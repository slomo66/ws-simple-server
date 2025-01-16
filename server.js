const express = require(`express`);
const app = express();
const expressWs = require("express-ws")(app);
const axios = require("axios");

const port = process.env.PORT || 8080;

let lastMsg = "";
let objweather = { weather: null, error: null, timestamp: null };

const CITY = "Meinerzhagen";
const API_KEY = "1cfba33dcfa8499db4b93353250701";
const BASE_URL = "http://api.weatherapi.com/v1";
const API_URL = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${CITY}&days=5&lang=de`;

const FETCH_INTERVALL = 15 * 60 * 1000; // 15 Minuten

async function getWeather() {
  objweather.timestamp = Date.now();
  try {
    const response = await axios.get(API_URL);
    objweather.weather = response.data;
    objweather.error = null;
  } catch (err) {
    objweather.weather = null;
    objweather.error = err;
  }

  return await objweather;
}

async function fetchWeather() {
  const res = await getWeather();

  if (res.weather != null) {
    console.log(res.weather?.current);
  }
}


fetchWeather();

setInterval(() => {
  fetchWeather();
}, FETCH_INTERVALL);


app.ws("/", (ws, req) => {
  console.log("A client just connected");

  ws.on("message", function (msg) {
    console.log("Received message from client: " + msg);

    lastMsg = msg;

    const timestamp = Date.now();
    ws.send(`Timestamp:${timestamp} Someone said: ${msg}`);
  });
});

app.get(`/abc`, (req, res) => {
  res.json(`lastMsg: ${lastMsg}`);
});

app.get("/aktuell", (req, res) => {
  res.send(objweather?.weather?.current);
});

//app.listen(port);
app.listen(port, () => {
  console.log("Server started on port", port);
});
