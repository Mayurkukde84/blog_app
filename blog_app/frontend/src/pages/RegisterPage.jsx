import React, { useState } from "react";
import "./register.css";
const RegisterPage = () => {
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
  const submitHandler = async(e) => {
    e.preventDefault();
    const { name, email, password, pwdConfirm } = regiter;

    const res = await fetch("http://localhost:5000/api/v1/auth/signup",{
        method:'POST',
        headers:{
            "Content-Type":'application/json',
        },
        body:JSON.stringify({
            name, email, password, passwordConfirm: pwdConfirm
        })
    })

    const data = await res.json();
    console.log(data)
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
      </form>
    </section>
  );
};

export default RegisterPage;
