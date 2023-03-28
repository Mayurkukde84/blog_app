import { axiosPrivate } from "../api/axios";
import React,{useEffect} from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = ()=>{
    const refresh = useRefreshToken();
    const { auth} = useAuth()
console.log(auth,'auth')
    useEffect(()=>{

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config =>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.token}`
                }
                return config
            },(error)=>Promise.reject(error)
        )

        const reponseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async(error)=>{
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const newToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(prevRequest)
            }
        );
        return ()=>{
            axiosPrivate.interceptors.response.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(reponseIntercept)
        }
    },[auth,refresh])

    return axiosPrivate
}

export default useAxiosPrivate