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
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-black">
      
      {/* Main App Navbar */}
      <Navbar />

      <div className="flex">
        
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r bg-background p-4 min-h-[calc(100vh-64px)]">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">
              Analytics Dashboard
            </p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin/analytics"}
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;