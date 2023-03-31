import React, { useState, useEffect, useRef ,useContext} from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const {setAuth} = useContext(AuthContext)
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserLogin((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    setErrMsg("");
  }, [userLogin]);
  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/v1/auth/login",
        JSON.stringify({
          email: userLogin.email,
          password: userLogin.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response?.data));
      console.log("success");
      const token = response?.data?.token
      const roles = response?.data?.user?.role
      const user = response?.data?.user?.username
      setAuth({user,roles,token})
      
      setSuccess(true);
      
      navigate('/admin')
      console.log(accessToken,roles,userName,token)
      

     
    } catch (err) {
      
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 403) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };
  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h3>Log In</h3>
          <form onSubmit={SubmitHandler}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              onChange={onChangeHandler}
              value={userLogin.email}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={onChangeHandler}
              value={userLogin.password}
              autoComplete="off"
            />
            <button>Submit</button>
          </form>
        </section>
      )}
    </>
  );
};

export default Login;
