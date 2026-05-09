import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiPlus, FiTrash2 } from "react-icons/fi";
import Select from "react-select";
import { US_TICKERS, PSX_TICKERS } from "../tickers";

const API = "http://127.0.0.1:8000";

const tickerOptions = [
  {
    label: "US Stocks",
    options: US_TICKERS.map(t => ({ value: t, label: t, psx: false }))
  },
  {
    label: "PSX Stocks (Limited Data)",
    options: PSX_TICKERS.map(t => ({ value: t, label: t, psx: true }))
  }
];

export default function Portfolio({ dark }) {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [psxWarning, setPsxWarning] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
  };

  const addStock = async () => {
    if (!ticker || !quantity || !buyPrice) return;
    await axios.post(`${API}/portfolio/add?ticker=${ticker}&quantity=${quantity}&buy_price=${buyPrice}`);
    setTicker(""); setQuantity(""); setBuyPrice(""); setPsxWarning(false);
    fetchPortfolio();
  };

  const removeStock = async (id) => {
    await axios.delete(`${API}/portfolio/remove/${id}`);
    fetchPortfolio();
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const totalGainLoss = portfolio.reduce((sum, h) => sum + h.gain_loss, 0);

  const selectStyles = {
    container: base => ({ ...base, flex: 1, minWidth: 180 }),
    control: base => ({
      ...base,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 10,
      boxShadow: "none",
      minHeight: 44,
      cursor: "pointer",
    }),
    menu: base => ({
      ...base,
      background: dark ? "#0f172a" : "#ffffff",
      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 10,
      zIndex: 99,
    }),
    groupHeading: base => ({
      ...base,
      color: dark ? "#475569" : "#94a3b8",
      fontSize: 10,
      letterSpacing: 2,
      fontFamily: "'IBM Plex Mono', monospace",
      padding: "8px 12px 4px",
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused
        ? dark ? "rgba(99,255,180,0.08)" : "rgba(0,102,255,0.08)"
        : "transparent",
      color: dark ? "#e2e8f0" : "#0f172a",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      cursor: "pointer",
    }),
    singleValue: base => ({ ...base, color: dark ? "#e2e8f0" : "#0f172a", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }),
    placeholder: base => ({ ...base, color: dark ? "#334155" : "#94a3b8", fontSize: 14 }),
    input: base => ({ ...base, color: dark ? "#e2e8f0" : "#0f172a" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: base => ({ ...base, color: dark ? "#334155" : "#94a3b8" }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        body {
          background: ${dark ? "#0a0e17" : "#f0f4ff"};
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          transition: background 0.4s;
        }

        .port-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .port-heading {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 4px;
        }

        .port-sub {
          font-size: 13px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#475569" : "#94a3b8"};
          margin-bottom: 36px;
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
          align-items: center;
        }

        input {
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

        input:focus {
          border-color: ${dark ? "#63ffb4" : "#0066ff"};
          background: ${dark ? "rgba(99,255,180,0.05)" : "rgba(0,102,255,0.05)"};
        }

        input::placeholder { color: ${dark ? "#334155" : "#94a3b8"}; }

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

        .psx-warning {
          width: 100%;
          margin-top: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(234,179,8,0.08);
          border: 1px solid rgba(234,179,8,0.25);
          color: #eab308;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pnl-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .pnl-chip {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'IBM Plex Mono', monospace;
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
          color: ${dark ? "#e2e8f0" : "#0f172a"};
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
          border: 1px solid rgba(239,68,68,0.2);
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
      `}</style>

      <div className="port-wrap">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="port-heading">Portfolio</div>
          <div className="port-sub">// Manage your stock positions</div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title">Add Position</div>
          <div className="add-form">
            <Select
              options={tickerOptions}
              onChange={opt => {
                setTicker(opt ? opt.value : "");
                setPsxWarning(opt ? opt.psx : false);
              }}
              value={ticker ? { value: ticker, label: ticker } : null}
              placeholder="Search ticker..."
              isSearchable
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} type="number" />
            <input placeholder="Buy Price ($)" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} type="number" />
            <button className="btn-primary" onClick={addStock}><FiPlus /> Add Stock</button>
          </div>
          <AnimatePresence>
            {psxWarning && (
              <motion.div className="psx-warning"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                ⚠️ PSX stocks may have limited data. Price and P&L may be unavailable or delayed.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card-title">Your Holdings</div>
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
        </motion.div>
      </div>
    </>
  );
}