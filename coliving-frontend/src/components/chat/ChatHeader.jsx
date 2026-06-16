export default function ChatHeader({ conversation, currentUser, onlineUsers }) {
  const isAI = conversation?._id === "ai";

  const otherUser = conversation?.participants?.find(
    (p) => p._id !== currentUser?._id
  );

  const isOnline = onlineUsers?.includes(otherUser?._id);

  return (
    <div className="border-b px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative shrink-0">
          {isAI ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg sm:text-xl">
              🤖
            </div>
          ) : otherUser?.profilePic ? (
            <img
              src={
                otherUser.profilePic.startsWith("/uploads")
                  ? `https://coliving-backend.onrender.com${otherUser.profilePic}`
                  : otherUser.profilePic
              }
              alt={otherUser.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg sm:text-xl">
              👤
            </div>
          )}

          {!isAI && isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-base sm:text-lg truncate">
            {isAI ? "AI Assistant" : otherUser?.name || "Unknown User"}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500">
            {isAI ? "Always available" : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}