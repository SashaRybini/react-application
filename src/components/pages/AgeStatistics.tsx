import { Box, FormHelperText, MenuItem, Select, Typography } from "@mui/material"
import Statistics from "./Statistics"
import { useState } from "react"

const DEFAULT_INTERVAL = 10

const intervals = [5, 10, 20]

const AgeStatistics: React.FC = () => {

    const [interval, setInterval] = useState(DEFAULT_INTERVAL)

    function handlerInterval(event: any) {
        const selectedInterval = event.target.value;

        setInterval(selectedInterval);
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box>
                <Select
                labelId="select-interval-id"
                value={interval}
                onChange={handlerInterval}>
                {intervals.map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
            </Select>
            <FormHelperText>Select interval</FormHelperText>
            </Box>
            <Statistics fieldName="birthDate" interval={interval} />
        </Box>
}

export default AgeStatistics