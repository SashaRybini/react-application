import { 
    Box, Button,  Modal, Tooltip, useMediaQuery, useTheme 
} from "@mui/material"
import { useMemo, useRef, useState } from "react";
import { Order } from "../../model/Order";
import { ordersService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Avatar from '@mui/material/Avatar';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import UserData from "../../model/UserData";
import UserInfoCard from "../common/UserInfoCard";
import { PickedProduct } from "../../model/PickedProduct";
import CheckIcon from '@mui/icons-material/Check';
import Confirm from "../common/Confirm";
import OrderDetailsAdmin from "../common/OrderDetailsAdmin";
import { useSelectorOrders, useSelectorUsers } from "../../hooks/hooks";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        // children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        children: `${name.substring(0, 1).toUpperCase()}`,
    };
}

const Customers: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'email', headerName: 'Customer', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                return <Button onClick={() => {
                    setOpenUserDetails(true)
                    const user: UserData = users.filter(u => u?.email === params.value)[0]
                    userInfo.current = user
                }}>
                    <Tooltip title={params.value}>
                        <Avatar {...stringAvatar(params.value)} />
                    </Tooltip>
                </Button>
            }
        },
        {
            field: 'id', headerName: 'Order ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center',
            type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="orderDetails" icon={
                        <Box sx={{ fontSize: '0.8em', color: 'black' }}>{params.id}</Box>
                    }
                        onClick={() => {
                            const userCart: PickedProduct[] = params.row.cart
                            setOpenOrderDetails(true)
                            cart.current = userCart
                        }}
                    />
                ];
            }
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
            field: 'status', headerName: 'Status', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actionsStatus', type: "actions", getActions: (params) => {
                const isOrdered = params.row.status == 'ordered'
                const isAccepted = params.row.status == 'accepted'
                const isDelivered = params.row.status == 'delivered'
                return [
                    <GridActionsCellItem label="status" disabled={isAccepted || isDelivered} icon={<CheckIcon />}
                        onClick={() => {
                            convertOrderAndUpdateStatus(params.row, 'accepted')
                        }}
                    />,
                    <GridActionsCellItem label="update" disabled={isDelivered || isOrdered} icon={<LocalShippingOutlinedIcon />}
                        onClick={() => {
                            convertOrderAndUpdateStatus(params.row, 'delivered')
                        }}
                    />
                ];
            }
        }
    ]
    function convertOrderAndUpdateStatus(orderWithCost: any, status: string) {
        delete orderWithCost.cost //bug
        const order: Order = { ...orderWithCost, status }
        currentOrder.current = order
        setOpenConfirmStatus(true)
    }
    const currentOrder = useRef<Order>()
    const [openConfirmStatus, setOpenConfirmStatus] = useState(false)

    function onSubmitConfirmStatus(confirmation: boolean) {
        setOpenConfirmStatus(false)
        if (confirmation) {
            ordersService.setOrderStatus(currentOrder.current?.id, currentOrder.current!)
        }
    }
    const [openUserDetails, setOpenUserDetails] = useState(false)
    const userInfo = useRef<UserData>()

    const orders = useSelectorOrders()

    const users = useSelectorUsers()
    
    function getRows() {
        let rows = orders.map(o => ({ ...o, cost: getCost(o) }))
        if (hideDelivered) {
            rows = rows.filter(r => r.status != 'delivered')
        }
        return rows
    }
    function getCost(order: Order): number {
        return order.cart.reduce((res, cur) => (res + (cur.count * cur.product.price)), 0)
    }

    const [openOrderDetails, setOpenOrderDetails] = useState(false)
    const cart = useRef<PickedProduct[]>()

    const [buttonName, setButtonName] = useState('hide delivered')
    const [hideDelivered, setHideDelivered] = useState(false)

    const rows = useMemo(() => getRows(), [hideDelivered, orders])

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))
    const rotateStyle = isPortrait ? 'rotate' : ''

    return <Box className={`center-style ${rotateStyle}`}>
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
        <Box sx={{ height: isPortrait ? '40vh' : '65vh', width: isPortrait ? '180vw' : '95vw' }}>
            <DataGrid
                columns={columns}
                rows={rows}
            />
        </Box>
        <Modal
            open={openUserDetails}
            onClose={() => setOpenUserDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal-window">
                <UserInfoCard userInfo={userInfo.current!} />
            </Box>
        </Modal>
        <Confirm
            title='update status?'
            content=''
            handleClose={onSubmitConfirmStatus}
            open={openConfirmStatus}
        />
        <Modal
            open={openOrderDetails}
            onClose={() => setOpenOrderDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal-window-table">
                <OrderDetailsAdmin cart={cart.current as PickedProduct[]} />
            </Box>
        </Modal>
    </Box>
}
export default Customers