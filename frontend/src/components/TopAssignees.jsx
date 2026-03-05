import { useEffect, useState } from "react";
import { getTopCandidats } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SkeletonChart } from "./Skeleton";


const COLORS = [
  "#7c3aed","#8b5cf6","#a855f7","#9333ea","#6d28d9",
  "#10b981","#059669","#3b82f6","#2563eb","#f59e0b",
  "#d97706","#ec4899","#db2777","#06b6d4","#0891b2",
  "#ef4444","#dc2626","#84cc16","#65a30d","#f97316"
];

function TopAssignees() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  getTopCandidats()
    .then(data => setData(data.map(d => ({  // ← plus de res.data
      name: d._id?.substring(0, 22),
      count: d.count
    }))))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

 if (loading) return <SkeletonChart />;

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.15)",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(124,58,237,0.08)"
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.6rem",
        color: "#7c3aed",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: "0.4rem"
      }}>── Classement Déposants</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.2rem", color: "#1e293b" }}>
        Top 10 Candidats
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} layout="vertical"
          margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number"
            tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Space Mono" }}
            axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={160}
           tick={{ fill: "#64748b", fontSize: 9 }}
           axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{
            background: "#ffffff",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "8px",
            color: "#1e293b",
            fontSize: "0.8rem",
            boxShadow: "0 4px 15px rgba(124,58,237,0.1)"
          }}
            cursor={{ fill: "rgba(124,58,237,0.04)" }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopAssignees;