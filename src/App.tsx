import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Products from './components/pages/Products';
import Orders from './components/pages/Orders';
import Customers from './components/pages/Customers';
import SignIn from './components/pages/SignIn';
import SignOut from './components/pages/SignOut';
import NotFound from './components/pages/NotFound';
import NavigatorDispatcher, { RouteType } from './components/navigators/NavigatorDispatcher';
import { useMemo } from 'react';
import routesConfig from './config/routes-config.json';
import UserData from './model/UserData';
import ShoppingCart from './components/pages/ShoppingCart';
import { useSelectorAuth } from './redux/store';

const { always, authenticated, admin, noadmin, noauthenticated } = routesConfig;

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

function App() {

  const userData: UserData = useSelectorAuth()
  const routes = useMemo(() => getRoutes(userData), [userData])

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
        <Route index element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="shoppingcart" element={<ShoppingCart />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
    {/* {alertMessage && <SnackbarAlert message={alertMessage} severity={severity} />} */}
  </BrowserRouter>
}

export default App;
