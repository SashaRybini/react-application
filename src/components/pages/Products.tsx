import ProductsAdmin from "./ProductsAdmin"
import ProductsUser from "./ProductsUser"

const Products: React.FC = () => {
    const who = 'user'
    return who != 'user' ? <ProductsUser /> : <ProductsAdmin />
}
export default Products