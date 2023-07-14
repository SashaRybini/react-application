import { Delete } from "@mui/icons-material"
import { Box } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import { Product } from "../../model/Product"
import { useEffect, useState } from "react"
import { PickedProduct } from "../../model/PickedProduct"
import { Subscription } from "rxjs"
import { ordersService } from "../../config/service-config"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const centerStyle = {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center'
}
const ShoppingCart: React.FC = () => {

    const columns: GridColDef[] = [
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
                        onClick={() => console.log('-')}
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
                        onClick={() => console.log('+')}
                    />
                ];
            }
        },
        {
            field: 'amount', headerName: 'Amount', flex: 0.4, headerClassName: 'data-grid-header',
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
    function removeProduct(prod: Product) {
        console.log('-row');

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
            amount: pp.count * pp.product.price
        }))
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
export default ShoppingCart