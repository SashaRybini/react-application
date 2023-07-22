import { 
    Box, Button, Modal, useMediaQuery, useTheme 
} from "@mui/material"
import { useMemo, useRef, useState } from "react";
import { Order } from "../../model/Order";
import { ordersService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import OrderDetails from "../common/OrderDetails";
import { Delete } from "@mui/icons-material";
import Confirm from "../common/Confirm";
import { useDispatchCode, useSelectorOrders } from "../../hooks/hooks";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '70%', //
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
    function getColumns() {
        let columns: GridColDef[] = [
            {
                field: 'id', headerName: 'Order ID', flex: 0.5, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center', editable: true
            },
            {
                field: 'cost', headerName: 'Cost in $', flex: 0.7, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'orderDate', headerName: 'Order Date', flex: 0.8, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'deliveryDate', headerName: 'Delivery Date', flex: 0.7, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'actions', headerName: "Order Details", flex: 0.8,
                type: "actions", getActions: (params) => {
                    return [
                        <GridActionsCellItem label="details" icon={<VisibilityIcon />}
                            onClick={() => {
                                setOpenOrderDetails(true)
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
        if (isMobile) {
            columns = columns.filter(c => c.field != 'id' && c.field != 'orderDate')
        }
        return columns
    }

    const orderStatus = useRef('')
    const orderId = useRef('')
    
    const orders = useSelectorOrders()

    const userData: UserData = useSelectorAuth()

    function getRows() {
        let userOrders = orders.filter(o => o.email === userData?.email)
        userOrders = userOrders.map(uo => ({
            ...uo,
            cost: getCost(uo)
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

    const dispatch = useDispatchCode()
    function deleteOrder() {
        try {
            ordersService.deleteOrder(orderId.current)
            dispatch('', `order ${orderId.current} has been deleted`) //hmm.. (rerenders too fast mby)
        } catch (error: any) {
            dispatch(error, '')
        }
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

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))
    const rotateStyle = isPortrait ? 'rotate' : ''

    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return <Box sx={centerStyle} className={rotateStyle}>
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
            }}
        >
            {buttonName}
        </Button>
        <Box sx={{ height: '65vh', width: isPortrait ? '180vw' : '95vw' }}>
            <DataGrid
                columns={getColumns()}
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