import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ConversationSidebar({
  selectedConversation,
  setSelectedConversation,
  conversationId,
}) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://coliving-backend.onrender.com";

  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/conversations");
      setConversations(res.data);

      if (conversationId) {
        const selected = res.data.find((c) => c._id === conversationId);
        if (selected) setSelectedConversation(selected);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = conversation.participants?.find(
      (p) => p._id !== currentUser?._id
    );

    const keyword = search.toLowerCase();

    return (
      otherUser?.name?.toLowerCase().includes(keyword) ||
      otherUser?.email?.toLowerCase().includes(keyword) ||
      conversation.lastMessage?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="bg-white text-black rounded-none md:rounded-3xl shadow overflow-hidden h-[calc(100vh-80px)] md:h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b shrink-0">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Messages</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people or chats..."
          className="w-full border rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!search && (
        <div
          className={`p-3 sm:p-4 border-b cursor-pointer hover:bg-gray-50 shrink-0 ${
            selectedConversation?._id === "ai" ? "bg-blue-50" : ""
          }`}
          onClick={() =>
            setSelectedConversation({
              _id: "ai",
              name: "AI Assistant",
            })
          }
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              🤖
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                AI Assistant
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Ask anything
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 && (
          <div className="p-6 text-center text-gray-400 text-sm">
            No chats found
          </div>
        )}

        {filteredConversations.map((conversation) => {
          const otherUser = conversation.participants?.find(
            (p) => p._id !== currentUser?._id
          );

          return (
            <div
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-3 sm:p-4 border-b cursor-pointer transition ${
                selectedConversation?._id === conversation._id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {otherUser?.profilePic ? (
                    <img
                      src={
                        otherUser.profilePic.startsWith("http")
                          ? otherUser.profilePic
                          : `${BACKEND_URL}${otherUser.profilePic}`
                      }
                      alt={otherUser?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {otherUser?.name || "Unknown User"}
                    </h3>

                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {conversation.lastMessage || "Start chatting"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}