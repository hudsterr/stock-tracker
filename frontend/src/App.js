import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
  };

  const addStock = async () => {
    await axios.post(`${API}/portfolio/add?ticker=${ticker}&quantity=${quantity}&buy_price=${buyPrice}`);
    setTicker("");
    setQuantity("");
    setBuyPrice("");
    fetchPortfolio();
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

      <div>
        <input placeholder="Ticker" value={ticker} onChange={e => setTicker(e.target.value)} />
        <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input placeholder="Buy Price" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
        <button onClick={addStock}>Add Stock</button>
      </div>

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