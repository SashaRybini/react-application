import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {
    getFirestore, collection, getDoc, doc
} from 'firebase/firestore';
import {
    getAuth, signInWithEmailAndPassword, signOut
} from 'firebase/auth';
import appFirebase from "../../config/firebase-config";

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null
        try {
            const userAuth = await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
            userData = { 
                email: loginData.email,
                role: await this.isAdmin(userAuth.user.uid) ? 'admin' : 'user'
            }
        } catch (error: any) {
            console.log(error.code, error)
        }
        return userData;
    }
    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administrators, uid)
        return (await getDoc(docRef)).exists()
    }
    logout(): Promise<void> {
        return signOut(this.auth)
    }

}