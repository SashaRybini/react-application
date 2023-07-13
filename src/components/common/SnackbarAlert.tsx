import { Alert, Snackbar } from "@mui/material";
import { StatusType } from "../../model/StatusType";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { codeActions } from "../../redux/slices/codeSlice";

type Props = {
    message: string;
    duration?: number;
    severity: StatusType;
}
const DEFAULT_DURATION = 20000
const SnackbarAlert: React.FC<Props> = ({ message, duration, severity }) => {
    const [open, setOpen] = useState(false);
    const alertMessage = useRef('')
    const dispatch = useDispatch()
    useEffect(() => {
        message && setOpen(true);
        alertMessage.current = message;
    }, [message])
    
    return <Snackbar 
            open={open} 
            autoHideDuration={duration || DEFAULT_DURATION}
            onClose={() => {
                    setOpen(false)
                    dispatch(codeActions.reset()) //for two success alerts in a row, for example
                }}
            >
        <Alert 
            onClose={() => {
                setOpen(false)
                dispatch(codeActions.reset())
            }} 
            severity={severity} 
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
}
export default SnackbarAlert;