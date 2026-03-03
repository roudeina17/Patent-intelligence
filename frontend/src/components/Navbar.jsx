import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";


function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
useEffect(() => {
  const titles = {
    "/": "Accueil — Patent Intelligence",
    "/dashboard": "Dashboard — Patent Intelligence",
    "/prediction": "Prédiction — Patent Intelligence"
  };
  document.title = titles[location.pathname] || "Patent Intelligence";
}, [location.pathname]);
  return (
    <header style={{
      borderBottom: "1px solid rgba(124,58,237,0.15)",
      padding: "1rem 2.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 20px rgba(124,58,237,0.08)"
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "38px", height: "38px",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: "0 4px 15px rgba(124,58,237,0.25)",
          transition: "transform 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "rotate(-10deg) scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "rotate(0) scale(1)"}
        >⚡</div>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
            color: "#7c3aed", letterSpacing: "0.2em", textTransform: "uppercase"
          }}>Patent Intelligence</div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
            {location.pathname === "/" ? "Accueil" :
             location.pathname === "/dashboard" ? "Dashboard Brevets" : "Analyse Prédictive"}
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <nav style={{ 
  display: "flex", gap: "0.4rem", alignItems: "center",
  flexWrap: "wrap"  // ← permet le retour à la ligne sur mobile
}}>
  {[
    { to: "/", label: "Accueil" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/prediction", label: "Prédiction" },
  ].map(({ to, label }) => (
    <Link key={to} to={to} style={{
      padding: "0.4rem 0.7rem",
      borderRadius: "8px",
      textDecoration: "none",
      fontSize: "0.75rem",  // ← réduit sur mobile
      fontWeight: 600,
      background: isActive(to) ? "rgba(124,58,237,0.1)" : "transparent",
      color: isActive(to) ? "#7c3aed" : "#64748b",
      border: `1px solid ${isActive(to) ? "rgba(124,58,237,0.3)" : "transparent"}`,
      transition: "all 0.2s",
      whiteSpace: "nowrap"  // ← empêche le texte de se couper
    }}
      onMouseEnter={e => {
        if (!isActive(to)) e.currentTarget.style.background = "rgba(124,58,237,0.05)";
      }}
      onMouseLeave={e => {
        if (!isActive(to)) e.currentTarget.style.background = "transparent";
      }}
    >{label}</Link>
  ))}
</nav>
    </header>
  );
}

export default Navbar;