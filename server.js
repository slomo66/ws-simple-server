const express = require(`express`)
const app = express();
const expressWs = require('express-ws')(app);


let lastMsg = "";

app.ws("/", (ws, req) => {
  console.log("A client just connected");

  ws.on('message', function (msg) {
    console.log("Received message from client: " + msg);

    lastMsg = msg;

    const timestamp = Date.now();
    ws.send(`Timestamp:${timestamp} Someone said: ${msg}`);
  });
})


app.get(`/abc`, (req, res) => {
  res.json(`lastMsg: ${lastMsg}`)
})

app.listen(8080)

