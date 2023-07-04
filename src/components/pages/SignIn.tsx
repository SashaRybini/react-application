import { useDispatch } from "react-redux";
import SignInForm from "../forms/SignInForm";
import LoginData from "../../model/LoginData";
import InputResult from "../../model/InputResult";
import { authService } from "../../config/service-config";
import UserData from "../../model/UserData";
import { authActions } from "../../redux/slices/authSlice";

const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    async function submitFn(loginData: LoginData): Promise<InputResult> {
        const res: UserData = await authService.login(loginData)
        res && dispatch(authActions.set(res))
        return {status: res ? 'success' : 'error', 
                message: res? '' : 'Incorrect Credentials'}
    }

    return <SignInForm submitFn={submitFn} />
}

 export default SignIn;