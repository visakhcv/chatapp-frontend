import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext= createContext({})

export function UserContextProvider({children}) {
    const [username,setUsername] = useState(null)
    const [id,setId] = useState(null)
    useEffect(()=>{
        axios.get('/profile').then(response=>{
            setId(response.data.userData.userId)
            setUsername(response.data.userData.username)
        })
    },[])
    return(
        <UserContext.Provider value={{username,setUsername,id,setId}} >{children} </UserContext.Provider>
    )
}