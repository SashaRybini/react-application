
import { productsService } from "../../config/service-config";
import { useDispatch } from "react-redux";
import { codeActions } from "../../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";
import CodePayload from "../../model/CodePayload";
import { Product } from "../../model/Product";
import { AddProductForm } from "../forms/AddProductForm";

const AddProduct: React.FC = () => {

    const dispatch = useDispatch();

    async function submitFn(prod: Product) {
        const alert: CodePayload = { code: CodeType.OK, message: ''}
        try {
            const product: Product = await productsService.addProduct(prod);
            alert.message = `product: ${product.title} has been added`
        } catch (error: any) {
            alert.code = CodeType.SERVER_ERROR
            alert.message = error;
            
            // if ((typeof (error) == 'string') && error.includes('Authentication')) {
            //     alert.code = CodeType.AUTH_ERROR
            // }
        }
        dispatch(codeActions.set(alert))
    }
    return <AddProductForm submitFn={submitFn} />
}
export default AddProduct;