import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigator, { RouteType } from "./components/navigators/Navigator";
import Home from "./components/pages/Home";
import Customers from "./components/pages/Customers";
import Products from "./components/pages/Products";
import Orders from "./components/pages/Orders";
import ShoppingCart from "./components/pages/ShoppingCart";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";

const {always, authenticated, admin, noadmin, noauthenticated} = routesConfig;

function getRoutes(username: string): RouteType[] {
  const res: RouteType[] = [];
  res.push(...always);
  username && res.push(...authenticated);
  username.startsWith('admin') && res.push(...admin);
  username && !username.startsWith('admin') && res.push(...noadmin);
  !username && res.push(...noauthenticated);
  return res;
}

const App: React.FC = () => {
  const username = useSelectorAuth();
  const routes = useMemo(() => getRoutes(username), [username])
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<NavigatorDispatcher routes={routes}/>}>
        <Route index element={<Home/>}/>
        <Route path="customers" element={<Customers/>}/>
        <Route path="products" element={<Products/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="shoppingcart" element={<ShoppingCart/>}/>
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signout" element={<SignOut/>}/>
        <Route path="/*" element={<NotFound />}/>
    </Route>
  </Routes>
  </BrowserRouter>
}
export default App;