import AuthService from "../service/auth/AuthService";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import ProductsService from "../service/crud/ProductsService";
import ProductsServiceFire from "../service/crud/ProductsServiceFire";

export const authService: AuthService = new AuthServiceFire()
export const productsService: ProductsService = new ProductsServiceFire()