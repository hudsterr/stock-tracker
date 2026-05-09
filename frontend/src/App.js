import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiPlus, FiTrash2, FiActivity, FiSun, FiMoon } from "react-icons/fi";

const API = "http://127.0.0.1:8000";

function StockChartBackground({ dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lines = Array.from({ length: 6 }, (_, i) => ({
      points: Array.from({ length: 80 }, (_, j) => ({
        x: (j / 79) * window.innerWidth,
        y: window.innerHeight * 0.3 + i * 80 + Math.random() * 60,
      })),
      offset: i * 30,
      speed: 0.3 + Math.random() * 0.3,
    }));

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      lines.forEach((line) => {
        line.points.forEach((pt, j) => {
          if (j > 0) {
            const wave = Math.sin((frame + line.offset + j * 5) * 0.015) * 20;
            pt.y += (wave - pt.y * 0.001) * line.speed * 0.05;
          }
        });

        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        line.points.forEach((pt, j) => {
          if (j > 0) ctx.lineTo(pt.x, pt.y);
        });

        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, dark ? "rgba(99,255,180,0)" : "rgba(0,120,255,0)");
        grad.addColorStop(0.5, dark ? "rgba(99,255,180,0.15)" : "rgba(0,120,255,0.12)");
        grad.addColorStop(1, dark ? "rgba(99,255,180,0)" : "rgba(0,120,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [dark]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6
    }} />
  );
}

