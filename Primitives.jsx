// Shared primitives — buttons, eyebrow, glass card, gradient text, section title
const { useEffect, useRef, useState } = React;

// ─── Eyebrow badge ───────────────────────────────────────────
function Eyebrow({ children, color = "blue" }) {
  const palette = {
    blue:   { fg: "#60A5FA", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)" },
    purple: { fg: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
    lime:   { fg: "#c8e636", bg: "rgba(200,230,54,0.1)",  border: "rgba(200,230,54,0.3)" },
    red:    { fg: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)" },
  }[color];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 16px", borderRadius: 999,
      border: `1px solid ${palette.border}`, background: palette.bg, color: palette.fg,
      fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: palette.fg }} />
      {children}
    </span>
  );
}

// ─── Primary CTA (gradient) ──────────────────────────────────
function PrimaryButton({ children, onClick, size = "lg" }) {
  const [hover, setHover] = useState(false);
  const pad = size === "lg" ? "16px 32px" : "10px 20px";
  const fs = size === "lg" ? 16 : 14;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: pad, border: "none", borderRadius: 10,
        background: "linear-gradient(to right, #3b82f6, #a855f7)",
        color: "#fff", fontSize: fs, fontWeight: 600,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer",
        boxShadow: hover ? "0 12px 40px rgba(96,165,250,0.5)" : "none",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.15s, box-shadow 0.3s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, size = "lg" }) {
  const [hover, setHover] = useState(false);
  const pad = size === "lg" ? "16px 32px" : "10px 20px";
  const fs = size === "lg" ? 16 : 14;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: pad, border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        background: hover ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
        color: "#fff", fontSize: fs, fontWeight: 600,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer", backdropFilter: "blur(10px)",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.15s, background 0.2s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

// ─── Glass card ──────────────────────────────────────────────
function GlassCard({ children, accent = null, hover = true, style = {} }) {
  const [h, setH] = useState(false);
  const accentColor = accent || "rgba(255,255,255,0.1)";
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        padding: 32,
        background: h ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(6px)",
        border: `1px solid ${h && accent ? accentColor : "rgba(255,255,255,0.1)"}`,
        borderRadius: 16,
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: h ? "translateY(-5px) scale(1.02)" : "none",
        cursor: hover ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section title (with lime-underlined italic emphasis) ────
function SectionTitle({ children, style = {} }) {
  return (
    <h2 style={{
      fontSize: "clamp(32px, 4.5vw, 56px)",
      fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
      margin: 0, textAlign: "center", textWrap: "balance",
      ...style,
    }}>
      {children}
    </h2>
  );
}

function ItalicLime({ children, thickness = 4, offset = 4 }) {
  return (
    <b style={{
      fontFamily: "Fraunces, serif",
      fontStyle: "italic", fontWeight: 500,
      textDecoration: "underline",
      textDecorationColor: "#c8e636",
      textDecorationThickness: thickness,
      textUnderlineOffset: offset,
    }}>{children}</b>
  );
}

function GradientText({ children }) {
  return (
    <span style={{
      background: "linear-gradient(to right, #60A5FA, #A78BFA, #22D3EE)",
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
    }}>{children}</span>
  );
}

// ─── Ambient background blobs + particle field ───────────────
function AmbientBG() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: "25%", width: 384, height: 384, background: "rgba(59,130,246,0.2)", borderRadius: "50%", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "33%", right: "25%", width: 384, height: 384, background: "rgba(168,85,247,0.2)", borderRadius: "50%", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: "25%", left: "33%", width: 384, height: 384, background: "rgba(6,182,212,0.2)", borderRadius: "50%", filter: "blur(80px)" }} />
    </div>
  );
}

// ─── Simple star field canvas (approximation of ParticleField)
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const colors = ["255,255,255", "200,230,255", "147,197,253", "196,181,253"];
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.45 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      glow: Math.random() * 8 + 4,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.012 + Math.random() * 0.03,
    }));
    let anim;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < stars.length; i++) {
        const p = stars[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        p.phase += p.phaseSpeed;
        const tw = 0.55 + 0.45 * Math.sin(p.phase);
        const ca = p.a * tw;
        ctx.shadowBlur = p.glow * tw;
        ctx.shadowColor = `rgba(${p.color},${ca * 0.85})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${ca})`; ctx.fill();
        ctx.shadowBlur = 0;
      }
      // connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(147,197,253,${0.08 * (1 - d/100)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", pointerEvents: "none", zIndex: 1 }} />
  );
}

Object.assign(window, {
  Eyebrow, PrimaryButton, SecondaryButton, GlassCard,
  SectionTitle, ItalicLime, GradientText, AmbientBG, StarField,
});
