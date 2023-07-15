import { Delete, Edit } from "@mui/icons-material";
import { 
    Box, FormHelperText, Link, MenuItem, Modal, Select, Typography 
} from "@mui/material"
import {
    DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams
} from "@mui/x-data-grid"
import { useRef, useState } from "react";
import { useDispatchCode, useSelectorProducts } from "../../hooks/hooks";
import Confirm from "../common/Confirm";
import { productsService } from "../../config/service-config";
import { Product } from "../../model/Product";
import { AddProductForm, categories } from "../forms/AddProductForm";
import CategorySelect from "../common/CategorySelect";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const centerStyle = { 
    display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center' 
}


function ExpandableCell({ value }: GridRenderCellParams) {
    const [expanded, setExpanded] = useState(false);
    return (
        <Box>
            {expanded ? value : value.slice(0, 50)}&nbsp;
            {value.length > 50 && (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <Link
                    type="button"
                    component="button"
                    sx={{ fontSize: 'inherit' }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'view less' : 'view more'}
                </Link>
            )}
        </Box>
    );
}

const ProductsAdmin: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'imageUrl', headerName: 'Image', flex: 0.4, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                return <img src={params.value} style={{ width: '100%' }} />
            }
        },
        {
            field: 'title', headerName: 'Title', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'price', headerName: 'Price in $', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'content', headerName: 'Content', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
        },
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => removeProduct(params.row)}
                    />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => updateProduct(params.row)}
                    />
                ];
            }
        }
    ]
    const products = useSelectorProducts()

    const productId = useRef('')
    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmContent, setConfirmContent] = useState('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    
    function removeProduct(prod: Product) {
        setConfirmTitle('delete product?')
        setConfirmContent(`you are going to delete ${prod.title}`)
        productId.current = prod.id
        setOpenConfirmDialog(true)
    }
    const product = useRef<Product>()
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    function updateProduct(prod: Product) {
        setConfirmTitle('update product?')
        setConfirmContent(`we are going to update ${prod.title}`)
        setOpenUpdateModal(true)
        product.current = prod
    }
    const dispatch = useDispatchCode()
    function onSubmitConfirmDialog(confirmation: boolean) { //fn performs deleting and updating
        setOpenConfirmDialog(false)
        if (confirmation && !isUpdate) {
            try {
                productsService.deleteProduct(productId.current)
                dispatch('', `product with id ${productId.current} has been deleted`)
            } catch (error: any) {
                dispatch(error, '')
            }
        } else if (confirmation && isUpdate) {
            setIsUpdate(false)
            try {
                productsService.updateProduct(product.current!)
                dispatch('', `product with id ${productId.current} has been deleted`)
            } catch (error: any) {
                dispatch(error, '')
            }
        }
    }
    async function updateSubmitFn(prod: Product) {
        product.current = prod
        setIsUpdate(true)
        setOpenConfirmDialog(true)
        setOpenUpdateModal(false)
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
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid
                // getEstimatedRowHeight={() => 100}
                getRowHeight={() => 'auto'}
                columns={columns}
                rows={filteredProducts.length != 0 ? filteredProducts : products} />
        </Box>
        <Confirm
            title={confirmTitle}
            content={confirmContent}
            handleClose={onSubmitConfirmDialog}
            open={openConfirmDialog}
        />
        <Modal
            open={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    variant="h6"
                >
                    {`we are on updating ${product.current?.title}`}
                </Typography>
                <AddProductForm
                    submitFn={updateSubmitFn}
                    productUpdated={product.current}
                />
            </Box>
        </Modal>
    </Box>
}
export default ProductsAdmin