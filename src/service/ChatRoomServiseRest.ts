import { Observable, Subscriber } from "rxjs";
import Contact from "../model/Contact";
import ChatRoomService from "./ChatRoomService";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";


async function fetchAllContacts(url: string): Promise<Contact[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}
//есть лишнее в fetchRequst
async function fetchRequest(url: string, options: RequestInit, cont?: Contact): Promise<Response> {
    options.headers = getHeaders();
    if (cont) {
        options.body = JSON.stringify(cont);
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
        responseText = await getResponseText(response);
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

async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status == 401 || status == 403 ? 'Authentication' : await response.text();
    }
    return res;
}

function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
    }
    return res;
}



export default class ChatRoomServiceRest implements ChatRoomService {

    private conts: Map<string, Contact> = new Map();

    private observable: Observable<Contact[] | string> | null = null;
    private subscriber: Subscriber<Contact[] | string> | undefined;

    private urlService: string;
    private urlWebsocket: string

    private webSocket: WebSocket | undefined

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}/contacts`;
        this.urlWebsocket = `ws://${baseUrl}/contacts/websocket`
    }
    
    getAllContacts(): Observable<string | Contact[]> {
        if (!this.observable) {
            this.observable = new Observable<Contact[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.subscriberNext();
                this.connectWS()
                return () => this.disconnectWS();
            })
        }
        return this.observable;
    }
    private disconnectWS(): void {
        this.webSocket?.close()
    }

    private connectWS() {
        this.webSocket = new WebSocket(this.urlWebsocket) //второй параметр?
        this.webSocket.onmessage = message => {
            console.log(message.data)
            this.subscriberNext()          
        }
    }
    private subscriberNext(): void {
        fetchAllContacts(this.urlService).then(contacts => {
            (contacts as Contact[]).forEach(cont => this.conts.set(cont.username, cont)) //cont._id
            this.subscriber?.next(contacts)
        }).catch(error => this.subscriber?.next(error))
    }


    async getImageUrl(username: string): Promise<string> {
        const url = `http://localhost:8080/users/imageUrl/${username}`;
        const responce = await fetchRequest(url, { method: "GET"})
        const imgUrl = (await responce.json()).imgUrl
        return imgUrl
    }

    // async getUsers(): Promise<any> {
    //     const url = `http://localhost:8080/users`;
    //     const responce = await fetchRequest(url, { method: "GET"})
    //     return responce.json()
    // }
    
}