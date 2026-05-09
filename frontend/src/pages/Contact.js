import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin, FiSend } from "react-icons/fi";

export default function Contact({ dark }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) return;
    setSent(true);
    setName(""); setEmail(""); setMessage("");
    setTimeout(() => setSent(false), 4000);
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

        .contact-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 1;
        }

        .contact-heading {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 4px;
        }

        .contact-sub {
          font-size: 13px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#475569" : "#94a3b8"};
          margin-bottom: 36px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }

        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .card {
          background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
          border-radius: 16px;
          padding: 28px;
          backdrop-filter: blur(12px);
        }

        .card-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${dark ? "#63ffb4" : "#0066ff"};
          margin-bottom: 24px;
          font-family: 'IBM Plex Mono', monospace;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          justify-content: center;
          height: calc(100% - 48px);
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          background: transparent;
          color: ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"};
          text-decoration: none;
          transition: all 0.3s;
          flex: 1;
        }

        .social-btn:hover {
          color: ${dark ? "#63ffb4" : "#0066ff"};
          border-color: ${dark ? "rgba(99,255,180,0.3)" : "rgba(0,102,255,0.3)"};
          background: ${dark ? "rgba(99,255,180,0.04)" : "rgba(0,102,255,0.04)"};
          transform: translateY(-4px);
          box-shadow: ${dark ? "0 12px 40px rgba(99,255,180,0.1)" : "0 12px 40px rgba(0,102,255,0.1)"};
        }

        .form-group { margin-bottom: 16px; }

        .form-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: ${dark ? "#475569" : "#94a3b8"};
          font-family: 'IBM Plex Mono', monospace;
          display: block;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${dark ? "#e2e8f0" : "#0f172a"};
          padding: 11px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: ${dark ? "#63ffb4" : "#0066ff"};
          background: ${dark ? "rgba(99,255,180,0.05)" : "rgba(0,102,255,0.05)"};
        }

        .form-input::placeholder { color: ${dark ? "#334155" : "#94a3b8"}; }

        textarea.form-input {
          resize: vertical;
          min-height: 120px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .btn-primary {
          background: ${dark ? "#63ffb4" : "#0066ff"};
          color: ${dark ? "#0a0e17" : "#ffffff"};
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          width: 100%;
          justify-content: center;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: ${dark ? "0 8px 24px rgba(99,255,180,0.25)" : "0 8px 24px rgba(0,102,255,0.25)"};
        }

        .success-msg {
          text-align: center;
          padding: 16px;
          border-radius: 10px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          color: #22c55e;
          font-size: 14px;
          font-weight: 600;
          margin-top: 12px;
        }
      `}</style>
      
      <div className="contact-wrap">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="contact-heading">Contact</div>
          <div className="contact-sub">// Get in touch or find me online</div>
        </motion.div>

        <div className="contact-grid">
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column" }}>
            <div className="card-title">Find Me</div>
            <div className="social-links">
              <a
                href="mailto:abdulhaadibinsakibb1234@gmail.com"
                className="social-btn"
              >
                <FiMail size={64} strokeWidth={1} />
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-haadi-bin-sakibb-627056358/"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <FiLinkedin size={64} strokeWidth={1} />
              </a>
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="card-title">Send a Message</div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" placeholder="What's on your mind?" value={message} onChange={e => setMessage(e.target.value)} />
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              <FiSend size={14} /> Send Message
            </button>

            <AnimatePresence>
              {sent && (
                <motion.div className="success-msg"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  ✓ Message sent successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}