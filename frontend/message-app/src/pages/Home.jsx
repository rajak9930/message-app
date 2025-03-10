import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chat"); 
    }
  }, [user, navigate]);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
      <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">
        Welcome to <span className="text-yellow-300">Chat App</span>
      </h1>
      <p className="text-lg mb-6 opacity-80">
        Connect and chat with your friends instantly!
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
