import React, { useState, createContext } from "react";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";


const App = () => {
 
  return (
    <div className="container-center">
    
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
    
    </div>
  );
};

export default App;
