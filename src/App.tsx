import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteType } from "./components/navigators/Navigator";

import './App.css'
import { useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import Navigator from "./components/navigators/Navigator";


import { Alert, Snackbar } from "@mui/material";
import CodeType from "./model/CodeType";
import { StatusType } from "./model/StatusType";
import { useDispatch } from "react-redux";
import SnackbarAlert from "./components/common/SnackbarAlert";

import CodePayload from "./model/CodePayload";
import { codeActions } from "./redux/slices/codeSlice";
import Adverts from "./components/pages/Adverts";
import AdvertsByCategory from "./components/pages/AdvertsByCategory";
import AdvertsByPrice from "./components/pages/AdvertsByPrice";
import AddAdvert from "./components/pages/AddAdvert";

const { routes } = routesConfig;

const App: React.FC = () => {

  const dispatch = useDispatch()
  const codeMessage: CodePayload = useSelectorCode()
  const [alertMessage, severity] = useMemo(() => codeProcessing(), [codeMessage])

  function codeProcessing() {
    const res: [string, StatusType] = ['', 'success']
    res[0] = codeMessage.message
    res[1] = codeMessage.code === CodeType.OK ? 'success' : 'error'
    // if (codeMessage.code === CodeType.AUTH_ERROR) {
    //   authService.logout()
    //   dispatch(authActions.reset());
    // }
    return res
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigator routes={routes} />}>
        <Route index element={<Adverts />} />
        <Route path="adverts/bycategory" element={<AdvertsByCategory />} />
        <Route path="adverts/byprice" element={<AdvertsByPrice />} />
        <Route path="adverts/add" element={<AddAdvert />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
    {alertMessage && <SnackbarAlert message={alertMessage} severity={severity} />}
  </BrowserRouter>
}
export default App;