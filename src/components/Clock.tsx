import { CSSProperties } from "react"
import timeZones from "../time-zones";

const countryDefault: string = 'Israel';
const indexDefault: number = timeZones.findIndex(obj => JSON.stringify(obj).includes(countryDefault));

type Props = {
    time: Date,
    city: string
}
export const Clock: React.FC<Props> = ({time, city}) => { // or (props) and then props.time
    // const style: React.CSSProperties
    const style: CSSProperties = {display: "flex", 
        flexDirection: "column", alignItems: "center"}

    //operations inside are porformed every second
    let index: number = timeZones.findIndex(obj => JSON.stringify(obj).includes(city));
    city = index > -1 ? city : countryDefault;
    index = index > -1 ? index : indexDefault;

    const timeInZone: string = time.toLocaleTimeString('en-GB', {timeZone: timeZones[index].name})
    
    return <div style={style}>
        <header>
            Time in {city}
        </header>
        <p>{timeInZone}</p>
    </div>
}