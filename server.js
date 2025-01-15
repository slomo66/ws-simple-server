const WebSocket = require("ws");
const express = require("express");
const app = express();

const HTML_PORT = process.env.PORT || 8080;
const WS_PORT = 5000;


const wsServer = new WebSocket.Server({
  port: WS_PORT,
});

app.listen(HTML_PORT, () => {
  console.log("Server started on port", HTML_PORT);
});

app.get("/", (req, res) => {
  const timestamp = Date.now();
  res.send(`Timestamp:${timestamp} Subscribe to Slomo's channel`);
});

wsServer.on("connection", function (socket) {
  // Some feedback on the console
  console.log("A client just connected");

  // Attach some behavior to the incoming socket
  socket.on("message", function (msg) {
    console.log("Received message from client: " + msg);
    // socket.send("Take this back: " + msg);

    // Broadcast that message to all connected clients
    const timestamp = Date.now();
    wsServer.clients.forEach(function (client) {
      client.send(`Timestamp:${timestamp} Someone said: ${msg}`);
    });
  });

  socket.on("close", function () {
    console.log("Client disconnected");
  });
});

console.log(new Date() + " Server is listening on port " + WS_PORT);