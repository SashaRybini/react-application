import { 
    Box, Grid, FormControl, InputLabel, Select, MenuItem, 
    TextField, FormControlLabel, FormLabel, Radio, RadioGroup 
} from "@mui/material"
import housesConfig from "../../config/houses-config.json"
import Advert from "../../model/Advert";
import { useEffect, useState } from "react";

const { houseType, minRooms, maxRooms, minSquare, maxSquare, advertType } = housesConfig;

type HouseDetails = {
    houseType: string,
    advertType: string,
    rooms: number,
    square: number
}

type Props = {
    handlerDetails: (details: string) => void,
    advertUpd?: Advert
}

const initialDetails: HouseDetails = {
    houseType: "",
    advertType: "",
    rooms: 0,
    square: 0
}

export const HousesForm: React.FC<Props> = ({ handlerDetails, advertUpd }) => {

    const [details, setDetails] = useState<HouseDetails>(advertUpd ? JSON.parse(advertUpd.details) : initialDetails);

    function handlerHouseType(event: any) {
        const housetype = event.target.value;
        const detCopy = { ...details };
        detCopy.houseType = housetype;
        setDetails(detCopy);
    }
    function handlerRooms(event: any) {
        const rooms = event.target.value;
        const detCopy = { ...details };
        detCopy.rooms = rooms;
        setDetails(detCopy);
    }
    function handlerSquare(event: any) {
        const square = event.target.value;
        const detCopy = { ...details };
        detCopy.square = square;
        setDetails(detCopy);
    }
    function handlerAdverttype(event: any) {
        const type = event.target.value;
        const detCopy = { ...details };
        detCopy.advertType = type;
        setDetails(detCopy);
    }

    useEffect(() => {
        handlerDetails(JSON.stringify(details))
    }, [details])

    return <Box sx={{ marginTop: { sm: "3vh" } }}>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} sm={5} >
                <FormControl fullWidth required>
                    <InputLabel id="select-housetype-id">House type</InputLabel>
                    <Select labelId="select-housetype-id" label="House type"
                        value={details.houseType} onChange={handlerHouseType}>
                        <MenuItem value=''>None</MenuItem>
                        {houseType.map(h => <MenuItem value={h} key={h}>{h}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Rooms"
                    inputProps={{
                        min: minRooms,
                        max: maxRooms
                    }}
                    onChange={handlerRooms}
                    value={details.rooms || ""} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Square"
                    inputProps={{
                        min: minSquare,
                        max: maxSquare
                    }}
                    onChange={handlerSquare}
                    value={details.square || ""} />
            </Grid>
            <Grid item xs={8} sm={4} md={5}>
                <FormControl required >
                    <FormLabel id="adtype-group-label">Type</FormLabel>
                    <RadioGroup
                        aria-labelledby="adtype-group-label"
                        defaultValue=""
                        value={details.advertType || ''}
                        name="radio-buttons-group"
                        row onChange={handlerAdverttype}
                    >
                        <FormControlLabel value={advertType[0]} control={<Radio />} label={advertType[0]} />
                        <FormControlLabel value={advertType[1]} control={<Radio />} label={advertType[1]} />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    </Box>
}