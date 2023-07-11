import { Box, Button, Modal, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo } from "react";
import Employee from "../../model/Employee";
import { employeesService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit, Man, Woman } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import Confirm from "../common/Confirm";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getISODateStr } from "../../util/date-functions";

const columnsCommon: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'birthDate', headerName: "Date", flex: 0.8, type: 'date', headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'department', headerName: 'Department', flex: 0.8, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'salary', headerName: 'Salary', type: 'number', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'gender', headerName: 'Gender', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center', renderCell: params => {
            return params.value == "male" ? <Man /> : <Woman />
        }
    },
];

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
const styleXs = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Employees: React.FC = () => {
    const columnsXs: GridColDef[] = [ //copy past not so good
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="details" icon={<VisibilityIcon />}
                        onClick={() => { 
                            employeeId.current = params.id as any;
                            if (params.row) {
                                const empl = params.row;
                                empl && (employee.current = empl);
                                setOpenDetails(true)
                            }
                         }}
                    />
                ]
            }
        }
    ]
    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => removeEmployee(params.id)
                        }
                    />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => {
                            employeeId.current = params.id as any;
                            if (params.row) {
                                const empl = params.row;
                                empl && (employee.current = empl);
                                setFlEdit(true)
                            }
                        }}
                    />
                ];
            }
        }
    ]

    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))

    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const employees = useSelectorEmployees();
    const columns = useMemo(() => getColumns(), [userData, employees, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [xsOpen, setOpenDetails] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    const employee = useRef<Employee | undefined>();

    function getColumns(): GridColDef[] {
        let res: GridColDef[];
        if (isPortrait) {
            res = columnsXs;
        } else {
            res = columnsCommon;
            if (userData && userData.role == 'admin') {
                res = res.concat(columnsAdmin);
            }
        }
        return res;
    }
    function removeEmployee(id: any) {
        title.current = "Remove Employee object?";
        const employee = employees.find(empl => empl.id == id);
        content.current = `You are going remove employee with id ${employee?.id}`;
        employeeId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await employeesService.deleteEmployee(employeeId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }
    function updateEmployee(empl: Employee): Promise<InputResult> {
        setFlEdit(false)
        const res: InputResult = { status: 'error', message: '' };
        if (JSON.stringify(employee.current) != JSON.stringify(empl)) {
            title.current = "Update Employee object?";
            employee.current = empl;
            content.current = `You are going update employee with id ${empl.id}`;
            confirmFn.current = actualUpdate;
            setOpenConfirm(true);
        }
        return Promise.resolve(res);
    }
    async function actualUpdate(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await employeesService.updateEmployee(employee.current!);
            } catch (error: any) {
                errorMessage = error
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }

    return <Box sx={{
        display: 'flex', justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={employees} />
        </Box>
        <Confirm confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirm>
        <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeForm submitFn={updateEmployee} employeeUpdated={employee.current} />
            </Box>
        </Modal>

        <Modal
            open={xsOpen}
            onClose={() => setOpenDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleXs}>
                <Typography>ID: {employee.current?.id}</Typography> 
                <Typography>Name: {employee.current?.name}</Typography> 
                <Typography>Birth Date: {employee.current?.birthDate.toISOString().substring(0, 10)}</Typography> 
                <Typography>Department: {employee.current?.department}</Typography> 
                <Typography>Salary: {employee.current?.salary}</Typography>
                {userData && userData.role == 'admin' && <Button onClick={() => {
                    setOpenDetails(false)
                    removeEmployee(employee.current?.id)
                    }}> delete </Button>
                }
                {userData && userData.role == 'admin' && <Button onClick={() => {
                    setOpenDetails(false)
                    setFlEdit(true)
                    }}> update </Button>}
            </Box>
        </Modal>


    </Box>
}
export default Employees;