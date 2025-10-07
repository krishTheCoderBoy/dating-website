import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import EmailVerify from "./pages/emailVerify";
import ResetPassword from "./pages/resetPassword";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/emailverify" element={<EmailVerify />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
