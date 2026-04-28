// EnvisionXAI Website — NavBar (floating glass pill)
const { useState, useEffect } = React;

function ArrowUpRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
  );
}

function NavBar({ active = "/", onNavigate = () => {}, ctaLabel = "Обсудить проект" }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { to: "/", label: "Главная" },
    { to: "/cases", label: "Кейсы" },
    { to: "/pricing", label: "Тарифы" },
    { to: "/about", label: "О нас" },
    { to: "/contacts", label: "Контакты" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 80,
      display: "flex", justifyContent: "center", padding: "16px 24px",
      pointerEvents: "none",
    }}>
      <div style={{
        pointerEvents: "auto",
        display: "flex", alignItems: "center", gap: 4, padding: 6,
        borderRadius: 999,
        background: scrolled ? "color-mix(in oklch, #050505 75%, transparent)" : "color-mix(in oklch, #050505 40%, transparent)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.14)",
        transition: "background 0.3s",
      }}>
        <button
          type="button"
          onClick={() => onNavigate("/")}
          aria-label="compXstore — на главную"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 14px 8px 12px", background: "transparent",
            border: "none", borderRadius: 999, color: "#fff", cursor: "pointer",
          }}
        >
          <img src="assets/envision_xai_icon.svg" alt="" style={{ width: 20, height: 20, borderRadius: 6 }} />
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>compXstore</span>
        </button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.16)" }} aria-hidden="true" />

        {items.map((it) => {
          const isActive = active === it.to;
          return (
            <button
              key={it.to}
              type="button"
              onClick={() => onNavigate(it.to)}
              aria-current={isActive ? "page" : undefined}
              style={{
                padding: "8px 14px", border: "none", borderRadius: 999,
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.68)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.68)"; }}
            >
              {it.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onNavigate("/discuss-project")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", border: "none", borderRadius: 999,
            background: "#fff", color: "#050505",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#c8e636"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
        >
          {ctaLabel}
          <ArrowUpRight size={14} />
        </button>
      </div>
    </nav>
  );
}

window.NavBar = NavBar;
