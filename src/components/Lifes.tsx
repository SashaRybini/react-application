import { useEffect } from "react";
import { useSelectorCount, useSelectorDirection } from "../redux/store"
import { useDispatch } from "react-redux";
import { countAction } from "../redux/slices/lifesCountSlice";
import LifeGame from "./LifeGame";
import Input from "./common/Input";
import InputResult from "../model/InputResult";

const Lifes: React.FC = () => {
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(countAction.setCount(lifesCount));
    }, [])

    const lifesCount = useSelectorCount()
    function submitFn(input: string): InputResult {
        const count = +input;
        if (count < 1 || count > 4) {
            return {status: "error", message: 'number sould be in range 1..4'}
        }
        dispatch(countAction.setCount(count))
        return {status: 'success'};
    }
    
    const flexDirection = useSelectorDirection();

    return <section style={{display: 'flex', flexDirection, alignItems: 'center', justifyContent: 'space-around'}}>
        {!lifesCount && <Input submitFn={submitFn} placeHolder="enter N lifes (1..4)"></Input>}
        {lifesCount  != 0 && Array.from({length: lifesCount}).map((_, index) => <LifeGame key={index} />)}
    </section>
}
export default Lifes