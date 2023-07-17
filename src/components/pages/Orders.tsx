import { Box, Button, Modal, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { Order } from "../../model/Order";
import { ordersService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import OrderDetails from "../common/OrderDetails";
import { PickedProduct } from "../../model/PickedProduct";
import ShoppingCart from "./ShoppingCart";
import { Delete } from "@mui/icons-material";
import Confirm from "../common/Confirm";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const centerStyle = {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center'
}

const Orders: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'Order ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'cost', headerName: 'Cost in $', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'orderDate', headerName: 'Order Date', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'deliveryDate', headerName: 'Delivery Date', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions', headerName: "Order Details", flex: 0.8,
            type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="details" icon={<VisibilityIcon />}
                        onClick={() => {
                            setOpenOrderDetails(true)
                            cart.current = params.row.cart
                            orderId.current = params.id.toString()
                            orderStatus.current = params.row.status
                        }}
                    />
                ];
            }
        },
        {
            field: 'status', headerName: 'Status', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actionsRemoveRow', type: "actions", getActions: (params) => {
                const isDisabled = params.row.status != 'ordered'
                return [
                    <GridActionsCellItem label="remove" disabled={isDisabled} icon={<Delete />}
                        onClick={() => {
                            setOpenConfirm(true)
                            orderId.current = params.id.toString()
                        }}
                    />
                ];
            }
        }
    ]
    const orderStatus = useRef('')
    const orderId = useRef('')
    //code below TODO move to useSelectorOrders in hooks
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const subscription: Subscription = ordersService.getOrders()
            .subscribe({
                next(ordersArray: Order[]) {
                    setOrders(ordersArray);
                }
            });
        return () => subscription.unsubscribe();
    }, [])

    const userData: UserData = useSelectorAuth()
    const cart = useRef([])

    function getRows() {
        let userOrders = orders.filter(o => o.email === userData?.email)
        userOrders.map(uo => ({
            ...uo,
            cost: getCost(uo),
            orderDate: uo.orderDate,
            deliveryDate: uo.deliveryDate,
            status: uo.status
        }))
        if (hideDelivered) {
            userOrders = userOrders.filter(uo => uo.status != 'delivered')
        }
        return userOrders
    }
    function getCost(order: Order): number {
        return order.cart.reduce((res, cur) => (res + (cur.count * cur.product.price)), 0)
    }
    const [openOrderDetails, setOpenOrderDetails] = useState(false)

    function deleteOrder() {
        console.log(orderId.current)
        ordersService.deleteOrder(orderId.current)
    }
    const [openConfirm, setOpenConfirm] = useState(false)
    function onSubmitConfirm(decision: boolean) {
        setOpenConfirm(false)
        if (decision) {
            deleteOrder()
        }
    }

    const [buttonName, setButtonName] = useState('hide delivered')
    const [hideDelivered, setHideDelivered] = useState(false)

    const rows = useMemo(() => getRows(), [hideDelivered, orders])

    return <Box sx={centerStyle}>
        <Button
            onClick={() => {
                setButtonName(
                    buttonName == 'hide delivered'
                        ?
                        'show delivered'
                        :
                        'hide delivered'
                )
                setHideDelivered(buttonName == 'hide delivered')
                console.log('knopka')
            }}
        >
            {buttonName}
        </Button>
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid
                columns={columns}
                rows={rows}
            />
        </Box>
        <Modal
            open={openOrderDetails}
            onClose={() => setOpenOrderDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <OrderDetails
                    // cart={cart.current as PickedProduct[]}
                    orderId={orderId.current!}
                    orderStatus={orderStatus.current}
                />
            </Box>
        </Modal>
        <Confirm
            title='delete order?'
            content=''
            handleClose={onSubmitConfirm}
            open={openConfirm}
        />
    </Box>
}
export default Orders