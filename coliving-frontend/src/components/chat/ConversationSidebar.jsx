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

        if (selected) {
          setSelectedConversation(selected);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = conversation.participants?.find(
      (p) => p._id !== currentUser?._id,
    );

    const name = otherUser?.name?.toLowerCase() || "";

    const email = otherUser?.email?.toLowerCase() || "";

    const lastMessage = conversation.lastMessage?.toLowerCase() || "";

    const keyword = search.toLowerCase();

    return (
      name.includes(keyword) ||
      email.includes(keyword) ||
      lastMessage.includes(keyword)
    );
  });

  return (
    <div className="bg-white text-black rounded-3xl shadow overflow-hidden h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-3">Messages</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people or chats..."
          className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!search && (
        <div
          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              🤖
            </div>

            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-gray-500">Ask anything</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 && (
          <div className="p-6 text-center text-gray-400">No chats found</div>
        )}

        {filteredConversations.map((conversation) => {
          const otherUser = conversation.participants?.find(
            (p) => p._id !== currentUser?._id,
          );

          return (
            <div
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-green-900 transition ${
                selectedConversation?._id === conversation._id
                  ? "bg-gray-800"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {otherUser?.profilePic ? (
                    <img
                      src={
                        otherUser?.profilePic
                          ? otherUser.profilePic.startsWith("http")
                            ? otherUser.profilePic
                            : `${BACKEND_URL}${otherUser.profilePic}`
                          : "/default-user.png"
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
                    <h3 className="font-semibold truncate">
                      {otherUser?.name || "Unknown User"}
                    </h3>

                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 truncate">
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
