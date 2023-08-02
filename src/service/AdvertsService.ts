import { Observable } from "rxjs";
import Advert from "../model/Advert";


export default interface AdvertsService {

    addAdvert(ad: Advert): Promise<string>
    getAdverts(): Observable<Advert[] | string>
    deleteAdvert(id: any): Promise<string>
    updateAdvert(ad: Advert): Promise<string>
    getAdvertsByCategory(category: string): Promise<Advert[] | string>
    getAdvertsByPrice(price: number): Observable<Advert[] | string>

}