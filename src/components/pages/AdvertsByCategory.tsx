import { Box, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import advertsConfig from "../../config/categories-config.json"
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { advertsService } from "../../config/service-config";
import Advert from "../../model/Advert";
import CodePayload from "../../model/CodePayload";
import CodeType from "../../model/CodeType";
import { useDispatchCode } from "../../hooks/hooks";

const categories = advertsConfig.categories;

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
}

const columns: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'category', headerName: 'Category', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'price', headerName: 'Price', flex: 1, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'name', headerName: 'Name', flex: 0.8, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    }
]

const AdvertsByCategory: React.FC = () => {

    const [category, setCategory] = useState("");

    function handlerCategory(event: any) {
        const cat = event.target.value;
        setCategory(cat)
    }

    // const adverts: any[] = []
    useMemo(() => getAdverts(), [category])
    const [adverts, setAdverts] = useState<Advert[]>([]);
    // useEffect(async () => {
    //     const advArray: Advert[] | string = await advertsService.getAdvertsByCategory(category)
    //     const alert: CodePayload = { code: CodeType.OK, message: '' }
    //     if (typeof advArray === 'string') {
    //         alert.code = CodeType.SERVER_ERROR
    //         alert.message = advArray
    //     } else {
    //         setAdverts(advArray)
    //     }
    //     // dispatch(codeActions.set(alert)) //

    // }, [])
    const dispatch = useDispatchCode()
    async function getAdverts() {
        if (category) {
            const advArray = await advertsService.getAdvertsByCategory(category)
            if (typeof advArray === 'string') {
                dispatch(advArray, '')
            } else {
                console.log(advArray)
                setAdverts(advArray)
                // dispatch('', `${category}`)
            }
            // dispatch(codeActions.set(alert)) //
        }
    }
    // async function submitFn(adv: Advert) {
    //     // const adv: Advert = await advertsService.addAdvert(advert)
    //     try {
    //         const res: string = await advertsService.addAdvert(adv)
    //         console.log(res)
    //         // dispatch('', `advert: ${advert.name} with id ${advert.id} has been added`)
    //         dispatch('', res)
    //     } catch (error: any) {
    //         console.log(error)
    //         dispatch(error, '')
    //     }
    // }


    return <Box sx={centerStyle}>
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
    </Box>
}
export default AdvertsByCategory