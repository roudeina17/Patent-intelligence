import { useState } from "react";
import { recherche } from "../services/api";

const JURIDICTIONS = ["", "CN", "US", "EP", "JP", "KR"];
const ANNEES = ["", "2024", "2025", "2026"];

function Recherche() {
  const [q, setQ] = useState("");
  const [juridiction, setJuridiction] = useState("");
  const [annee, setAnnee] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
  if (!q && !juridiction && !annee) return;
  setLoading(true);
  try {
    const data = await recherche({ q, juridiction, annee }); // ← plus de res
    setResults(data.results);  // ← plus de res.data
    setTotal(data.total);      // ← plus de res.data
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const selectStyle = {
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(124,58,237,0.2)",
    background: "white",
    color: "#1e293b",
    fontSize: "0.85rem",
    cursor: "pointer",
    outline: "none",
    fontFamily: "Syne, sans-serif"
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.15)",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
      marginBottom: "2rem"
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.6rem", color: "#7c3aed",
        letterSpacing: "0.2em", textTransform: "uppercase",
        marginBottom: "0.4rem"
      }}>── Recherche & Filtres</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "1.2rem" }}>
        Explorer les Brevets
      </div>

      {/* Barre de recherche + filtres */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        
        {/* Input recherche */}
        <div style={{ position: "relative", flex: "1", minWidth: "250px" }}>
          <span style={{
            position: "absolute", left: "0.9rem", top: "50%",
            transform: "translateY(-50%)", color: "#94a3b8", fontSize: "1rem"
          }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par candidat ou titre..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              borderRadius: "8px",
              border: "1px solid rgba(124,58,237,0.2)",
              background: "white",
              color: "#1e293b",
              fontSize: "0.85rem",
              outline: "none",
              fontFamily: "Syne, sans-serif",
              transition: "border 0.2s"
            }}
            onFocus={e => e.target.style.border = "1px solid rgba(124,58,237,0.5)"}
            onBlur={e => e.target.style.border = "1px solid rgba(124,58,237,0.2)"}
          />
        </div>

        {/* Filtre Juridiction */}
        <select value={juridiction} onChange={e => setJuridiction(e.target.value)} style={selectStyle}>
          <option value="">Toutes juridictions</option>
          {JURIDICTIONS.filter(j => j).map(j => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>

        {/* Filtre Année */}
        <select value={annee} onChange={e => setAnnee(e.target.value)} style={selectStyle}>
          <option value="">Toutes années</option>
          {ANNEES.filter(a => a).map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* Bouton recherche */}
        <button onClick={handleSearch} style={{
          padding: "0.6rem 1.5rem",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "white",
          border: "none",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: "pointer",
          fontFamily: "Syne, sans-serif",
          transition: "opacity 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Rechercher
        </button>

        {/* Reset */}
        {(q || juridiction || annee) && (
          <button onClick={() => {
            setQ(""); setJuridiction(""); setAnnee("");
            setResults([]); setTotal(null);
          }} style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            background: "transparent",
            color: "#64748b",
            border: "1px solid rgba(100,116,139,0.2)",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "Syne, sans-serif"
          }}>✕ Reset</button>
        )}
      </div>

      {/* Résultats */}
      {loading && (
        <div style={{ color: "#7c3aed", fontFamily: "Space Mono, monospace", fontSize: "0.8rem" }}>
          ⟳ Recherche en cours...
        </div>
      )}

      {total !== null && !loading && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{
            fontSize: "0.78rem", color: "#64748b",
            fontFamily: "Space Mono, monospace", marginBottom: "0.75rem"
          }}>
            {total} résultat{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
            {total > 50 ? " (affichage limité à 50)" : ""}
          </div>

          {results.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Aucun résultat.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
                  {["Titre", "Candidat", "Juridiction", "Année", "Type", "Cité par"].map(h => (
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
                {results.map((b, i) => (
                  <tr key={i}
                    style={{ borderBottom: "1px solid rgba(124,58,237,0.06)", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "0.7rem 0.8rem", color: "#1e293b", maxWidth: "280px" }}>
                      {b["Titre"]?.substring(0, 50)}...
                    </td>
                    <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontSize: "0.78rem" }}>
                      {b["Candidats"]?.substring(0, 25)}
                    </td>
                    <td style={{ padding: "0.7rem 0.8rem" }}>
                      <span style={{
                        background: "rgba(124,58,237,0.1)", color: "#7c3aed",
                        padding: "0.15rem 0.5rem", borderRadius: "4px",
                        fontSize: "0.72rem", fontFamily: "Space Mono, monospace", fontWeight: 700
                      }}>{b["Juridiction"]}</span>
                    </td>
                    <td style={{
                      padding: "0.7rem 0.8rem", color: "#64748b",
                      fontFamily: "Space Mono, monospace", fontSize: "0.78rem"
                    }}>{b["Année de publication"]}</td>
                    <td style={{ padding: "0.7rem 0.8rem", color: "#64748b", fontSize: "0.78rem" }}>
                      {b["Type de document"]}
                    </td>
                    <td style={{
                      padding: "0.7rem 0.8rem",
                      color: b["Cité par nombre de brevets"] > 0 ? "#f59e0b" : "#94a3b8",
                      fontFamily: "Space Mono, monospace", fontWeight: 700
                    }}>
                      {b["Cité par nombre de brevets"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Recherche;