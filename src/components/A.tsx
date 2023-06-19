import { useEffect } from "react"

const A: React.FC = () => {
    useEffect(() => {
        console.log('mounting of A');
        return () => console.log('unmouting of A');
        
    })
    return <p style={{fontSize:'2em', fontWeight:'bold'}}>Component A</p>
}
export default A