import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import AudioBar from '../BottomBar/AudioBar';
import Chat from '../Chat/Chat';
import AudioCard from '../Video/AudioCard';

const AudioRoom = (props) => {
    const { roomId } = useParams();
    const { auth } = useSelector(state => state);
    const currentUser = auth?.user?.user?.username;
    const [peers, setPeers] = useState([]);
    const [userVideoAudio, setUserVideoAudio] = useState({
        localUser: { video: false, audio: true },
    });
    const [videoDevices, setVideoDevices] = useState([]);
    const [displayChat, setDisplayChat] = useState(false);
    const [screenShare, setScreenShare] = useState(false);
    const [showVideoDevices, setShowVideoDevices] = useState(false);
    const peersRef = useRef([]);
    const userVideoRef = useRef();
    const screenTrackRef = useRef();
    const userStream = useRef();
    useEffect(() => {
        if (!socket) return
        fetch(`https://collaballapp.herokuapp.com/group-call-verify/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.permission !== true) {
                    window.location.replace('/chat')
                }
            })
        // Get Video Devices
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const filtered = devices.filter((device) => device.kind === 'videoinput');
            setVideoDevices(filtered);
        });

        // Set Back Button Event
        window.addEventListener('popstate', goToBack);

        // Connect Camera & Mic
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((stream) => {
                userVideoRef.current.srcObject = stream;
                userStream.current = stream;
                let name = auth?.user?.user?.firstName + ' ' + auth?.user?.user?.lastName;
                let pic = auth?.user?.user?.pic;
                socket.emit('BE-join-room', { roomId, userName: currentUser, name, pic });
                socket.on('FE-user-join', (users) => {
                    // all users
                    const peers = [];
                    users.forEach(({ userId, info, name, pic }) => {
                        let { userName, video, audio } = info;

                        if (userName !== currentUser) {
                            const peer = createPeer(userId, socket.id, stream, name, pic);
                            peer.userName = userName;
                            peer.peerID = userId;
                            peer.name = name;
                            peer.pic = pic;
                            peersRef.current.push({
                                peerID: userId,
                                peer,
                                userName,
                                name,
                                pic
                            });
                            peers.push(peer);

                            setUserVideoAudio((preList) => {
                                return {
                                    ...preList,
                                    [peer.userName]: { video, audio },
                                };
                            });
                        }
                    });

                    setPeers(peers);
                });

                socket.on('FE-receive-call', ({ signal, from, info }) => {
                    let { userName, video, audio, name, pic } = info;
                    const peerIdx = findPeer(from);

                    if (!peerIdx) {
                        const peer = addPeer(signal, from, stream);
                        peer.userName = userName;
                        peer.name = name;
                        peer.pic = pic;
                        peersRef.current.push({
                            peerID: from,
                            peer,
                            userName: userName,
                            name: name,
                            pic: pic
                        });
                        setPeers((users) => {
                            return [...users, peer];
                        });
                        setUserVideoAudio((preList) => {
                            return {
                                ...preList,
                                [peer.userName]: { video, audio },
                            };
                        });
                    }
                });

                socket.on('FE-call-accepted', ({ signal, answerId }) => {
                    const peerIdx = findPeer(answerId);
                    peerIdx.peer.signal(signal);
                });

                socket.on('FE-user-leave', ({ userId, userName }) => {
                    const peerIdx = findPeer(userId);
                    peerIdx.peer.destroy();
                    setPeers((users) => {
                        users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
                        return [...users];
                    });
                    peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId);
                });
            });

        socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
            const peerIdx = findPeer(userId);

            setUserVideoAudio((preList) => {
                let video = preList[peerIdx.userName].video;
                let audio = preList[peerIdx.userName].audio;

                if (switchTarget === 'video') video = !video;
                else audio = !audio;

                return {
                    ...preList,
                    [peerIdx.userName]: { video, audio },
                };
            });
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        socket.off('callEndedRoom').on('callEndedRoom', (data) => {
            if (data.callEnd === true) {
                window.location.replace('/chat')
            }
        })
    })
    function createPeer(userId, caller, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socket.emit('BE-call-user', {
                userToCall: userId,
                from: caller,
                signal,
            });
        });
        peer.on('disconnect', () => {
            peer.destroy();
        });

        return peer;
    }

    function addPeer(incomingSignal, callerId, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socket.emit('BE-accept-call', { signal, to: callerId });
        });

        peer.on('disconnect', () => {
            peer.destroy();
        });

        peer.signal(incomingSignal);

        return peer;
    }

    function findPeer(id) {
        return peersRef.current.find((p) => p.peerID === id);
    }

    function createUserVideo(peer, index, arr) {
        return (
            <VideoBox
                className={`width-peer${peers.length > 8 ? '' : peers.length}`}
                onClick={expandScreen}
                key={index}
            >
                {writeUserName(peer.userName)}
                <FaIcon className='fas fa-expand' />
                <AudioCard key={index} peer={peer} number={arr.length} />
            </VideoBox>
        );
    }

    function writeUserName(userName, index) {
        if (userVideoAudio.hasOwnProperty(userName)) {
            if (!userVideoAudio[userName].video) {
                return <UserName key={userName}>{userName}</UserName>;
            }
        }
    }

    // Open Chat
    const clickChat = (e) => {
        e.stopPropagation();
        setDisplayChat(!displayChat);
    };
    // BackButton
    const goToBack = (e) => {
        e.preventDefault();
        socket.emit('BE-leave-room', { roomId, leaver: currentUser });
        sessionStorage.removeItem('user');
        window.location.href = '/chat';
    };
    const handleEndCall = (e) => {
        e.preventDefault();
        socket.emit('BE-leave-room-end', { roomId, leaver: currentUser });
        sessionStorage.removeItem('user');
        window.location.href = '/chat';
    };
    const toggleCameraAudio = (e) => {
        const target = e.target.getAttribute('data-switch');

        setUserVideoAudio((preList) => {
            let videoSwitch = preList['localUser'].video;
            let audioSwitch = preList['localUser'].audio;

            if (target === 'video') {
                const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
                videoSwitch = !videoSwitch;
                userVideoTrack.enabled = videoSwitch;
            } else {
                const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
                audioSwitch = !audioSwitch;

                if (userAudioTrack) {
                    userAudioTrack.enabled = audioSwitch;
                } else {
                    userStream.current.getAudioTracks()[0].enabled = audioSwitch;
                }
            }

            return {
                ...preList,
                localUser: { video: videoSwitch, audio: audioSwitch },
            };
        });

        socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
    };

    const clickScreenSharing = () => {
        if (!screenShare) {
            navigator.mediaDevices
                .getDisplayMedia({ cursor: true })
                .then((stream) => {
                    const screenTrack = stream.getTracks()[0];

                    peersRef.current.forEach(({ peer }) => {
                        // replaceTrack (oldTrack, newTrack, oldStream);
                        peer.replaceTrack(
                            peer.streams[0]
                                .getTracks()
                                .find((track) => track.kind === 'video'),
                            screenTrack,
                            userStream.current
                        );
                    });

                    // Listen click end
                    screenTrack.onended = () => {
                        peersRef.current.forEach(({ peer }) => {
                            peer.replaceTrack(
                                screenTrack,
                                peer.streams[0]
                                    .getTracks()
                                    .find((track) => track.kind === 'video'),
                                userStream.current
                            );
                        });
                        userVideoRef.current.srcObject = userStream.current;
                        setScreenShare(false);
                    };

                    userVideoRef.current.srcObject = stream;
                    screenTrackRef.current = screenTrack;
                    setScreenShare(true);
                });
        } else {
            screenTrackRef.current.onended();
        }
    };

    const expandScreen = (e) => {
        const elem = e.target;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
    };

    const clickBackground = () => {
        if (!showVideoDevices) return;

        setShowVideoDevices(false);
    };

    const clickCameraDevice = (event) => {
        if (event && event.target && event.target.dataset && event.target.dataset.value) {
            const deviceId = event.target.dataset.value;
            const enabledAudio = userVideoRef.current.srcObject.getAudioTracks()[0].enabled;

            navigator.mediaDevices
                .getUserMedia({ video: { deviceId }, audio: enabledAudio })
                .then((stream) => {
                    const newStreamTrack = stream.getTracks().find((track) => track.kind === 'video');
                    const oldStreamTrack = userStream.current
                        .getTracks()
                        .find((track) => track.kind === 'video');

                    userStream.current.removeTrack(oldStreamTrack);
                    userStream.current.addTrack(newStreamTrack);

                    peersRef.current.forEach(({ peer }) => {
                        // replaceTrack (oldTrack, newTrack, oldStream);
                        peer.replaceTrack(
                            oldStreamTrack,
                            newStreamTrack,
                            userStream.current
                        );
                    });
                });
        }
    };

    return (
        <RoomContainer onClick={clickBackground}>
            <VideoAndBarContainer>
                <VideoContainer>
                    {/* Current User Video */}
                    <VideoBox
                        className={`width-peer${peers.length > 8 ? '' : peers.length}`}
                    >
                        {/* {userVideoAudio['localUser'].video ? null : (
                           
                        )} */}
                        <FaIcon className='fas fa-expand' />
                        {/* <MyVideo
                            onClick={expandScreen}
                            ref={userVideoRef}
                            muted
                            autoPlay
                            playInline
                        ></MyVideo> */}
                        <audio
                            onClick={expandScreen}
                            style={{ width: '0' }}
                            muted
                            autoPlay
                            playinline="true"
                            ref={userVideoRef}
                        />
                        {<><img title={auth?.user?.user?.firstName + ' ' + auth?.user?.user?.lastName} style={{ width: '80px', height: '80px', borderRadius: '80px' }} src={auth?.user?.user?.pic} alt={auth?.user?.user?.username} /></>}
                    </VideoBox>
                    {/* Joined User Vidoe */}
                    {peers &&
                        peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
                </VideoContainer>
                <AudioBar
                    clickScreenSharing={clickScreenSharing}
                    clickChat={clickChat}
                    clickCameraDevice={clickCameraDevice}
                    goToBack={goToBack}
                    toggleCameraAudio={toggleCameraAudio}
                    userVideoAudio={userVideoAudio['localUser']}
                    screenShare={screenShare}
                    videoDevices={videoDevices}
                    showVideoDevices={showVideoDevices}
                    handleEndCall={handleEndCall}
                    setShowVideoDevices={setShowVideoDevices}
                />
            </VideoAndBarContainer>
            <Chat display={displayChat} roomId={roomId} />
        </RoomContainer>
    );
};

const RoomContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
`;

const VideoContainer = styled.div`
  max-width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  gap: 10px;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

// const MyVideo = styled.video``;

const VideoBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > video {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :hover {
    > i {
      display: block;
    }
  }
`;

const UserName = styled.div`
  position: absolute;
  color:white;
  font-size: calc(20px + 5vmin);
  z-index: 1;
`;

const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;

export default AudioRoom;