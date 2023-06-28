import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJwt";

export const authService: AuthService = new AuthServiceJwt('http://localhost:3500')