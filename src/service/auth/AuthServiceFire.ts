import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {
    getFirestore, collection, getDoc, doc, setDoc, FirestoreError
} from 'firebase/firestore';
import {
    GoogleAuthProvider, getAuth, signInWithEmailAndPassword,
    signInWithPopup, signOut, createUserWithEmailAndPassword
} from 'firebase/auth';
import appFirebase from "../../config/firebase-config";
import { Observable, catchError, of } from "rxjs";
import { collectionData } from "rxfire/firestore";

function getErrorMessage(firestoreError: FirestoreError): string {
    let errorMessage = '';
    switch (firestoreError.code) {
        case "unauthenticated":
        case "permission-denied": errorMessage = "Authentication"; break;
        default: errorMessage = firestoreError.message;
    }
    return errorMessage;
}

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
            if (newUser?.email === 'GOOGLE') { //we need empty fields for profile updating
                newUser = {
                    ...newUser,
                    address: '',
                    name: '',
                    phone: ''
                }
            }
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
        await setDoc(docRef, newUser) //try 

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
    getUsers(): Observable<UserData[] | string> {
        return collectionData(this.users).pipe(catchError(error => {
            const firestoreError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestoreError);
            return of(errorMessage)
        })) as Observable<UserData[]>
    }
    async updateUserData(userData: UserData): Promise<UserData> {
        const docRef = doc(this.users, userData!.email)
        try {
            setDoc(docRef, userData)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            throw firestorError.message
        }
        return userData
    }
}