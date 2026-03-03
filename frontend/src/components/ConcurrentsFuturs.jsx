import { useEffect, useState } from "react";
import { getConcurrentsFuturs } from "../services/api";
import { SkeletonChart } from "./Skeleton";
import { cachedFetch } from "../services/cache";


function ConcurrentsFuturs() {
  const [concurrents, setConcurrents] = useState([]);
  const [loading, setLoading] = useState(true);
  const NIVEAU_COLORS = {
  "Critique": { bg: "rgba(239,68,68,0.1)",  color: "#ef4444" },
  "Élevé":    { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  "Modéré":   { bg: "rgba(234,179,8,0.1)",  color: "#eab308" },
  "Faible":   { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};


useEffect(() => {
  cachedFetch("concurrents", () => getConcurrentsFuturs())
    .then(data => setConcurrents(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);


  if (loading) return <SkeletonChart />;


  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.15)",
      borderRadius: "12px", padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
      marginBottom: "1.5rem"
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
        color: "#7c3aed", letterSpacing: "0.2em",
        textTransform: "uppercase", marginBottom: "0.4rem"
      }}>── Stratégie Commerciale</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "0.5rem" }}>
        Concurrents Futurs — Score de Menace 2027
      </div>
      <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.5rem" }}>
        Classement basé sur la croissance et les dépôts prédits
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
            {["Rang", "Candidat", "2024", "2025", "2026", "Prédit 2027", "Croissance", "Menace"].map(h => (
              <th key={h} style={{
                padding: "0.6rem 0.8rem", textAlign: "left",
                color: "#64748b", fontFamily: "Space Mono, monospace",
                fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase"
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {concurrents.map((c, i) => (
            <tr key={i}
              style={{ borderBottom: "1px solid rgba(124,58,237,0.06)", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <td style={{ padding: "0.7rem 0.8rem" }}>
                <span style={{
                  background: i < 3 ? "rgba(124,58,237,0.12)" : "rgba(100,116,139,0.08)",
                  color: i < 3 ? "#7c3aed" : "#64748b",
                  padding: "0.15rem 0.5rem", borderRadius: "4px",
                  fontFamily: "Space Mono, monospace", fontSize: "0.75rem", fontWeight: 700
                }}>#{i + 1}</span>
              </td>
              <td style={{ padding: "0.7rem 0.8rem", color: "#1e293b", fontWeight: 600, maxWidth: "200px" }}>
                {c.candidat?.substring(0, 25)}
              </td>
              <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace", fontSize: "0.78rem" }}>
                {c.parAnnee[2024]}
              </td>
              <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace", fontSize: "0.78rem" }}>
                {c.parAnnee[2025]}
              </td>
              <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace", fontSize: "0.78rem" }}>
                {c.parAnnee[2026]}
              </td>
              <td style={{ padding: "0.7rem 0.8rem", color: "#7c3aed", fontFamily: "Space Mono, monospace", fontWeight: 700 }}>
                {c.pred2027}
              </td>
              <td style={{ padding: "0.7rem 0.8rem" }}>
                <span style={{
                  color: c.croissance >= 0 ? "#10b981" : "#ef4444",
                  fontFamily: "Space Mono, monospace", fontSize: "0.78rem", fontWeight: 700
                }}>
                  {c.croissance >= 0 ? "↑" : "↓"} {Math.abs(c.croissance)}%
                </span>
              </td>

              <td style={{ padding: "0.7rem 0.8rem", fontSize: "0.82rem" }}>
              <span style={{
  background: NIVEAU_COLORS[c.niveau]?.bg || "rgba(100,116,139,0.1)",
  color: NIVEAU_COLORS[c.niveau]?.color || "#64748b",
  padding: "0.2rem 0.6rem",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 700
}}>
  {c.niveau}
</span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConcurrentsFuturs;