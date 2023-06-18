type Props = {
    message: string
    status: string
}
const Alert: React.FC<Props> = ({message, status}) => {
    let colorStr: string = ""
    switch(status) {
        case "error": {
            colorStr = "red"
            break
        }
        case "warning": {
            colorStr = "blue"
            break
        }
        case "success": {
            colorStr = "green"
            break
        }
    }
    return <div style={{color:colorStr}}>{message}</div>
}
export default Alert