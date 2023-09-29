import { useDispatch } from "react-redux"
import { authService } from "../../config/service-config"
import CodePayload from "../../model/CodePayload"
import CodeType from "../../model/CodeType"
import LoginData from "../../model/LoginData"
import UserData from "../../model/UserData"
import { authActions } from "../../redux/slices/authSlice"
import SignUpForm from "../forms/SignUpForm"

const SignUp: React.FC = () => {

    const dispatch = useDispatch()

    async function signUpSubmitFn(newUser: UserData) {
        const loginData: LoginData = await authService.registerNewUser(newUser)
        const res: UserData = await authService.login(loginData)
        res && dispatch(authActions.set(res))

        //in case of login after registration credentials will be always correct
        
        // const alert: CodePayload = { code: CodeType.OK, message: '' }
        // alert.code = res ? CodeType.OK : CodeType.SERVER_ERROR
        // alert.message = res ? 'Welcome' : 'Incorrect Credentials'
    }

    return <SignUpForm submitFn={signUpSubmitFn} />
}
export default SignUp