import UserData from "../model/UserData";

export default interface AuthService {
    login(loginData: {email: string, password: string}): Promise<UserData | null>
    logout(): Promise<void>
}