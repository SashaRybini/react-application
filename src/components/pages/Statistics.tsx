import { Box, useTheme } from "@mui/material"
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
import React from "react"
import { Title } from "@mui/icons-material"
import { Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

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

function getRows(employees: Employee[], fieldName: string, interval: number): StatsType[] {
    let empls: Object[] = Object.assign(employees)
    if (fieldName == 'birthDate') {
        empls = employees.map(e => ({...e, 'age': new Date().getFullYear() - e.birthDate.getFullYear()}))
        fieldName = 'age'
    } 
    const rows: StatsType[] = getStatistics(empls, fieldName, interval)
    return rows;
}


const Statistics: React.FC<Props> = ({ fieldName, interval }) => {

    const dispatch = useDispatch()
    const [employees, setEmployees] = useState<Employee[]>([])
    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {
                const alert: CodePayload = { code: CodeType.OK, message: '' }
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

    const theme = useTheme();

    function createData(range: string, count: number) {
        return { range, count };
    }
    
    const data = rows.map(r => createData(r.min + "-" + r.max, r.count))
      

    return <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ height: '50vh', width: '80vw' }}>
            
            {columns && <DataGrid columns={columns} rows={rows} />}

            <React.Fragment>
                <Title>Title</Title>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 16,
                            right: 16,
                            bottom: 0,
                            left: 24,
                        }}
                    >
                        <XAxis
                            dataKey="range"
                            stroke={theme.palette.text.secondary}
                            style={theme.typography.body2}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            style={theme.typography.body2}
                        >
                            <Label
                                angle={270}
                                position="left"
                                style={{
                                    textAnchor: 'middle',
                                    fill: theme.palette.text.primary,
                                    ...theme.typography.body1,
                                }}
                            >
                                Count
                            </Label>
                        </YAxis>
                        <Line
                            isAnimationActive={false}
                            type="monotone"
                            dataKey="count"
                            stroke={theme.palette.primary.main}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </React.Fragment>
        </Box>
    </Box>
}
export default Statistics