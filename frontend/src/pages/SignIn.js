

import { useRef, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

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
        line.points.forEach((pt, j) => { if (j > 0) ctx.lineTo(pt.x, pt.y); });
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, "rgba(99,255,180,0)");
        grad.addColorStop(0.5, "rgba(99,255,180,0.15)");
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

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }} />;
}

export default function SignIn({ setUser }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0e17; font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; }
        .signin-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .signin-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 56px 48px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          backdrop-filter: blur(12px);
        }
        .signin-logo {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -2px;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .signin-logo span { color: #63ffb4; }
        .signin-sub {
          font-size: 11px;
          font-family: 'IBM Plex Mono', monospace;
          color: #63ffb4;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 48px;
        }
        .signin-heading {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 8px;
        }
        .signin-desc {
          font-size: 13px;
          color: #475569;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .divider {
          width: 40px;
          height: 2px;
          background: #63ffb4;
          margin: 0 auto 32px;
          border-radius: 2px;
        }
        .google-btn-wrap {
          display: flex;
          justify-content: center;
        }
        .signin-footer {
          margin-top: 32px;
          font-size: 11px;
          color: #334155;
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>

      <StockChartBackground />

      <div className="signin-wrap">
        <motion.div
          className="signin-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          <div className="signin-logo">stock<span>r</span></div>
          <div className="signin-sub">AI-Powered Portfolio</div>
          <div className="divider" />
          <div className="signin-heading">Welcome back</div>
          <div className="signin-desc">Sign in with your Google account to access your portfolio and AI-powered market insights.</div>

          <div className="google-btn-wrap">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                setUser({
                  name: decoded.name,
                  email: decoded.email,
                  picture: decoded.picture,
                });
              }}
              onError={() => console.log("Login failed")}
              theme="filled_black"
              shape="pill"
              size="large"
              text="signin_with_google"
            />
          </div>

          <div className="signin-footer">
            Your data is private and secure
          </div>
        </motion.div>
      </div>
    </>
  );
}