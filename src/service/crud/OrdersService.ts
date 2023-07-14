import { Observable } from "rxjs"
import { PickedProduct } from "../../model/PickedProduct"

export default interface ProductsService {

    addProductTocart(email: string, id: string): Promise<void>
    removeProductFromCart(email: string, id: string): Promise<void>
    getShoppingCart(email: string): Observable<PickedProduct[]>
}