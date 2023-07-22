import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ordersService } from "../../config/service-config";
import { Order } from "../../model/Order";
import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Confirm from "./Confirm";
import { useDispatchCode, useSelectorOrders } from "../../hooks/hooks";

type Props = {
    orderId: string
    orderStatus: string
}

const OrderDetails: React.FC<Props> = ({ orderId, orderStatus }) => {

    function getColumns() {
        let columns: GridColDef[] = [
            {
                field: 'id', headerName: 'ID', flex: 0.7, headerClassName: 'data-grid-header',
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
                field: 'actionsRemove', flex: 0.4, type: "actions", getActions: (params) => {
                    return [
                        <GridActionsCellItem label="remove" icon={<RemoveIcon />}
                            onClick={() => {
                                updateOrder(params.id.toString(), true)
                            }}
                        />
                    ];
                }
            },
            {
                field: 'count', headerName: 'Count', flex: 0.6, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'actionsAdd', flex: 0.4, type: "actions", getActions: (params) => {
                    return [
                        <GridActionsCellItem label="add" icon={<AddIcon />}
                            onClick={() => {
                                updateOrder(params.id.toString(), false)
                            }}
                        />
                    ];
                }
            }
        ]
        if (orderStatus != 'ordered') {
            columns = columns.filter(c => c.field != 'actionsRemove' && c.field != 'actionsAdd')
        }
        return columns
    }
    async function updateOrder(prodId: string, isRemove: boolean) {
        const orderToUpdate: Order = await ordersService.getOrder(orderId!)
        //pwc Product with count (and id actually)
        orderToUpdate.cart.map(pwc => {
            if (pwc.id == prodId) {
                isRemove ? pwc.count-- : pwc.count++
            }
        })
        orderToUpdate.cart = orderToUpdate.cart.filter(pwc => pwc.count !== 0)
        if (orderToUpdate.cart.length == 0) {
            setOpenConfirm(true)
        } else {
            ordersService.updateOrder(orderToUpdate)
        }
    }
    const dispatch = useDispatchCode()
    function deleteOrder() {
        try {
            ordersService.deleteOrder(orderId!)
            dispatch('', `order ${orderId!} has been deleted`) //hmm..
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

    const orders = useSelectorOrders()

    function getRows() {
        let order: Order
        let rows: any = []
        if (orders.length > 0) {
            order = orders.filter(o => o.id == orderId)[0]
            if (order) { //cuz undefined after deleting
                rows = order.cart.map(pp => ({ ...pp.product, id: pp.id, count: pp.count }))
            }
        }
        return rows
    }

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))
    const rotateStyle = isPortrait ? 'rotate' : ''

    return <Box className={rotateStyle}>
        <Box sx={{
            height: '60vh', width: isPortrait ? '160vw' : '80vw',
            ml: isPortrait ? '9vw' : ''
        }}
        >
            <DataGrid columns={getColumns()} rows={getRows()} />
        </Box>
        <Confirm
            title='delete order?'
            content=''
            handleClose={onSubmitConfirm}
            open={openConfirm}
        />
    </Box>
}
export default OrderDetails