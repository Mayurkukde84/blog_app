import React from 'react'
import useAuth from './useAuth'
import axios from '../api/axios'
const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async()=>{
        const response = await axios.get('/refresh',{
            withCredentials:true
        })
        console.log(refresh,'refresh')
        setAuth(prev =>{
            console.log(JSON.stringify(prev))
            console.log(response.data.token)
            return { ...prev,token:response.data.token}
        });
        return response.data.token
       
    }
  return refresh
}

export default useRefreshToken