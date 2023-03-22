import { useState,useEffect } from "react"

const Users = () => {
    const [users,setUser] = useState();

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController()
        const getUsers = async ()=>{
            try {
                const res = await fetch("http://localhost:5000/api/v1/getUser", {
                    
                    signal: controller.signal
            });
            const data = await res.json()
            console.log(data)
            isMounted && setUser(data)
            } catch (error) {
                console.log(error)
            }
        }
        getUsers();

        return ()=>{
            isMounted = false;
            controller.abort()
        }
       
    },[])
  return (
    <article>
        <h2>Users List</h2>
       {
        users?.length ? 
        (
            <ul>
                {users.map((user,i)=> <li key={i} >
                    {user?.username}
                </li>)}
            </ul>
        ) : <p>No users to display</p>
       }
    </article>
  )
}

export default Users