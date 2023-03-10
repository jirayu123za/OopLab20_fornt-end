import React from "react";

interface CellProps {
  value: string;
  onClick: () => void;
}

const cellStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  fontSize: "64px",
};

function Cell({ value, onClick }: CellProps) {
  return (
    <button style={cellStyle} onClick={onClick} disabled={value !== " "}>
      {value === "X" ? "X" : value === "O" ? "O" : ""}
    </button>
  );
}


export default Cell;