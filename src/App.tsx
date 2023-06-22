import { useEffect } from "react";
import LifeGame from "./components/LifeGame";
import { useDispatch } from "react-redux";
import { getSize, sizeAction } from "./redux/slices/cellSizeSlice";

const App: React.FC = () => {
  const dispatch = useDispatch<any>()
  useEffect(() => {
    window.addEventListener('resize', () => dispatch(sizeAction.setSize(getSize())))
  })
  return <LifeGame /> 
}
export default App;