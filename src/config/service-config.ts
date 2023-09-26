import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJwt";
import ChatRoomService from "../service/ChatRoomService";
import ChatRoomServiceImpl from "../service/ChatRoomServiseImpl";

export const authService: AuthService = new AuthServiceJwt('localhost:8080')

export const chatRoomService: ChatRoomService = new ChatRoomServiceImpl('localhost:8080')