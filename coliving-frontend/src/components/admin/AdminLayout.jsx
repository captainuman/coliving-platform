import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Navbar";

import {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  CalendarCheck,
  Star,
  MessageSquare,
  Table,
  Menu,
  X,
} from "lucide-react";

const links = [
  { to: "/admin/analytics", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/analytics/users", label: "Users", icon: Users },
  { to: "/admin/analytics/properties", label: "Properties", icon: Building2 },
  { to: "/admin/analytics/rooms", label: "Rooms", icon: BedDouble },
  { to: "/admin/analytics/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/analytics/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/admin/analytics/tables", label: "Tables", icon: Table },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-black pb-10">
      <Navbar />

      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 left-0 z-40 w-64 shrink-0 border-r bg-background p-4 min-h-screen lg:min-h-[calc(100vh-64px)] transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">
                Analytics Dashboard
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin/analytics"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-6 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-sm"
          >
            <Menu size={20} />
            Menu
          </button>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;