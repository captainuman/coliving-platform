import { useEffect, useState } from "react";
import API from "../../services/api";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";

import toast from "react-hot-toast";
import socket from "../../services/socket";

export default function ChatWindow({
  conversation,
  onBack,
  onConversationUpdate,
}) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!conversation) return;

    if (conversation._id === "ai") {
      setMessages([]);
      return;
    }

    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    if (!currentUser?._id) return;

    socket.connect();
    socket.emit("join", currentUser._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (message) => {
      onConversationUpdate?.();

      if (conversation && message.conversation === conversation._id) {
        setMessages((prev) => [...prev, message]);
        API.put(`/messages/${message.conversation}/seen`).catch(console.log);
      } else {
        toast.success(`New message: ${message.text}`);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, [currentUser?._id, conversation?._id]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/messages/${conversation._id}`);
      setMessages(res.data);
      await API.put(`/messages/${conversation._id}/seen`);
      onConversationUpdate?.();
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (text) => {
    if (!conversation) return;

    if (conversation._id === "ai") {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          sender: currentUser._id,
          text,
          createdAt: new Date(),
        },
        {
          _id: Date.now() + 1,
          sender: "ai",
          text: "Hello! I am your AI Assistant. How can I help you?",
          createdAt: new Date(),
        },
      ]);

      return;
    }

    try {
      const res = await API.post("/messages", {
        conversationId: conversation._id,
        text,
      });

      setMessages((prev) => [...prev, res.data]);

      const receiver = conversation.participants.find(
        (p) => p._id !== currentUser._id
      );

      if (receiver) {
        socket.emit("sendMessage", {
          ...res.data,
          receiverId: receiver._id,
        });
      }

      onConversationUpdate?.();
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
    }
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex md:col-span-2 bg-white rounded-3xl shadow items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="md:col-span-2 bg-white rounded-none md:rounded-3xl shadow flex flex-col h-[calc(100vh-80px)] md:h-[85vh] overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-white">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden pl-3 text-2xl text-gray-700"
          >
            ←
          </button>
        )}

        <div className="flex-1 min-w-0">
          <ChatHeader
            conversation={conversation}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm sm:text-base text-center">
            Start a conversation 👋
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            currentUserId={currentUser?._id}
          />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}