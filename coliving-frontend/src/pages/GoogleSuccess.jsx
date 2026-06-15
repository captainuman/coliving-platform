import { useEffect } from "react";

export default function GoogleSuccess() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(
        window.location.search
      );

      const token = params.get("token");
      const user = params.get("user");

      if (!token || !user) {
        window.location.replace("/login");
        return;
      }

      const parsedUser = JSON.parse(
        decodeURIComponent(user)
      );

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(parsedUser)
      );

      switch (parsedUser.role) {
        case "admin":
          window.location.replace("/admin/analytics");
          break;

        case "owner":
          window.location.replace("/owner/dashboard");
          break;

        default:
          window.location.replace("/properties");
      }
    } catch (err) {
      console.error("Google login error:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 py-5 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold">
          Signing you in...
        </h2>
      </div>
    </div>
  );
} 
