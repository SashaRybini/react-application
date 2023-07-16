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
import { getIdToken } from "firebase/auth";
import { Order } from "../../model/Order";
import { getISODateStr } from "../../util/date-functions";

const MIN_ID = 1000000;
const MAX_ID = 10000000;

export default class OrdersServiceFire implements OrdersService {

    dataBase: Firestore = getFirestore(appFirebase)
    ordersRef: CollectionReference = collection(this.dataBase, 'orders')

    async addProductToCart(email: string, product: Product): Promise<void> {
        const docRef = this.getDocRef(email, product.id)
        const docSnapshot = await getDoc(docRef)
        const docData = docSnapshot.data()
        let count = 0
        if (docData) {
            count = docData.count;
        }
        const prod: PickedProduct = {product, id: product.id, count: count + 1}
        await setDoc(docRef, prod)   
    }

    private getDocRef(email: string, id: string): DocumentReference {
        return doc(this.dataBase, email, id)
    }
    async removeProductFromCart(email: string, product: Product): Promise<void> {
        const docRef = this.getDocRef(email, product.id)
        const docSnapshot = await getDoc(docRef)
        const docData = docSnapshot.data();
        let count = 0
        if (docData) {
            count = docData.count
        }
        const prod: PickedProduct = {product, id: product.id, count: count - 1}
        if (prod.count < 1) {
            this.removeProductFromCartAtAll(email, product.id)
        } else {
            await setDoc(docRef, prod)   
        }
    }
    async removeProductFromCartAtAll(email: string, id: string): Promise<void> {
        const docRef = this.getDocRef(email, id)
        await deleteDoc(docRef)
    }
    getShoppingCart(email: string): Observable<PickedProduct[]> { //toto handle errors? of? like in getProducts (ProductsServiceFire)
        const collectionRef = collection(this.dataBase, email) //as CollectionReference<PickedProduct>;
        return collectionData(collectionRef) as Observable<PickedProduct[]>
    }
    async createOrder(email: string, cart: PickedProduct[], deliveryDate: string): Promise<void> {
        const order: Order = {
            id: await this.getId(),
            email,
            orderDate: getISODateStr(new Date()),
            cart,
            deliveryDate,
            status: "ordered"
        }
        await setDoc(doc(this.ordersRef, order.id), order);

        // ===== and clear shopping =====
        cart.forEach(async p => {
            const docRef = doc(this.dataBase, email, p.id)
            await deleteDoc(docRef)
        })
    }
    private async getId(): Promise<string> {
        let id: string = '';
        do {
            id = getRandomInt(MIN_ID, MAX_ID).toString();
        } while (await this.exists(id));
        return id;
    }
    private async exists(id: string): Promise<boolean> {
        const docRef: DocumentReference = doc(this.ordersRef, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }
    getOrders(): Observable<Order[]> { //todo handle ERRORS
        return collectionData(this.ordersRef) as Observable<Order[]>
    }
    async setOrderStatus(orderId: string, order: Order): Promise<void> {
        const docRef = doc(this.ordersRef, orderId)
        setDoc(docRef, order)
    }
}