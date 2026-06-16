export default function MessageBubble({ message, currentUserId }) {
  const isMine =
    message.sender?._id === currentUserId || message.sender === currentUserId;

  const isAI = message.sender === "ai";

  return (
    <div className={`flex mb-2 sm:mb-3 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-xl break-words ${
          isMine
            ? "bg-blue-600 text-white"
            : isAI
            ? "bg-purple-100 text-gray-900"
            : "bg-gray-200 text-black"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="message"
            className="rounded-xl mb-2 max-w-full sm:max-w-xs"
          />
        )}

        {message.text && (
          <p className="text-sm sm:text-base whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        <span
          className={`block text-[9px] sm:text-[10px] mt-1 text-right ${
            isMine ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
      </div>
    </div>
  );
}