import { useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import ConversationSidebar from "../components/chat/ConversationSidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Inbox() {
  const location = useLocation();

  const [selectedConversation, setSelectedConversation] =
    useState(location.state?.conversation || null);

  return (
    <div className="min-h-screen bg-gray-400 overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[85vh]">
          <ConversationSidebar
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />

          <ChatWindow conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
}
