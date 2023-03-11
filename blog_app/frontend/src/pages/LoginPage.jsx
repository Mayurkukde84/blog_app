import React,{useState} from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate()
 
  const [loginData,setLoginData] = useState({
    email:'',
    password:''
  })

  const onChangeHandler = (e)=>{
    const {name,value} = e.target
    setLoginData((preVal)=>{
      return{
        ...preVal,
        [name]:value
      }
    })
  }

  const SubmitHandler = async(e)=>{
    e.preventDefault()
    try {
      const {email,password} = loginData

      const res = await fetch("http://localhost:5000/api/v1/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      
      })
      const data = await res.json()
      console.log(data)
      localStorage.setItem("token",data.token)
     
     
     
      navigate('/home')

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section>
      <form onSubmit={SubmitHandler}>
        <h3>Sign In</h3>
        <label htmlFor="email">Email</label>
        <input placeholder="email" autoComplete="off" value={loginData.email} name='email' type='email' onChange={onChangeHandler} />
        <label htmlFor="password">Password</label>
        <input placeholder="password" autoComplete="current-password" value={loginData.password} name='password' type='password' onChange={onChangeHandler} />
        <button type="submit">Submit</button>
        <p>Not register? <a href="/" >Sign Up</a> </p>
      </form>
    </section>
  );
};

export default LoginPage;
