import { Box, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import advertsConfig from "../../config/categories-config.json"
import { useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { advertsService } from "../../config/service-config";

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

    const adverts: any[] = []
    // const adverts = useMemo(() => advertsService.getAdvertsByCategory(category), [category])

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