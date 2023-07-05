import { Box, Button, FormHelperText, MenuItem, Select, TextField, Typography } from "@mui/material"
import Statistics from "../common/Statistics"
import { useState } from "react"

const DEFAULT_INTERVAL = 5000

const intervals = [1000, 2000, 5000, 10000]

const SalaryStatistics: React.FC = () => {

    const [interval, setInterval] = useState(DEFAULT_INTERVAL)

    function handlerInterval(event: any) {
        const selectedInterval = event.target.value;

        setInterval(selectedInterval);
    }


    return <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={interval}
                onChange={handlerInterval}
            >
                {intervals.map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
            </Select>
            <FormHelperText>Select interval</FormHelperText>
        </Box>
        <Statistics fieldName="salary" interval={interval} />
    </Box>

}

export default SalaryStatistics