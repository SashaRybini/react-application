import UserData from "../model/UserData";
import AuthService from "./AuthService";

export default class AuthServiceJwt implements AuthService {

    constructor(private url: string) {
        
    }

    async login(loginData: { email: string; password: string; }): Promise<UserData | null> {
        //todo
        return null;
    }
    async logout(): Promise<void> {
        //todo
    }
    
}