import Clocks from "./components/Clocks";
import Input from "./components/common/Input";
import InputResult from "./model/InputResult";
import './App.css'

const App: React.FC = () => {
  
  // return <Input submitFn={function (inputText: string): InputResult {
  //   console.log(inputText)
  //   return {status: "sucsess", message: inputText}
  // } } inputType="text" placeHolder={"enter smthng"} buttonTitle="gogo"/>
  return <div className="app-class">
      <Clocks />
    </div>
}
export default App;