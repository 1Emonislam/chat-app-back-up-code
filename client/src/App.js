/* eslint-disable react-hooks/exhaustive-deps */
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import Call from "./components/Call/Call";
import BlockedUser from "./components/DashBoardSettings/BlockedUser";
import DashBoardHome from "./components/DashBoardSettings/DashBoardHome";
import OnLineAndOffLineStatusBar from "./components/DashBoardSettings/OnLineAndOffLineStatusBar";
import ReportUser from "./components/DashBoardSettings/ReportUser";
import SettingAdmob from "./components/DashBoardSettings/SettingAdmob";
import SettingsFirebase from "./components/DashBoardSettings/SettingsFirebase";
import SettingsGeneral from "./components/DashBoardSettings/SettingsGeneral";
import SettingSinch from "./components/DashBoardSettings/SettingSinch";
import Users from "./components/DashBoardSettings/Users";
import Group from "./components/Group/Group";
import GroupInviteAccept from "./components/GroupInviteAccept";
import Settings from "./components/Settings/Settings/Settings";
import Status from "./components/Status/Status/Status";
import { ThemeSwitch } from "./hooks/useThemes";
import ChangePassword from "./pages/Auth/ChangePassword";
import Chat from "./pages/Auth/Chat/Chat";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import Home from "./pages/Home/Home";
import { getGroupChatData } from "./store/actions/groupActions";
import { getNotification } from "./store/actions/messageNotificationAction";
import { SOCKET_GLOBAL } from "./store/type/socketType";
export const ThemeSelectContext = React.createContext();
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });
export default function ToggleColorMode() {
  const { auth, groupMessage } = useSelector(state => state);
  const [mode, setMode] = React.useState(
    window.localStorage.getItem("themeCurrent") ? JSON.parse(window.localStorage.getItem("themeCurrent")) : 'light');
  if (!mode) {
    window.localStorage.setItem(
      "themeCurrent",
      JSON.stringify(mode === "light" ? "dark" : "light")
    );
  }
  if (mode === "light") {
    document.body.style.background = "#fefefe";
  }
  if (mode === "dark") {
    document.body.style.background = " #111";
  }
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        window.localStorage.setItem(
          "themeCurrent",
          JSON.stringify(mode === "light" ? "dark" : "light")
        );
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

        },
      }),
    [mode]
  );
  React.useEffect(() => {
    if (!auth?.user?.user?.email) {
      <Navigate to="/login" replace></Navigate>
    }
  }, [auth?.user?.user?.email])
  const socket = React.useRef();
  const ENDPOINT = "https://collaball.netlify.app/";
  const dispatch = useDispatch()
  React.useEffect(() => {
    socket.current = io(ENDPOINT, {
      auth: {
        data: auth?.user
      },
      query: auth?.user?.user?._id
    });
    dispatch({
      type: SOCKET_GLOBAL,
      payload: { socket },
    })
    return () => { socket.current?.disconnect() };
  }, [auth?.user, dispatch])
  React.useMemo(() => {
    dispatch(getGroupChatData(auth?.user?.token,'recent'));
    dispatch(getNotification(auth.user?.token))
  }, [auth.user?.token, dispatch, groupMessage?.msg])
  return (
    <ColorModeContext.Provider value={colorMode} sx={{
      bgcolor: "background.default",
      color: "text.default",
      borderRadius: 1,
      width: "100%",
    }}>
      <ThemeSelectContext.Provider value={theme}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<Login />}>
              </Route>
              <Route path="/forget-password" element={<ForgetPassword />}>
              </Route>
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              > </Route>
              <Route path="/change-password" element={<ChangePassword />}>
              </Route>
              <Route path="/register" element={<Register />}>
              </Route>
              {/* private page start */}
              <Route
                path="/chat"
                element={
                  <Chat>
                    <ThemeSwitch
                      onClick={colorMode.toggleColorMode}
                      style={{ fontSize: "20px" }}
                      checked={!(theme.palette.mode === "light")}
                    />
                  </Chat>
                }
              ></Route>
              <Route
                path="/group"
                element={
                  <Group>

                  </Group>
                }
              ></Route>
              <Route
                path="/call"
                element={
                  <Call>
                    <ThemeSwitch
                      onClick={colorMode.toggleColorMode}
                      style={{ fontSize: "20px" }}
                      checked={!(theme.palette.mode === "light")}
                    />
                  </Call>
                }
              ></Route>
              <Route
                path="/settings"
                element={
                  <Settings>
                    <ThemeSwitch
                      onClick={colorMode.toggleColorMode}
                      style={{ fontSize: "20px" }}
                      checked={!(theme.palette.mode === "light")}
                    />
                  </Settings>
                }
              ></Route>
              <Route
                path="/status"
                element={
                  <Status>
                    <ThemeSwitch
                      onClick={colorMode.toggleColorMode}
                      style={{ fontSize: "20px" }}
                      checked={!(theme.palette.mode === "light")}
                    />
                  </Status>
                }
              ></Route>
              {/* Dashboard  start*/}
              <Route path="/group/invite/:token" element={<GroupInviteAccept />}> </Route>
              <Route path="/general-setting" element={< SettingsGeneral />}> </Route>
              <Route path="/admob-setting" element={< SettingAdmob />}> </Route>
              <Route path="/snich-setting" element={< SettingSinch />}> </Route>
              <Route path="/firebase-setting" element={< SettingsFirebase />}> </Route>
              <Route path="/dashboard" element={< DashBoardHome />}> </Route>
              <Route path="/online" element={< OnLineAndOffLineStatusBar />}> </Route>
              <Route path="/users" element={< Users />}> </Route>
              <Route path="/blockusers" element={< BlockedUser />}> </Route>
              <Route path="/report" element={< ReportUser />}> </Route>
              {/* dashboard end */}
              <Route
                path="*"
                element={
                  <> <h2> Not Found</h2></>
                }>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider >
      </ThemeSelectContext.Provider >
    </ColorModeContext.Provider >
  );
}
