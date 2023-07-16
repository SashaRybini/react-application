import { Box, Modal, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { Order } from "../../model/Order";
import { ordersService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import OrderDetails from "../common/OrderDetails";
import { PickedProduct } from "../../model/PickedProduct";

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
                    <GridActionsCellItem label="remove" icon={<VisibilityIcon />}
                        onClick={() => {
                            setOpenOrderDetails(true)
                            cart.current = params.row.cart
                        }}
                    />
                ];
            }
        },
        {
            field: 'status', headerName: 'Status', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        }
    ]

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
        const userOrders = orders.filter(o => o.email === userData?.email)
        return userOrders.map(uo => ({ 
            ...uo, 
            cost: getCost(uo),
            orderDate: uo.orderDate,
            deliveryDate: uo.deliveryDate,
            status: uo.status
        }))
    }
    function getCost(order: Order): number {
        return order.cart.reduce((res, cur) => (res + (cur.count * cur.product.price)), 0)
    }
    const [openOrderDetails, setOpenOrderDetails] = useState(false)

    return <Box sx={centerStyle}>
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid
                columns={columns}
                rows={getRows()}
            />
        </Box>
        <Modal
            open={openOrderDetails}
            onClose={() => setOpenOrderDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* maybe: if just Ordered - show table like in shopping catr, 
                    else (accepted or delivered) - show only details like below */}
                <OrderDetails cart={cart.current as PickedProduct[]}  />
            </Box>
        </Modal>
    </Box>
}
export default Orders