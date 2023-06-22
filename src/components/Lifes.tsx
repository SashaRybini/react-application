import { useEffect } from "react";
import { useSelectorDirection } from "../redux/store"
import { useDispatch } from "react-redux";
import { countAction } from "../redux/slices/lifesCountSlice";
import LifeGame from "./LifeGame";

const Lifes: React.FC<{lifesCount: number}> = ({lifesCount}) => {
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(countAction.setCount(lifesCount));
    }, [])
    
    const flexDirection = useSelectorDirection();
    return <section style={{display: 'flex', flexDirection, alignItems: 'center', justifyContent: 'space-around'}}>
        {lifesCount && Array.from({length: lifesCount}).map((_, index) => <LifeGame key={index} />)}
    </section>
}
export default Lifes