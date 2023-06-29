import Employee from "../model/Employee";
import EmployeesService from "./EmployeesService";

export default class EmployeesServiceRest implements EmployeesService {

    constructor(private url: string) {
    }
    
    addEmployee(empl: Employee): Promise<Employee> {
        
        throw new Error("Method not implemented.");
    }
    
}