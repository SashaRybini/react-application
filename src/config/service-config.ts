import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJwt";
import ChatRoomService from "../service/ChatRoomService";
import ChatRoomServiceImpl from "../service/ChatRoomServiseImpl";
import MessagesService from "../service/MessagesService";

export const authService: AuthService = new AuthServiceJwt('localhost:8080')

export const chatRoomService: ChatRoomService = new ChatRoomServiceImpl('localhost:8080')

export const messagesService = new MessagesService('localhost:8080')