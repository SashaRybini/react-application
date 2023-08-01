import Advert from "../../model/Advert"

import electricalConfig from "../../config/electrical-config.json"
import { useState, useEffect } from "react";
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const { productAge, productType } = electricalConfig;

type ElectricalDetails = {
    productAge: string,
    productType: string
}

type Props = {
    handlerDetails: (details: string) => void,
    advert: Advert
}

const initialDetails: ElectricalDetails = {
    productAge: "",
    productType: ""
}

export const ElectricalForm: React.FC<Props> = ({ handlerDetails, advert }) => {

    const [details, setDetails] = useState<ElectricalDetails>(advert.details ? JSON.parse(advert.details) : initialDetails);

    function handlerProducttype(event: any) {
        const type = event.target.value;
        const detCopy = { ...details };
        detCopy.productType = type;
        setDetails(detCopy);
    }
    function handlerProductage(event: any) {
        const age = event.target.value;
        const detCopy = { ...details };
        detCopy.productAge = age;
        setDetails(detCopy);
    }

    useEffect(() => {
        handlerDetails(JSON.stringify(details))
    }, [details])

    return <Box sx={{ marginTop: { sm: "3vh" } }}>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} sm={5} >
                <FormControl fullWidth required>
                    <InputLabel id="select-electricaltype-id">Product type</InputLabel>
                    <Select labelId="select-electricaltype-id" label="Product type"
                        value={details.productType} onChange={handlerProducttype}>
                        <MenuItem value=''>None</MenuItem>
                        {productType.map(p => <MenuItem value={p} key={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={8} sm={4} md={5}>
                <FormControl required >
                    <FormLabel id="adtype-group-label">Type</FormLabel>
                    <RadioGroup
                        aria-labelledby="adtype-group-label"
                        defaultValue=""
                        value={details.productAge || ''}
                        name="radio-buttons-group"
                        row onChange={handlerProductage}
                    >
                        <FormControlLabel value={productAge[0]} control={<Radio />} label={productAge[0]} />
                        <FormControlLabel value={productAge[1]} control={<Radio />} label={productAge[1]} />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    </Box>
}

