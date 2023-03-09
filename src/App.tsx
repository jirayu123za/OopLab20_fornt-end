import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

import Canvas from "./components/Canvas";

let client: Client;

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

function App() {
  const [board, setBoard] = useState<string[][]>([
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!client) {
      client = new Client({
        brokerURL: "ws://localhost:8080/demo-websocket",
        onConnect: () => {
          client.subscribe("/topic/error", (message) => {
            try {
              const body = JSON.parse(message.body);
              setErrorMessage(body.error);
            } catch (error) {
              console.log(message.body)
            }
          });

          client.subscribe("/topic/error", (message) => {
            try {
              const body = JSON.parse(message.body);
              setErrorMessage(body.error);
            } catch (error) {
              console.error(error);
            }
          });
        },
      });

      client.activate();
    }
  }, []);

  const paint = (x: number, y: number) => {
    console.log("paint",x, y);
    if (client && client.connected) {
      const newBoard = [...board];
      newBoard[x][y] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      client.publish({
        destination: "/app/paint",
        body: JSON.stringify({
          x: x,
          y: y,
          color: currentPlayer,
        }),
      });
    }
  };

  const resetBoard = () => {
    console.log("reset");
    setBoard([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ]);
    setCurrentPlayer("X");
    setErrorMessage("");
  };

  return (
    <div style={containerStyle}>
      <h1>Tic Tac Toe</h1>
      <Canvas board={board} paint={paint} />
      <div>
        <p style={{ fontSize: "24px" }}>Current player: {currentPlayer}</p>
        {errorMessage && <p>Error: {errorMessage}</p>}
        <button onClick={resetBoard}>New Game</button>
      </div>
    </div>
  );
}
export default App;