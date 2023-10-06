import { Observable } from "rxjs";
import Contact from "../model/Contact";

export default interface ChatRoomService {

    getAllContacts(): Observable<Contact[] | string>

    getImageUrl(username: string): Promise<string>

}