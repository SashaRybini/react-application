
import StatsType from "../model/StatsType";
import { count } from "../util/number-functions";

export function getStatistics(empls: Object[], field: string, interval: number): StatsType[] {
    
    const statisticsObj = count(empls, field, interval);
    
    const res: StatsType[] = Object.entries(statisticsObj).map((e, index): StatsType => {
        const min = +e[0] * interval;
        const max = min + interval - 1;
        return { id: index + 1, min, max, count: e[1] as number };
    })

    return res
}