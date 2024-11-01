function CustomLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h2 style={{ margin: 0 }}>🔗</h2>
      <h3 style={{ margin: 0, marginLeft: "8px" }}>Hyperlocal Admin</h3>
    </div>
  );
}

export const components = {
  Logo: CustomLogo,
};
