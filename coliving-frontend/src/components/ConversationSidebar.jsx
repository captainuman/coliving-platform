import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function ConversationSidebar() {

  const [conversations, setConversations] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {

    try {

      const res = await API.get(
        "/chat/conversations/all"
      );

      setConversations(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="bg-white rounded-3xl shadow-md p-4 h-full overflow-y-auto">

      <h2 className="text-2xl font-bold mb-4">
        Messages
      </h2>

      <div className="space-y-3">

        {conversations.map((chat, index) => (

          <div
            key={index}
            onClick={() =>
              navigate(
                `/chat/${chat.user._id}`
              )
            }
            className="border rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition"
          >

            <div className="flex items-center justify-between mb-1">

              <h3 className="font-bold text-lg">
                {chat.user.name}
              </h3>

              {chat.unreadCount > 0 && (

                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unreadCount}
                </span>

              )}

            </div>

            <p className="text-gray-600 text-sm truncate">
              {chat.lastMessage}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}