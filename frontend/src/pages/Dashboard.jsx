import { Link } from "react-router-dom";
import YearChart from "../components/charts/YearChart";
import DomainChart from "../components/charts/DomainChart";
import TopAssignees from "../components/TopAssignees";
import AlertBox from "../components/AlertBox";
import Recherche from "../components/Recherche";
import Navbar from "../components/Navbar";



function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f2f5 0%, #ede9fe 50%, #f0f2f5 100%)",
    }}>
<Navbar />
      

      {/* Main */}
      <main style={{ padding: "2rem 2.5rem", maxWidth: "1400px", margin: "0 auto" }}>
        
        <section style={{ marginBottom: "2rem" }}>
          <section style={{ marginBottom: "2rem" }}>
  <Recherche />
</section>
          <YearChart />
          
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <AlertBox />
        </section>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          
          <DomainChart />
          <TopAssignees />
        </div>
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

export default Dashboard;