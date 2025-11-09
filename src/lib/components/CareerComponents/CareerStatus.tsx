export default function CareerStatus({ status }: { status: string }) {
  let bgColor = "#F5F5F5";
  let borderColor = "#E9EAEB";
  let dotColor = "#717680";
  let text = "Draft";

  if (status === "active") {
    bgColor = "#ECFDF3";
    borderColor = "#A6F4C5";
    dotColor = "#12B76A";
    text = "Published";
  } else if (status === "inactive") {
    bgColor = "#F5F5F5";
    borderColor = "#E9EAEB";
    dotColor = "#717680";
    text = "Unpublished";
  }

  return (
    <div style={{
      borderRadius: "60px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      padding: "0px 8px",
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: dotColor }}></div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "#414651" }}>{text}</span>
    </div>
  );
}
