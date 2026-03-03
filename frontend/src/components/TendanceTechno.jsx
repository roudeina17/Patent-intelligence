import { useEffect, useState } from "react";
import { getTendanceTechno } from "../services/api";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonChart } from "./Skeleton";
import { cachedFetch } from "../services/cache";



function TendanceTechno() {
  const [techno, setTechno] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  cachedFetch("tendance-techno", () => getTendanceTechno())
    .then(data => setTechno(data))
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
      }}>── Prédiction R&D</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "0.5rem" }}>
        Tendances Technologiques 2027
      </div>
      <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.5rem" }}>
        Domaines recommandés pour investissement R&D basé sur la trajectoire des dépôts
      </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Bar chart */}
                <ResponsiveContainer width="100%" height={250}>
            <BarChart data={techno} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
            <XAxis dataKey="domaine"
                tickFormatter={(v) => v.split(" ")[0]} // ← juste le premier mot
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Space Mono" }}
                axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{
                background: "#fff", border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: "8px", fontSize: "0.8rem"
            }} formatter={(v) => [v, "Brevets prédits 2027"]} />
            <Bar dataKey="pred2027" radius={[6, 6, 0, 0]}>
                {techno.map((d, i) => (
                <Cell key={i} fill={d.tendance === "croissance" ? "#7c3aed" : "#ef444460"} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
    {techno.map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.7rem 1rem",
              background: d.tendance === "croissance" ? "rgba(124,58,237,0.05)" : "rgba(239,68,68,0.04)",
              border: `1px solid ${d.tendance === "croissance" ? "rgba(124,58,237,0.15)" : "rgba(239,68,68,0.15)"}`,
              borderRadius: "8px"
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#1e293b" }}>{d.domaine}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "Space Mono, monospace" }}>
                  2024: {d.parAnnee[2024]} → 2026: {d.parAnnee[2026]}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1rem",
                  color: d.tendance === "croissance" ? "#7c3aed" : "#ef4444"
                }}>{d.pred2027}</div>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600,
                  color: d.tendance === "croissance" ? "#10b981" : "#ef4444"
                }}>
                  {d.tendance === "croissance" ? "↑" : "↓"} {Math.abs(d.croissance)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TendanceTechno;