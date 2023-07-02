import { Observable } from "rxjs";
import Employee from "../model/Employee";

export default interface EmployeesService {

    addEmployee(empl: Employee): Promise<Employee>
    getEmployees(): Observable<Employee[]>
    
}