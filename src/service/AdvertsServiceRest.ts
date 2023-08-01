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

    async addAdvert(advert: Advert): Promise<Advert> {
        let responseText = '';
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(advert)
            });
            if (!response.ok) {
                // const { status, statusText } = response;
                // responseText = status == 401 || status == 403 ? 'Authentication' : statusText;
                console.log('response ne ok')
                // throw response.statusText
                // throw responseText;
            }
            // console.log("12311")
            // console.log(response)
            return response.json();
        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
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