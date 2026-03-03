import { useEffect, useState } from "react";
import { getZonesStrategiques } from "../services/api";
import { SkeletonChart } from "./Skeleton";
import { cachedFetch } from "../services/cache";


const STRAT_COLORS = {
  "Marché Clé":     "#7c3aed",   // ← sans emoji
  "Marché Porteur": "#10b981",
  "À Surveiller":   "#f59e0b",
  "Émergent":       "#3b82f6"
};

function ZonesStrategiques() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  cachedFetch("zones", () => getZonesStrategiques())
    .then(data => setZones(data))
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
      }}>── Géostratégie</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "0.5rem" }}>
        Zones Géographiques Stratégiques 2027
      </div>
      <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.5rem" }}>
        Marchés prioritaires basés sur la trajectoire des dépôts de brevets
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {zones.map((z, i) => {
          const color = STRAT_COLORS[z.strategie] || "#94a3b8";
          return (
            <div key={i} style={{
              background: `linear-gradient(135deg, ${color}10, ${color}05)`,
              border: `1px solid ${color}25`,
              borderRadius: "12px", padding: "1.2rem",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 25px ${color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div style={{
                  fontFamily: "Space Mono, monospace", fontWeight: 700,
                  fontSize: "1.5rem", color
                }}>{z.juridiction}</div>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 600,
                  background: `${color}15`, color,
                  padding: "0.2rem 0.5rem", borderRadius: "4px"
                }}>{z.strategie}</span>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                {[2024, 2025, 2026].map(a => (
                  <div key={a} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "Space Mono, monospace" }}>{a}</span>
                    <span style={{ fontSize: "0.72rem", color: "#1e293b", fontFamily: "Space Mono, monospace", fontWeight: 600 }}>
                      {z.parAnnee[a] || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${color}20`, paddingTop: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Prédit 2027</div>
                <div style={{
                  fontSize: "1.4rem", fontWeight: 800,
                  color, fontFamily: "Space Mono, monospace"
                }}>{z.pred2027?.toLocaleString()}</div>
                {z.croissance !== null && (
                  <div style={{
                    fontSize: "0.72rem", fontWeight: 600,
                    color: z.croissance >= 0 ? "#10b981" : "#ef4444"
                  }}>
                    {z.croissance >= 0 ? "↑" : "↓"} {Math.abs(z.croissance)}% vs 2024
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ZonesStrategiques;