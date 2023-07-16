import { Box, Button, Tooltip } from "@mui/material"
import { useEffect, useState } from "react";
import { Order } from "../../model/Order";
import { Subscription } from "rxjs";
import { authService, ordersService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Avatar from '@mui/material/Avatar';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { log } from "console";
import UserData from "../../model/UserData";

const centerStyle = {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center'
}

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

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
                return <Button onClick={() => console.log(users.filter(u => u?.email === params.value))}>
                    <Tooltip title={params.value}>
                    <Avatar {...stringAvatar(params.value)} />
                    </Tooltip>
                </Button>
            }
        },
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
        // {
        //     field: 'actionsDate', headerName: "Delivery Date", flex: 0.8,
        //     type: "actions", getActions: (params) => {
        //         return [
        //             <GridActionsCellItem label="remove" icon={<EditCalendarIcon />}
        //                 onClick={() => console.log('set date')}
        //             />
        //         ];
        //     }
        // },
        // {
        //     field: 'status', headerName: 'Status', flex: 0.6, headerClassName: 'data-grid-header',
        //     align: 'center', headerAlign: 'center'
        // }
        {
            field: 'actionsStatus', headerName: "Status", flex: 0.8,
            type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<LocalShippingOutlinedIcon />}
                        onClick={() => console.log('set status')}
                    />
                ];
            }
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

    //code below maybe also TODO move to useSelectorUsers in hooks
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

    function getRows() {
        return orders.map(o => ({ ...o, cost: getCost(o) }))
    }
    function getCost(order: Order): number {
        return order.cart.reduce((res, cur) => (res + (cur.count * cur.product.price)), 0)
    }

    return <Box sx={centerStyle}>
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid
                columns={columns}
                rows={getRows()}
            />
        </Box>
    </Box>
}
export default Customers