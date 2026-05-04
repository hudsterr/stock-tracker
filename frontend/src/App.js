import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
  };

  const removeStock = async (id) => {
    await axios.delete(`${API}/portfolio/remove/${id}`);
    fetchPortfolio();
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div>
      <h1>Stock Portfolio Tracker</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Gain/Loss</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((holding) => (
            <tr key={holding.id}>
              <td>{holding.ticker}</td>
              <td>{holding.quantity}</td>
              <td>${holding.buy_price}</td>
              <td>${holding.current_price}</td>
              <td style={{ color: holding.gain_loss >= 0 ? "green" : "red" }}>
                ${holding.gain_loss}
              </td>
              <td>
                <button onClick={() => removeStock(holding.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;