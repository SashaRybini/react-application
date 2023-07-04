import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/slices/authSlice";
import { codeActions } from "../../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";
import CodePayload from "../../model/CodePayload";

const AddEmployee: React.FC = () => {

    const dispatch = useDispatch();

    async function submitFn(empl: Employee) {
        const alert: CodePayload = { code: CodeType.OK, message: ''}
        try {
            const employee: Employee = await employeesService.addEmployee(empl);
            alert.message = `employee with id: ${employee.id} has been added`
        } catch (error: any) {
            alert.code = CodeType.SERVER_ERROR
            alert.message = error;
            
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                alert.code = CodeType.AUTH_ERROR
            }
        }
        dispatch(codeActions.set(alert))
    }
    return <EmployeeForm submitFn={submitFn} />
}
export default AddEmployee;