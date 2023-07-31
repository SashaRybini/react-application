import { Box, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material"

import housesConfig from "../../config/houses-config.json"
import Advert from "../../model/Advert";
import { useState } from "react";
const housesTypes = housesConfig.houseType;

type HouseDetails = {
    houseType: string,
    advertType: string,
    rooms: number,
    square: number
}

type Props = {
    handlerDetails: (event: any) => void,
    advert: Advert
}

const initialDetails: HouseDetails = {
    houseType: "",
    advertType: "",
    rooms: 0,
    square: 0
}

export const HousesForm: React.FC<Props> = ({handlerDetails, advert}) => {

    const [details, setDetails] = useState<HouseDetails>(advert.details ? JSON.parse(advert.details) : initialDetails);
    console.log(advert.details)
    console.log(details)

    console.log(JSON.stringify(details))
    function handlerHouseType(event: any) {
        const housetype = event.target.value;
        const detCopy = { ...details };
        detCopy.houseType = housetype;
        setDetails(detCopy);
    }
    //useMemo on handlerDetails?

    return <Box sx={{ marginTop: { sm: "3vh" } }}>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} sm={5} >
                <FormControl fullWidth required>
                    <InputLabel id="select-housetype-id">House type</InputLabel>
                    <Select labelId="select-housetype-id" label="House type"
                        value={details.houseType} onChange={handlerHouseType}>
                        <MenuItem value=''>None</MenuItem>
                        {housesTypes.map(h => <MenuItem value={h} key={h}>{h}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            {/* <Grid item xs={8} sm={5} >
                <TextField type="text" required fullWidth label="Advert name"
                    onChange={handlerName}
                    value={advert.name} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Price"
                    inputProps={{
                        min: 1
                    }}
                    onChange={handlerPrice}
                    value={advert.price || ""} />
            </Grid> */}
        </Grid>
        
   
</Box>
}