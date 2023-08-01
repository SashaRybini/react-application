import { Box, Grid, Button, TextField } from "@mui/material"
import { useState } from "react"

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
}

const AdvertsByPrice: React.FC = () => {

    const [maxPrice, setMaxProce] = useState(0)
    function handlerPrice(event: any) {
        const price = event.target.value
        setMaxProce(price)
    }


    return <Box sx={centerStyle}>
        <Grid container justifyContent={'center'} spacing={1} >
            <Grid item xs={8} sm={5} >
                <TextField type="number" required fullWidth label="Max price"
                    helperText="Enter max price" size="small"
                    inputProps={{
                        min: 1
                    }}
                    onChange={handlerPrice}
                    value={maxPrice || ""} />
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
                <Box className="center-style">
                    <Button variant="contained"
                        fullWidth disabled={maxPrice <= 0}
                        onClick={() => {
                            console.log(maxPrice)
                        }}
                    >
                        GO
                    </Button>
                </Box>
            </Grid>
        </Grid>
    </Box>
}
export default AdvertsByPrice