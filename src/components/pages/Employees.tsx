import { useEffect, useState } from "react"
import Employee from "../../model/Employee"
import { employeesService } from "../../config/service-config"
import { Subscription } from 'rxjs'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Box } from "@mui/material"

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'name', headerName: 'Name', flex: 0.7},
    { field: 'birthDate', type: 'date', headerName: 'Birth Date', flex: 1 },
    { field: 'department', headerName: 'Department', flex: 0.8 },
    { field: 'salary', type: 'number', headerName: 'Salary', flex: 0.6 },
    { field: 'gender', headerName: 'Gender', flex: 0.6}
]
const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    useEffect(() => {
        const subscription =  employeesService.getEmployees().subscribe({
            next(emplArray: Employee[]) {
                setEmployees(emplArray.map(e => ({...e, birthDate: new Date(e.birthDate)})))
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
    </Box>
}
export default Employees