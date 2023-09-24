import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";

export const AUTH_DATA_JWT = 'auth-data-jwt'

function getUserData(data: any): UserData {
    const jwt = data.accessToken
    localStorage.setItem(AUTH_DATA_JWT, jwt)
    const jwtPayloadJson = atob(jwt.split('.')[1])
    const jwtPayloadObj = JSON.parse(jwtPayloadJson)
    const username = jwtPayloadObj.sub
    const role = jwtPayloadObj.role === "admin" ? "admin" : "user";
    const res: UserData = {username, role}
    return res;
}

export default class AuthServiceJwt implements AuthService {

    constructor(private url: string) {
        
    }

    async registerNewUser(newUser: UserData): Promise<LoginData> {
        // const user = {...newUser, roles: ['USER']}
        // delete user.role
        const response = await fetch(`${this.url}/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        console.log(response);
        
        return response.json()
    }

    async login(loginData: LoginData): Promise<UserData> {

        const serverLoginData:any = {};
        serverLoginData.username = loginData.username;
        serverLoginData.password = loginData.password;
        console.log(loginData);
        
        const response = await fetch(`${this.url}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverLoginData)
        })
        return response.ok ? getUserData(await response.json()) : null
    }

    async logout(): Promise<void> {
        
        localStorage.removeItem(AUTH_DATA_JWT)
    }

}