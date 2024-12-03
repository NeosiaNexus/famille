export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>{"Coucou cha <3"}</p>
      <p>{"Je t'aime"}</p>
      <p>Je pense à toi</p>
      <p style={{
          marginTop: "20px",
      }}>
        <strong>Signé:</strong> Ton homme
      </p>
      <div>
        <img
          src="https://i.pinimg.com/originals/01/6c/c8/016cc8a0e4c93e07a1063b485dcc221a.gif"
          alt="love"
        />
      </div>
    </div>
  );
}
