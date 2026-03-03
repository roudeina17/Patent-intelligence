import { useEffect, useState } from "react";
import { getKPIs } from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SkeletonCard, SkeletonChart } from "../Skeleton";

const YEAR_COLORS = ["#7c3aed", "#a855f7", "#10b981"];

function YearChart() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await getKPIs();
        setKpis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !kpis) return (
    <div>
      <SkeletonCard />
      <div style={{ marginTop: "1.5rem" }}><SkeletonChart /></div>
    </div>
  );

  const cards = [
    {
      label: "Total Brevets", value: kpis.total?.toLocaleString(),
      color: "#7c3aed", icon: "📋",
      info: "Nombre total de brevets dans la base de données"
    },
    {
      label: "Avec Résumé", value: kpis.avecResume?.toLocaleString(),
      color: "#3b82f6", icon: "📝",
      info: "Brevets ayant un résumé/abstract disponible"
    },
    {
      label: "Sans Résumé", value: kpis.sansResume?.toLocaleString(),
      color: "#ef4444", icon: "⚠️",
      info: "Brevets sans résumé — données incomplètes dans la source"
    },
    {
      label: "Moy. Cites", value: kpis.moyenneCites,
      color: "#06b6d4", icon: "📎",
      info: "Nombre moyen de brevets cités par brevet — mesure l'ancrage technologique"
    },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.6rem",
        color: "#7c3aed",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: "1rem"
      }}>── KPIs Globaux</div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {cards.map((c, i) => (
          <div key={i}
            style={{
              background: `linear-gradient(135deg, ${c.color}12, ${c.color}06)`,
              border: `1px solid ${c.color}30`,
              borderRadius: "12px", padding: "1.2rem 1.5rem",
              flex: "1", minWidth: "140px",
              boxShadow: `0 4px 15px ${c.color}10`,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default", position: "relative"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 8px 25px ${c.color}20`;
              setHoveredCard(i);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 15px ${c.color}10`;
              setHoveredCard(null);
            }}
          >
            {/* Tooltip */}
            {hoveredCard === i && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                transform: "translateX(-50%)",
                background: "#1e293b", color: "white",
                padding: "0.5rem 0.75rem", borderRadius: "8px",
                fontSize: "0.72rem", lineHeight: 1.5,
                whiteSpace: "nowrap", zIndex: 50,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                pointerEvents: "none"
              }}>
                {c.info}
                <div style={{
                  position: "absolute", top: "100%", left: "50%",
                  transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid #1e293b"
                }} />
              </div>
            )}

            <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{c.icon}</div>
            <div style={{
              fontSize: "1.8rem", fontWeight: 800, color: c.color,
              fontFamily: "'Space Mono', monospace", letterSpacing: "-0.02em"
            }}>{c.value}</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem" }}>
              {c.label}
            </div>

            {/* Indicateur info */}
            <div style={{
              position: "absolute", top: "0.5rem", right: "0.5rem",
              width: "16px", height: "16px", borderRadius: "50%",
              background: `${c.color}20`, color: c.color,
              fontSize: "0.6rem", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>ℹ</div>
          </div>
        ))}
      </div>

      {/* Bar chart par année */}
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
        }}>── Évolution Temporelle</div>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.2rem", color: "#1e293b" }}>
          Distribution de l'échantillon par Année
          <p style={{
            fontSize: "0.7rem",
            color: "#94a3b8",
            fontFamily: "Space Mono, monospace",
            marginTop: "0.5rem",
            textAlign: "right"
          }}>
            * Échantillon extrait de The Lens (licence gratuite)
          </p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={kpis.parAnnee}
            margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
            <XAxis dataKey="_id"
              tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Space Mono" }}
              axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Space Mono" }}
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {kpis.parAnnee?.map((_, i) => (
                <Cell key={i} fill={YEAR_COLORS[i % YEAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default YearChart;