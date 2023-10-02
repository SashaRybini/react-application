import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteType } from "./components/navigators/Navigator";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useEffect, useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import UserData from "./model/UserData";
import CodeType from "./model/CodeType";
import { StatusType } from "./model/StatusType";
import { authService, messagesService } from "./config/service-config";
import { useDispatch } from "react-redux";
import SnackbarAlert from "./components/common/SnackbarAlert";
import { authActions } from "./redux/slices/authSlice";
import CodePayload from "./model/CodePayload";
import ChatRoom from "./components/pages/ChatRoom";
import SignUp from "./components/pages/SignUp";

const { always, authenticated, /*admin,*/ noadmin, noauthenticated } = routesConfig;

function getRoutes(userData: UserData): RouteType[] {
  const result: RouteType[] = [];
  result.push(...always);
  if (userData) {
    result.push(...authenticated)
    // userData.role === 'admin' && result.push(...admin);
    // userData.role === 'user' && result.push(...noadmin);
  } else {
    result.push(...noauthenticated);
  }
  const res = result.sort((r1, r2) => {
    let res = 0
    if (r1.order && r2.order) {
      res = r1.order - r2.order
    }
    return res
  });
  if (userData) {
    res[result.length - 1].label = userData.username //logout last
  }
  return res
}

const App: React.FC = () => {
  const userData: UserData = useSelectorAuth()
  const dispatch = useDispatch()
  const codeMessage: CodePayload = useSelectorCode()
  const [alertMessage, severity] = useMemo(() => codeProcessing(), [codeMessage])

  function codeProcessing() {
    const res: [string, StatusType] = ['', 'success']
    res[0] = codeMessage.message
    res[1] = codeMessage.code === CodeType.OK ? 'success' : 'error'
    if (codeMessage.code === CodeType.AUTH_ERROR) {
      authService.logout()
      dispatch(authActions.reset());
    }
    return res
  }

  const routes = useMemo(() => getRoutes(userData), [userData])

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
        <Route index element={<ChatRoom />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
    {alertMessage && <SnackbarAlert message={alertMessage} severity={severity} />}
  </BrowserRouter>
}
export default App;