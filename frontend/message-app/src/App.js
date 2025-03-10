import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
     <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
