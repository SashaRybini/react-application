import { Box, FormHelperText, MenuItem, Select } from "@mui/material"

type Props = {
    category: string,
    handlerCategoryFilter: (event: any) => void,
    categories: string[]
}

const CategorySelect: React.FC<Props> =  ({category, handlerCategoryFilter, categories}) => {

    return <Box>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"

            value={category || 'All products'}
            onChange={handlerCategoryFilter}
        >
            <MenuItem value='All products'>All products</MenuItem>
            {categories.map(c => <MenuItem value={c} key={c}>{c}s</MenuItem>)}
        </Select>
        <FormHelperText>Select category</FormHelperText>
    </Box>
}
export default CategorySelect