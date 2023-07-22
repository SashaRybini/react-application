import { useDispatch } from "react-redux";
import SignInForm from "../forms/SignInForm";
import LoginData from "../../model/LoginData";
import { authService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { authActions } from "../../redux/slices/authSlice";
import { useDispatchCode } from "../../hooks/hooks";

const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    const dispatchCode = useDispatchCode()

    async function loginSubmitFn(loginData: LoginData) {
        const res: UserData = await authService.login(loginData) //login returns null in case of any errors
        res && dispatch(authActions.set(res))
        res ? dispatchCode('', 'Welcome') : dispatchCode('Incorrect Credentials', '')
    }

    return <SignInForm loginSubmitFn={loginSubmitFn}/>
}

export default SignIn;