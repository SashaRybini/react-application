import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import { PickedProduct } from "../../model/PickedProduct"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Delete } from "@mui/icons-material"
import { Product } from "../../model/Product";
import { ordersService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { Order } from "../../model/Order";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { Box } from "@mui/material";
import Confirm from "./Confirm";

type Props = {
    // cart: PickedProduct[]
    orderId: string
    orderStatus: string
}

const OrderDetails: React.FC<Props> = ({ orderId, orderStatus }) => {

    // const userData: UserData = useSelectorAuth()

    function getColumns() {
        // if accepted/delivered => filter
        // if admin => filter //it looks like there will be no admin
        let columns: GridColDef[] = [
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
                field: 'actionsRemove', type: "actions", getActions: (params) => {
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
                field: 'actionsAdd', type: "actions", getActions: (params) => {
                    return [
                        <GridActionsCellItem label="add" icon={<AddIcon />}
                            onClick={() => {
                                updateOrder(params.id.toString(), false)
                            }}
                        />
                    ];
                }
            }
            // ,
            // {
            //     field: 'actionsRemoveRow', type: "actions", getActions: (params) => {
            //         return [
            //             <GridActionsCellItem label="remove" icon={<Delete />}
            //                 onClick={() => {
            //                     console.log('remove')
            //                     // deleteOrder()
            //                 }}
            //             />
            //         ];
            //     }
            // }
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
    function deleteOrder() {
        ordersService.deleteOrder(orderId!)
    }
    const [openConfirm, setOpenConfirm] = useState(false)
    function onSubmitConfirm(decision: boolean) {
        setOpenConfirm(false)
        if (decision) {
            deleteOrder()
        }
    }

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

    function getRows() {
        let order: Order
        let rows: any = []
        if (orders.length > 0) {
            order = orders.filter(o => o.id == orderId)[0]
            if (order) { //cuz undefined after deleting
                rows = order.cart.map(pp => ({ ...pp.product, id: pp.id, count: pp.count }))
            }
        }
        // if (userData?.role === 'admin') {
        //     rows = cart.map(pp => ({...pp.product, id: pp.id, count: pp.count}))
        // }
        return rows
    }

    return <Box>
        <DataGrid columns={getColumns()} rows={getRows()} />
        <Confirm
            title='delete order?'
            content=''
            handleClose={onSubmitConfirm}
            open={openConfirm}
        />
    </Box>
}
export default OrderDetails