import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import ProductsAdmin from "./ProductsAdmin"
import ProductsUser from "./ProductsUser"

const Products: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    return  userData && userData.role === 'admin' ? <ProductsAdmin /> : <ProductsUser />
}
export default Products