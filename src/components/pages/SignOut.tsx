import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { authService } from '../../config/service-config';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    // return <button onClick={() => dispatch(authActions.reset())}>confirm sign out</button>
    return <button onClick={() => {
            dispatch(authActions.reset()) 
            authService.logout()
        }}
        > confirm sign out </button>
}
export default SignOut;
