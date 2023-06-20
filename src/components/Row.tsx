import { ReactNode } from "react"
import config from '../config/life-game-config.json'

function getPxSize() {
    
    return (Math.min(window.innerHeight, window.innerWidth) / config.dimension) * 0.7
}

const Row: React.FC<{row: number[]}> = ({row}) => {
    function getDivs(): ReactNode {      
        return row.map((num, index) => 
            <div key={index} style={{width: getPxSize(), height: getPxSize(), backgroundColor: num ? 
                'black' : 'white', border: 'solid 1px gray'}}></div>)
    }
    return <section style={{display: 'flex'}}>
        {getDivs()}
    </section>
}
export default Row