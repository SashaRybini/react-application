import { Observable } from "rxjs";
import Advert from "../model/Advert";


export default interface AdvertsService {

    addAdvert(ad: Advert): Promise<Advert>
    getAdverts(): Observable<Advert[] | string>
    deleteAdvert(id: any): Promise<void>
    updateAdvert(ad: Advert): Promise<Advert>
    getAdvertsByCategory(category: string): Observable<Advert[] | string>
    getAdvertsByPrice(price: number): Observable<Advert[] | string>

}