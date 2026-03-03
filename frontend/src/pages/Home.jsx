import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getKPIs } from "../services/api";

function Home() {
  const [kpis, setKpis] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getKPIs().then(res => setKpis(res.data));
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f2f5 0%, #ede9fe 50%, #f0f2f5 100%)",
      display: "flex", flexDirection: "column"
    }}>

      {/* Navbar */}
      <header style={{
        padding: "1.2rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(124,58,237,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "38px", height: "38px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", boxShadow: "0 4px 15px rgba(124,58,237,0.3)"
          }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1e293b" }}>
            Patent Intelligence
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/dashboard" style={{
            padding: "0.5rem 1.2rem", borderRadius: "8px",
            textDecoration: "none", fontSize: "0.85rem", fontWeight: 600,
            color: "#7c3aed", border: "1px solid rgba(124,58,237,0.3)",
            background: "rgba(124,58,237,0.05)", transition: "all 0.2s"
          }}>Dashboard</Link>
          <Link to="/prediction" style={{
            padding: "0.5rem 1.2rem", borderRadius: "8px",
            textDecoration: "none", fontSize: "0.85rem", fontWeight: 600,
            color: "white", background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 4px 15px rgba(124,58,237,0.3)", transition: "all 0.2s"
          }}>Prédiction</Link>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center" }}>
        
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease"
        }}>

          {/* Titre */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            color: "#1e293b",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em"
          }}>
            Analyse Intelligente<br />
            <span style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>des Brevets Mondiaux</span>
          </h1>

          {/* Sous-titre */}
          <p style={{
            fontSize: "1.1rem", color: "#64748b",
            maxWidth: "600px", margin: "0 auto 3rem",
            lineHeight: 1.7
          }}>
            Explorez, analysez et prédisez les tendances brevets mondiales.
            Données couvrant CN, US, EP, JP, KR sur 3 années.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
            <Link to="/dashboard" style={{
              padding: "0.85rem 2rem", borderRadius: "10px",
              textDecoration: "none", fontSize: "1rem", fontWeight: 700,
              color: "white",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 8px 30px rgba(124,58,237,0.35)",
              transition: "all 0.2s"
            }}>
              📊 Voir le Dashboard
            </Link>
            <Link to="/prediction" style={{
              padding: "0.85rem 2rem", borderRadius: "10px",
              textDecoration: "none", fontSize: "1rem", fontWeight: 700,
              color: "#7c3aed",
              background: "white",
              border: "2px solid rgba(124,58,237,0.2)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.1)",
              transition: "all 0.2s"
            }}>
              🔮 Analyse Prédictive
            </Link>
          </div>
        </div>

        {/* KPI Stats */}
        {kpis && (
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease 0.3s",
            display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center",
            marginBottom: "4rem"
          }}>
            {[
              { value: kpis.total?.toLocaleString(), label: "Brevets Total", icon: "📋" },
              { value: kpis.actifs?.toLocaleString(), label: "Brevets Actifs", icon: "✅" },
              { value: "5", label: "Juridictions", icon: "🌍" },
              { value: "3", label: "Années", icon: "📅" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: "12px", padding: "1.2rem 2rem",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
                minWidth: "140px"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{s.icon}</div>
                <div style={{
                  fontSize: "1.8rem", fontWeight: 800,
                  color: "#7c3aed", fontFamily: "Space Mono, monospace"
                }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        <div style={{
          opacity: visible ? 1 : 0,
          transition: "all 0.8s ease 0.5s",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
gap: "0.75rem", maxWidth: "700px", width: "100%"
        }}>
          {[
            { icon: "📊", title: "Dashboard Analytique", desc: "Visualisez KPIs, répartitions géographiques et top déposants en temps réel." },
            { icon: "🔮", title: "Analyse Prédictive", desc: "Détectez les tendances et comparez l'évolution des déposants sur 3 ans." },
            { icon: "🔍", title: "Recherche Avancée", desc: "Filtrez par candidat, juridiction et année parmi 100 000 brevets." },
            { icon: "🚨", title: "Alertes Concurrence", desc: "Identifiez les brevets à fort impact et les acteurs dominants par marché." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(124,58,237,0.12)",
              borderRadius: "12px", padding: "1.5rem",
              textAlign: "left",
              boxShadow: "0 4px 15px rgba(124,58,237,0.06)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(124,58,237,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(124,58,237,0.06)";
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>{f.title}</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "1.5rem 2.5rem",
        borderTop: "1px solid rgba(124,58,237,0.1)",
        background: "rgba(255,255,255,0.5)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "1rem"
      }}>
        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "Space Mono, monospace" }}>
          Patent Intelligence © 2026
        </span>
        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "Space Mono, monospace" }}>
          Source : The Lens · 100K brevets · CN · US · EP · JP · KR
        </span>
      </footer>
    </div>
  );
}

export default Home;