import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { PickedProduct } from "../../model/PickedProduct"
import { Typography, useMediaQuery, useTheme } from "@mui/material";

type Props = {
    cart: PickedProduct[]
}

const columns: GridColDef[] = [
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
        field: 'count', headerName: 'Count', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    }
]

const OrderDetailsAdmin: React.FC<Props> = ({ cart }) => {

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))
    // const rotateStyle = isPortrait ? 'rotate' : ''

    function getRows() {
        return cart.map(pp => ({ ...pp.product, id: pp.id, count: pp.count }))
    }

    return isPortrait
        ?
        <Typography>ROTATE PHONE YOU ARE AT WORK ACTUALLY</Typography>
        :
        <DataGrid columns={columns} rows={getRows()} />
}
export default OrderDetailsAdmin

// <Box className={rotateStyle}>
//         <Box sx={{
//             height: '60vh', width: isPortrait ? '160vw' : '80vw',
//              ml: isPortrait ? '9vw' : ''
//         }}
//         >
//             <DataGrid columns={columns} rows={getRows()} />
//         </Box>
//     </Box>