const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${dark ? "#0a0e17" : "#f0f4ff"};
    color: ${dark ? "#e2e8f0" : "#0f172a"};
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    transition: background 0.4s, color 0.4s;
  }

  .app {
    max-width: 1080px;
    margin: 0 auto;
    padding: 40px 24px;
    position: relative;
    z-index: 1;
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
  }

  .logo {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    color: ${dark ? "#ffffff" : "#0f172a"};
  }

  .logo span {
    color: ${dark ? "#63ffb4" : "#0066ff"};
  }

  .logo-sub {
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    color: ${dark ? "#63ffb4" : "#0066ff"};
    letter-spacing: 2px;
    margin-top: 2px;
  }

  .mode-btn {
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    color: ${dark ? "#e2e8f0" : "#0f172a"};
    padding: 10px 16px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .mode-btn:hover {
    background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  }

  .card {
    background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    backdrop-filter: blur(12px);
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${dark ? "#63ffb4" : "#0066ff"};
    margin-bottom: 20px;
    font-family: 'IBM Plex Mono', monospace;
  }

  .add-form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  input, select {
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    color: ${dark ? "#e2e8f0" : "#0f172a"};
    padding: 11px 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    flex: 1;
    min-width: 120px;
    border-radius: 10px;
    transition: all 0.2s;
  }

  input:focus, select:focus {
    border-color: ${dark ? "#63ffb4" : "#0066ff"};
    background: ${dark ? "rgba(99,255,180,0.05)" : "rgba(0,102,255,0.05)"};
  }

  input::placeholder { color: ${dark ? "#334155" : "#94a3b8"}; }

  select option {
    background: ${dark ? "#0a0e17" : "#ffffff"};
    color: ${dark ? "#e2e8f0" : "#0f172a"};
  }

  .btn-primary {
    background: ${dark ? "#63ffb4" : "#0066ff"};
    color: ${dark ? "#0a0e17" : "#ffffff"};
    border: none;
    padding: 11px 24px;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: ${dark ? "0 8px 24px rgba(99,255,180,0.25)" : "0 8px 24px rgba(0,102,255,0.25)"};
  }

  .btn-outline {
    background: transparent;
    border: 1.5px solid ${dark ? "#63ffb4" : "#0066ff"};
    color: ${dark ? "#63ffb4" : "#0066ff"};
    padding: 11px 24px;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-outline:hover {
    background: ${dark ? "rgba(99,255,180,0.08)" : "rgba(0,102,255,0.08)"};
    transform: translateY(-2px);
  }

  table { width: 100%; border-collapse: collapse; }

  th {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${dark ? "#475569" : "#94a3b8"};
    padding: 0 16px 14px;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
  }

  td {
    padding: 14px 16px;
    border-top: 1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"};
    font-size: 14px;
    font-weight: 500;
  }

  tr:hover td { background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}; }

  .ticker-badge {
    background: ${dark ? "rgba(99,255,180,0.1)" : "rgba(0,102,255,0.08)"};
    color: ${dark ? "#63ffb4" : "#0066ff"};
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    display: inline-block;
  }

  .gain { color: #22c55e; }
  .loss { color: #ef4444; }

  .gain-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .gain-pill.up { background: rgba(34,197,94,0.12); color: #22c55e; }
  .gain-pill.down { background: rgba(239,68,68,0.12); color: #ef4444; }

  .btn-remove {
    background: transparent;
    border: 1px solid ${dark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.2)"};
    color: #ef4444;
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
  }

  .btn-remove:hover {
    background: rgba(239,68,68,0.1);
    border-color: #ef4444;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: ${dark ? "#334155" : "#cbd5e1"};
    font-size: 14px;
    border: 1px dashed ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"};
    border-radius: 12px;
  }

  .pnl-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .pnl-chip {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'IBM Plex Mono', monospace;
  }

  .sentiment-box {
    background: ${dark ? "rgba(99,255,180,0.04)" : "rgba(0,102,255,0.04)"};
    border-left: 3px solid ${dark ? "#63ffb4" : "#0066ff"};
    border-radius: 0 10px 10px 0;
    padding: 20px 24px;
    line-height: 1.8;
    font-size: 14px;
    color: ${dark ? "#94a3b8" : "#475569"};
    margin-bottom: 20px;
  }

  .news-item {
    padding: 16px 0;
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"};
  }

  .news-title {
    color: ${dark ? "#e2e8f0" : "#0f172a"};
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    display: block;
    margin-bottom: 6px;
    transition: color 0.2s;
  }

  .news-title:hover { color: ${dark ? "#63ffb4" : "#0066ff"}; }

  .news-meta {
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    color: ${dark ? "#334155" : "#94a3b8"};
    letter-spacing: 1px;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${dark ? "#63ffb4" : "#0066ff"};
    font-size: 13px;
    padding: 20px 0;
    font-weight: 600;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${dark ? "#63ffb4" : "#0066ff"};
  }

  .search-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export default function App() {
  const [dark, setDark] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
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
    if (!selectedTicker) return;
    setLoading(true); setNews([]); setAnalysis("");
    const newsRes = await axios.get(`${API}/news/${selectedTicker}`);
    setNews(newsRes.data.articles || []);
    const analysisRes = await axios.get(`${API}/analysis/${selectedTicker}`);
    setAnalysis(analysisRes.data.sentiment || "");
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const totalGainLoss = portfolio.reduce((sum, h) => sum + h.gain_loss, 0);

  return (
    <>
      <style>{getStyles(dark)}</style>
      <StockChartBackground dark={dark} />
      <div className="app">

        <motion.div className="topbar" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="logo">stock<span>r</span></div>
            <div className="logo-sub">AI-POWERED PORTFOLIO</div>
          </div>
          <button className="mode-btn" onClick={() => setDark(!dark)}>
            {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title">Add Position</div>
          <div className="add-form">
            <input placeholder="Ticker (e.g. AAPL)" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
            <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} type="number" />
            <input placeholder="Buy Price ($)" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} type="number" />
            <button className="btn-primary" onClick={addStock}><FiPlus /> Add Stock</button>
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card-title">Portfolio</div>
          {portfolio.length > 0 && (
            <div className="pnl-bar">
              <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#64748b" : "#94a3b8" }}>Total P&L</span>
              <span className="pnl-chip" style={{
                background: totalGainLoss >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                color: totalGainLoss >= 0 ? "#22c55e" : "#ef4444"
              }}>
                {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
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
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.25 }}>
                        <td><span className="ticker-badge">{h.ticker}</span></td>
                        <td>{h.quantity}</td>
                        <td>${h.buy_price}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>${h.current_price}</td>
                        <td>
                          <span className={`gain-pill ${h.gain_loss >= 0 ? "up" : "down"}`}>
                            {h.gain_loss >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                            {h.gain_loss >= 0 ? "+" : ""}${h.gain_loss}
                          </span>
                        </td>
                        <td>
                          <button className="btn-remove" onClick={() => removeStock(h.id)}>
                            <FiTrash2 size={12} /> Remove
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="card-title">AI Analysis</div>
          <div className="search-row">
            <select value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)}>
              <option value="">Select a stock from your portfolio</option>
              {portfolio.map(h => (
                <option key={h.id} value={h.ticker}>{h.ticker}</option>
              ))}
            </select>
            <button className="btn-outline" onClick={analyzeStock}><FiActivity /> Analyze</button>
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
              <motion.div className="sentiment-box"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {analysis}
              </motion.div>
            )}
          </AnimatePresence>

          {news.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <div className="card-title" style={{ marginTop: 8 }}>Latest Headlines</div>
              {news.map((article, i) => (
                <motion.div key={i} className="news-item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <a href={article.url} target="_blank" rel="noreferrer" className="news-title">
                    {article.title}
                  </a>
                  <div className="news-meta">{article.source} — {new Date(article.published).toLocaleDateString()}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

      </div>
    </>
  );
}