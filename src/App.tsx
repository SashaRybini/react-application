import { useEffect, useState } from "react";
import LifeGame from "./components/LifeGame";
import { useDispatch, useSelector } from "react-redux";
import { sizeAction } from "./redux/slices/cellSizeSlice";
import { directionActions } from "./redux/slices/flexDirectionSlice";
import Lifes from "./components/Lifes";
import Input from "./components/common/Input";
import InputResult from "./model/InputResult";
import { countAction } from "./redux/slices/lifesCountSlice";
import { useSelectorCount } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useDispatch<any>()
  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(sizeAction.setSize())
      dispatch(directionActions.setDirection())
    })
  }, [])

  let count = useSelectorCount()
  function submitFn(inputText: string): InputResult {
    const res: InputResult = {status: 'success'}
    dispatch(countAction.setCount(+inputText))
    return res;
  }

  return <div>
      {!count && <Input submitFn={submitFn} placeHolder="enter N lifes"></Input>}
      {count != 0 && <Lifes lifesCount={count}/>}
    </div>
}
export default App