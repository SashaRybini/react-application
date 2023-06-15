import { CSSProperties } from "react"
type Props = {
    time: string
}
export const Clock: React.FC<Props> = ({time}) => {
    // const style: React.CSSProperties
    const style: CSSProperties = {display: "flex", 
        flexDirection: "column", alignItems: "center"}

    return <div style={style}>
        <header>
            Time
        </header>
        <p>{time}</p>
    </div>
}