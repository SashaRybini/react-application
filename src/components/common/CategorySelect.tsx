import { Box, FormControl, FormHelperText, MenuItem, Select } from "@mui/material"

type Props = {
    category: string,
    handlerCategoryFilter: (event: any) => void,
    categories: string[]
}

const CategorySelect: React.FC<Props> = ({ category, handlerCategoryFilter, categories }) => {

    return <Box>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            {/* <InputLabel id="demo-select-small-label">Age</InputLabel> */}
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={category || 'All products'}
                onChange={handlerCategoryFilter}
            >
                <MenuItem value='All products'>All products</MenuItem>
                {categories.map(c => <MenuItem value={c} key={c}>{c}s</MenuItem>)}
            </Select>
            <FormHelperText>Select category</FormHelperText>
        </FormControl>
    </Box>
}
export default CategorySelect