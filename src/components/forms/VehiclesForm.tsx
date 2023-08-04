import { useEffect, useState } from "react"
import Advert from "../../model/Advert"
import { Box, Grid, TextField } from "@mui/material"
import vehicleConfig from "../../config/vehicle-config.json"

const { minYear, maxMileage } = vehicleConfig;

type VehicleDetails = {
    manufacturer: string,
    model: string,
    color: string,
    year: number,
    mileage: number
}

type Props = {
    handlerDetails: (details: string) => void,
    advert: Advert
}

const initialDetails: VehicleDetails = {
    manufacturer: "",
    model: "",
    color: "",
    year: 0,
    mileage: 0
}

export const VehiclesForm: React.FC<Props> = ({ handlerDetails, advert }) => {

    const [details, setDetails] = useState<VehicleDetails>(advert.details ? JSON.parse(advert.details) : initialDetails);

    function handlerManufacturer(event: any) {
        const manufacturer = event.target.value;
        const detCopy = { ...details };
        detCopy.manufacturer = manufacturer;
        setDetails(detCopy);
    }
    function handlerModel(event: any) {
        const model = event.target.value;
        const detCopy = { ...details };
        detCopy.model = model;
        setDetails(detCopy);
    }
    function handlerColor(event: any) {
        const color = event.target.value;
        const detCopy = { ...details };
        detCopy.color = color;
        setDetails(detCopy);
    }
    function handlerYear(event: any) {
        const year: number = +event.target.value;
        const detCopy = { ...details };
        detCopy.year = year;
        setDetails(detCopy);
    }
    function handlerMileage(event: any) {
        const mileage: number = +event.target.value;
        const detCopy = { ...details };
        detCopy.mileage = mileage;
        setDetails(detCopy);
    }

    useEffect(() => {
        handlerDetails(JSON.stringify(details))
    }, [details])

    return <Box sx={{ marginTop: { sm: "3vh" } }}>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} sm={5} >
                <TextField type="text" required fullWidth label="Manufacturer"
                    onChange={handlerManufacturer}
                    value={details.manufacturer} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="text" required fullWidth label="Model"
                    onChange={handlerModel}
                    value={details.model} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="text" required fullWidth label="Color"
                    onChange={handlerColor}
                    value={details.color} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Year"
                    inputProps={{
                        min: minYear,
                        max: new Date().getFullYear()
                    }}
                    onChange={handlerYear}
                    value={details.year || ""} />
            </Grid>
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Mileage"
                    inputProps={{
                        min: 0,
                        max: maxMileage
                    }}
                    onChange={handlerMileage}
                    value={details.mileage || ""} />
            </Grid>
        </Grid>
    </Box>
}