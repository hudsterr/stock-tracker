import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { FiLinkedin } from "react-icons/fi";

export default function Contact({ dark }) {
  const contacts = [
    {
      name: "Abdul Haadi Bin Sakibb",
      email: "abdulhaadibinsakibb1234@gmail.com",
      linkedin: "https://www.linkedin.com/in/abdul-haadi-bin-sakibb-627056358/",
    },
    {
      name: "Areedah Rehman",
      email: "areedahrehman06@gmail.com",
      linkedin: "https://www.linkedin.com/in/areedah-rehman-212138361",
    },
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
          margin-bottom: 48px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .contact-card {
          background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
          border-radius: 20px;
          padding: 40px 32px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .contact-card:hover {
          border-color: ${dark ? "rgba(99,255,180,0.2)" : "rgba(0,102,255,0.2)"};
          transform: translateY(-2px);
        }

        .contact-name {
          font-size: 18px;
          font-weight: 700;
          color: ${dark ? "#ffffff" : "#0f172a"};
          margin-bottom: 8px;
          text-align: center;
        }

        .contact-role {
          font-size: 11px;
          font-family: 'IBM Plex Mono', monospace;
          color: ${dark ? "#63ffb4" : "#0066ff"};
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .contact-icons {
          display: flex;
          gap: 32px;
          justify-content: center;
        }

        .contact-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
          color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"};
          text-decoration: none;
          transition: all 0.25s;
        }

        .contact-icon-btn:hover {
          color: ${dark ? "#63ffb4" : "#0066ff"};
          border-color: ${dark ? "rgba(99,255,180,0.3)" : "rgba(0,102,255,0.3)"};
          background: ${dark ? "rgba(99,255,180,0.06)" : "rgba(0,102,255,0.06)"};
          transform: translateY(-3px);
          box-shadow: ${dark ? "0 8px 24px rgba(99,255,180,0.1)" : "0 8px 24px rgba(0,102,255,0.1)"};
        }

        .divider {
          width: 40px;
          height: 2px;
          background: ${dark ? "rgba(99,255,180,0.3)" : "rgba(0,102,255,0.3)"};
          border-radius: 2px;
          margin: 8px 0;
        }
      `}</style>

      <div className="contact-wrap">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="contact-heading">Contact</div>
          <div className="contact-sub">// Get in touch with the team</div>
        </motion.div>

        <div className="contact-grid">
          {contacts.map((contact, i) => (
            <motion.div
              key={i}
              className="contact-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}>

              <div className="contact-name">{contact.name}</div>
              <div className="divider" />
              <div className="contact-role">Developer</div>

              <div className="contact-icons">
                <a
                  href={`mailto:${contact.email}`}
                  className="contact-icon-btn"
                  title={contact.email}>
                  <FiMail size={30} />
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-icon-btn"
                  title="LinkedIn">
                  <FiLinkedin size={30} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}