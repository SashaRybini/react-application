
type Props = {
    message: string
}

const Alert: React.FC<Props> = ({message}) => {

    return <div>{message}</div>
}
export default Alert