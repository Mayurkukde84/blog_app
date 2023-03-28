import React,{useState,useEffect} from 'react'
import axios from '../api/axios'

const Users = () => {
    const [users,setUsers] = useState();
    
   

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async()=>{
            try {
                const response = await axios.get("/api/v1/blog",{
                    signal:controller.signal,
               
                })
                console.log(response?.data)
           
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
                            {user?.article}
                            <br />
                            {user?.author}
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