import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Modal, Typography } from "@mui/material"
import advertsConfig from "../../config/categories-config.json"
import { useEffect, useMemo, useRef, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { advertsService } from "../../config/service-config";
import Advert from "../../model/Advert";
import { useDispatchCode } from "../../hooks/hooks";
import VisibilityIcon from '@mui/icons-material/Visibility'

const categories = advertsConfig.categories;

const AdvertsByCategory: React.FC = () => {
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

    const [category, setCategory] = useState("");

    function handlerCategory(event: any) {
        const cat = event.target.value;
        setCategory(cat)
    }

    useMemo(() => getAdverts(), [category])
    const [adverts, setAdverts] = useState<Advert[]>([]);
   
    const dispatch = useDispatchCode()
    async function getAdverts() {
        if (category) {
            try {
                const advArray = await advertsService.getAdvertsByCategory(category)
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
        <Box sx={{ marginTop: { sm: "1vh" } }}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-category-id">Category</InputLabel>
                        <Select labelId="select-category-id" label="Category"
                            value={category} onChange={handlerCategory}>
                            {/* <MenuItem value=''>None</MenuItem> */}
                            {categories.map(c => <MenuItem value={c} key={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ height: '70vh', width: '95vw', marginTop: "2vh" }}>
                <DataGrid columns={columns} rows={adverts} />
            </Box>
        </Box>
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
export default AdvertsByCategory