import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css"; 
const socket = io("http://localhost:3000");

function App() {
  const [ticks, setTicks] = useState([]);

  useEffect(() => {
    socket.on("tick", (tick) => {
      setTicks((prevTicks) => [tick, ...prevTicks].slice(0, 100)); 
    });
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">High-Frequency Market Event Detection</h1>
      <table className="ticks-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Old Price</th>
            <th>New Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {ticks.map((tick, index) => (
            <tr
              key={index}
              className={
                Math.abs(tick.newPrice - tick.oldPrice) / tick.oldPrice > 0.1
                  ? "spike"
                  : ""
              }
            >
              <td>{tick.instrument}</td>
              <td>{tick.oldPrice}</td>
              <td>{tick.newPrice}</td>
              <td>{tick.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
