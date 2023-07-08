import { useEffect, useMemo, useRef, useState } from "react"
import Employee from "../../model/Employee"
import { employeesService } from "../../config/service-config"
import { Subscription } from 'rxjs'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import { Box, Modal, Typography } from "@mui/material"
import { useDispatch } from "react-redux"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../common/Confirm"
import { useSelectorAuth } from "../../redux/store"
import UserData from "../../model/UserData"
import CodePayload from "../../model/CodePayload"
import CodeType from "../../model/CodeType"
import { codeActions } from "../../redux/slices/codeSlice"
import { EmployeeForm } from "../forms/EmployeeForm"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Employees: React.FC = () => {
    function getColumns(userData: UserData) {
        const columns: GridColDef[] = [
            {
                field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'birthDate', type: 'date', headerName: 'Birth Date', flex: 1, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'department', headerName: 'Department', flex: 0.8, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'salary', type: 'number', headerName: 'Salary', flex: 0.6, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            },
            {
                field: 'gender', headerName: 'Gender', flex: 0.6, headerClassName: 'data-grid-header',
                align: 'center', headerAlign: 'center'
            }
        ]
        userData?.role === 'admin' && columns.push({
            field: 'actions', type: 'actions', getActions: (params: GridRowParams) => [
                <GridActionsCellItem icon={<DeleteIcon />} onClick={() => {
                    setConfirmTitle('delete employee?')
                    setConfirmContent(`you are going to delete employee with id ${params.id}`)
                    setOpenDialog(true)
                    emplID.current = +params.id
                }} label="Delete" />,
                <GridActionsCellItem icon={<EditIcon />} onClick={() => {
                    setConfirmTitle('update employee?')
                    setConfirmContent(`we are going to update employee with id ${params.id}`)
                    setOpenModal(true)
                    emplData.current = params.row
                }} label="Update" />
            ]
        })
        //fixme below, two separate fns
        return columns
    }

    const dispatch = useDispatch()
    const [employees, setEmployees] = useState<Employee[]>([])
    const userData = useSelectorAuth()
    const columns = useMemo(() => getColumns(userData), [userData])

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

    const [openDialog, setOpenDialog] = useState(false)
    const emplID = useRef(0)

    async function handleCloseDialog(decision: boolean) { //fn performs deleting and updating :)
        setOpenDialog(false)
        const alert: CodePayload = {code: CodeType.OK, message: ''}
        if (decision && !isUpdate) {
            employeesService.deleteEmployee(emplID.current) //fixme (try / catch)
            alert.message = `employee with id ${emplID.current} has been deleted`
        } else if (decision && isUpdate) {
            setIsUpdate(false)
            try {
                const employee: Employee = await employeesService.updateEmployee(emplData.current!);
                alert.message = `employee with id: ${employee.id} has been updated`
            } catch (error: any) {
                alert.code = CodeType.SERVER_ERROR
                alert.message = error;
                if ((typeof (error) == 'string') && error.includes('Authentication')) {
                    alert.code = CodeType.AUTH_ERROR
                }
            }
        }
        dispatch(codeActions.set(alert))
    }

    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmContent, setConfirmContent] = useState('')

    const [openModal, setOpenModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const emplData = useRef<Employee>()

    async function updateSubmitFn(empl: Employee) { 
        emplData.current = empl
        setIsUpdate(true)
        setOpenDialog(true)
        setOpenModal(false)
    }

    return <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ height: '50vh', width: '80vw' }}>
            {columns && <DataGrid
                columns={columns}
                rows={employees}
            />}
        </Box>
        <Confirm
            title={confirmTitle}
            content={confirmContent}
            handleClose={handleCloseDialog}
            open={openDialog}
        />
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    variant="h6"
                >
                    {`we are on updating employee with id ${emplData.current?.id}`}
                </Typography>
                <EmployeeForm
                    submitFn={updateSubmitFn}
                    employeeUpdated={emplData.current}
                />
            </Box>
        </Modal>
    </Box>
}
export default Employees

