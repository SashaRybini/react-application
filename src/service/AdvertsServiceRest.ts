import { Observable, Subscriber } from "rxjs";
import AdvertsService from "./AdvertsService";
import Advert from "../model/Advert";

const POLLER_INTERVAL = 2000;
// class Cache {
//     cacheString: string = '';
//     set(employees: Employee[]): void {
//         this.cacheString = JSON.stringify(employees);
//     }
//     reset() {
//         this.cacheString = ''
//     }
//     isEqual(employees: Employee[]): boolean {
//         return this.cacheString === JSON.stringify(employees)
//     }
//     getCache(): Employee[] {
//         return !this.isEmpty() ? JSON.parse(this.cacheString) : []
//     }
//     isEmpty(): boolean {
//         return this.cacheString.length === 0;
//     }
// }

export default class AdcertsServiceRest implements AdvertsService {
    // private observable: Observable<Employee[] | string> | null = null;
    // private cache: Cache = new Cache();

    constructor(private url: string) { }
    
    addAdvert(ad: Advert): Promise<Advert> {
        throw new Error("Method not implemented.");
    }
    getAdverts(): Observable<string | Advert[]> {
        throw new Error("Method not implemented.");
    }
    deleteAdvert(id: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateAdvert(ad: Advert): Promise<Advert> {
        throw new Error("Method not implemented.");
    }
    getAdvertsByCategory(category: string): Observable<string | Advert[]> {
        throw new Error("Method not implemented.");
    }
    getAdvertsByPrice(price: number): Observable<string | Advert[]> {
        throw new Error("Method not implemented.");
    }

    

}