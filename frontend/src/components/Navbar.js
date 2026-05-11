import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

export default function Navbar({ user, dark, setDark, onLogout }) {
  const location = useLocation();

  const links = [
    { path: "/home", label: "Home" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/insights", label: "Insights" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: ${dark ? "rgba(10,14,23,0.85)" : "rgba(240,244,255,0.85)"};
          backdrop-filter: blur(16px);
          border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"};
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .nav-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -1px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          text-decoration: none;
        }

        .nav-logo span { color: ${dark ? "#63ffb4" : "#0066ff"}; }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
        }

        .nav-link {
          position: relative;
          text-decoration: none;
          color: ${dark ? "#64748b" : "#94a3b8"};
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: color 0.2s;
        }

        .nav-link:hover { color: ${dark ? "#e2e8f0" : "#0f172a"}; }

        .nav-link.active {
          color: ${dark ? "#63ffb4" : "#0066ff"};
          background: ${dark ? "rgba(99,255,180,0.08)" : "rgba(0,102,255,0.08)"};
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid ${dark ? "#63ffb4" : "#0066ff"};
          object-fit: cover;
        }

        .nav-name {
          font-size: 13px;
          font-weight: 600;
          color: ${dark ? "#e2e8f0" : "#0f172a"};
        }

        .nav-icon-btn {
          background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          padding: 7px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .nav-icon-btn:hover {
          background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
        }
      `}</style>

      <nav className="navbar">
        <Link to="/home" className="nav-logo">stock<span>r</span></Link>

        <ul className="nav-links">
          {links.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {user?.picture && (
            <img
              src={user.picture}
              alt="avatar"
              className="nav-avatar"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="nav-name">{user?.name?.split(" ")[0]}</span>
          <button className="nav-icon-btn" onClick={() => setDark(!dark)}>
            {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
          <button className="nav-icon-btn" onClick={onLogout}>
            <FiLogOut size={15} />
          </button>
        </div>
      </nav>
    </>
  );
}