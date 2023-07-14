import OrdersService from "./OrdersService";
import { Observable, catchError, of } from "rxjs";
import {
    CollectionReference, DocumentReference, getFirestore,
    collection, getDoc, FirestoreError, setDoc, deleteDoc, doc, getDocs, Firestore
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore'
import { getRandomInt } from "../../util/random";
import { Product } from "../../model/Product";
import ProductsService from "./ProductsService";
import appFirebase from "../../config/firebase-config";
import { PickedProduct } from "../../model/PickedProduct";


export default class OrdersServiceFire implements OrdersService {

    dataBase: Firestore = getFirestore(appFirebase)
    collectionRef: CollectionReference = collection(this.dataBase, 'orders')

    async addProductTocart(email: string, id: string): Promise<void> {
        const docRef = this.getDocRef(email, id)
        const docSnapshot = await getDoc(docRef)
        const docData = docSnapshot.data();
        let count = 0
        if (docData) {
            count = docData.count;
        }
        const product: PickedProduct = {id, count: count + 1}
        await setDoc(docRef, product)   
    }

    private getDocRef(email: string, id: string): DocumentReference {
        return doc(this.dataBase, email, id)
    }
    async removeProductFromCart(email: string, id: string): Promise<void> {
        const docRef = this.getDocRef(email, id)
        const docSnapshot = await getDoc(docRef)
        const docData = docSnapshot.data();
        let count = 0
        if (docData) {
            count = docData.count;
        }
        const product: PickedProduct = {id, count: count - 1}
        if (product.count < 1) {
            this.removeProductAtAll(email, id)
        } else {
            await setDoc(docRef, product)   
        }
    }
    async removeProductAtAll(email: string, id: string): Promise<void> {
        const docRef = this.getDocRef(email, id)
        await deleteDoc(docRef)
    }
    getShoppingCart(email: string): Observable<PickedProduct[]> {
        const collectionRef = collection(this.dataBase, email) as CollectionReference<PickedProduct>;
        return collectionData(collectionRef);
    }
}