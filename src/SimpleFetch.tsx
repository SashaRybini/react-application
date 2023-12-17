import axios from "axios";
import React, { useEffect, useState } from "react";

const fetchRandomData = async (page: number) => {

    //just fetch
    // return axios.get(`https://randomuser.me/api?page=${page}`)
    //     .then(response => {
          
    //         return response.data
    //     }).catch(error => {
    //         console.error(error); 
    //     })
    const response = await fetch(`https://randomuser.me/api?page=${page}`)
    return await response.json()
}
// https://codesandbox.io/p/sandbox/quizzical-tharp-t90fd?file=%2Fsrc%2FApp.tsx%3A26%2C8
type UserName = {
    first: string,
    last: string,
    title: string
}
type Picture = {
    thumbnail: string
}
type UserInfo = {
    name: UserName,
    picture: Picture
}

function getUserName(username: UserName) {
    
    return `${username.title} ${username.first} ${username.last}`
}

const Test: React.FC = () => {
    const [counter, setCounter] = useState(0)
    const [userInfo, setUserInfo] = useState<any>([])
    const [page, setPage] =  useState(1)

    useEffect(() => {
        fetchRandomData(page).then(data => {
            const nextUserInfo = [
                ...userInfo,
                ...data.results
            ]
            // setUserInfo(data.results) 
            setUserInfo(nextUserInfo)
        })
    }, [page])

    

    return <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            // justifyContent: "center",  height: "100vh"
        }}>
        <p>
           {counter} 
        </p>
        <button onClick={() => setCounter(counter + 1)}>+</button>
        <button onClick={() => setCounter(counter - 1)}>-</button>
        <button onClick={() => setPage(page + 1)}>next</button>
        {
            userInfo.map((info: UserInfo, ind: number) => {
                return <div key={ind}>
                    <p>{getUserName(info.name)}</p>
                    <img src={info.picture.thumbnail}/>
                </div>
            })
        }
       
    </div>
}
export default Test