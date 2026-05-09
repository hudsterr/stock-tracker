import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const API = "http://127.0.0.1:8000";

export default function Insights({ dark }) {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("");
  const [news, setNews] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    const res = await axios.get(`${API}/portfolio`);
    setPortfolio(res.data);
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

        .insights-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .insights-heading {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 4px;
        }

        .insights-sub {
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

        .search-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        select {
          background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          padding: 11px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          flex: 1;
          border-radius: 10px;
          transition: all 0.2s;
          cursor: pointer;
        }

        select option {
          background: ${dark ? "#0a0e17" : "#ffffff"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
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

        .empty-state {
          text-align: center;
          padding: 40px;
          color: ${dark ? "#334155" : "#cbd5e1"};
          font-size: 14px;
          border: 1px dashed ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"};
          border-radius: 12px;
        }
      `}</style>

      <div className="insights-wrap">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="insights-heading">Insights</div>
          <div className="insights-sub">// AI-powered market sentiment analysis</div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title">Analyze a Stock</div>
          {portfolio.length === 0 ? (
            <div className="empty-state">Add stocks to your portfolio first to analyze them.</div>
          ) : (
            <div className="search-row">
              <select value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)}>
                <option value="">Select a stock from your portfolio</option>
                {portfolio.map(h => (
                  <option key={h.id} value={h.ticker}>{h.ticker}</option>
                ))}
              </select>
              <button className="btn-outline" onClick={analyzeStock}>
                <FiActivity /> Analyze
              </button>
            </div>
          )}

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
                <ReactMarkdown>{analysis}</ReactMarkdown>
        </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {news.length > 0 && (
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="card-title">Latest Headlines</div>
            {news.map((article, i) => (
              <motion.div key={i} className="news-item"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <a href={article.url} target="_blank" rel="noreferrer" className="news-title">
                  {article.title}
                </a>
                <div className="news-meta">
                  {article.source} — {new Date(article.published).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}