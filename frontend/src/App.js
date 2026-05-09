import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiPlus, FiTrash2, FiSearch, FiActivity } from "react-icons/fi";

const API = "http://127.0.0.1:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #080c10;
    color: #e8eaf0;
    font-family: 'JetBrains Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .content { position: relative; z-index: 1; }

  .header {
    margin-bottom: 56px;
  }

  .header-tag {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #00ff88;
    margin-bottom: 12px;
    font-weight: 500;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1;
    color: #ffffff;
    letter-spacing: -2px;
  }

  h1 span { color: #00ff88; }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #4a5568;
    margin-bottom: 20px;
  }

  .add-form {
    display: flex;
    gap: 10px;
    margin-bottom: 48px;
    flex-wrap: wrap;
  }

  input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8eaf0;
    padding: 12px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    outline: none;
    flex: 1;
    min-width: 120px;
    transition: all 0.2s;
  }

  input:focus {
    border-color: #00ff88;
    background: rgba(0,255,136,0.04);
    box-shadow: 0 0 20px rgba(0,255,136,0.08);
  }

  input::placeholder { color: #2d3748; }

  .btn-add {
    background: #00ff88;
    color: #080c10;
    border: none;
    padding: 12px 24px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-add:hover {
    background: #00e87a;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,255,136,0.3);
  }

  .table-wrapper {
    margin-bottom: 56px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #2d3748;
    padding: 0 16px 16px;
    text-align: left;
    font-weight: 500;
  }

  td {
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
  }

  .ticker-cell {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .gain { color: #00ff88; }
  .loss { color: #ff4466; }

  .gain-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .btn-remove {
    background: transparent;
    border: 1px solid rgba(255,68,102,0.3);
    color: #ff4466;
    padding: 6px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-remove:hover {
    background: rgba(255,68,102,0.1);
    border-color: #ff4466;
    box-shadow: 0 0 16px rgba(255,68,102,0.2);
  }

  .empty-state {
    text-align: center;
    padding: 48px;
    color: #2d3748;
    font-size: 13px;
    border: 1px dashed rgba(255,255,255,0.06);
  }

  .analysis-section {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 48px;
  }

  .search-row {
    display: flex;
    gap: 10px;
    margin-bottom: 32px;
  }

  .btn-analyze {
    background: transparent;
    border: 1px solid #00ff88;
    color: #00ff88;
    padding: 12px 24px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-analyze:hover {
    background: rgba(0,255,136,0.08);
    box-shadow: 0 0 24px rgba(0,255,136,0.15);
  }

  .sentiment-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 28px;
    margin-bottom: 24px;
    line-height: 1.8;
    font-size: 14px;
    color: #a0aec0;
    border-left: 3px solid #00ff88;
  }

  .news-list { display: flex; flex-direction: column; gap: 1px; }

  .news-item {
    background: rgba(255,255,255,0.02);
    padding: 16px 20px;
    border-left: 2px solid rgba(255,255,255,0.06);
    transition: all 0.2s;
  }

  .news-item:hover {
    background: rgba(255,255,255,0.04);
    border-left-color: #00ff88;
  }

  .news-title {
    color: #e8eaf0;
    text-decoration: none;
    font-size: 13px;
    line-height: 1.5;
    display: block;
    margin-bottom: 6px;
  }

  .news-title:hover { color: #00ff88; }

  .news-meta {
    font-size: 11px;
    color: #2d3748;
    letter-spacing: 1px;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #00ff88;
    font-size: 13px;
    padding: 24px 0;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: #00ff88;
    border-radius: 50%;
  }

  tr:hover td { background: rgba(255,255,255,0.015); }
`;

export default function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [searchTicker, setSearchTicker] = useState("");
  const [news, setNews] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
  };

  const addStock = async () => {
    if (!ticker || !quantity || !buyPrice) return;
    await axios.post(`${API}/portfolio/add?ticker=${ticker}&quantity=${quantity}&buy_price=${buyPrice}`);
    setTicker(""); setQuantity(""); setBuyPrice("");
    fetchPortfolio();
  };

  const removeStock = async (id) => {
    await axios.delete(`${API}/portfolio/remove/${id}`);
    fetchPortfolio();
  };

  const analyzeStock = async () => {
    if (!searchTicker) return;
    setLoading(true); setNews([]); setAnalysis("");
    const newsRes = await axios.get(`${API}/news/${searchTicker}`);
    setNews(newsRes.data.articles || []);
    const analysisRes = await axios.get(`${API}/analysis/${searchTicker}`);
    setAnalysis(analysisRes.data.sentiment || "");
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const totalGainLoss = portfolio.reduce((sum, h) => sum + h.gain_loss, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="bg-grid" />
      <div className="app content">

        <motion.div className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="header-tag">// AI-Powered</div>
          <h1>Stock<br /><span>Tracker</span></h1>
          {portfolio.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ marginTop: 16, fontSize: 13, color: totalGainLoss >= 0 ? "#00ff88" : "#ff4466" }}>
              Total P&L: {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)}
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="section-title">// Add Position</div>
          <div className="add-form">
            <input placeholder="TICKER" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
            <input placeholder="QUANTITY" value={quantity} onChange={e => setQuantity(e.target.value)} type="number" />
            <input placeholder="BUY PRICE" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} type="number" />
            <button className="btn-add" onClick={addStock}><FiPlus /> ADD</button>
          </div>
        </motion.div>

        <motion.div className="table-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="section-title">// Portfolio</div>
          {portfolio.length === 0 ? (
            <div className="empty-state">No positions yet. Add your first stock above.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ticker</th><th>Qty</th><th>Buy Price</th>
                  <th>Current</th><th>P&L</th><th></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {portfolio.map((h) => (
                    <motion.tr key={h.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}>
                      <td><span className="ticker-cell">{h.ticker}</span></td>
                      <td>{h.quantity}</td>
                      <td>${h.buy_price}</td>
                      <td>${h.current_price}</td>
                      <td>
                        <div className={`gain-cell ${h.gain_loss >= 0 ? "gain" : "loss"}`}>
                          {h.gain_loss >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                          {h.gain_loss >= 0 ? "+" : ""}${h.gain_loss}
                        </div>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => removeStock(h.id)}>
                          <FiTrash2 /> REMOVE
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>

        <motion.div className="analysis-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="section-title">// AI Analysis</div>
          <div className="search-row">
            <input placeholder="ENTER TICKER" value={searchTicker} onChange={e => setSearchTicker(e.target.value.toUpperCase())} />
            <button className="btn-analyze" onClick={analyzeStock}><FiActivity /> ANALYZE</button>
          </div>

          {loading && (
            <div className="loading">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="dot"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
              ))}
              Analyzing market sentiment...
            </div>
          )}

          <AnimatePresence>
            {analysis && (
              <motion.div className="sentiment-card"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {analysis}
              </motion.div>
            )}
          </AnimatePresence>

          {news.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>// Headlines</div>
              <div className="news-list">
                {news.map((article, i) => (
                  <motion.div key={i} className="news-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <a href={article.url} target="_blank" rel="noreferrer" className="news-title">
                      {article.title}
                    </a>
                    <div className="news-meta">{article.source} — {new Date(article.published).toLocaleDateString()}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </>
  );
}