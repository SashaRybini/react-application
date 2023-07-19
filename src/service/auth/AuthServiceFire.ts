import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {
    getFirestore, collection, getDoc, doc, setDoc
} from 'firebase/firestore';
import {
    GoogleAuthProvider, getAuth, signInWithEmailAndPassword,
    signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithRedirect
} from 'firebase/auth';
import appFirebase from "../../config/firebase-config";
import { Observable } from "rxjs";
import { collectionData } from "rxfire/firestore";

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');
    private users = collection(getFirestore(appFirebase), 'users')

    async registerNewUser(newUser: UserData): Promise<LoginData> {

        try {
            const userAuth = newUser!.email === 'GOOGLE'
                ?
                await signInWithPopup(this.auth, new GoogleAuthProvider())
                :
                await createUserWithEmailAndPassword(this.auth, newUser!.email, newUser!.password!)
            newUser = {
                ...newUser,
                email: userAuth.user.email as string,
                role: 'user'
            }
        } catch (error: any) {
            console.log(error.code, error)
        }

        const loginData: LoginData = { email: newUser!.email, password: newUser!.password! }

        delete newUser!.password

        const docRef = doc(this.users, newUser!.email)
        await setDoc(docRef, newUser)

        return loginData
    }

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null
        try {
            const userAuth = loginData.email === 'GOOGLE'
                ?
                await signInWithPopup(this.auth, new GoogleAuthProvider())
                :
                await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
            userData = {
                email: userAuth.user.email as string,
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
    getUsers(): Observable<UserData[]> { //todo handle errors
        return collectionData(this.users) as Observable<UserData[]>
    }
    async updateUserData(userData: UserData): Promise<void> {
        console.log(userData)
        const docRef = doc(this.users, userData!.email)
        setDoc(docRef, userData)
    }
}