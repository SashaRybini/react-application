import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import tempConfig from "../../config/goods-config.json"
import { getRandomInt } from "../../util/random";
const goods = tempConfig.initialGoods.map(g => ({ ...g, price: `$${g.price}`, id: getRandomInt(1, 1000) }))

const ProductsAdmin: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'image', headerName: 'Image', flex: 0.6, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                return <img src={params.value} alt="Image" style={{ width: '100%', height: 'auto' }} />
            },
        },
        {
            field: 'title', headerName: 'Title', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'price', headerName: 'Price', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'content', headerName: 'Content', flex: 0.3, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center', renderCell: (params) => {
                return <GridActionsCellItem label="content" icon={<ExpandMoreIcon />}
                    onClick={() => console.log(params.value)}
                />
            },
        },
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => console.log('remove')}
                    />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => console.log('update')}
                    />
                ];
            }
        }
    ]


    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    }}
    >
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={goods} />
        </Box>
    </Box>
}
export default ProductsAdmin