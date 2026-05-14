import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from "recharts";

const API = "http://127.0.0.1:8000";

const PERIODS = [
  { label: "1W", value: "1wk" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
];

function generateProjection(history, sentiment) {


  if (history.length < 2) return [];

  const last = history[history.length - 1];
  const lastPrice = last.price;
  const lastDate = new Date(last.date);

  // Calculate real log returns from full history
  const logReturns = [];
  for (let i = 1; i < history.length; i++) {
    logReturns.push(Math.log(history[i].price / history[i - 1].price));
  }

  // Real mean daily return and standard deviation (volatility)
  const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
  const variance = logReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / logReturns.length;
  const stdDev = Math.sqrt(variance);

  // Sentiment nudges the drift slightly
  let sentimentBias = 0;
  if (sentiment.toLowerCase().includes("bullish")) sentimentBias = 0.003;
  else if (sentiment.toLowerCase().includes("bearish")) sentimentBias = -0.003;

  // Box-Muller transform for normally distributed random numbers
  function gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  const projection = [];
  let price = lastPrice;
  for (let i = 1; i <= 14; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);

    // Geometric Brownian Motion step
    const dailyReturn = mean + sentimentBias + stdDev * gaussianRandom();
    price = parseFloat((price * Math.exp(dailyReturn)).toFixed(2));

    projection.push({
      date: date.toISOString().split("T")[0],
      projected: price,
    });
  }
  return projection;
}
  


const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: dark ? "rgba(10,14,23,0.95)" : "rgba(255,255,255,0.95)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 13,
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        <div style={{ color: dark ? "#475569" : "#94a3b8", marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: ${p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Graph({ dark }) {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("");
  const [period, setPeriod] = useState("1mo");
  const [history, setHistory] = useState([]);
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [projection, setProjection] = useState([]);

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
  };

  const fetchGraph = async (ticker, per) => {
    setLoading(true);
    try {
      const histRes = await axios.get(`${API}/stock/${ticker}/history?period=${per}`);
      const hist = histRes.data.history;
      setHistory(hist);

      const analysisRes = await axios.get(`${API}/analysis/${ticker}`);
      const sent = analysisRes.data.sentiment || "";
      setSentiment(sent);

      const proj = generateProjection(hist, sent);
      setProjection(proj);

      const combined = [
        ...hist.map(h => ({ date: h.date, actual: h.price, projected: null })),
        ...proj.map(p => ({ date: p.date, actual: null, projected: p.projected })),
      ];
      setChartData(combined);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, []);

  useEffect(() => {
    if (selectedTicker) fetchGraph(selectedTicker, period);
  }, [selectedTicker, period]);

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

        .graph-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .graph-heading {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 4px;
        }

        .graph-sub {
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

        .controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        select {
          background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          padding: 10px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          border-radius: 10px;
          cursor: pointer;
          min-width: 180px;
        }

        select option {
          background: ${dark ? "#0a0e17" : "#ffffff"};
        }

        .period-tabs {
          display: flex;
          gap: 6px;
        }

        .period-btn {
          background: transparent;
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${dark ? "#475569" : "#94a3b8"};
          padding: 8px 14px;
          border-radius: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .period-btn:hover {
          color: ${dark ? "#e2e8f0" : "#0f172a"};
        }

        .period-btn.active {
          background: ${dark ? "rgba(99,255,180,0.1)" : "rgba(0,102,255,0.08)"};
          border-color: ${dark ? "#63ffb4" : "#0066ff"};
          color: ${dark ? "#63ffb4" : "#0066ff"};
        }

        .legend-row {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#64748b" : "#94a3b8"};
        }

        .legend-line {
          width: 24px;
          height: 2px;
        }

        .legend-line.dotted {
          border-top: 2px dashed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          color: ${dark ? "#334155" : "#cbd5e1"};
          font-size: 14px;
          border: 1px dashed ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"};
          border-radius: 12px;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: ${dark ? "#63ffb4" : "#0066ff"};
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
        }

        .sentiment-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'IBM Plex Mono', monospace;
          margin-left: auto;
        }
      `}</style>

      <div className="graph-wrap">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="graph-heading">Graph</div>
          <div className="graph-sub">// Live price history + AI projection</div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title">Price Chart</div>

          <div className="controls">
            <select value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)}>
              <option value="">Select a stock</option>
              {portfolio.map(h => (
                <option key={h.id} value={h.ticker}>{h.ticker}</option>
              ))}
            </select>

            <div className="period-tabs">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  className={`period-btn ${period === p.value ? "active" : ""}`}
                  onClick={() => setPeriod(p.value)}>
                  {p.label}
                </button>
              ))}
            </div>

            {sentiment && (
              <span className="sentiment-tag" style={{
                background: sentiment.toLowerCase().includes("bullish")
                  ? "rgba(34,197,94,0.12)"
                  : sentiment.toLowerCase().includes("bearish")
                  ? "rgba(239,68,68,0.12)"
                  : "rgba(234,179,8,0.12)",
                color: sentiment.toLowerCase().includes("bullish")
                  ? "#22c55e"
                  : sentiment.toLowerCase().includes("bearish")
                  ? "#ef4444"
                  : "#eab308",
              }}>
                {sentiment.toLowerCase().includes("bullish") ? "↑ Bullish" :
                 sentiment.toLowerCase().includes("bearish") ? "↓ Bearish" : "→ Neutral"}
              </span>
            )}
          </div>

          {!selectedTicker && (
            <div className="empty-state">Select a stock from your portfolio to view its chart.</div>
          )}

          {selectedTicker && loading && (
            <div className="loading">Loading chart data...</div>
          )}

          {selectedTicker && !loading && chartData.length > 0 && (
            <>
              <div className="legend-row">
                <div className="legend-item">
                  <div className="legend-line" style={{ background: dark ? "#63ffb4" : "#0066ff" }} />
                  Actual Price
                </div>
                <div className="legend-item">
                  <div className="legend-line dotted" style={{ borderColor: dark ? "#f59e0b" : "#f59e0b" }} />
                  AI Projection
                </div>
              </div>

              
                <LineChart width="100%" height={400} data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: dark ? "#334155" : "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: dark ? "#334155" : "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `$${v}`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <ReferenceLine
                    x={history[history.length - 1]?.date}
                    stroke={dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    strokeDasharray="4 4"
                    label={{ value: "Today", fill: dark ? "#475569" : "#94a3b8", fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke={dark ? "#63ffb4" : "#0066ff"}
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    name="Projected"
                    connectNulls={false}
                  />
                </LineChart>
              
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}