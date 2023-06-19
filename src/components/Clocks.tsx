import { useEffect, useState } from "react";
import { Clock } from "./Clock";
import clocksConfig from '../config/clocks-config.json'; // w/o assert ok

const cities: string[] =  clocksConfig.cities;

const Clocks: React.FC = () => {
    
    const [time, setTime] = useState<Date>(new Date())
   
    useEffect(() => {
        console.log('mounting of clocks');
        const intervalId = setInterval(() => {
            setTime(new Date()); //ресурс
            console.log('interval');
            
        }, 1000);
        return () => {               //вызывается когда компонента размонтируется и при повторном вызове этой функции
            clearInterval(intervalId)
            console.log('unmouting of clock');
        } 
    }, []) //[] - внутри указывается при изменении каких ресурсов вызывать юзэффект. по умолчанию все ресурсы

    return <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
        {cities.map(city => <Clock time={time} initialCity={city} key={city} />)}
    </div>
}
export default Clocks