import { useDispatch } from "react-redux";
import { authActions } from "../../redux/slices/authSlice";
import SignInForm from "../forms/SignInForm";
import AuthServiceJwt from "../../service/AuthServiceJwt";
import serviceConfig from '../../config/servise-config.json'

const {serviceUrl} = serviceConfig;
const authServiseJwt = new AuthServiceJwt(serviceUrl)

const SignIn: React.FC = () => {
    const dispatch = useDispatch();

    async function signinCb(loginData: { email: string; password: string; }) {
        const userData = await authServiseJwt.login(loginData);     
        userData && dispatch(authActions.set(userData))
    }

    return <SignInForm signinCb={signinCb}/>
}

 export default SignIn;