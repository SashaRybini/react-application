import { productsService } from "../../config/service-config";
import { Product } from "../../model/Product";
import { AddProductForm } from "../forms/AddProductForm";
import { useDispatchCode } from "../../hooks/hooks";

const AddProduct: React.FC = () => {

    const dispatch = useDispatchCode()

    async function submitFn(prod: Product) {
        try {
            const product: Product = await productsService.addProduct(prod);
            dispatch('', `product: ${product.title} has been added`)
        } catch (error: any) {
            dispatch(error, '')
        }
    }
    return <AddProductForm submitFn={submitFn} />
}
export default AddProduct;