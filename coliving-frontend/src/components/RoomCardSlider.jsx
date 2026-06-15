import { useState } from "react";

export default function RoomCardSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return "/default-room.jpg";

    if (img.startsWith("http")) return img;

    if (img.startsWith("/uploads")) {
      return `${BACKEND_URL}${img}`;
    }

    return `${BACKEND_URL}/uploads/rooms/${img}`;
  };

  const next = () => {
    setIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (!images.length) {
    return (
      <div className="h-full bg-gray-200 flex items-center justify-center">
        No Image
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <img
        src={getImageUrl(images[index])}
        alt="room"
        className="w-full h-full object-cover transition-all duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-full"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-full"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}