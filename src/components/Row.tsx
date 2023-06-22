import { ReactNode, useEffect, useState } from "react"
import config from '../config/life-game-config.json'

function getSize() {
    
    return Math.min(window.innerHeight, window.innerWidth) / config.dimension - 2 // border 1px
}

const Row: React.FC<{row: number[]}> = ({row}) => {
    const [size, setSize] = useState(getSize())
    useEffect(() => {
        window.addEventListener('resize', () => setSize(getSize()))
    }, [])
    function getDivs(): ReactNode {      
        return row.map((num, index) => 
            <div key={index} style={{width: size, height: size, backgroundColor: num ? 
                'black' : 'white', border: 'solid 1px gray'}}></div>)
    }
    return <section style={{display: 'flex'}}>
        {getDivs()}
    </section>
}
export default Row