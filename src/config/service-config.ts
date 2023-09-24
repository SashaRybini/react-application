import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJwt";

export const authService: AuthService = new AuthServiceJwt('http://localhost:8080')

// export const employeesService: EmployeesService = new EmployeesServiceRest('localhost:8080')