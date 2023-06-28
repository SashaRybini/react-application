import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";

function getUserData(data: any): UserData {
    const jwtPayloadJson = atob(data.accessToken.split('.')[1])
    const jwtPayloadObj = JSON.parse(jwtPayloadJson)
    const email = jwtPayloadObj.email
    const role = jwtPayloadObj.sub
    const res: UserData = {email, role}
    return res;
}

export default class AuthServiceJwt implements AuthService {

    constructor(private url: string) {
    }

    async login(loginData: LoginData): Promise<UserData> {
        const response = await fetch(`${this.url}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        return response.ok ? getUserData(await response.json()) : null
    }
    async logout(): Promise<void> {
        //
    }

}