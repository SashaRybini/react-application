import MessageType from "../model/MessageType"

export default class MessagesService {

  private webSocket: WebSocket | undefined

  private url

  constructor(baseurl: string) {
    this.url = baseurl
    // this.webSocket = new WebSocket('ws://localhost:8080/message/websocket')
  }

  connectWs(username: string) { //on login
    // this.webSocket = new WebSocket('ws://localhost:8080/message/websocket')
    this.webSocket = new WebSocket(`ws://${this.url}/connect/${username}`);
  }

  closeWs() { //on logout
    this.webSocket?.close()
  }

  send(message: MessageType) {
    console.log(message)

    this.webSocket!.send(JSON.stringify(message))
  }

  addListener(handleMessage: (event: any) => void) {
    //вешаем слушателя, по сообщ колим колбэк хэндлер в чатрум компоненте
    this.webSocket?.addEventListener('message', handleMessage);
  }

}