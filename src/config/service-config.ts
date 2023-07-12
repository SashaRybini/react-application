import AuthService from "../service/auth/AuthService";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import GoodsService from "../service/crud/ProductsService";
import GoodsServiceFire from "../service/crud/ProductsServiceFire";

export const authService: AuthService = new AuthServiceFire()
export const goodsService: GoodsService = new GoodsServiceFire()