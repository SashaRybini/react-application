import { CSSProperties } from "react";
import { StatusType } from "../../model/StatusType"

type Props = {
    status: StatusType
    message: string
}

const statusesProps: Map<StatusType, CSSProperties> = new Map([
    ['error', {backgroundColor: "red"}],
    ['warning', {backgroundColor: "orange"}],
    ['success', {backgroundColor: "green"}],
])

const Alert: React.FC<Props> = ({message, status}) => {
    
    return <div>
        <p style={statusesProps.get(status)}>{message}</p>
    </div>
}
export default Alert