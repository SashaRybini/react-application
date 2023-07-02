import { Observable } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";

export default class EmployeesServiceRest implements EmployeesService {

    private accessToken = localStorage.getItem(AUTH_DATA_JWT)

    constructor(private url: string) {
    }

    async addEmployee(empl: Employee): Promise<Employee> {

        const employee = { ...empl, userId: "admin" }

        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.accessToken}`
            },
            body: JSON.stringify(employee)
        })

        return response.ok ? await response.json() : null
    }

    getEmployees(): Observable<Employee[]> {
        const res =  new Observable<Employee[]>((subscriber) => {
            fetch(this.url, {
                headers: { Authorization: `Bearer ${this.accessToken}` }
            }).then(response => response.json()).then(data => subscriber.next(data))
        })
        return res
    }

}