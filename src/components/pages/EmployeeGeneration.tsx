import { authService, employeesService } from "../../config/service-config"
import { getRandomEmployee } from "../../util/random"
import employeeConfig from "../../config/employee-config.json"
import { authActions } from "../../redux/slices/authSlice"
import { useDispatch } from "react-redux"
import { Alert, Box, Button, Container, CssBaseline, Snackbar, TextField, ThemeProvider, createTheme } from "@mui/material"
import { useRef, useState } from "react"
import { StatusType } from "../../model/StatusType"
import CodePayload from "../../model/CodePayload"
import CodeType from "../../model/CodeType"
import { codeActions } from "../../redux/slices/codeSlice"

const { minYear, minSalary, maxYear, maxSalary, departments } = employeeConfig;
const defaultTheme = createTheme();

const EmployeeGeneration: React.FC = () => {
    const dispatch = useDispatch();

    async function submitFn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const emplsCount = +data.get('number')! as number

        const alert: CodePayload = { code: CodeType.OK, message: ''}
        
        try {
            for (let i = 0; i < emplsCount; i++) {
                const rdmEmpl = getRandomEmployee(minSalary, maxSalary, minYear, maxYear, departments)
                await employeesService.addEmployee(rdmEmpl)
            }
            alert.message = `${emplsCount} employees have been added`
        } catch (error: any) {
            alert.code = CodeType.SERVER_ERROR
            alert.message = error;
            
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                alert.code = CodeType.AUTH_ERROR
            }
        }
        dispatch(codeActions.set(alert))
    }

    return <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box >
                <form onSubmit={submitFn} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 300 }}>
                        <TextField label="Generate random employees" required
                            type="number"
                            helperText={`enter number of empls in range 1 .. 10`}
                            inputProps={{
                                min: 1,
                                max: 10
                            }}
                            name="number"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Generate
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    </ThemeProvider>

}
export default EmployeeGeneration
