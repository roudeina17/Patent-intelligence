import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f2f5 0%, #ede9fe 50%, #f0f2f5 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "2rem"
    }}>
      <div style={{
        fontSize: "6rem", fontWeight: 800,
        fontFamily: "Space Mono, monospace",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
      }}>404</div>
      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>
        Page introuvable
      </div>
      <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "2rem" }}>
        Cette page n'existe pas ou a été déplacée.
      </div>
      <Link to="/" style={{
        padding: "0.75rem 2rem", borderRadius: "10px",
        textDecoration: "none", fontWeight: 700,
        color: "white",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        boxShadow: "0 8px 30px rgba(124,58,237,0.3)"
      }}>⚡ Retour à l'accueil</Link>
    </div>
  );
}

export default NotFound;