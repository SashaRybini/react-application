import { Observable, Subscriber } from "rxjs";
import AdvertsService from "./AdvertsService";
import Advert from "../model/Advert";

const POLLER_INTERVAL = 22000;

class Cache {
    cacheString: string = '';
    set(ads: Advert[]): void {
        this.cacheString = JSON.stringify(ads);
    }
    reset() {
        this.cacheString = ''
    }
    isEqual(ads: Advert[]): boolean {
        return this.cacheString === JSON.stringify(ads)
    }
    getCache(): Advert[] {
        return !this.isEmpty() ? JSON.parse(this.cacheString) : []
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
}

function getResponseText(response: Response): string {
    let res = '';
    if (!response.ok) {
        // const { status, statusText } = response;
        res = response.statusText;
    }
    return res;

}
function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
    }
    return res;
}

async function fetchRequest(url: string, options: RequestInit, adv?: Advert): Promise<Response> {
    options.headers = getHeaders();
    if (adv) {
        options.body = JSON.stringify(adv);
    }
    let flUpdate = true;
    let responseText = '';
    try {
        if (options.method == "DELETE" || options.method == "PUT") {
            flUpdate = false;
            await fetchRequest(url, { method: "GET" });
            flUpdate = true;
        }
        const response = await fetch(url, options);
        responseText = getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : "Server is unavailable. Repeat later on";
    }
}
async function fetchAllAdverts(url: string): Promise<Advert[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class AdcertsServiceRest implements AdvertsService {

    private observable: Observable<Advert[] | string> | null = null;

    private cache: Cache = new Cache();

    constructor(private url: string) { }

    async addAdvert(advert: Advert): Promise<string> {
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
                responseText = response.statusText;
                throw responseText;
            } 

            return await response.text();

        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }
    getAdverts(): Observable<string | Advert[]> {
        let intervalId: any;
        // const getAllUrl = this.url + "/all"
        if (!this.observable) {
            this.observable = new Observable<Advert[] | string>(subscriber => {
                this.cache.reset();
                this.subscriberNext(this.url, subscriber);
                intervalId = setInterval(() => this.subscriberNext(this.url, subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observable;
    }
    private subscriberNext(url: string, subscriber: Subscriber<Advert[] | string>): void {
        fetchAllAdverts(url).then(ads => {
            if (this.cache.isEmpty() || !this.cache.isEqual(ads as Advert[])) {
                this.cache.set(ads as Advert[]);
                subscriber.next(ads);
            }
        }).catch(error => subscriber.next(error));
    }

    async deleteAdvert(id: number): Promise<string> {
        let responseText = '';
        try {
            const response = await fetch(this.url + `/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                responseText = await response.text();
                throw responseText;
            }
            return await response.text();
        } catch (error: any) {
            console.log(error)
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }

    async updateAdvert(advert: Advert): Promise<string> {
        let responseText = '';
        try {
            const response = await fetch(this.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(advert)
            });
            if (!response.ok) {
                responseText = await response.text();
                throw responseText;
            }
            return await response.text();
        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }
    
    async getAdvertsByCategory(category: string): Promise<string | Advert[]> {
        let responseText = '';
        try {
            const response = await fetch(this.url + `/category/${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                responseText = await response.text();
                throw responseText;
            }
            return await response.json();
        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }

    async getAdvertsByPrice(price: number): Promise<string | Advert[]> {
        let responseText = '';
        try {
            const response = await fetch(this.url + `/price/${price}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                responseText = await response.text();
                throw responseText;
            }
            return await response.json();
        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }



}