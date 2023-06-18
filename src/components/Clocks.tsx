import { useEffect, useState } from "react";
import { Clock } from "./Clock";
import clocksConfig from '../config/clocks-config.json'; // w/o assert ok

const cities: string[] =  clocksConfig.cities;

const Clocks: React.FC = () => {
    
    const [time, setTime] = useState<Date>(new Date())
   
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date()); //ресурс
        }, 1000);
        return () => clearInterval(intervalId) //вызывается когда компонента размонтируется и при повторном вызове этой функции
    }, []) //[] - внутри указывается при изменении каких ресурсов вызывать юзэффект. по умолчанию все ресурсы

    return <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
        {cities.map(city => <Clock time={time} city={city} key={city} />)}
    </div>
}
export default Clocks