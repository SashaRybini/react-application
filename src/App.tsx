import Clocks from "./components/Clocks";
import Input from "./components/common/Input";
import InputResult from "./model/InputResult";

const App: React.FC = () => {
  
  return <Input submitFn={function (inputText: string): InputResult {
    console.log(inputText)
    return {status: "sucsess", message: inputText}
  } } inputType="text" placeHolder={"enter smthng"} buttonTitle="gogo"/>
  // return <Clocks />
}
export default App;