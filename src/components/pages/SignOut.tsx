import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Box, Button } from '@mui/material';

const style: React.CSSProperties = {display: 'flex', justifyContent: 'center'}

const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    
    return <Box style={style}>
        <Button onClick={() => dispatch(authActions.reset())}>confirm sign out</Button>
    </Box>
}
 export default SignOut;