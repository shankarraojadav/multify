const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const instruments = ["NSE:ACC", "NSE:SBIN", "NSE:TCS", "NSE:INFY"];
const tickFrequency = 1000; // ticks per second
const lastPrices = {};

// Initialize lastPrices with some random values
instruments.forEach((instrument) => {
  lastPrices[instrument] = (Math.random() * 1000).toFixed(2);
});

// Generate random ticks with realistic changes
setInterval(() => {
  instruments.forEach((instrument) => {
  
    const changePercentage = Math.random() * 0.02 - 0.01; 
    const oldPrice = parseFloat(lastPrices[instrument]);
    const newPrice = (oldPrice * (1 + changePercentage)).toFixed(2);
    lastPrices[instrument] = newPrice;

    const tick = {
      instrument,
      oldPrice: oldPrice.toFixed(2),
      newPrice,
      timestamp: moment().format(),
    };

    // Emit tick to clients
    io.emit("tick", tick);

    // Detect spike
    if (Math.abs(newPrice - oldPrice) / oldPrice > 0.1) {
      logSpike(tick);
    }
  });
}, 1000 / tickFrequency);

// Log spikes to CSV
function logSpike({ instrument, oldPrice, newPrice, timestamp }) {
  const log = `${instrument},${oldPrice},${newPrice},${timestamp}\n`;
  fs.appendFile("spikes.csv", log, (err) => {
    if (err) throw err;
  });
}

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
