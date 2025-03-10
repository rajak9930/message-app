import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function UserList({ onSelectUser, currentUser }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("update-user-status", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    if (currentUser) {
      socket.emit("user-online", currentUser._id);
    }

    return () => {
      socket.off("update-user-status");
    };
  }, [currentUser]);

  return (
    <div className="w-80 h-screen bg-white shadow-lg p-4 border-r border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Users</h2>
      <ul className="space-y-2">
        {users
          .filter((user) => user._id !== currentUser?._id)
          .map((user) => (
            <li
              key={user._id}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-200"
              onClick={() => onSelectUser(user)}
            >
             
              <div className="relative w-10 h-10">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
               
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.includes(user._id) ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>

              <span className="ml-3 text-gray-700 font-medium">{user.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
