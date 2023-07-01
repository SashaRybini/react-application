import AddEmployeeForm from "../forms/AddEmployeeForm"
import { employeesService } from "../../config/service-config"
import Employee from "../../model/Employee"

const AddEmployee: React.FC = () => {

   function submitFn(empl: Employee): Promise<Employee> { //InputResult ?

        return employeesService.addEmployee(empl)
   }

    return <AddEmployeeForm submitFn={submitFn} />
}

export default AddEmployee