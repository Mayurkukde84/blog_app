import React,{useState,useEffect} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Users = () => {
    const [users,setUsers] = useState();
    
   const axiosPrivate = useAxiosPrivate()

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async()=>{
            try {
                const response = await axiosPrivate.get("/api/v1/blog",{
                    signal:controller.signal,
               
                })
                console.log(response.data)
           
                isMounted && setUsers(response.data.blog)
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
        return ()=>{
            isMounted = false
            controller.abort()
        }
       
    },[])

  return (
    <article>
        <h2>Users List</h2>
        {
            users?.length ? (
                <ul>
                    {
                        users.map((user,i)=><li key={i} >
                       <h4>{user?.author}</h4> 
                        <br />
                        <p>{user?.article}</p>   
                            
                          
                        </li>)
                    }
                </ul>
            ):(
<p>No users to display</p>
            )
        }
      
    </article>
  )
}

export default Users