import AuthService from "../service/auth/AuthService";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import OrdersService from "../service/crud/OrdersService";
import OrdersServiceFire from "../service/crud/OrdersServiceFire";
import ProductsService from "../service/crud/ProductsService";
import ProductsServiceFire from "../service/crud/ProductsServiceFire";

export const authService: AuthService = new AuthServiceFire()
export const productsService: ProductsService = new ProductsServiceFire()
export const ordersService: OrdersService = new OrdersServiceFire()