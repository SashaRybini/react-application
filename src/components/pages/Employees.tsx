import { useEffect, useRef, useState } from "react"
import Employee from "../../model/Employee"
import { authService, employeesService } from "../../config/service-config"
import { Subscription } from 'rxjs'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Alert, Box, Snackbar } from "@mui/material"
import { useDispatch } from "react-redux"
import { authActions } from "../../redux/slices/authSlice"
import { StatusType } from "../../model/StatusType"

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center'},
    { field: 'birthDate', type: 'date', headerName: 'Birth Date', flex: 1, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center' },
    { field: 'department', headerName: 'Department', flex: 0.8, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center' },
    { field: 'salary', type: 'number', headerName: 'Salary', flex: 0.6, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center' },
    { field: 'gender', headerName: 'Gender', flex: 0.6, headerClassName: 'data-grid-header', 
        align: 'center', headerAlign: 'center'}
]
const Employees: React.FC = () => {
    const dispatch = useDispatch()
    const [alertMessage, setAlertMessage] = useState('')
    const severity = useRef<StatusType>('error')
    const [employees, setEmployees] = useState<Employee[]>([])
    useEffect(() => {
        const subscription =  employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {
                if (typeof emplArray === 'string') {
                    if (emplArray.includes('Authentication')) {
                        authService.logout()
                        dispatch(authActions.reset())
                    } else {
                        setAlertMessage(emplArray)
                    }
                } else {
                    setEmployees(emplArray.map(e => ({...e, birthDate: new Date(e.birthDate)})))
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [])
    return <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Box sx={{height: '50vh', width: '80vw'}}>
            <DataGrid 
                columns={columns} 
                rows={employees}           
            />
        </Box>
        <Snackbar open={!!alertMessage} autoHideDuration={20000}
            onClose={() => setAlertMessage('')}>
            <Alert onClose={() => setAlertMessage('')} severity={severity.current} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
    </Box>
}
export default Employees