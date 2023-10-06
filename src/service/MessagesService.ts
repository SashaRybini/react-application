import MessageType from "../model/MessageType"

export default class MessagesService {

  private webSocket: WebSocket | undefined

  private url

  constructor(baseurl: string) {
    this.url = baseurl
  }

  connectWs(username: string) { //on login

    this.webSocket = new WebSocket(`ws://${this.url}/connect/${username}`);
  }

  closeWs() { //on logout
    this.webSocket?.close()
  }

  send(message: MessageType) {

    this.webSocket!.send(JSON.stringify(message))
  }

  addListener(handleMessage: (event: any) => void) {
    //вешаем слушателя, по сообщ колим колбэк хэндлер в чатрум компоненте
    this.webSocket?.addEventListener('message', handleMessage);
  }

  async getPrivateMessages(clientFrom: string, clientTo: string) {
    const url = `http://${this.url}/messages/private`
    const responce = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clientFrom, clientTo })
    })

    return await responce.text()
  }

  reconnect() {
    const jwt = localStorage.getItem('auth-data-jwt')
    if (jwt) {
      const jwtPayloadJson = atob(jwt.split('.')[1])
      const jwtPayloadObj = JSON.parse(jwtPayloadJson)
      const username = jwtPayloadObj.sub
      this.connectWs(username)
    }
  }

  isWebsocket() {

    return this.webSocket
  }

  async deleteMessage(message: MessageType) {
    const url = `http://${this.url}/messages`
    const responce = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
 
    //
    const deletedMessage = {
      action: 'deleting',
      message: message
    }
    this.webSocket!.send(JSON.stringify(deletedMessage))
    //
  }

  async resetUnread(username: string, client: string) {
    //идем в клаента, ресетим там себя (я - юзернейм)
    const url = `http://${this.url}/messages/unread`
    const responce = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, client })
    })
    return await responce.text() //
  }

}