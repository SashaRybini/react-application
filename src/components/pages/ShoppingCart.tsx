import { Delete } from "@mui/icons-material"
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import { Product } from "../../model/Product"
import { useEffect, useMemo, useRef, useState } from "react"
import { PickedProduct } from "../../model/PickedProduct"
import { Subscription } from "rxjs"
import { authService, ordersService } from "../../config/service-config"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Confirm from "../common/Confirm"
import { getEndDate, getISODateStr } from "../../util/date-functions"
import { useNavigate } from "react-router-dom"

const centerStyle = {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center'
}
const ShoppingCart: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.8, headerClassName: 'data-grid-header',
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
            field: 'actionsRemove', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<RemoveIcon />}
                        onClick={() => {
                            const product: Product = params.row.product
                            const count = params.row.count
                            if (count < 2) {
                                removeProduct(product)
                            } else {
                                ordersService.removeProductFromCart(userData!.email, product)
                            }
                        }}
                    />
                ];
            }
        },
        {
            field: 'count', headerName: 'Count', flex: 0.4, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actionsAdd', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<AddIcon />}
                        onClick={() => {
                            ordersService.addProductToCart(userData!.email, params.row.product)
                        }}
                    />
                ];
            }
        },
        {
            field: 'amount', headerName: 'Amount in $', flex: 0.4, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actionsRemoveRow', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => removeProduct(params.row)}
                    />
                ];
            }
        }
    ]
    const productId = useRef('')
    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmContent, setConfirmContent] = useState('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

    function removeProduct(prod: Product) { //we have same fn in ProductsAdmin
        setConfirmTitle('delete product?')
        setConfirmContent(`you are going to delete ${prod.title} from cart`)
        productId.current = prod.id
        setOpenConfirmDialog(true)
    }
    function onSubmitConfirmDialog(confirmation: boolean) {
        setOpenConfirmDialog(false)
        if (confirmation) {
            ordersService.removeProductFromCartAtAll(userData!.email, productId.current)
        }
    }
    const userData: UserData = useSelectorAuth()
    //code below TODO move to useSelectorCart in hooks
    const [cart, setCart] = useState<PickedProduct[]>([]);
    useEffect(() => {
        if (userData) {
            const subscription: Subscription = ordersService.getShoppingCart(userData.email)
                .subscribe({
                    next(prodArray: PickedProduct[]) {
                        setCart(prodArray);
                    }
                });
            return () => subscription.unsubscribe();
        }
    }, [])

    function getRows() {
        return cart.map(pp => ({
            ...pp.product,
            count: pp.count,
            amount: pp.count * pp.product.price,
            product: pp.product
        }))
    }
    const totalAmount = useMemo(() => getTotalAmount(), [cart])
    function getTotalAmount() {
        return cart.reduce((res, cur) => res + (cur.count * cur.product.price), 0)
    }
    const [openConfirmOrder, setOpenConfirmOrder] = useState(false)
    function onSubmitConfirmOrder(confirmatin: boolean) {
        setOpenConfirmOrder(false)
        if (confirmatin) {
            ordersService.createOrder(userData!.email, cart, deliveryDate)
        }
    }
    const [deliveryDate, setDeliveryDate] = useState('')
    function handlerDeliveryDate(event: any) {
        const date = event.target.value;
        setDeliveryDate(date);
    }



    //code below TODO move to useSelectorUsers in hooks
    const [users, setUsers] = useState<UserData[]>([]);
    useEffect(() => {
        const subscription: Subscription = authService.getUsers()
            .subscribe({
                next(usersArray: UserData[]) {
                    setUsers(usersArray);
                }
            });
        return () => subscription.unsubscribe();
    }, [])

    const isAdressExist: boolean = isAdress()
    function isAdress(): boolean {
        const userdata = users.filter(u => u?.email == userData?.email)[0]!
        return userdata && userdata?.address != ''
    }
    const [openWarning, setOpenWarning] = useState(false)
    const navigate = useNavigate()

    return <Box sx={centerStyle}>
        <Box sx={{ height: '60vh', width: '95vw' }}>
            <DataGrid
                columns={columns}
                rows={getRows()}
            />
        </Box>
        <Confirm
            title={confirmTitle}
            content={confirmContent}
            handleClose={onSubmitConfirmDialog}
            open={openConfirmDialog}
        />
        <Grid container justifyContent={'center'} spacing={1} >
            <Grid item xs={12} sm={4} md={4}>
                <Typography
                    className="center-style"
                    sx={{ mt: 2 }}
                    variant="h5"
                >
                    Total amount: ${totalAmount}
                </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
                <TextField
                    size="small"
                    sx={{ mt: 2 }}
                    type="date"
                    required
                    fullWidth
                    label="Order Date"
                    value={deliveryDate}
                    inputProps={{
                        min: getEndDate(new Date(), 30),
                        max: getEndDate(new Date(), 300)
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={handlerDeliveryDate}
                />
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
                <Box className="center-style">
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        fullWidth
                        disabled={totalAmount == 0 || !deliveryDate}
                        onClick={() => {
                            // ordersService.createOrder(userData!.email, cart)
                            if (!isAdressExist) {
                                setOpenWarning(true)
                            } else {
                                setOpenConfirmOrder(true)
                            }
                        }}
                    >
                        order
                    </Button>
                </Box>
            </Grid>
        </Grid>

        <Confirm
            title='create order?'
            content=''
            handleClose={onSubmitConfirmOrder}
            open={openConfirmOrder}
        />

        <Modal
            open={openWarning}
            onClose={() => setOpenWarning(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal-window">
                <Typography variant="h6">
                    please enter your adress
                </Typography>
                <Button onClick={() => {
                    setOpenWarning(false)
                    navigate('/profile')
                }}
                >
                    ok
                </Button>
            </Box>
        </Modal>
    </Box>
}
export default ShoppingCart