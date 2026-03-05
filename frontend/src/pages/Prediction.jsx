import { useEffect, useState } from "react";
import { getTendance, getTopParJuridiction } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import Navbar from "../components/Navbar";
import TendanceTechno from "../components/TendanceTechno";
import ConcurrentsFuturs from "../components/ConcurrentsFuturs";
import ZonesStrategiques from "../components/ZonesStrategiques";

const COLORS = ["#7c3aed","#10b981","#f59e0b","#3b82f6","#ec4899",
                "#06b6d4","#ef4444","#a855f7","#84cc16","#f97316",
                "#0891b2","#d97706","#be185d","#065f46","#1d4ed8"];

function regressionLineaire(points) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - a * sumX) / n;
  return (x) => Math.max(0, Math.round(a * x + b));
}

const TABS = [
  { key: "tendances",   label: "📈 Tendances",   desc: "Évolution des dépôts" },
  { key: "regression",  label: "📉 Régression",  desc: "Prédiction 2027" },
  { key: "techno",      label: "🔬 Technologie", desc: "Tendances R&D" },
  { key: "concurrents", label: "⚔️ Concurrents",  desc: "Score de menace" },
  { key: "geo",         label: "🌍 Géographie",  desc: "Zones stratégiques" },
];

function Prediction() {
  const [activeTab, setActiveTab] = useState("tendances");
  const [tendance, setTendance] = useState([]);
  const [, setJuridiction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

useEffect(() => {
  Promise.all([getTendance(), getTopParJuridiction()])
    .then(([t, j]) => {
      const tendanceData = t || [];        // ← plus de t?.data
      const juridictionData = j || [];     // ← plus de j?.data
      
      setTendance(tendanceData);
      setJuridiction(juridictionData);
      setSelected(tendanceData.slice(0, 5).map(d => d._id));
    })
    .catch(err => console.error("Erreur Prediction:", err))
    .finally(() => setLoading(false));
}, []);

  const lineData = [2024, 2025, 2026, 2027].map(annee => {
    const row = { annee };
    tendance.forEach(d => {
      if (selected.includes(d._id)) {
        if (annee <= 2026) {
          const a = d.annees.find(x => x.annee === annee);
          row[d._id?.substring(0, 18)] = a ? a.count : 0;
        } else {
          const points = d.annees.filter(x => x.annee >= 2024).map(x => ({ x: x.annee, y: x.count }));
          if (points.length >= 2) {
            row[`${d._id?.substring(0, 18)}_pred`] = regressionLineaire(points)(2027);
          }
        }
      }
    });
    return row;
  });

  const getTrend = (candidat) => {
    const a2024 = candidat.annees.find(a => a.annee === 2024)?.count || 0;
    const a2026 = candidat.annees.find(a => a.annee === 2026)?.count || 0;
    if (a2024 === 0) return null;
    return (((a2026 - a2024) / a2024) * 100).toFixed(0);
  };

if (loading) return (
  <div style={{ 
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f2f5 0%, #ede9fe 50%, #f0f2f5 100%)"
  }}>
    <Navbar />
    <div style={{ padding: "2rem", color: "#7c3aed", fontFamily: "Space Mono, monospace" }}>
      ⟳ Analyse en cours...
    </div>
  </div>
);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f2f5 0%, #ede9fe 50%, #f0f2f5 100%)"
    }}>
      <Navbar />

      <main style={{ padding: "2rem 2.5rem", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Tabs navigation */}
        <div style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: "12px", padding: "0.5rem",
            boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
            marginBottom: "1.5rem",
            display: "flex", gap: "0.3rem",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none"
          }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: "1", minWidth: "120px",
              padding: "0.75rem 1rem",
              borderRadius: "8px", border: "none",
              cursor: "pointer", transition: "all 0.2s",
              background: activeTab === tab.key ? "rgba(124,58,237,0.1)" : "transparent",
              color: activeTab === tab.key ? "#7c3aed" : "#64748b",
              fontFamily: "Syne, sans-serif", fontWeight: 600,
              fontSize: "0.85rem",
              borderBottom: activeTab === tab.key ? "2px solid #7c3aed" : "2px solid transparent"
            }}>
              <div>{tab.label}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7, marginTop: "0.1rem" }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Tab content */}

        {/* TENDANCES */}
        {activeTab === "tendances" && (
          <div className="tab-content">
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
              }}>── Analyse Prédictive</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "0.5rem" }}>
                Évolution des Dépôts (2024 → 2026)
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.2rem" }}>
                Sélectionne les candidats à comparer :
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {tendance.map((d, i) => (
                  <button key={d._id} onClick={() => {
                    setSelected(prev =>
                      prev.includes(d._id) ? prev.filter(x => x !== d._id) : [...prev, d._id]
                    );
                  }} style={{
                    padding: "0.35rem 0.8rem", borderRadius: "20px",
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${selected.includes(d._id) ? COLORS[i] : "rgba(124,58,237,0.2)"}`,
                    background: selected.includes(d._id) ? `${COLORS[i]}18` : "transparent",
                    color: selected.includes(d._id) ? COLORS[i] : "#64748b",
                    transition: "all 0.2s"
                  }}>
                    {d._id?.substring(0, 22)}
                  </button>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData.filter(d => d.annee <= 2026)}
                  margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                  <XAxis dataKey="annee"
                    tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Space Mono" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{
                    background: "#fff", border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: "8px", fontSize: "0.8rem"
                  }} />
                  <Legend formatter={v => <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{v}</span>} />
                  {selected.map((id) => (
                    <Line key={id} type="monotone"
                      dataKey={id?.substring(0, 18)}
                      stroke={COLORS[tendance.findIndex(d => d._id === id) % COLORS.length]}
                      strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tableau scores */}
            <div style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.15)",
              borderRadius: "12px", padding: "1.5rem",
              boxShadow: "0 4px 20px rgba(124,58,237,0.08)"
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
                color: "#7c3aed", letterSpacing: "0.2em",
                textTransform: "uppercase", marginBottom: "0.4rem"
              }}>── Indicateurs</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "1.2rem" }}>
                Score d'Activité & Tendance 2024 → 2026
              </div>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
                    {["Rang", "Candidat", "2024", "2025", "2026", "Total", "Tendance"].map(h => (
                      <th key={h} style={{
                        padding: "0.6rem 0.8rem", textAlign: "left",
                        color: "#64748b", fontFamily: "Space Mono, monospace",
                        fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tendance.map((d, i) => {
                    const trend = getTrend(d);
                    const a2024 = d.annees.find(a => a.annee === 2024)?.count || 0;
                    const a2025 = d.annees.find(a => a.annee === 2025)?.count || 0;
                    const a2026 = d.annees.find(a => a.annee === 2026)?.count || 0;
                    return (
                      <tr key={d._id}
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
                        <td style={{ padding: "0.7rem 0.8rem", color: "#1e293b", fontWeight: 600 }}>
                          {d._id?.substring(0, 30)}
                        </td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace" }}>{a2024}</td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace" }}>{a2025}</td>
                        <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontFamily: "Space Mono, monospace" }}>{a2026}</td>
                        <td style={{ padding: "0.7rem 0.8rem", fontFamily: "Space Mono, monospace", fontWeight: 700, color: "#7c3aed" }}>
                          {d.total}
                        </td>
                        <td style={{ padding: "0.7rem 0.8rem" }}>
                          {trend !== null ? (
                            <span style={{
                              background: trend > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                              color: trend > 0 ? "#10b981" : "#ef4444",
                              padding: "0.2rem 0.6rem", borderRadius: "20px",
                              fontSize: "0.75rem", fontFamily: "Space Mono, monospace", fontWeight: 700
                            }}>
                              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                            </span>
                          ) : <span style={{ color: "#94a3b8" }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
               </div>
            </div>
          </div>
        )}

        {/* REGRESSION */}
        {activeTab === "regression" && (
          <div className="tab-content" style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: "12px", padding: "1.5rem",
            boxShadow: "0 4px 20px rgba(124,58,237,0.08)"
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
              color: "#7c3aed", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: "0.4rem"
            }}>── Régression Linéaire</div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "0.5rem" }}>
              Prédiction des Dépôts 2027
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.5rem" }}>
              Basée sur la tendance 2024 → 2025 → 2026 pour les top 6 candidats
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineData} margin={{ left: 10, right: 30, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="annee"
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Space Mono" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{
                  background: "#fff", border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: "8px", fontSize: "0.8rem"
                }} />
                <Legend formatter={v => (
                  <span style={{ color: "#64748b", fontSize: "0.72rem" }}>
                    {v.replace("_pred", " (prédit)")}
                  </span>
                )} />
                {tendance.slice(0, 6).map((d, i) => (
                  <Line key={d._id} type="monotone"
                    dataKey={d._id?.substring(0, 18)}
                    stroke={COLORS[i]} strokeWidth={2.5}
                    dot={{ r: 4 }} connectNulls={false} />
                ))}
                {tendance.slice(0, 6).map((d, i) => (
                  <Line key={`${d._id}_pred`} type="monotone"
                    dataKey={`${d._id?.substring(0, 18)}_pred`}
                    stroke={COLORS[i]} strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 6, fill: "white", strokeWidth: 2 }}
                    connectNulls={true} />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Cards prédictions */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{
                fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
                color: "#7c3aed", letterSpacing: "0.15em",
                textTransform: "uppercase", marginBottom: "0.75rem"
              }}>Valeurs prédites pour 2027</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {tendance.slice(0, 6).map((d, i) => {
                  const points = d.annees.filter(x => x.annee >= 2024).map(x => ({ x: x.annee, y: x.count }));
                  const pred = points.length >= 2 ? regressionLineaire(points)(2027) : null;
                  const a2026 = d.annees.find(a => a.annee === 2026)?.count || 0;
                  const diff = pred - a2026;
                  return pred ? (
                    <div key={d._id} style={{
                      background: `linear-gradient(135deg, ${COLORS[i]}10, ${COLORS[i]}05)`,
                      border: `1px solid ${COLORS[i]}25`,
                      borderRadius: "10px", padding: "0.9rem 1.2rem",
                      minWidth: "160px", flex: "1"
                    }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.3rem" }}>
                        {d._id?.substring(0, 22)}
                      </div>
                      <div style={{
                        fontSize: "1.6rem", fontWeight: 800,
                        color: COLORS[i], fontFamily: "Space Mono, monospace"
                      }}>{pred?.toLocaleString()}</div>
                      <span style={{
                        fontSize: "0.72rem", fontFamily: "Space Mono, monospace",
                        color: diff >= 0 ? "#10b981" : "#ef4444",
                        background: diff >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        padding: "0.1rem 0.4rem", borderRadius: "4px"
                      }}>
                        {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)} vs 2026
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* TECHNOLOGIE */}
        {activeTab === "techno" &&   <div className="tab-content">
    <TendanceTechno />
  </div>}

        {/* CONCURRENTS */}
        {activeTab === "concurrents" &&   <div className="tab-content">
    <ConcurrentsFuturs />
  </div>}

        {/* GEOGRAPHIE */}
        {activeTab === "geo" &&   <div className="tab-content">
    <ZonesStrategiques />
  </div>}

      </main>
      {/* Footer */}
<footer style={{
  padding: "1.5rem 2.5rem",
  borderTop: "1px solid rgba(124,58,237,0.1)",
  background: "rgba(255,255,255,0.5)",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  flexWrap: "wrap", gap: "1rem",
  marginTop: "2rem"
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

export default Prediction;