import { PickedProduct } from "./PickedProduct"

export type Order = {
    id: any,
    email: string,
    orderDate: string,
    cart: PickedProduct[],
    deliveryDate: string,
    isDelivered: boolean
}