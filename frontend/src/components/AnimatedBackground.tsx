"use client";

interface AnimatedBackgroundProps {
  dark: boolean;
}

export default function AnimatedBackground({ dark }: AnimatedBackgroundProps) {
  return (
    <>
      <style>{`
        /* ── Orb travel paths — each visits the opposite side of the screen ── */

        /* Orb 1 — top-left → bottom-right loop */
        @keyframes drift-a {
          0%   { transform: translate(0vw,    0vh);  }
          25%  { transform: translate(55vw,  18vh);  }
          50%  { transform: translate(62vw,  65vh);  }
          75%  { transform: translate(10vw,  72vh);  }
          100% { transform: translate(0vw,    0vh);  }
        }
        /* Orb 2 — bottom-right → top-left loop */
        @keyframes drift-b {
          0%   { transform: translate(0vw,    0vh);  }
          25%  { transform: translate(-50vw, -20vh); }
          50%  { transform: translate(-60vw, -60vh); }
          75%  { transform: translate(-12vw, -70vh); }
          100% { transform: translate(0vw,    0vh);  }
        }
        /* Orb 3 — centre → top-right → bottom-left */
        @keyframes drift-c {
          0%   { transform: translate(0vw,    0vh);  }
          20%  { transform: translate(30vw,  -45vh); }
          50%  { transform: translate(-25vw, -55vh); }
          75%  { transform: translate(-40vw,  30vh); }
          100% { transform: translate(0vw,    0vh);  }
        }
        /* Orb 4 — bottom-left → right edge sweep */
        @keyframes drift-d {
          0%   { transform: translate(0vw,   0vh);   }
          30%  { transform: translate(55vw, -30vh);  }
          60%  { transform: translate(60vw,  25vh);  }
          80%  { transform: translate(20vw, -60vh);  }
          100% { transform: translate(0vw,   0vh);   }
        }
        /* Orb 5 — top-right → bottom half sweep */
        @keyframes drift-e {
          0%   { transform: translate(0vw,   0vh);   }
          25%  { transform: translate(-40vw, 35vh);  }
          55%  { transform: translate(-55vw, 65vh);  }
          80%  { transform: translate(-10vw, 55vh);  }
          100% { transform: translate(0vw,   0vh);   }
        }

        /* ── Grain shimmer ── */
        @keyframes grain {
          0%,100% { transform: translate(0,0);     }
          10%     { transform: translate(-2%,-3%);  }
          30%     { transform: translate(3%,2%);    }
          50%     { transform: translate(-1%,4%);   }
          70%     { transform: translate(4%,-1%);   }
          90%     { transform: translate(-3%,3%);   }
        }

        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(22px);
          will-change: transform;
        }

        /* ── DARK — amber / burnt-orange ── */
        .theme-dark .orb-1 {
          width: 18vw; height: 18vw; top: 5%; left: 5%;
          background: radial-gradient(circle, rgba(251,174,23,0.85) 0%, rgba(251,130,0,0.30) 45%, transparent 70%);
          animation: drift-a 12s ease-in-out infinite;
        }
        .theme-dark .orb-2 {
          width: 15vw; height: 15vw; bottom: 6%; right: 6%;
          background: radial-gradient(circle, rgba(255,210,60,0.80) 0%, rgba(251,174,23,0.25) 45%, transparent 70%);
          animation: drift-b 14s ease-in-out infinite;
        }
        .theme-dark .orb-3 {
          width: 14vw; height: 14vw; top: 48%; left: 48%;
          background: radial-gradient(circle, rgba(230,100,0,0.75) 0%, rgba(180,60,0,0.20) 45%, transparent 70%);
          animation: drift-c 11s ease-in-out infinite;
        }
        .theme-dark .orb-4 {
          width: 13vw; height: 13vw; bottom: 8%; left: 8%;
          background: radial-gradient(circle, rgba(251,174,23,0.70) 0%, rgba(220,140,0,0.22) 45%, transparent 70%);
          animation: drift-d 13s ease-in-out infinite;
        }
        .theme-dark .orb-5 {
          width: 16vw; height: 16vw; top: 6%; right: 6%;
          background: radial-gradient(circle, rgba(255,190,40,0.72) 0%, rgba(200,100,0,0.20) 45%, transparent 70%);
          animation: drift-e 15s ease-in-out infinite;
        }

        /* ── LIGHT — violet / rose / teal / amber / pink ── */
        .theme-light .orb-1 {
          width: 18vw; height: 18vw; top: 5%; left: 5%;
          background: radial-gradient(circle, rgba(139,92,246,0.60) 0%, rgba(109,40,217,0.18) 45%, transparent 70%);
          animation: drift-a 12s ease-in-out infinite;
        }
        .theme-light .orb-2 {
          width: 15vw; height: 15vw; bottom: 6%; right: 6%;
          background: radial-gradient(circle, rgba(244,63,94,0.58) 0%, rgba(225,29,72,0.16) 45%, transparent 70%);
          animation: drift-b 14s ease-in-out infinite;
        }
        .theme-light .orb-3 {
          width: 14vw; height: 14vw; top: 48%; left: 48%;
          background: radial-gradient(circle, rgba(20,184,166,0.55) 0%, rgba(13,148,136,0.15) 45%, transparent 70%);
          animation: drift-c 11s ease-in-out infinite;
        }
        .theme-light .orb-4 {
          width: 13vw; height: 13vw; bottom: 8%; left: 8%;
          background: radial-gradient(circle, rgba(251,174,23,0.65) 0%, rgba(217,119,6,0.18) 45%, transparent 70%);
          animation: drift-d 13s ease-in-out infinite;
        }
        .theme-light .orb-5 {
          width: 16vw; height: 16vw; top: 6%; right: 6%;
          background: radial-gradient(circle, rgba(236,72,153,0.55) 0%, rgba(190,24,93,0.15) 45%, transparent 70%);
          animation: drift-e 15s ease-in-out infinite;
        }

        /* ── Grain overlay ── */
        .grain-layer {
          position: fixed;
          inset: -50%;
          width: 200%; height: 200%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          animation: grain 7s steps(1) infinite;
        }
      `}</style>

      {/* Orbs */}
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${dark ? "theme-dark" : "theme-light"}`}
        aria-hidden="true"
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
      </div>

      {/* Grain */}
      <div className="grain-layer" aria-hidden="true" />
    </>
  );
}