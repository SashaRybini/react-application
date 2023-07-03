import { CSSProperties, useEffect, useRef, useState } from "react";
import InputResult from "../../model/InputResult";

import { StatusType } from "../../model/StatusType";
import { Alert, Button, TextField } from "@mui/material";

type Props = {
    submitFn: (inputText: string) => InputResult,
    placeholder: string,
    buttonTitle?: string,
    inputType?: string
}
const style: CSSProperties = {textAlign: 'center'}

const Input: React.FC<Props> = ({submitFn, placeholder, buttonTitle, inputType}) => {
    const inputElementRef = useRef<any>(null)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")

    const status = useRef<StatusType>("success")

    function onClickFn() {
        const res = submitFn(inputElementRef.current!.value)
        
        status.current = res.status;
        if (res.status === 'success') {
            inputElementRef.current!.value = ''
        }

        setMessage(res.message || "")
        res.message && setTimeout(() => setMessage(""), 5000)
    }

    function onChangeFn(event: any) {
        inputElementRef.current = event.target as any
        setDisabled(!event.target.value)
    }
    
    return <div style={style}>
        <TextField 
            size="small" 
            type={inputType || "text"} 
            placeholder={placeholder} 
            ref={inputElementRef}
            onChange={onChangeFn}
        />
        <Button onClick={onClickFn} disabled={disabled}>{buttonTitle || 'go'}</Button>
        {message && <Alert severity={status.current} >{message}</Alert>} 
    </div>
}
export default Input;