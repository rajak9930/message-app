import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";
import { api } from "../utils/api";
import { io } from "socket.io-client";

export default function Chat() {
  const [currentUser , setCurrentUser ] = useState(null);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { forceNew: true });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser  = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCurrentUser (data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser ();
  }, []);

  return (
    <div className="flex h-screen">
      <UserList onSelectUser ={setSelectedUser } currentUser ={currentUser } />
      {selectedUser  ? (
        <ChatBox selectedUser ={selectedUser } currentUser ={currentUser } socket={socket} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
}