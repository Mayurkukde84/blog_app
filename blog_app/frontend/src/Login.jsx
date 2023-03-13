import React, { useState, useRef, useEffect } from "react";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [success,setSuccess] = useState(false)

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg(" ");
  }, [email, pwd]);

  const submitHandler = async(e)=>{
    e.preventDefault()
   
    console.log(email,pwd)
    const res = await fetch("http://localhost:5000/api/v1/auth/login",{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            email,
            password:pwd
        })
    })
    const data = await res.json()
    console.log(data)
    setSuccess(true)
  }

  return (
    <>
    {
        success ? (
<section>
    <h1>You are logged in!</h1>
    <br />
    <p>
        <a href="#" >Go to home</a>
    </p>
</section>
        ):(
            <section>
            <p
              ref={errRef}
              className={errMsg ? "errMsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={submitHandler}>
              <label htmlFor="email" >Username:</label>
              <input 
                  type="email"
                  id="email"
                  autoComplete="off"
                  ref={userRef}
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  required
              />
              <label htmlFor="password" >Password:</label>
              <input 
                  type="password"
                  id="password"
                  autoComplete="off"
                
                  onChange={(e)=>setPwd(e.target.value)}
                  value={pwd}
                  required
              />
              <button type="submit">Log In</button>
            </form>
            <p>
              Need an Account? <br />
              <span className="line" >
              <a href='#'>Sign Up</a>
              </span>
            </p>
          </section>

        )
    }
    </>
  );
};

export default Login;
