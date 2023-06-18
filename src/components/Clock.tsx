import { CSSProperties, useMemo } from "react"
import timeZones from "../time-zones";

type Props = {
    time: Date,
    city: string
}

const countryDefault: string = 'Israel';
const indexDefault: number = timeZones.findIndex(obj => JSON.stringify(obj).includes(countryDefault));

const style: CSSProperties = {display: "flex", flexDirection: "column", alignItems: "center"}

function getTimeZone(city: string): string {
    let index: number = getIndex(city);
    city = index > -1 ? city : countryDefault;
    index = index > -1 ? index : indexDefault;
    return timeZones[index].name;
}
function getCity(city: string): string {
    let index: number = getIndex(city);
    return city = index > -1 ? city : countryDefault;
}
function getIndex(city: string): number {
    return timeZones.findIndex(obj => JSON.stringify(obj).includes(city)); //try find 
}

export const Clock: React.FC<Props> = ({time, city}) => { // or (props) and then props.time
    // const style: React.CSSProperties
    //operations inside are performed every second
    const timeZone = useMemo(() => getTimeZone(city), [city]); //вызовется только если поменялся сити
    const timeInZone: string = time.toLocaleTimeString('en-GB', {timeZone: timeZone})
    city = useMemo(() => getCity(city), [city])
    return <div style={style}>
        <header>
            Time in {city}
        </header>
        <p>{timeInZone}</p>
    </div>
}