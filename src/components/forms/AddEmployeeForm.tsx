import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, ThemeProvider, createTheme } from "@mui/material"
import Employee from "../../model/Employee"

import employeeConfig from '../../config/employee-config.json'
import React from "react"

const { minSalary, maxSalary, minYear, maxYear, departments } = employeeConfig

const defaultTheme = createTheme();

type Props = {
    submitFn: (empl: Employee) => Promise<Employee>
}
const initialDate = new Date()

const AddEmployeeForm: React.FC<Props> = ({ submitFn }) => {
    const [department, setDepartment] = React.useState<string>('');
    const [gender, setGender] = React.useState<'male' | 'female'>('male');
    const [name, setName] = React.useState('');
    const [salary, setSalary] = React.useState(0);
    const [birthDate, setBirthDate] = React.useState<Date>(initialDate);
    const [open, setOpen] = React.useState(false)

    const handleChangeDepartment = (event: SelectChangeEvent) => {
        setDepartment(event.target.value as string);
    };
    const handleChangeGender = (event: SelectChangeEvent) => {
        setGender(event.target.value as any);
    };
    const handleBirthDate = (event: any) => {
        setBirthDate(event.target.value as Date);
    };

    const handleName = (event: any) => {
        setName(event.target.value as string)
    }
    const checkName = () => {
        return name === '' || new RegExp('^[A-Za-z]+$').test(name);
    }
    function getNameErrorMessage() {
        return !checkName() ? 'Name can contain only letters' : '';
    }

    const handleSalary = (event: any) => {
        setSalary(event.target.value as number)
    }
    const checkSalary = () => {
        return salary === 0 || salary >= minSalary * 1000 && salary <= maxSalary * 1000;
    }
    function getSalaryErrorMessage() {
        return !checkSalary() ? `Salary should be in range ${minSalary * 1000} .. ${maxSalary * 1000}` : '';
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!salary || !checkSalary() || !name || !checkName() || !department) {
            setOpen(true)
        } else {
            const empl: Employee = {
                name, salary, birthDate, department, gender
            }
            submitFn(empl)
        }
    };

    return <ThemeProvider theme={defaultTheme}>
        <Box
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-basic"
                label="Name"
                name="name"
                variant="outlined"
                onInput={handleName}
                error={!checkName()} helperText={getNameErrorMessage()}
            />
            <TextField
                type="number"
                id="outlined-basic"
                label="Salary"
                name="salary"
                InputProps={{ inputProps: { min: minSalary * 1000, max: maxSalary * 1000 } }}
                variant="outlined"
                onInput={handleSalary}
                error={!checkSalary()} helperText={getSalaryErrorMessage()}
            />
            <TextField
                type="date"
                id="outlined-basic"
                label="BirthDate"
                name="birthDate"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{ min: `${minYear}-01-01`, max: `${maxYear}-12-31` }}
                onInput={handleBirthDate}
            />
            <FormControl fullWidth>
                <InputLabel
                    id="demo-simple-select-label"
                >
                    Department
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={department}
                    label="Department"
                    onChange={handleChangeDepartment}
                >
                    {departments.map(dep => <MenuItem key={dep} value={dep}>{dep}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl
                style={{ marginTop: 10 }}
                fullWidth
            >
                <InputLabel
                    id="demo-simple-select-label"
                >
                    Gender
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    label="Gender"
                    onChange={handleChangeGender}
                >
                    <MenuItem value='male'>Male</MenuItem>
                    <MenuItem value='female'>Female</MenuItem>
                </Select>
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create empl
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity={'error'}
                    sx={{ width: '100%' }}
                >
                    you need to enter all the parameters and look out the ranges
                </Alert>
            </Snackbar>
        </Box>
    </ThemeProvider>
}
export default AddEmployeeForm
