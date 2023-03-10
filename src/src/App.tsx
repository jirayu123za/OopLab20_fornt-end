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

const messageStyle: React.CSSProperties = {
  fontSize: "24px",
  margin: "1rem 0",
};

function App() {
  const [board, setBoard] = useState<string[][]>([
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [errorMessage, setErrorMessage] = useState("");
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

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

          client.subscribe("/topic/gameOver", (message) => {
            try {
              const body = JSON.parse(message.body);
              setGameOverMessage(body);
              setIsGameOver(true);
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
    if (isGameOver) {
      return;
    }

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
    setBoard([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ]);
    setCurrentPlayer("X");
    setErrorMessage("");
    setGameOverMessage("");
    setIsGameOver(false);
  };

  const renderGameOverMessage = () => (
    <div style={messageStyle}>
      <p>{gameOverMessage}</p>
      <button onClick={resetBoard}>New Game</button>
    </div>
  );

  const renderCurrentTurn = () => (
    <p style={{ fontSize: "24px" }}>
      Current player:{" "}
      <span style={{ color: currentPlayer === "X" ? "red" : "blue" }}>
        {currentPlayer}
      </span>
    </p>
  );

  return (
    <div style={containerStyle}>
      <h1>Tic Tac Toe</h1>
      <Canvas board={board} paint={paint} />
      {isGameOver ? renderGameOverMessage() :
        <>
          {renderCurrentTurn()}
          {errorMessage && <p style={messageStyle}>Error: {errorMessage}</p>}
          <button onClick={resetBoard}>New Game</button>
        </>
      }
    </div>
  );
}

export default App;
