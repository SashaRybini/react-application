import { useState } from "react"

function shuffle(arInit: string[]) {
    let ar = arInit.slice()
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]]
    }
    return ar
}

// const cities = new Map([
//     ['Israel', 'Jerusalem'],
//     ['Russia', 'Moscow'],
//     ['Spain', 'Madrid']
// ])

const capitals = ['Jerusalem', 'Moscow', 'Madrid', 'Rim', 'Canberra']
const countries = ['Israel', 'Russia', 'Spain', 'Italy', 'Australia']



const Capitals: React.FC = () => {

    const [pickedCity, setPickedCity] = useState('')
    const [pickedCountry, setPickedCountry] = useState('')
    const [result, setResult] = useState('')

    const [capitalsShuffled, setCapitalsShuffled] = useState(shuffle(capitals))
    const [countriesShuffled, setCountriesShuffled] = useState(shuffle(countries))

    function reset() {
        setCapitalsShuffled(shuffle(capitals))
        setCountriesShuffled(shuffle(countries))
    }

    function handlerCheck() {
        let cityIndex = capitals.indexOf(pickedCity)
        let countryIndex = countries.indexOf(pickedCountry)

        if (cityIndex == countryIndex) {
            setResult(`right, ${pickedCity} is a capital of ${pickedCountry}`)

            capitalsShuffled.splice(capitalsShuffled.indexOf(pickedCity), 1)
            countriesShuffled.splice(countriesShuffled.indexOf(pickedCountry), 1)

        } else {
            setResult(`wrong, ${pickedCity} is not a capital of ${pickedCountry}`)
        }

        if (capitalsShuffled.length == 0) {
            setResult('molodets')
        }
        setPickedCity('')
        setPickedCountry('')
    }

    const [value, setValue] = useState('')
    function onChangeHandler(e: any) {
        setValue(e.target.value)
    }
    function onSubmitHandler(e: any) {
        e.preventDefault()            
        if (value == capitals[countries.indexOf(pickedCountry)]) {
            console.log('kuku');
        }
        setValue('')
    }

    return <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {
                countriesShuffled.map((country, i) => {
                 return <button 
                    key={i} 
                    style={{ color: i == countriesShuffled.indexOf(pickedCountry) ? 'blue' : 'initial' }}
                    onClick={() => {
                        setPickedCountry(country)
                    }}
                    >
                        {country}
                    </button>
                })
            }
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {
                capitalsShuffled.map((city, i) => {
                    return <button 
                        key={i} 
                        style={{ color: i == capitalsShuffled.indexOf(pickedCity) ? 'blue' : 'initial' }}
                        onClick={() => {
                            setPickedCity(city)
                        }}
                        >
                            {city}
                        </button>
                })
            }
        </div>
        <button onClick={() => handlerCheck()} disabled={pickedCity == '' || pickedCountry == ''}>check</button>
        <p>{result}</p>
        <button onClick={() => reset() }>reset</button>

        <form onSubmit={onSubmitHandler}>
            <input type="text" value={value} onChange={onChangeHandler}></input>
            <button type="submit">go</button>
        </form>

    </div>
}
export default Capitals