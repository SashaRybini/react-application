import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sizeAction } from "./redux/slices/cellSizeSlice";
import { directionActions } from "./redux/slices/flexDirectionSlice";
import Lifes from "./components/Lifes";


const App: React.FC = () => {
  const dispatch = useDispatch<any>()
  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(sizeAction.setSize())
      dispatch(directionActions.setDirection())
    })
  }, [])

  return <div>
      <Lifes />
    </div>
}
export default App