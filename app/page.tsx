export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #151515, #080808)",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {/* TOP IMAGE */}

      <div
        style={{
          width: "100%",
          height: "78px",
          backgroundImage: "url('/topbar.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderBottom: "2px solid #5f472f",
        }}
      />

      {/* BUTTON BAR */}

      <div
        style={{
          width: "100%",
          height: "70px",
          background:
            "linear-gradient(to bottom, #2a2118, #1b140e)",
          borderBottom: "2px solid #4d3825",
          display: "flex",
          alignItems: "center",
          paddingLeft: "40px",
          gap: "24px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <button style={buttonStyle}>
          Home
        </button>

        <button style={buttonStyle}>
          Games
        </button>

        <button style={buttonStyle}>
          Workshop
        </button>

        <button style={buttonStyle}>
          Community
        </button>
      </div>

      {/* PAGE CONTENT */}

      <div
        style={{
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Welcome to Rivet
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginBottom: "40px",
            fontSize: "18px",
            maxWidth: "700px",
            lineHeight: "1.6",
          }}
        >
          Rivet is a free social gaming platform
          where players can create worlds, play
          games, and build together online.
        </p>

        {/* EMPTY GAME AREA */}

        <div
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "18px",
            border: "2px dashed #3a3a3a",
            background: "#121212",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          No Games Yet
        </div>
      </div>
    </main>
  );
}

const buttonStyle = {
  background:
    "linear-gradient(to bottom, #6a4b2d, #4e341f)",
  border: "2px solid #8b6a46",
  color: "#ffd400",
  fontSize: "20px",
  fontWeight: "bold" as const,
  padding: "12px 26px",
  borderRadius: "10px",
  cursor: "pointer",
  boxShadow: "0 4px 0 #2d1d11",
};