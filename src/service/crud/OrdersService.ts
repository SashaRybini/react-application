import { Observable } from "rxjs"
import { PickedProduct } from "../../model/PickedProduct"
import { Product } from "../../model/Product"

export default interface ProductsService {

    addProductToCart(email: string, product: Product): Promise<void>
    removeProductFromCart(email: string, product: Product): Promise<void>
    getShoppingCart(email: string): Observable<PickedProduct[]>
    removeProductAtAll(email: string, id: string): Promise<void>
}