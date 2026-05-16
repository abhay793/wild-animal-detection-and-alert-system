import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ImageDetection from "./pages/ImageDetection";
import LiveDetection from "./pages/LiveDetection";
import VideoDetection from "./pages/VideoDetection";
import Settings from "./pages/Settings";
import SystemLogs from "./pages/SystemLogs";

interface NavLink {
  path: string;
  label: string;
}

function App(): JSX.Element {
  const location = useLocation();

  const navLinks: NavLink[] = [
    { path: "/", label: "Home" },
    { path: "/image-detection", label: "Image Detection" },
    { path: "/live-detection", label: "Live Detection" },
    { path: "/video-detection", label: "Video Detection" },
    { path: "/system-logs", label: "System Logs" },
    { path: "/admin", label: "Admin" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #1a2a3a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* NAVBAR */}
      <header
        style={{
          width: "100%",
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0.75rem 2rem", // Reduced vertical padding, kept horizontal
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          {/* TITLE - Left Side - Updated with better spacing */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Small clean gap between icon and text
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              }}
            >
              🐅
            </span>
            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                fontWeight: "700", // Made bold and crisp
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
                background: "linear-gradient(135deg, #ffffff 0%, #86efac 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              WILD EYE
            </h2>
          </div>

          {/* NAVIGATION - Right Side - Increased spacing between links */}
          <nav
            style={{
              display: "flex",
              gap: "1.5rem", // Increased from 0.5rem to 1.5rem (space-x-6 equivalent)
              alignItems: "center",
              flexWrap: "nowrap",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {navLinks.map((item: NavLink) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    color: isActive ? "#22c55e" : "#94a3b8",
                    padding: "0.375rem 0.75rem", // Increased padding for active state (px-3 py-1.5 equivalent)
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                    background: isActive ? "rgba(34, 197, 94, 0.1)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateY(0px)";
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT - UNCHANGED */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "3rem auto 2rem",
          padding: "0 2rem",
          boxSizing: "border-box",
        }}
      >
        {/* Hero Section Constraint Container for any page content */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-detection" element={<ImageDetection />} />
            <Route path="/live-detection" element={<LiveDetection />} />
            <Route path="/video-detection" element={<VideoDetection />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "4rem",
                    padding: "3rem",
                  }}
                >
                  <h1
                    style={{
                      color: "#ef4444",
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: "700",
                      marginBottom: "1rem",
                    }}
                  >
                    404
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      color: "#94a3b8",
                    }}
                  >
                    Page Not Found
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;