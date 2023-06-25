import { CSSProperties, useEffect, useRef, useState } from "react";
import InputResult from "../../model/InputResult";
import Alert from "./Alert";
import { StatusType } from "../../model/StatusType";

type Props = {
    submitFn: (inputText: string) => InputResult,
    placeholder: string,
    buttonTitle?: string,
    inputType?: string
}
const style: CSSProperties = {textAlign: 'center'}

const Input: React.FC<Props> = ({submitFn, placeholder, buttonTitle, inputType}) => {
    const inputElementRef = useRef<HTMLInputElement>(null)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")

    // const [status, setStatus] = useState<string>("")
    const status = useRef<StatusType>("success")

    function onClickFn() {
        const res = submitFn(inputElementRef.current!.value)
        
        status.current = res.status;
        if (res.status === 'success') {
            inputElementRef.current!.value = ''
        }
        // setStatus(res.status || "")
        // res.status && setTimeout(() => setStatus(""), 5000)

        setMessage(res.message || "")
        res.message && setTimeout(() => setMessage(""), 5000)
    }

    function onChangeFn() {
        setDisabled(!inputElementRef.current?.value)
    }

    return <div style={style}>
        <input type={inputType || "text"} placeholder={placeholder} ref={inputElementRef} onChange={onChangeFn}/>
        <button onClick={onClickFn} disabled={disabled}>{buttonTitle || 'go'}</button>
        {message && <Alert status={status.current} message={message}></Alert>} 
    </div>
}
export default Input; // ^ если нет мессаджа то и нет алерта