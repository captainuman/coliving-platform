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
    <div className="min-h-screen bg-gray-400 overflow-hidden pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="h-[calc(100vh-80px)] md:h-[85vh] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`${
              selectedConversation ? "hidden md:block" : "block"
            } md:col-span-1 h-full overflow-hidden`}
          >
            <ConversationSidebar
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          </div>

          <div
            className={`${
              selectedConversation ? "block" : "hidden md:block"
            } md:col-span-2 h-full overflow-hidden`}
          >
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
