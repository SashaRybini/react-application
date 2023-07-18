import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {
    getFirestore, collection, getDoc, doc, setDoc
} from 'firebase/firestore';
import {
    GoogleAuthProvider, getAuth, signInWithEmailAndPassword,
    signInWithPopup, signOut, createUserWithEmailAndPassword
} from 'firebase/auth';
import appFirebase from "../../config/firebase-config";
import { Observable } from "rxjs";
import { collectionData } from "rxfire/firestore";

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');
    private users = collection(getFirestore(appFirebase), 'users')

    async registerNewUser(newUser: UserData): Promise<void> {
        // try {
        //     if (newUser!.email === 'GOOGLE') {
        //         const provider = new GoogleAuthProvider();
        //         await signInWithPopup(this.auth, provider);
        //     } else {
        //         await createUserWithEmailAndPassword(this.auth, newUser!.email, newUser!.password!);
        //     }
        // } catch (error: any) {
        //     console.log(error.code, error)
        // }
        // //+ collection of users
        // const docRef = doc(this.users, newUser?.email)
        // delete newUser?.password
        // await setDoc(docRef, newUser)

        if (newUser!.email !== 'GOOGLE') {
            await createUserWithEmailAndPassword(this.auth, newUser!.email, newUser!.password!);
        } else if (newUser!.email === 'GOOGLE') {
            newUser!.role = 'user'
        }

        const logindata: LoginData = { email: newUser!.email, password: newUser!.password! }
        const userdata: UserData = await this.login(logindata)

        //add user to users collection
        newUser = {...newUser, email: userdata!.email}
        delete newUser.password
        const docRef = doc(this.users, newUser!.email)
        await setDoc(docRef, newUser)
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

        //in case of user clicks at firs on sign in w google we need to put him to users collection
        //but we need to put user to users only if he doesn't exist yet
        //so it will be the same as sigh up with google
        //or don't let him sign in before sign up, but how? ...

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
}