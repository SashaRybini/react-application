import UserData from "../model/UserData";
import AuthService from "./AuthService";

export default class AuthServiceJwt implements AuthService {

    constructor(private url: string) {

    }

    async login(loginData: { email: string; password: string; }): Promise<UserData | null> {
        const response = await fetch(`${this.url}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        if (response.status === 200) { //what about 'success' //or response.ok
            const data = await response.json()
            const payloadJson = atob(data.accessToken.split('.')[1])
            const userData = JSON.parse(payloadJson)
            const email = userData.email
            const role = userData.sub
            const res: UserData = {email, role}
            return res;
        } else {
            alert(await response.json()) //we have our own alert
        }
        return null;
    }
    async logout(): Promise<void> {
        //???
    }

}