import { Grid, Paper, ToggleButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { MdSend, MdSettingsVoice } from 'react-icons/md';
import { ReactMic } from 'react-mic';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
//import VoiceMessage from '../components/VoiceMessage.js/VoiceMessage';
import { editMessage, sendAllUploadMessage, sendMessage } from '../store/actions/messageAction';
import { SUCCESS_MESSAGE_CLEAR, UPDATE_MESSAGE_FAILED, WRITE_MESSAGE_UPDATE } from '../store/type/messageTypes';
import './Editor.css';
import FileUploadPopup from './FileUploadPopup';
import IconPopup from './IconPopup';
import './VoiceRecoder.css';

function Editor({ handleTyping, messageEditHandle, editMsg, isTyping, size = 25 }) {

    const { groupMessage, theme, selectedChat, socketFunc, auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const [record, setRecord] = useState(false)
    const handleUpdate = (e) => {
        dispatch({
            type: WRITE_MESSAGE_UPDATE,
            payload: {
                data: {
                    ...groupMessage?.messageInfoStore,
                    content: {
                        text: e.target.value,
                    }
                },
            },
        })
    }

    if (groupMessage?.success) {
        toast.success(`${groupMessage?.success}`, {
            position: "bottom-right",
            theme: theme?.theme,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        dispatch({
            type: SUCCESS_MESSAGE_CLEAR,
        })
    }
    if (groupMessage?.error) {
        Object.values(groupMessage?.error)?.forEach((err) => {
            toast.error(`${err}`, {
                position: "bottom-right",
                theme: theme?.theme,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            dispatch({
                type: UPDATE_MESSAGE_FAILED,
                payload: {
                    error: '',
                }
            })
        })
    }
    const handleSendMessage = () => {
        if (!(socketFunc?.socket?.current)) return
        if (selectedChat?.chat?._id) {
            socketFunc?.socket?.current?.emit('stop typing', selectedChat?.chat?._id);
            dispatch(sendMessage(groupMessage?.write, selectedChat?.chat?._id, auth?.user?.token))
        }
    }
    const startRecording = () => {
        setRecord(true)
    }
    const stopRecording = () => {
        setRecord(false)
    }
    const onData = (recordedBlob) => {

    }
    const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
    const onStop = async (recordedBlob) => {
        if (recordedBlob?.blobURL === null) {
            toast.error(`Recording Failed! Please try again!`, {
                position: "bottom-right",
                theme: theme?.theme,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if (recordedBlob?.blobURL) {
            if (selectedChat?.chat?._id && auth?.user?.token) {
                const voiceUrl = await convertBlobToBase64(recordedBlob?.blob)
                const voiceData = {
                    secure_url: voiceUrl, write: groupMessage?.write || '', audioFile: 'audio', bytes: '', original_filename: 'voice over audio', format: 'wav', duration: ''
                }
                dispatch(sendAllUploadMessage(voiceData, selectedChat?.chat?._id, auth?.user?.token))
            }
        }
    }
    return (
        <div style={{
            marginTop: '30px',
            border: '1px solid rgb(133 127 127 / 15%)',
            boxhadow: "0px 0px 10px rgba(0,0,0,0.1)",
            padding: '14px 20px',
            borderRadius: '30px'
        }}>
            <Grid container spacing={0} alignItems="center" justifyContent={'space-between'} >
                <Grid item xs={0.6}>
                    <IconPopup />
                </Grid>
                <Grid item xs={1}>
                    <FileUploadPopup groupMessage={groupMessage} auth={auth} selectedChat={selectedChat} />
                </Grid>
                {editMsg ? <Grid item xs={6}>
                    <textarea className='text-msg' sx={{
                        fontSize: {
                            lg: '18px',
                            md: '16px',
                            sm: '15px',
                            xs: '10px'
                        }
                    }} onChange={(e) => {
                        handleUpdate(e)
                    }} value={groupMessage?.messageInfoStore?.content?.text} placeholder='Enter text here...'>
                    </textarea>
                </Grid> : <Grid item xs={8}>
                    <textarea className='text-msg' sx={{
                        fontSize: {
                            lg: '18px',
                            md: '16px',
                            sm: '15px',
                            xs: '10px'
                        }
                    }} onChange={(e) => handleTyping(e)} value={groupMessage?.write} placeholder='Enter text here...'>
                    </textarea>
                </Grid>}
                <Grid item xs={0.7}>
                    <Paper sx={{ marginBottom: '0px!important', border: 'none', boxShadow: 'none', background: 'transparent' }}>
                        <div>
                            <ReactMic
                                className='record-box'
                                record={record}
                                onStop={onStop}
                                onData={onData} />
                            {record ? <>
                                <div className="col-md-4 col-md-offset-4 box-voice" onClick={() => stopRecording()}>
                                    <div className="box">
                                        <div className="circle_ripple"></div>
                                        <div className="circle_ripple-2"></div>
                                        <div className="circle">
                                            <div className="circle-2">
                                                <i className="fa fa-microphone"></i>
                                            </div>
                                        </div>
                                        <div className="progress blue">
                                            <span className="progress-left">
                                                <span className="progress-bar"></span>
                                            </span>
                                            <span className="progress-right">
                                                <span className="progress-bar"></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </> :
                                <MdSettingsVoice size={size} onClick={() => startRecording()} />}
                        </div>
                    </Paper>
                </Grid>
                <>
                    {editMsg ? <Grid item xs={2}>
                        <ToggleButton  onClick={() => dispatch(editMessage(groupMessage?.messageInfoStore?.content?.text, groupMessage?.messageInfoStore?.chat?._id, groupMessage?.messageInfoStore?._id, auth?.user?.token, messageEditHandle))} className='send-btn' value="four" sx={{ marginBottom: '0px!important', border: 'none' }}>
                            {auth?.user?.token && selectedChat?.chat?._id ? <MdSend size={size}/> : <Tooltip style={{ cursor: "pointer" }} title="Permission Denied" arrow> <MdSend /></Tooltip>}
                        </ToggleButton>
                    </Grid> : <Grid item xs={1}>
                        <ToggleButton onClick={handleSendMessage} className='send-btn' value="four" sx={{ marginBottom: '0px!important', border: 'none' }}>
                            {auth?.user?.token && selectedChat?.chat?._id ? <MdSend size={size}/> : <Tooltip style={{ cursor: "pointer" }} title="Permission Denied" arrow> <MdSend /></Tooltip>}
                        </ToggleButton>
                    </Grid>}
                </>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {/* <VoiceMessage /> */}
            </Grid>
        </div>
    )
}

export default Editor