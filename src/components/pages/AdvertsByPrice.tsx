import { Box, Grid, Button, TextField, Modal, Typography } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import { advertsService } from "../../config/service-config";
import { useDispatchCode } from "../../hooks/hooks";
import Advert from "../../model/Advert";
import { GridColDef, GridRowParams, GridActionsCellItem, DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility'

const AdvertsByPrice: React.FC = () => {

    const [maxPrice, setMaxPrice] = useState(0)
    function handlerPrice(event: any) {
        const price = event.target.value
        setMaxPrice(price)
    }
    const [pricetogo, setPricetogo] = useState(0)

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'category', headerName: 'Category', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'price', headerName: 'Price', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'name', headerName: 'Name', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions', type: 'actions', flex: 0.6, getActions: (params: GridRowParams) => {
                return [
                    <GridActionsCellItem icon={<VisibilityIcon />} onClick={() => {
                        advert.current = params.row as Advert
                        setOpenDetailsModal(true)
                    }} label="Details" />
                ]
            }
        }
    ]

    useMemo(() => getAdverts(), [pricetogo])
    const [adverts, setAdverts] = useState<Advert[]>([]);
    
    const dispatch = useDispatchCode()
    async function getAdverts() {
        if (pricetogo) {
            try {
                const advArray = await advertsService.getAdvertsByPrice(pricetogo)
                if (typeof advArray !== 'string') {
                    setAdverts(advArray)
                }
            } catch (error: any) {
                dispatch(error, '')
            }
        }
    }
    const advert = useRef<Advert>()
    const [openDetailsModal, setOpenDetailsModal] = useState(false);


    return <Box className='center-style'>
        <Grid container justifyContent={'center'} spacing={1} >
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Max price"
                    helperText="Enter max price" size="small"
                    onChange={handlerPrice}
                    value={maxPrice || ""} />
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
                <Box className="center-style">
                    <Button variant="contained"
                        fullWidth disabled={maxPrice <= 0 || maxPrice >= 1_000_000_000}
                        onClick={() => {
                            setPricetogo(maxPrice);
                        }}
                    >
                        GO
                    </Button>
                </Box>
            </Grid>
            <Box sx={{ height: '70vh', width: '95vw', marginTop: "2vh" }}>
                <DataGrid columns={columns} rows={adverts} />
            </Box>
        </Grid>
        <Modal
            open={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='modal-window'>
                {advert.current && Object.entries(JSON.parse(advert.current!.details)).map(([key, value]) => {
                        const text = `${key}: ${value}`
                        return <Typography key={key}>{text}</Typography>
                })}
            </Box>
        </Modal>
    </Box>
}
export default AdvertsByPrice