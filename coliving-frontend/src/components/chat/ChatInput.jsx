import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">

        <button
          type="button"
          className="text-2xl"
        >
          😊
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
        >
          Send
        </button>

      </div>
    </div>
  );
}
