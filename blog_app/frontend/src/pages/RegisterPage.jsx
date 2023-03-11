import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate()
  const [regiter, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    pwdConfirm: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setRegister((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, pwdConfirm } = regiter;

      const res = await fetch("http://localhost:5000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          passwordConfirm: pwdConfirm,
        }),
      });
      const data = await res.json();
      navigate('/login')
      console.log(data.message);
  
      console.log(data.data.user.username);
      console.log(data.status);
      console.log(res.status);
    } catch (error) {
      console.log(error)
    }

   
  };
  return (
    <section>
      <form onSubmit={submitHandler}>
        <h3>Sign Up</h3>
        <label>Username</label>
        <input
          placeholder="name"
          name="name"
          type="text"
          onChange={onChangeHandler}
          value={regiter.username}
        />
        <label>Email</label>
        <input
          placeholder="email"
          type="email"
          name="email"
          autoComplete="off"
          onChange={onChangeHandler}
          value={regiter.email}
        />
        <label>Password</label>
        <input
          placeholder="password"
          autoComplete="current-password"
          type="password"
          name="password"
          onChange={onChangeHandler}
          value={regiter.pwd}
        />
        <label>PasswordConfirm</label>
        <input
          placeholder="passwordConfirm"
          type="pwdConfirm"
          name="pwdConfirm"
          onChange={onChangeHandler}
          value={regiter.pwdConfirm}
        />
        <button type="submit">Submit</button>
        <p>Already register?please <a href="/login">SignIn</a> </p>
      </form>
    </section>
  );
};

export default RegisterPage;
