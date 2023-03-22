import {createContext, useState} from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState({})
    console.log(auth,'require')
    return(
        <AuthContext.Provider value={{auth,setAuth}} >
        {children}
        </AuthContext.Provider>
    )
}

export default AuthContext