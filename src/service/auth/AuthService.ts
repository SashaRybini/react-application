import { Observable } from "rxjs";
import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";

export default interface AuthService {

    login(loginData: LoginData): Promise<UserData>
    logout(): Promise<void>
    registerNewUser(newUser: UserData): Promise<LoginData>
    getUsers(): Observable<UserData[] | string>
    updateUserData(userData: UserData): Promise<UserData>
    
}