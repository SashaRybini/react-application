import { Observable, catchError, of } from "rxjs";
import {
    CollectionReference, DocumentReference, getFirestore,
    collection, getDoc, FirestoreError, setDoc, deleteDoc, doc
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore'
import { getRandomInt } from "../../util/random";
import { getISODateStr } from "../../util/date-functions";
import GoodsService from "./ProductsService";
import { Product } from "../../model/Product";

const MIN_ID = 100000;
const MAX_ID = 1000000;

// function convertEmployee(empl: Employee, id?: string): any {
//     const res: any = {
//         ...empl, 
//         id: id ? id : empl.id,
//         birthDate: getISODateStr(empl.birthDate)
//     }
//     return res;
// }
// function getErrorMessage(firestoreError: FirestoreError): string {
//     let errorMessage = '';
//     switch (firestoreError.code) {
//         case "unauthenticated":
//             case "permission-denied": errorMessage = "Authentication"; break;
//         default: errorMessage = firestoreError.message;
//     }
//     return errorMessage;
// }

export default class GoodsServiceFire implements GoodsService {
    addProduct(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    getProducts(): Observable<string | Product[]> {
        throw new Error("Method not implemented.");
    }
    deleteProduct(id: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateProduct(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }


    // collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'employees');

    // async addGoods(empl: GoodsType): Promise<GoodsType> {
    //     const id: string = await this.getId();
    //     const employee = convertEmployee(empl, id);
    //     const docRef = this.getDocRef(id);
    //     try {
    //         await setDoc(docRef, employee)
    //     } catch (error: any) {
    //         const firestoreError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestoreError);
    //         throw errorMessage;
    //     }
    //     return employee;
    // }
    // private getDocRef(id: string): DocumentReference {
    //     return doc(this.collectionRef, id);
    // }
    // private async exists(id: string): Promise<boolean> {
    //     const docRef: DocumentReference = this.getDocRef(id);
    //     const docSnap = await getDoc(docRef);
    //     return docSnap.exists();
    // }
    // private async getId(): Promise<string> {
    //     let id: string = '';
    //     do {
    //         id = getRandomInt(MIN_ID, MAX_ID).toString();
    //     } while (await this.exists(id));
    //     return id;
    // }
    // getEmployees(): Observable<string | Employee[]> {
    //     return collectionData(this.collectionRef).pipe(catchError(error => {
    //         const firestorError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestorError);
    //         return of(errorMessage) //of закидывает мессадж в стрим
    //     })) as Observable<string | Employee[]>
    // }
    // async deleteEmployee(id: any): Promise<void> {
    //     const docRef = this.getDocRef(id);
    //     if (!await this.exists(id)) {
    //         throw 'not found';
    //     }
    //     try {
    //         await deleteDoc(docRef);
    //     } catch (error: any) {
    //         const firestorError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestorError);
    //         throw errorMessage;
    //     }
    // }
    // async updateEmployee(empl: Employee): Promise<Employee> {
    //     if (!empl.id || !await this.exists(empl.id)) {
    //         throw 'not found';
    //     }
    //     const employee = convertEmployee(empl);
    //     const docRef = this.getDocRef(empl.id);
    //     try {
    //         await setDoc(docRef, employee)
    //     } catch (error: any) {
    //         const firestorError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestorError);
    //         throw errorMessage;
    //     }
    //     return employee;
    // }

}