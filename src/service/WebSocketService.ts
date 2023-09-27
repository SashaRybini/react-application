import Message from "../model/Message"

export default class WebSocketService {

    private webSocket: WebSocket

    constructor() {
        this.webSocket = new WebSocket('ws://localhost:8080/message/websocket')
    }

    send(message: Message) {
        console.log(message)

        this.webSocket.send(JSON.stringify(message))
    }

}