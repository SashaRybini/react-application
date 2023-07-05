import Employee from "../model/Employee";
import StatsType from "../model/StatsType";
import { count } from "../util/number-functions";

export function getStatistics(employees: Employee[], field: string, interval: number): StatsType[] {
    // const res: StatsType[] = []
    
    let array;
    const currentYear = new Date().getFullYear();

    if (field == 'birthDate') {
        array = employees.map(e => currentYear - e[field].getFullYear())
    }
    if (field == 'salary') {
        array = employees.map(e => e[field])
    }
    
    const statisticsObj = count(array, interval);
    
    const res: StatsType[] = Object.entries(statisticsObj).map((e, index): StatsType => {
        const min = +e[0] * interval;
        const max = min + interval - 1;
        return { id: index + 1, min, max, count: e[1] };
    })

    return res
}