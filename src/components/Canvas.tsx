import React from "react";
import Cell from "./Cell";

interface CanvasProps {
  board: string[][];
  paint: (x: number, y: number) => void;
}


function Canvas({ board, paint }: CanvasProps) {
  const renderRow = (row: string[], rowIndex: number) => (
    <div className="row" key={rowIndex}>
      {row.map((cellValue, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          value={cellValue}
          onClick={() => paint(rowIndex, colIndex)}
        />
      ))}
    </div>
  );

  return <div className="canvas">{board.map(renderRow)}</div>;
}

export default Canvas;