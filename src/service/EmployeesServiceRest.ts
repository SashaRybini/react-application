import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";

export default class EmployeesServiceRest implements EmployeesService {

    constructor(private url: string) {
    }

    async addEmployee(empl: Employee): Promise<Employee> {

        const employee = { ...empl, userId: "admin" }
        const accessToken = localStorage.getItem(AUTH_DATA_JWT)
        
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(employee)
        })
        
        return await response.json()
    }  
}