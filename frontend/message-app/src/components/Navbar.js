import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
 
  

  const navigate = useNavigate();
  const handleProfileClick = () => {
    if (user) {
    //   const token = localStorage.getItem("token"); // Get token from localStorage
      navigate(`/profile/${user._id}`);
    }
  };
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Chat App</h1>

      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            <button
              onClick={handleProfileClick}
              className="text-sm font-medium hover:underline"
            >
              Welcome, {user.name} ({user.role})
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
