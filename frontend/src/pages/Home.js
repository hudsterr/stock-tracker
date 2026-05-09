import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiTrendingUp, FiActivity, FiShield } from "react-icons/fi";

function StockChartBackground() {
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
        line.points.forEach((pt, j) => { if (j > 0) ctx.lineTo(pt.x, pt.y); });
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, "rgba(99,255,180,0)");
        grad.addColorStop(0.5, "rgba(99,255,180,0.12)");
        grad.addColorStop(1, "rgba(99,255,180,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }} />;
}

export default function Home({ user, dark }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiTrendingUp size={22} />,
      title: "Live Portfolio Tracking",
      desc: "Track your holdings in real time with live prices, gain/loss calculations, and total P&L."
    },
    {
      icon: <FiActivity size={22} />,
      title: "AI Market Insights",
      desc: "Get AI-generated sentiment analysis powered by real news headlines for any stock in your portfolio."
    },
    {
      icon: <FiShield size={22} />,
      title: "US & PSX Markets",
      desc: "Track stocks from both US and Pakistan Stock Exchange markets in one unified dashboard."
    }
  ];

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

        .home-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
          z-index: 1;
        }

        .home-tag {
          font-size: 11px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#63ffb4" : "#0066ff"};
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .home-heading {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -2px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 24px;
        }

        .home-heading span { color: ${dark ? "#63ffb4" : "#0066ff"}; }

        .home-desc {
          font-size: 16px;
          color: ${dark ? "#64748b" : "#64748b"};
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .home-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 96px;
        }

        .btn-hero {
          background: ${dark ? "#63ffb4" : "#0066ff"};
          color: ${dark ? "#0a0e17" : "#ffffff"};
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: ${dark ? "0 10px 32px rgba(99,255,180,0.25)" : "0 10px 32px rgba(0,102,255,0.25)"};
        }

        .btn-hero-outline {
          background: transparent;
          border: 1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-hero-outline:hover {
          background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
          border-radius: 16px;
          padding: 28px;
          backdrop-filter: blur(12px);
          transition: all 0.2s;
        }

        .feature-card:hover {
          border-color: ${dark ? "rgba(99,255,180,0.2)" : "rgba(0,102,255,0.2)"};
          transform: translateY(-2px);
        }

        .feature-icon {
          color: ${dark ? "#63ffb4" : "#0066ff"};
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 700;
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 13px;
          color: ${dark ? "#475569" : "#64748b"};
          line-height: 1.7;
        }

        .greeting {
          font-size: 13px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#475569" : "#94a3b8"};
          margin-bottom: 12px;
        }
      `}</style>

      <StockChartBackground />

      <div className="home-wrap">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="greeting">// Welcome back, {user?.name?.split(" ")[0]}</div>
          <div className="home-tag">AI-Powered Stock Tracker</div>
          <h1 className="home-heading">
            Your portfolio,<br />
            <span>intelligently</span> tracked.
          </h1>
          <p className="home-desc">
            Real-time prices, AI-generated market sentiment, and news analysis — all in one place. Built for serious investors.
          </p>
          <div className="home-btns">
            <button className="btn-hero" onClick={() => navigate("/portfolio")}>
              View Portfolio <FiArrowRight />
            </button>
            <button className="btn-hero-outline" onClick={() => navigate("/insights")}>
              AI Insights
            </button>
          </div>
        </motion.div>

        <motion.div
          className="features-grid"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}