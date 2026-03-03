function Skeleton({ width = "100%", height = "20px", borderRadius = "6px", style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: "linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      ...style
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.1)",
      borderRadius: "12px", padding: "1.2rem 1.5rem",
      flex: "1", minWidth: "140px"
    }}>
      <Skeleton width="30px" height="30px" borderRadius="50%" style={{ marginBottom: "0.75rem" }} />
      <Skeleton width="80%" height="28px" style={{ marginBottom: "0.4rem" }} />
      <Skeleton width="60%" height="14px" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.1)",
      borderRadius: "12px", padding: "1.5rem"
    }}>
      <Skeleton width="40%" height="14px" style={{ marginBottom: "0.5rem" }} />
      <Skeleton width="60%" height="22px" style={{ marginBottom: "1.5rem" }} />
      <Skeleton width="100%" height="250px" borderRadius="8px" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(124,58,237,0.1)",
      borderRadius: "12px", padding: "1.5rem"
    }}>
      <Skeleton width="40%" height="14px" style={{ marginBottom: "0.5rem" }} />
      <Skeleton width="60%" height="22px" style={{ marginBottom: "1.5rem" }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
          <Skeleton width="5%" height="16px" />
          <Skeleton width="35%" height="16px" />
          <Skeleton width="20%" height="16px" />
          <Skeleton width="15%" height="16px" />
          <Skeleton width="15%" height="16px" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;