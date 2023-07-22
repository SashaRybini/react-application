import {
    Box, Button, Card, CardActions, CardContent,
    CardMedia, Grid, Modal, Typography
} from "@mui/material"
import { useMemo, useState } from "react";
import { useSelectorCart, useSelectorProducts } from "../../hooks/hooks";
import { Product } from "../../model/Product";
import CategorySelect from "../common/CategorySelect";
import { categories } from "../forms/AddProductForm";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ordersService } from "../../config/service-config";
import { PickedProduct } from "../../model/PickedProduct";

const ProductsUser: React.FC = () => {

    const [openContent, setOpenContent] = useState(false)
    const [content, setContent] = useState('')

    const products = useSelectorProducts()

    function getProductsCards() {
        const prods = filteredProducts.length == 0 ? products : filteredProducts
        return prods.map((p, index) =>
            <Card key={index} sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 150 }}
                    image={p.imageUrl}
                />
                <CardContent style={{ paddingBottom: 0 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {p.title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        Price: ${p.price}
                    </Typography>
                </CardContent>
                <CardActions style={{ paddingTop: 0, paddingLeft: 12 }}>
                    <Button size="small" onClick={() => {
                        setOpenContent(true)
                        setContent(p.content)
                    }}
                    >
                        Learn More
                    </Button>
                </CardActions>
                <Grid container>
                    <Grid item xs={4}>
                        <Button
                            onClick={() => {
                                ordersService.removeProductFromCart(userData!.email, p)
                            }}
                            disabled={counts[index] == 0}
                        >
                            <RemoveIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            {counts[index]}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            onClick={() => {
                                if (!userData) {
                                    navigate('/signin')
                                } else {
                                    ordersService.addProductToCart(userData.email, p)
                                }
                            }}
                        >
                            <AddIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        )
    }

    const [category, setCategory] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    function handlerCategoryFilter(event: any) {
        setCategory(event.target.value)
        const filtered = products.filter(p => p.category === event.target.value)
        setFilteredProducts(filtered)
    }

    const userData: UserData = useSelectorAuth()
    const navigate = useNavigate()

    const cart: PickedProduct[] = useSelectorCart()

    const counts = useMemo(() => getCounts(), [products, cart, filteredProducts])
    function getCounts(): number[] {
        const prods = filteredProducts.length == 0 ? products : filteredProducts
        return prods.map(prod => {
            const pickedProd = cart.find(cartProd => cartProd.product.id == prod.id)
            let count = 0
            if (pickedProd) {
                count = pickedProd.count
            }
            return count
        })
    }

    return <Box className='center-style'>
        <CategorySelect
            category={category}
            handlerCategoryFilter={handlerCategoryFilter}
            categories={categories}
        />
        <Grid container justifyContent='center' gap={2}>
            {getProductsCards()}
            <Modal
                open={openContent}
                onClose={() => setOpenContent(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='modal-window-table'>
                    <Typography variant="body2" color="text.secondary">
                        {content}
                    </Typography>
                </Box>
            </Modal>
        </Grid>
    </Box>
}
export default ProductsUser