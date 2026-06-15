import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaBuilding,
  FaChartLine,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const desktopNavItem =
    "relative flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group whitespace-nowrap";

  const mobileNavItem =
    "relative flex flex-col items-center justify-center min-w-[58px] text-gray-400 hover:text-white transition-all duration-300 group";

  const desktopGlow =
    "absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee,0_0_22px_#22d3ee] opacity-0 group-hover:opacity-100 transition-all duration-300";

  const mobileGlow =
    "absolute -bottom-3 w-7 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee,0_0_22px_#22d3ee] opacity-0 group-hover:opacity-100 transition-all duration-300";

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex items-center justify-center bg-black py-4 px-10">
        <div className="w-full max-w-6xl bg-[#181818] rounded-full px-10 py-3 flex items-center justify-between gap-8 border border-[#2a2a2a] shadow-[inset_0_-18px_30px_rgba(0,0,0,0.6),0_12px_35px_rgba(0,0,0,0.7)]">

          {/* LOGO */}
          <Link
            to="/properties"
            className="flex flex-col leading-none shrink-0"
          >
            <span className="text-[10px] tracking-[0.5em] text-gray-500 font-bold text-center">
              THE
            </span>
            <span className="text-3xl font-black tracking-widest shiny-text">
              STARKS
            </span>
          </Link>

          {/* LINKS */}
          <div className="flex items-center gap-10 flex-nowrap">

            <Link to="/properties" className={desktopNavItem}>
              <FaHome size={18} />
              <span className="text-xs font-bold tracking-wider">
                HOME
              </span>
              <span className={desktopGlow}></span>
            </Link>

            {user?.role === "tenant" && (
              <Link
                to="/booking-history"
                className={desktopNavItem}
              >
                <FaCalendarAlt size={18} />
                <span className="text-xs font-bold tracking-wider">
                  BOOKINGS
                </span>
                <span className={desktopGlow}></span>
              </Link>
            )}

            {user?.role === "owner" && (
              <>
                <Link
                  to="/owner/dashboard"
                  className={desktopNavItem}
                >
                  <FaChartLine size={18} />
                  <span className="text-xs font-bold tracking-wider">
                    DASHBOARD
                  </span>
                  <span className={desktopGlow}></span>
                </Link>

                <Link
                  to="/owner-dashboard"
                  className={desktopNavItem}
                >
                  <FaBuilding size={18} />
                  <span className="text-xs font-bold tracking-wider">
                    PROPERTY
                  </span>
                  <span className={desktopGlow}></span>
                </Link>
              </>
            )}

            {user?.role === "admin" && (
             <>
               <Link
                to="/admin/analytics"
                className={desktopNavItem}
              >
                <FaShieldAlt size={18} />
                <span className="text-xs font-bold tracking-wider">
                  ADMIN
                </span>
                <span className={desktopGlow}></span>
              </Link>


                <Link
                to="/admin/roomrequests "
                className={desktopNavItem}
                >    
                <FaShieldAlt size={18} /> 
                <span className="text-xs font-bold tracking-wider">
                  Booking-Request 
                </span>
                <span className={desktopGlow}></span>
              </Link>
             </>
              
            )}

            {user?.role !== "admin" && (
              <Link to="/inbox" className={desktopNavItem}>
                <FaEnvelope size={18} />
                <span className="text-xs font-bold tracking-wider">
                  MESSAGES
                </span>
                <span className={desktopGlow}></span>
              </Link>
            )}

            <Link to="/profile" className={desktopNavItem}>
              <FaUser size={18} />
              <span className="text-xs font-bold tracking-wider">
                PROFILE
              </span>
              <span className={desktopGlow}></span>
            </Link>

            <button
              onClick={handleLogout}
              className={desktopNavItem}
            >
              <FaSignOutAlt size={18} />
              <span className="text-xs font-bold tracking-wider">
                LOGOUT
              </span>
              <span className={desktopGlow}></span>
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-black py-2 border-b border-gray-900">
        <Link
          to="/properties"
          className="flex flex-col items-center leading-none"
        >
          <span className="text-[10px] tracking-[0.5em] text-gray-500 font-bold">
            THE
          </span>
          <span className="text-3xl font-black tracking-widest shiny-text">
            STARKS
          </span>
        </Link>
      </header>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#181818] border-t border-[#2a2a2a]">
        <div className="flex justify-around items-center py-3">

          <Link to="/properties" className={mobileNavItem}>
            <FaHome size={18} />
            <span className="text-[9px] mt-1">HOME</span>
            <span className={mobileGlow}></span>
          </Link>

          {user?.role === "tenant" && (
            <Link
              to="/booking-history"
              className={mobileNavItem}
            >
              <FaCalendarAlt size={18} />
              <span className="text-[9px] mt-1">
                BOOKINGS
              </span>
              <span className={mobileGlow}></span>
            </Link>
          )}

          {user?.role === "owner" && (
            <>
              <Link
                to="/owner/dashboard"
                className={mobileNavItem}
              >
                <FaChartLine size={18} />
                <span className="text-[9px] mt-1">
                  DASHBOARD
                </span>
                <span className={mobileGlow}></span>
              </Link>

              <Link
                to="/owner-dashboard"
                className={mobileNavItem}
              >
                <FaBuilding size={18} />
                <span className="text-[9px] mt-1">
                  PROPERTY
                </span>
                <span className={mobileGlow}></span>
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/analytics"
              className={mobileNavItem}
            >
              <FaShieldAlt size={18} />
              <span className="text-[9px] mt-1">
                ADMIN
              </span>
              <span className={mobileGlow}></span>
            </Link>
          )}

          {user?.role !== "admin" && (
            <Link to="/inbox" className={mobileNavItem}>
              <FaEnvelope size={18} />
              <span className="text-[9px] mt-1">
                CHAT
              </span>
              <span className={mobileGlow}></span>
            </Link>
          )}

          <Link to="/profile" className={mobileNavItem}>
            <FaUser size={18} />
            <span className="text-[9px] mt-1">
              PROFILE
            </span>
            <span className={mobileGlow}></span>
          </Link>

          <button
            onClick={handleLogout}
            className={mobileNavItem}
          >
            <FaSignOutAlt size={18} />
            <span className="text-[9px] mt-1">
              LOGOUT
            </span>
            <span className={mobileGlow}></span>
          </button>

        </div>
      </nav>
    </>
  );
}