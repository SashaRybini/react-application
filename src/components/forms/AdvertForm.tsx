import React, { ReactNode, useMemo, useState } from "react";
import { 
    FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button
} from '@mui/material';
import advertsConfig from "../../config/categories-config.json"
import Advert from "../../model/Advert";
import { HousesForm } from "./HousesForm";
import { VehiclesForm } from "./VehiclesForm";
import { ElectricalForm } from "./ElectricalForm";
import { getSubformComponent } from "./SubformsMap";

const categories = advertsConfig.categories;

type Props = {
    submitFn: (advert: Advert) => void
    advertUpdated?: Advert
}

const initialAdvert: Advert = {
    id: 0,
    category: "",
    price: 0,
    name: "",
    details: ""
}

export const AdvertForm: React.FC<Props> = ({ submitFn, advertUpdated }) => {

    const [advert, setAdvert] = useState<Advert>(advertUpdated || initialAdvert);

    function handlerCategory(event: any) {
        const category = event.target.value;
        const advertCopy = { ...advert };
        advertCopy.category = category;
        setAdvert(advertCopy);
    }
    function handlerName(event: any) {
        const name = event.target.value;
        const advertCopy = { ...advert };
        advertCopy.name = name;
        setAdvert(advertCopy);
    }
    function handlerPrice(event: any) {
        const price: number = +event.target.value;
        const advertCopy = { ...advert };
        advertCopy.price = price;
        setAdvert(advertCopy);
    }
    function handlerDetails(details: string) {
        const advertCopy = { ...advert };
        advertCopy.details = details;
        setAdvert(advertCopy);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        submitFn(advert);
        event.target.reset();
    }
    function onResetFn(event: any) {

        setAdvert(advertUpdated || initialAdvert);
    }

    const subformComponent = useMemo(() => 
        getSubformComponent(advert.category, handlerDetails, advertUpdated), [advert.category])

    return <Box sx={{ marginTop: { sm: "3vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-category-id">Category</InputLabel>
                        <Select labelId="select-category-id" label="Category"
                            disabled={!!advertUpdated}
                            value={advert.category} onChange={handlerCategory}>
                            <MenuItem value=''>None</MenuItem>
                            {categories.map(c => <MenuItem value={c} key={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Advert name"
                        onChange={handlerName}
                        value={advert.name} />
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="number" required fullWidth label="Price"
                        inputProps={{
                            min: 1,
                            max: 1_000_000_000
                        }}
                        onChange={handlerPrice}
                        value={advert.price || ""} />
                </Grid>
            </Grid>

            {subformComponent}

            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>
        </form>
    </Box>
}