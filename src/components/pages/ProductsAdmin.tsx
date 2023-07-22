import { Delete, Edit } from "@mui/icons-material";
import {
    Box, Link, Modal, Typography, useMediaQuery, useTheme
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

function ExpandableCell({ value }: GridRenderCellParams) {
    const [expanded, setExpanded] = useState(false);
    return (
        <Box>
            {expanded ? value : value.slice(0, 50)}&nbsp;
            {value.length > 50 && (
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

    function getColumns() {
        let columns: GridColDef[] = [
            {
                field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'imageUrl', headerName: 'Image', flex: 0.4, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center',
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
                align: 'center', headerAlign: 'center', editable: true
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
        if (isPortrait) {
            columns = columns.filter(c => c.field != 'content' && c.field != 'actions')
        }
        return columns
    }

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
                dispatch('', `product with id ${productId.current} has been updated`)
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

    function priceInARowUpdate(newRow: any, oldRow: any) {
        const newPrice = newRow.price
        if (newPrice > 0) {
            const product: Product = { ...newRow }
            productsService.updateProduct(product) //handle errors 
        }
        return newPrice > 0 ? newRow : oldRow
    }

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))

    return <Box className='center-style'>
        <CategorySelect
            category={category}
            handlerCategoryFilter={handlerCategoryFilter}
            categories={categories}
        />
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid
                getRowHeight={() => 'auto'}
                columns={getColumns()}
                rows={filteredProducts.length != 0 ? filteredProducts : products}
                processRowUpdate={priceInARowUpdate}
                onProcessRowUpdateError={(error) => console.log(error)} //alert ?
            />
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
            <Box className='modal-window-table'>
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
