import { Box } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import Employee from "../../model/Employee"
import { employeesService } from "../../config/service-config"
import CodePayload from "../../model/CodePayload"
import CodeType from "../../model/CodeType"
import { codeActions } from "../../redux/slices/codeSlice"
import StatsType from "../../model/StatsType"
import { getStatistics } from "../../service/CompanyService"

type Props = {
    fieldName: string,
    interval: number
}

function getColumns() {
    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'LINE', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'min', headerName: 'MIN', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'max', headerName: 'MAX', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'count', headerName: 'COUNT', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        }
    ]
    return columns
}

function getRows(employees: Employee[], fieldName: string, interval: number) {
    const res = getStatistics(employees, fieldName, interval)
    return res;
}


const Statistics: React.FC<Props> = ({fieldName, interval}) => {

    const dispatch = useDispatch()
    const [employees, setEmployees] = useState<Employee[]>([])
    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {
                const alert: CodePayload = {code: CodeType.OK, message: ''}
                if (typeof emplArray === 'string') {
                    if (emplArray.includes('Authentication')) {
                        alert.code = CodeType.AUTH_ERROR
                    } else {
                        alert.code = CodeType.SERVER_ERROR
                        alert.message = emplArray
                    }
                } else {
                    setEmployees(emplArray.map(e => ({ ...e, birthDate: new Date(e.birthDate) })))
                }
                dispatch(codeActions.set(alert)) //
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const columns = getColumns()
    const rows = useMemo(() => getRows(employees, fieldName, interval), [employees, fieldName, interval])

    return <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ height: '50vh', width: '80vw' }}>
            {columns && <DataGrid
                columns={columns}
                rows={rows}
            />}
        </Box>
    </Box>
}
export default Statistics