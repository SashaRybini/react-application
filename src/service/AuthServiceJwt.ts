import { messagesService } from "../config/service-config";
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

    // webSocket: WebSocket | undefined;

    constructor(private url: string) {

    }

    async registerNewUser(newUser: UserData): Promise<LoginData> {
        const response = await fetch(`http://${this.url}/users/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        return response.json()
    }

    async login(loginData: LoginData): Promise<UserData> {

        const serverLoginData:any = {};
        serverLoginData.username = loginData.username;
        serverLoginData.password = loginData.password;
        
        const response = await fetch(`http://${this.url}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverLoginData)
        })

        //на логине создаем коннекшн
        messagesService.connectWs(loginData.username)
        // this.webSocket = new WebSocket(`ws://${this.url}/connect/${loginData.username}`);
        
        return response.ok ? getUserData(await response.json()) : null
    }

    async logout(): Promise<void> {
        //на логауте удаляем коннекшн
        //колим ендпоинт для нотификации
        messagesService.closeWs()
        // this.webSocket!.close()

        console.log('logout');

        await fetch(`http://${this.url}/users/signout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        
        // localStorage.removeItem(AUTH_DATA_JWT) // redux does it
    }

}