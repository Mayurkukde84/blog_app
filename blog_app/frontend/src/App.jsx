import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Editor from "./components/Editor";
import Missing from "./components/Missing";
import Admin from "./components/Admin";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* private routes */}
        <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
