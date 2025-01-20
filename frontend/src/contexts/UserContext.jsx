import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const [username, setLoggedUsername] = useState(null)
    const [id, setId] = useState(null)
    useEffect(()=> {
        axios.get('/profile')
        .then((res)=> {
            setId(res.data.userId)
            setLoggedUsername(res.data.username)
        })
    }, [])
    return (
        <UserContext.Provider value={{username, setLoggedUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}