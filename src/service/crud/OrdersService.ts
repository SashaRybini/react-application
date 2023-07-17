import { Observable } from "rxjs"
import { PickedProduct } from "../../model/PickedProduct"
import { Product } from "../../model/Product"
import { Order } from "../../model/Order"

export default interface ProductsService {

    addProductToCart(email: string, product: Product): Promise<void>
    removeProductFromCart(email: string, product: Product): Promise<void>
    getShoppingCart(email: string): Observable<PickedProduct[]>
    removeProductFromCartAtAll(email: string, id: string): Promise<void>
    createOrder(email: string, cart: PickedProduct[], deliveryDate: string): Promise<void>
    getOrders(): Observable<Order[]>
    setOrderStatus(orderId: string, order: Order): Promise<void>
    getOrder(orderId: string): Promise<Order>
    updateOrder(order: Order): Promise<void>
    deleteOrder(orderId: string): Promise<void>
}