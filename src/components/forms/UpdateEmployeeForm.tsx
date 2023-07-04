import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Employee from "../../model/Employee";
import employeeConfig from "../../config/employee-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
import { getISODateStr } from "../../util/date-functions";

type Props = {
    submitFn: (empl: Employee) => void,
    initialEmployee?: Employee
}

export const UpdateEmployeeForm: React.FC<Props> = ({ submitFn, initialEmployee }) => {
    const { minYear, minSalary, maxYear, maxSalary, departments }
        = employeeConfig;
    const [employee, setEmployee] = useState<Employee>(initialEmployee!);
    const [errorMessage, setErrorMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('')
    const severity = useRef<StatusType>('success')
    function handlerName(event: any) {
        const name = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.name = name;
        setEmployee(emplCopy);
    }
    function handlerSalary(event: any) {
        const salary: number = +event.target.value;
        const emplCopy = { ...employee };
        emplCopy.salary = salary;
        setEmployee(emplCopy);
    }
    function handlerDepartment(event: any) {
        const department = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.department = department;
        setEmployee(emplCopy);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(employee);
    }

    return <Box sx={{ marginTop: { sm: "25vh" } }}>
        <form onSubmit={onSubmitFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-department-id">Department</InputLabel>
                        <Select labelId="select-department-id" label="Department"
                            value={employee.department} onChange={handlerDepartment}>
                            <MenuItem value=''>None</MenuItem>
                            {departments.map(dep => <MenuItem value={dep} key={dep}>{dep}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Employee name"
                        helperText="enter Employee name" onChange={handlerName}
                        value={employee.name} />
                </Grid>
                <Grid item xs={8} sm={4} md={5}>
                    <TextField type="text" aria-readonly fullWidth label="birthDate"
                        value={getISODateStr(employee.birthDate)} 
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="salary" fullWidth required
                        type="number" onChange={handlerSalary}
                        value={employee.salary}
                        helperText={`enter salary in range [${minSalary}-${maxSalary}]`}
                        inputProps={{
                            min: `${minSalary}`,
                            max: `${maxSalary}`
                        }} />
                </Grid>
                <Grid item xs={8} sm={4} md={5}>
                    <TextField type="text" aria-readonly fullWidth label="gender"
                        value={employee.gender} 
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
            </Box>
        </form>
    </Box>
}