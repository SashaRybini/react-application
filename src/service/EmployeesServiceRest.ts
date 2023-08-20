import { Observable, Subscriber } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";
import { CompatClient, Stomp } from "@stomp/stompjs";

const TOPIC = '/topic/employees'

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
async function fetchRequest(url: string, options: RequestInit, empl?: Employee): Promise<Response> {
    options.headers = getHeaders();
    if (empl) {
        options.body = JSON.stringify(empl);
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
async function fetchAllEmployees(url: string): Promise<Employee[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class EmployeesServiceRest implements EmployeesService {

    private observable: Observable<Employee[] | string> | null = null;
    private subscriber: Subscriber<string | Employee[]> | undefined;

    private urlService: string;
    private urlWebsocket: string;
    private stompClient: CompatClient;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}/employees`;
        this.urlWebsocket = `ws://${baseUrl}/websocket/employees`;

        this.stompClient = Stomp.client(this.urlWebsocket)
    }

    async updateEmployee(empl: Employee): Promise<Employee> {
        const response = await fetchRequest(this.getUrlWithId(empl.id!),
            { method: 'PUT' }, empl);
        return await response.json();
    }

    private getUrlWithId(id: any): string {
        return `${this.urlService}/${id}`;
    }

    private sibscriberNext(): void {
        fetchAllEmployees(this.urlService).then(employees => {
            this.subscriber?.next(employees);
        }).catch(error => this.subscriber?.next(error));
    }

    async deleteEmployee(id: any): Promise<void> {
        const response = await fetchRequest(this.getUrlWithId(id), {
            method: 'DELETE',
        });
    }

    getEmployees(): Observable<Employee[] | string> {
        if (!this.observable) {
            this.observable = new Observable<Employee[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.sibscriberNext();
                this.connectWS();
                return () => this.disconnectWS();
            })
        }
        return this.observable;
    }
    private disconnectWS(): void {
        this.stompClient?.disconnect()
    }
    private connectWS() {
        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(TOPIC, message => {
                console.log(message.body)
                this.sibscriberNext()
            })
        }, (error: any) => this.subscriber?.next(JSON.stringify(error)), () => console.log('websocket disconnected'))
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const response = await fetchRequest(this.urlService, {
            method: 'POST',
        }, empl)
        return response.json();
    }

}