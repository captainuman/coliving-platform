import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-white shadow transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Dashboard</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar links */}
        <nav className="p-4 space-y-3">
          <p>Overview</p>
          <p>Bookings</p>
          <p>Rooms</p>
          <p>Analytics</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        {/* Top bar */}
        <div className="bg-white shadow p-4 flex items-center gap-3">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={26} />
            </button>
          )}

          <h1 className="font-bold text-lg">Analytics</h1>
        </div>

        <div className="p-3 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}