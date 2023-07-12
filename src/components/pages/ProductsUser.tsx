import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Modal, Typography } from "@mui/material"
import goodsConfig from "../../config/goods-config.json"
import { useState } from "react";

const initialGoods = goodsConfig.initialGoods;
const goods = initialGoods

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

    function getProductsCards() {
        return goods.map((g, index) => <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 200 }}
                image={g.image}
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
                <Button size="small" onClick={() => setOpenContent(true)}>Learn More</Button>
            </CardActions>
            <Modal
                open={openContent}
                onClose={() => setOpenContent(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="body2" color="text.secondary">
                        {g.content}
                    </Typography>

                </Box>
            </Modal>
        </Card>)
    }

    return <Grid
        container
        justifyContent='center'
        gap={2}
    >
        {getProductsCards()}
    </Grid>
}
export default ProductsUser