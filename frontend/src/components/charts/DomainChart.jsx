import { useEffect, useState } from "react";
import { getJuridiction, getParDomaine } from "../../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SkeletonChart } from "../Skeleton";
import { cachedFetch } from "../../services/cache";


const COLORS = ["#7c3aed", "#a855f7", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#06b6d4", "#ef4444"];

function DomainChart() {
  const [juridictionData, setJuridictionData] = useState([]);
  const [domaineData, setDomaineData] = useState([]);
  const [mode, setMode] = useState("juridiction");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    cachedFetch("juridiction", () => getJuridiction()),   // ← plus de .then(res => res.data)
    cachedFetch("domaines", () => getParDomaine())        // ← plus de .then(res => res.data)
  ]).then(([j, d]) => {
    if (!j || !d) return;

    const grouped = {};
    j.forEach(item => {
      const jur = item._id.juridiction;
      grouped[jur] = (grouped[jur] || 0) + item.count;
    });
    const sorted = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const autres = sorted.slice(5).reduce((sum, x) => sum + x.value, 0);
    if (autres > 0) top5.push({ name: "Autres", value: autres });
    
    setJuridictionData(top5);
    setDomaineData(d);
  })
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
}, []);

  

  const data = mode === "juridiction" ? juridictionData : domaineData;

  if (loading) return <SkeletonChart />;


  return (
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
      }}>── Répartition</div>

      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>
          {mode === "juridiction" ? "Par Juridiction" : "Par Domaine Technologique"}
        </div>
        <div style={{ display: "flex", background: "rgba(124,58,237,0.08)", borderRadius: "8px", padding: "3px" }}>
          {[
            { key: "juridiction", label: "🌍 Juridiction" },
            { key: "domaine", label: "🔬 Domaine" }
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setMode(key)} style={{
              padding: "0.35rem 0.85rem", borderRadius: "6px",
              border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600,
              background: mode === key ? "white" : "transparent",
              color: mode === key ? "#7c3aed" : "#64748b",
              boxShadow: mode === key ? "0 2px 8px rgba(124,58,237,0.15)" : "none",
              transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name"
            cx="50%" cy="50%" outerRadius={110} innerRadius={50}
            label={({ name, percent }) => `${name.substring(0, 12)} ${(percent * 100).toFixed(1)}%`}
            labelLine={{ stroke: "rgba(124,58,237,0.3)" }}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{
            background: "#ffffff",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "8px", color: "#1e293b",
            boxShadow: "0 4px 15px rgba(124,58,237,0.1)"
          }} formatter={(value) => [value.toLocaleString(), "Brevets"]} />
          <Legend formatter={(value) => (
            <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{value}</span>
          )} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DomainChart;