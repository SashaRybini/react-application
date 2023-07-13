import { Delete, Edit } from "@mui/icons-material";
import { Box, Link } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"

import { getRandomInt } from "../../util/random";
import { useState } from "react";


// import tempConfig from "../../config/goods-config.json"
// import { useSelector } from "react-redux";
import { useSelectorProducts } from "../../hooks/hooks";
// const products = tempConfig.initialGoods.map(g => ({ ...g, price: `$${g.price}`, id: getRandomInt(1, 1000) }))

function ExpandableCell({ value }: GridRenderCellParams) {
    const [expanded, setExpanded] = useState(false);
    return (
      <Box>
        {expanded ? value : value.slice(0, 50)}&nbsp;
        {value.length > 50 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            type="button"
            component="button"
            sx={{ fontSize: 'inherit' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'view less' : 'view more'}
          </Link>
        )}
      </Box>
    );
  }

const ProductsAdmin: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'imageUrl', headerName: 'Image', flex: 0.4, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                return <img src={params.value} style={{ width: '100%'}} />
            }
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
            field: 'content', headerName: 'Content', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center', 
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
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

    const products = useSelectorProducts()


    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    }}
    >
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid 
                // getEstimatedRowHeight={() => 100}
                getRowHeight={() => 'auto'} 
                columns={columns} 
                rows={products} />
        </Box>
    </Box>
}
export default ProductsAdmin