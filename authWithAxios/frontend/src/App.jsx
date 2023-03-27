import React from "react";
import Register from "./pages/Register";
import "./App.css";
import {Routes,Route} from 'react-router-dom'
import Login from "./pages/Login";
const App = () => {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path="/login" element={<Login/>} />
    </Routes>
      
    </div>
  );
};

export default App;
