import React, { useState } from "react";
import axios from "axios";
const Register = () => {
  const [username, setUsername] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const setEmployee = (e) => {
    const { name, value } = e.target;
    setUsername((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };

  const handleSUbmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
       "/api/v1/auth/signup",
        JSON.stringify({
          username:username.name,
          email:username.email,
          password:username.password,
          passwordConfirm:username.passwordConfirm
        }),
        {
          headers: { "Content-Type": "application/json" },
        withCredentials:true
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section>
      <h3>Register</h3>
      <form onSubmit={handleSUbmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          onChange={setEmployee}
          value={username.name}
          autoComplete="off"
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          onChange={setEmployee}
          value={username.email}
          autoComplete="off"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={setEmployee}
          value={username.password}
          autoComplete="off"
        />
        <label htmlFor="passwordConfirm">PasswordConfirm</label>
        <input
          type="password"
          name="passwordConfirm"
          onChange={setEmployee}
          value={username.passwordConfirm}
          autoComplete="off"
        />
        <button type="submit">Submit</button>
      </form>
      <p>Already Register!</p>
      <a href="/login" ><span>Sign In</span></a>
    </section>
  );
};

export default Register;
