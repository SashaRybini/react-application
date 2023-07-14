import { Observable } from "rxjs"
import { PickedProduct } from "../../model/PickedProduct"
import { Product } from "../../model/Product"

export default interface ProductsService {

    addProductTocart(email: string, product: Product): Promise<void>
    removeProductFromCart(email: string, product: Product): Promise<void>
    getShoppingCart(email: string): Observable<PickedProduct[]>
}