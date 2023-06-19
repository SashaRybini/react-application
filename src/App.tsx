import Clocks from "./components/Clocks";
import Input from "./components/common/Input";
import InputResult from "./model/InputResult";
import './App.css'
import { ReactNode, useState } from "react";
import A from "./components/A";

const components: Map<string, ReactNode> = new Map([
  ['clocks', <Clocks></Clocks>],
  ['a', <A></A>]
])

const App: React.FC = () => {
  
  // return <Input submitFn={function (inputText: string): InputResult {
  //   console.log(inputText)
  //   return {status: "sucsess", message: inputText}
  // } } inputType="text" placeHolder={"enter smthng"} buttonTitle="gogo"/>
  const [componentName, setComponentName] = useState<string>('')
  function submitFn(component: string): InputResult {
    const res: InputResult = {status: 'error', message: `${component} doesn't exist`}
    if (components.has(component)) {
      res.status = 'success'
      res.message = 'ok'
      setComponentName(component);
    }
    return res
  }

  return <div className="app-class">
      {/* <Clocks /> */}
      <Input submitFn={submitFn} placeHolder="enter component name"></Input>
      {componentName && components.get(componentName)}
    </div>
}
export default App;