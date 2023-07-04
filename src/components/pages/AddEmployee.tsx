import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/slices/authSlice";
import { codeActions } from "../../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";

const AddEmployee: React.FC = () => {

    const dispatch = useDispatch();
    
    async function submitFn(empl: Employee): Promise<InputResult> {
        const res: InputResult = { status: 'success', message: '' };
        try {
            const employee: Employee = await employeesService.addEmployee(empl);
            res.message = `employee with id: ${employee.id} has been added`
        } catch (error: any) {
            res.status = 'error';
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                authService.logout();
                dispatch(authActions.reset());
                res.message = ""
            }
            res.message = error;

            //
            dispatch(codeActions.set({ code: CodeType.SERVER_ERROR, message: error }))
            //
        }
        return res;
    }
    return <EmployeeForm submitFn={submitFn} />
}
export default AddEmployee;