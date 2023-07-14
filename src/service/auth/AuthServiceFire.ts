import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {
    getFirestore, collection, getDoc, doc
} from 'firebase/firestore';
import {
    GoogleAuthProvider, getAuth, signInWithEmailAndPassword,
    signInWithPopup, signOut, createUserWithEmailAndPassword
} from 'firebase/auth';
import appFirebase from "../../config/firebase-config";

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');

    async registerNewUser(newUser: UserData): Promise<void> {
        try {
            if (newUser!.email === 'GOOGLE') {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(this.auth, provider);
              } else {
                  await createUserWithEmailAndPassword(this.auth, newUser!.email, newUser!.password!);                     
              }
        } catch (error: any) {
            console.log(error.code, error)
        }
        //+ collection
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

}