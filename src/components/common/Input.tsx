import { useEffect, useRef, useState } from "react";
import InputResult from "../../model/InputResult";
import Alert from "../Alert";

type Props = {
    submitFn: (inputText: string) => InputResult,
    placeHolder: string,
    buttonTitle?: string,
    inputType?: string
}
const Input: React.FC<Props> = ({submitFn, placeHolder, buttonTitle, inputType}) => {
    const inputElementRef = useRef<HTMLInputElement>(null)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")
    const [status, setStatus] = useState<string>("")

    function onClickFn() {
        const res = submitFn(inputElementRef.current!.value)
        setMessage(res.message || "")
        res.message && setTimeout(() => setMessage(""), 5000)

        setStatus(res.status || "")
        res.status && setTimeout(() => setStatus(""), 5000)
    }

    function onChangeFn() {
        setDisabled(!inputElementRef.current?.value)
    }

    return <div>
        <input type={inputType || "text"} placeholder={placeHolder} ref={inputElementRef} onChange={onChangeFn}/>
        <button onClick={onClickFn} disabled={disabled}>{buttonTitle || 'go'}</button>
        {/* {message && <label>{"success"} {message}</label>} */}
        <Alert message={message} status={status}></Alert>
    </div>
}
export default Input;