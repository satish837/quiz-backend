const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let gameState = { currentQuestion: 0, players: {} };

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);
  socket.emit("gameState", gameState);

  socket.on("submitAnswer", ({ playerId, selectedAnswer }) => {
    gameState.players[playerId] = selectedAnswer;
    io.emit("gameState", gameState);
  });

  socket.on("nextQuestion", () => {
    gameState.currentQuestion++;
    io.emit("gameState", gameState);
  });

  socket.on("disconnect", () => console.log("A player disconnected:", socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
