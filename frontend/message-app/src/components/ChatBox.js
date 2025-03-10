import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import moment from "moment";

export default function ChatBox({ selectedUser, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;

      setLoading(true);
      try {
        const { data } = await api.get(
          `/messages?senderId=${currentUser._id}&receiverId=${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sortedMessages = data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => {
          const updatedMessages = [...prev, message];
          return updatedMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        });
      }
    };

    const handleTyping = () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000); // Clear typing indicator after 2 seconds
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket, selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const messageData = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
  
    try {
      const { data } = await api.post("/messages/send", messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      setMessages((prev) => {
        const updatedMessages = [...prev, data];
        return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
      socket.emit("send-message", data);
      setNewMessage("");
      setIsTyping(false); // Clear typing indicator when sending a message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  const handleTyping = () => {
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // This will trigger scroll on new messages

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <div className="p-4 bg-white shadow-md sticky top-0 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Chat with {selectedUser?.name || "User "}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div>Loading messages...</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="flex flex-col max-w-[80%] sm:max-w-[60%]">
                <div
                  className={`p-3 rounded-xl shadow-md text-sm ${
                    msg.senderId === currentUser._id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-xs text-gray-500 mt-1 self-end sm:self-start">
                  {moment(msg.timestamp).format("h:mm A")}
                </span>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl shadow-md text-sm bg-gray-300 text-black">
              User is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white shadow-md flex items-center sticky bottom-0 w-full">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(); // Emit typing event on input change
          }}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
