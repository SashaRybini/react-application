import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteType } from "./components/navigators/Navigator";

import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import UserData from "./model/UserData";
import Employees from "./components/pages/Employees";
import AgeStatistics from "./components/pages/AgeStatistics";
import SalaryStatistics from "./components/pages/SalaryStatistics";
import AddEmployee from "./components/pages/AddEmployee";
import EmployeeGeneration from "./components/pages/EmployeeGeneration";

const {always, authenticated, admin, noadmin, noauthenticated} = routesConfig;

function getRoutes(userData: UserData): RouteType[] {
  const result: RouteType[] = [];
  result.push(...always);
  if (userData) {
    result.push(...authenticated)
    userData.role === 'admin' && result.push(...admin);
    userData.role === 'user' && result.push(...noadmin);
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
    res[result.length - 1].label = userData.email //logout last
  }
  return res
}

const App: React.FC = () => {
  const userData = useSelectorAuth()
  const code = useSelectorCode()
  // const [alertMessage, severity] = useMemo(() => codeProcessing(), [code])
  const routes = useMemo(() => getRoutes(userData), [userData])
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigatorDispatcher routes={routes}/>}>
        <Route index element={<Employees/>}/>
        <Route path="statistics/age" element={<AgeStatistics/>}/>
        <Route path="statistics/salary" element={<SalaryStatistics/>}/>
        <Route path="employees/add" element={<AddEmployee/>}/>
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signout" element={<SignOut/>}/>
        <Route path="employees/generation" element={<EmployeeGeneration/>}/>
        <Route path="/*" element={<NotFound />}/>
      </Route>
    </Routes>
    {/* snackbar */}
  </BrowserRouter>
}
export default App;