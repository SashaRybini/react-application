import { Product } from "./Product"

export type PickedProduct = {
    product: Product,
    id: string, //datagrid requires id's, rows don't work w/o id's
    count: number
}