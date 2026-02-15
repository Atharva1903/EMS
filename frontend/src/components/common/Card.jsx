const Card = ({ children }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}
    >
      {children}
    </div>
  );
};

export default Card;
