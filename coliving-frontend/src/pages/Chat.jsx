import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../services/socket";
import Navbar from "../components/Navbar";

export default function Chat() {
  const { userId } = useParams();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUserData = localStorage.getItem("user");
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

  useEffect(() => {
    initializeChat();

    if (currentUser?._id) {
      socket.emit("join", currentUser._id);
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const initializeChat = async () => {
    try {
      const conversationRes = await API.post("/conversations", {
        receiverId: userId
      });

      setConversation(conversationRes.data);

      const conversationId = conversationRes.data._id;

      const messagesRes = await API.get(`/messages/${conversationId}`);
      setMessages(messagesRes.data);

      await API.put(`/messages/${conversationId}/seen`);
    } catch (err) {
      console.log("CHAT INIT ERROR:", err.response?.data || err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversation?._id) return;

    try {
      const res = await API.post("/messages", {
        conversationId: conversation._id,
        text
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", {
        ...res.data,
        receiverId: userId
      });

      setText("");
    } catch (err) {
      console.log("SEND MESSAGE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-md p-6 h-[80vh] flex flex-col">
          <h1 className="text-3xl font-bold mb-6">
            Chat
          </h1>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((msg, index) => {
              const isCurrentUser =
                (msg.sender?._id || msg.sender) === currentUser?._id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[70%] ${
                      isCurrentUser
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{msg.text}</p>

                    <p className="text-xs mt-2 opacity-70">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border p-3 rounded-xl outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={sendMessage}
              className="bg-black hover:bg-gray-800 transition text-white px-6 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}