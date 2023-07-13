import {
    Box, Button, Card, CardActions, CardContent,
    CardMedia, Grid, Modal, Typography
} from "@mui/material"
import { useState } from "react";
import { useSelectorProducts } from "../../hooks/hooks";
import { Product } from "../../model/Product";
import CategorySelect from "../common/CategorySelect";
import { categories } from "../forms/AddProductForm";

const centerStyle = { 
    display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center' 
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProductsUser: React.FC = () => {

    const [openContent, setOpenContent] = useState(false)
    const [content, setContent] = useState('')
    const products = useSelectorProducts()

    function getProductsCards() {
        const prods = filteredProducts.length == 0 ? products : filteredProducts
        return prods.map((g, index) => <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 200 }}
                image={g.imageUrl}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {g.title}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    Price: ${g.price}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    setOpenContent(true)
                    setContent(g.content)
                }}
                >
                    Learn More
                </Button>
            </CardActions>
        </Card>)
    }
    
    const [category, setCategory] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    function handlerCategoryFilter(event: any) {
        setCategory(event.target.value)
        const filtered = products.filter(p => p.category === event.target.value)
        setFilteredProducts(filtered)
    }

    return <Box sx={centerStyle}>
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
                <Box sx={style}>
                    <Typography variant="body2" color="text.secondary">
                        {content}
                    </Typography>
                </Box>
            </Modal>
        </Grid>
    </Box>
}
export default ProductsUser