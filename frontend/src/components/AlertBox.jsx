import { useEffect, useState } from "react";
import { getImpactParDomaine } from "../services/api";
import { SkeletonChart } from "./Skeleton";
import { cachedFetch } from "../services/cache";


const DOMAINE_COLORS = {
  "Mécanique & Industrie": "#7c3aed",
  "Intelligence Artificielle": "#10b981",
  "Affichage & Optique": "#3b82f6",
  "Télécoms & 5G": "#f59e0b",
  "Semi-conducteurs": "#ec4899",
  "Énergie & Batteries": "#06b6d4",
  "Médical & Biotech": "#ef4444",
  "Autres": "#94a3b8"
};

const PAR_PAGE = 10;

function AlertBox() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Tous");
  const [page, setPage] = useState(1);

 useEffect(() => {
  getImpactParDomaine()
    .then(data => setData(data))  // ← plus de .data
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

  // Reset page quand filtre change

  if (loading) return <SkeletonChart />;


  const domaines = ["Tous", ...Object.keys(data.parDomaine)];

  const listeComplete = filtre === "Tous"
    ? data.liste
    : (data.parDomaine[filtre] || [])
        .sort((a, b) => parseFloat(b.impactScore) - parseFloat(a.impactScore));

  const totalPages = Math.ceil(listeComplete.length / PAR_PAGE);
  const brevets = listeComplete.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(239,68,68,0.04))",
      border: "1px solid rgba(124,58,237,0.2)",
      borderRadius: "12px", padding: "1.5rem",
      position: "relative", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(124,58,237,0.08)"
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899, transparent)"
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🚨</span>
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
              color: "#7c3aed", letterSpacing: "0.2em", textTransform: "uppercase"
            }}>Alerte Concurrentielle</div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>
              Brevets à Fort Impact
              <span style={{
                marginLeft: "0.75rem",
                background: "rgba(124,58,237,0.12)", color: "#7c3aed",
                padding: "0.15rem 0.6rem", borderRadius: "20px",
                fontSize: "0.75rem", fontFamily: "Space Mono, monospace"
              }}>{data.total}</span>
            </div>
          </div>
        </div>

        {/* Filtres domaine */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {domaines.map(d => (
            <button key={d} onClick={() => { setFiltre(d); setPage(1); }} style={{
              padding: "0.25rem 0.7rem", borderRadius: "20px",
              border: `1px solid ${filtre === d ? (DOMAINE_COLORS[d] || "#7c3aed") : "rgba(124,58,237,0.15)"}`,
              background: filtre === d ? `${DOMAINE_COLORS[d] || "#7c3aed"}15` : "transparent",
              color: filtre === d ? (DOMAINE_COLORS[d] || "#7c3aed") : "#64748b",
              fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Résumé par domaine */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
        {Object.entries(data.parDomaine).map(([dom, list]) => (
          <div key={dom} onClick={() => { setFiltre(dom); setPage(1); }} style={{
            background: `${DOMAINE_COLORS[dom] || "#94a3b8"}12`,
            border: `1px solid ${DOMAINE_COLORS[dom] || "#94a3b8"}25`,
            borderRadius: "8px", padding: "0.4rem 0.75rem",
            cursor: "pointer", transition: "all 0.2s"
          }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{dom} </span>
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.75rem",
              fontWeight: 700, color: DOMAINE_COLORS[dom] || "#94a3b8"
            }}>{list.length}</span>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
              {["#", "Titre", "Candidat", "Domaine", "Juridiction", "Cité par", "Score"].map(h => (
                <th key={h} style={{
                  padding: "0.6rem 0.8rem", textAlign: "left",
                  color: "#64748b", fontFamily: "Space Mono, monospace",
                  fontSize: "0.6rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontWeight: 600
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brevets.map((b, i) => (
              <tr key={i}
                style={{ borderBottom: "1px solid rgba(124,58,237,0.06)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{
                  padding: "0.7rem 0.8rem",
                  fontFamily: "Space Mono, monospace", fontSize: "0.72rem", color: "#94a3b8"
                }}>{(page - 1) * PAR_PAGE + i + 1}</td>
                <td style={{ padding: "0.7rem 0.8rem", color: "#1e293b", maxWidth: "250px" }}>
                  {b.Titre?.substring(0, 45)}...
                </td>
                <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontSize: "0.78rem" }}>
                  {b.Candidats?.substring(0, 20)}
                </td>
                <td style={{ padding: "0.7rem 0.8rem" }}>
                  <span style={{
                    background: `${DOMAINE_COLORS[b.domaine] || "#94a3b8"}15`,
                    color: DOMAINE_COLORS[b.domaine] || "#94a3b8",
                    padding: "0.15rem 0.5rem", borderRadius: "4px",
                    fontSize: "0.7rem", fontWeight: 600
                  }}>{b.domaine?.substring(0, 15)}</span>
                </td>
                <td style={{ padding: "0.7rem 0.8rem" }}>
                  <span style={{
                    background: "rgba(124,58,237,0.1)", color: "#7c3aed",
                    padding: "0.15rem 0.5rem", borderRadius: "4px",
                    fontSize: "0.72rem", fontFamily: "Space Mono, monospace", fontWeight: 700
                  }}>{b.Juridiction}</span>
                </td>
                <td style={{
                  padding: "0.7rem 0.8rem", color: "#f59e0b",
                  fontFamily: "Space Mono, monospace", fontWeight: 700
                }}>{b["Cité par nombre de brevets"]}</td>
                <td style={{ padding: "0.7rem 0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      height: "5px", width: "60px",
                      background: "rgba(124,58,237,0.1)",
                      borderRadius: "3px", overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(parseFloat(b.impactScore) * 10, 100)}%`,
                        background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                        borderRadius: "3px"
                      }} />
                    </div>
                    <span style={{
                      color: "#7c3aed", fontFamily: "Space Mono, monospace",
                      fontSize: "0.75rem", fontWeight: 700
                    }}>{b.impactScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: "1.2rem", flexWrap: "wrap", gap: "0.75rem"
      }}>
        <div style={{
          fontSize: "0.75rem", color: "#64748b",
          fontFamily: "Space Mono, monospace"
        }}>
          {(page - 1) * PAR_PAGE + 1}–{Math.min(page * PAR_PAGE, listeComplete.length)} sur {listeComplete.length}
        </div>

        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <button onClick={() => setPage(1)} disabled={page === 1} style={{
            padding: "0.4rem 0.7rem", borderRadius: "6px",
            border: "1px solid rgba(124,58,237,0.2)", cursor: page === 1 ? "not-allowed" : "pointer",
            color: page === 1 ? "#94a3b8" : "#7c3aed", background: "white", fontSize: "0.75rem"
          }}>«</button>

          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
            padding: "0.4rem 0.8rem", borderRadius: "6px",
            border: "1px solid rgba(124,58,237,0.2)", cursor: page === 1 ? "not-allowed" : "pointer",
            color: page === 1 ? "#94a3b8" : "#7c3aed", background: "white", fontSize: "0.75rem"
          }}>← Préc.</button>

          {/* Numéros de pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p;
            if (totalPages <= 5) p = i + 1;
            else if (page <= 3) p = i + 1;
            else if (page >= totalPages - 2) p = totalPages - 4 + i;
            else p = page - 2 + i;
            return (
              <button key={p} onClick={() => setPage(p)} style={{
                padding: "0.4rem 0.7rem", borderRadius: "6px",
                border: `1px solid ${page === p ? "#7c3aed" : "rgba(124,58,237,0.2)"}`,
                cursor: "pointer",
                background: page === p ? "rgba(124,58,237,0.1)" : "white",
                color: page === p ? "#7c3aed" : "#64748b",
                fontFamily: "Space Mono, monospace", fontSize: "0.75rem", fontWeight: 700
              }}>{p}</button>
            );
          })}

          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
            padding: "0.4rem 0.8rem", borderRadius: "6px",
            border: "1px solid rgba(124,58,237,0.2)", cursor: page === totalPages ? "not-allowed" : "pointer",
            color: page === totalPages ? "#94a3b8" : "#7c3aed", background: "white", fontSize: "0.75rem"
          }}>Suiv. →</button>

          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{
            padding: "0.4rem 0.7rem", borderRadius: "6px",
            border: "1px solid rgba(124,58,237,0.2)", cursor: page === totalPages ? "not-allowed" : "pointer",
            color: page === totalPages ? "#94a3b8" : "#7c3aed", background: "white", fontSize: "0.75rem"
          }}>»</button>
        </div>
      </div>
    </div>
  );
}

export default AlertBox;