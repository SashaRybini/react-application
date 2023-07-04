import { useEffect, useMemo, useRef, useState } from "react"
import Employee from "../../model/Employee"
import { authService, employeesService } from "../../config/service-config"
import { Subscription } from 'rxjs'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import { Alert, Box, Modal, Snackbar, TextField, Typography } from "@mui/material"
import { useDispatch } from "react-redux"
import { authActions } from "../../redux/slices/authSlice"
import { StatusType } from "../../model/StatusType"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Confirm from "../common/Confirm"
import { useSelectorAuth } from "../../redux/store"
import UserData from "../../model/UserData"
import { UpdateEmployeeForm } from "../forms/UpdateEmployeeForm"
import InputResult from "../../model/InputResult"

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
                    setOpenModal(true)
                    emplData.current = params.row
                }} label="Update" />
            ]
        })
        return columns
    }

    const dispatch = useDispatch()
    const [alertMessage, setAlertMessage] = useState('')
    const severity = useRef<StatusType>('error')
    const [employees, setEmployees] = useState<Employee[]>([])
    const userData = useSelectorAuth()
    const columns = useMemo(() => getColumns(userData), [userData])

    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {
                if (typeof emplArray === 'string') {
                    if (emplArray.includes('Authentication')) {
                        authService.logout()
                        dispatch(authActions.reset())
                    } else {
                        setAlertMessage(emplArray)
                    }
                } else {
                    setEmployees(emplArray.map(e => ({ ...e, birthDate: new Date(e.birthDate) })))
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const [openDialog, setOpenDialog] = useState(false)
    const emplID = useRef(0)

    function handleCloseDialog(decision: boolean) {
        setOpenDialog(false)
        if (decision && !isUpdate) {
            employeesService.deleteEmployee(emplID.current)
        } else if (decision && isUpdate) {

        }
    }

    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmContent, setConfirmContent] = useState('')

    const [openModal, setOpenModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const emplData = useRef<Employee>()

    async function updateSubmitFn(empl: Employee): Promise<InputResult> {
        const res: InputResult = { status: 'success', message: '' };

        setConfirmTitle('update employee?')
        setConfirmContent(`we are going to update employee with id ${emplData.current?.id}`)
        setIsUpdate(true)
        setOpenDialog(true)

        try {
            const employee: Employee = await employeesService.updateEmployee(empl);
            res.message = `employee with id: ${employee.id} has been updated`
        } catch (error: any) {
            res.status = 'error';
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                authService.logout();
                dispatch(authActions.reset());
                res.message = ""
            }
            res.message = error;
        }

        setOpenModal(false)
        return res;
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
                <UpdateEmployeeForm
                    submitFn={updateSubmitFn}
                    initialEmployee={emplData.current}
                />
            </Box>
        </Modal>

        <Snackbar
            open={!!alertMessage}
            autoHideDuration={20000}
            onClose={() => setAlertMessage('')}>
            <Alert
                onClose={() => setAlertMessage('')}
                severity={severity.current}
                sx={{ width: '100%' }}
            >
                {alertMessage}
            </Alert>
        </Snackbar>
    </Box>
}
export default Employees

