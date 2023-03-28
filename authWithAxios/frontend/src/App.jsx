import React from "react";
import Register from "./pages/Register";
import "./App.css";
import {Routes,Route} from 'react-router-dom'
import Login from "./pages/Login";
import Admin from "./pages/Admin";
const App = () => {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/admin" element={<Admin/>} />
    </Routes>
      
    </div>
  );
};

export default App;
