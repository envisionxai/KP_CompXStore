// kp-sections-3.jsx — Timeline, Pricing, Support, Final CTA, Footer
const { useEffect: useEffect3, useRef: useRef3, useState: useState3 } = React;

// ─── FILINGS CANVAS ───────────────────────────────────────
// Magnetic filings: сетка штрихов, реагирующая на курсор.
const FILINGS_COLORS = {
  green: "rgba(156,220,170,",
  blue:  "rgba(168,210,255,",
  warm:  "rgba(255,210,150,",
  lime:  "rgba(200,230,54,",
};

function FilingsCanvas({ mode = "grid", color = "lime" }) {
  const ref = useRef3(null);

  useEffect3(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colorStr = FILINGS_COLORS[color] || FILINGS_COLORS.lime;

    let w = 0, h = 0, raf = 0, running = true;
    let particles = [];
    const mouse = { x: null, y: null, active: false };
    const t0 = performance.now();

    function buildParticles() {
      particles = [];
      const spacing = mode === "dense" ? 28 : mode === "grid" ? 40 : 56;
      const jitter = mode === "grid" ? 0 : spacing * 0.25;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          const jx = (Math.random() - 0.5) * jitter;
          const jy = (Math.random() - 0.5) * jitter;
          particles.push({
            x: x + jx, y: y + jy,
            baseX: x + jx, baseY: y + jy,
            angle: Math.random() * Math.PI,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    function frame(now) {
      if (!running) { raf = requestAnimationFrame(frame); return; }
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const len = mode === "dense" ? 10 : mode === "grid" ? 14 : 18;
      const lineW = mode === "dense" ? 0.9 : 1.2;
      const breatheAx = mode === "sparse" ? 0.6 : 0.35;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const wave = Math.sin((p.baseX + p.baseY) * 0.004 + t * 0.6 + p.phase) * breatheAx;
        let targetAngle = wave;
        let strength = 0;

        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.baseX;
          const dy = mouse.y - p.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const R = Math.min(w, h) * 0.45;
          if (dist < R) {
            targetAngle = Math.atan2(dy, dx);
            strength = 1 - dist / R;
          }
        }

        let da = targetAngle - p.angle;
        da = ((da + Math.PI) % (Math.PI * 2)) - Math.PI;
        p.angle += da * 0.08;

        const pullX = mode === "sparse" ? 0.3 : 0.15;
        p.x += (p.baseX + (mouse.active && mouse.x !== null ? (mouse.x - p.baseX) * strength * pullX * 0.15 : 0) - p.x) * 0.1;
        p.y += (p.baseY + (mouse.active && mouse.y !== null ? (mouse.y - p.baseY) * strength * pullX * 0.15 : 0) - p.y) * 0.1;

        const alpha = 0.25 + strength * 0.55 + Math.abs(Math.sin(t * 0.8 + p.phase)) * 0.08;
        ctx.strokeStyle = colorStr + alpha.toFixed(3) + ")";
        ctx.lineWidth = lineW + strength * 0.6;
        ctx.lineCap = "round";
        const half = len / 2 + strength * (len * 0.25);
        ctx.beginPath();
        ctx.moveTo(p.x - Math.cos(p.angle) * half, p.y - Math.sin(p.angle) * half);
        ctx.lineTo(p.x + Math.cos(p.angle) * half, p.y + Math.sin(p.angle) * half);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) running = e.isIntersecting;
    }, { threshold: 0 });
    io.observe(canvas);

    window.addEventListener("mousemove", onMove);
    canvas.parentElement && canvas.parentElement.addEventListener("mouseleave", onLeave);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      canvas.parentElement && canvas.parentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mode, color]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block", pointerEvents: "none",
      }}
    />
  );
}

// ─── TIMELINE ─────────────────────────────────────────────
function Timeline() {
  const phases = [
    { week: "Дни 1–3",    title: "Аудит и проектирование",      tasks: ["Интервью с РОПом и менеджерами", "Анализ текущих диалогов и скриптов", "Карта квалифицирующих вопросов", "ТЗ на интеграции"], color: "#60A5FA", glow: "96,165,250" },
    { week: "Дни 4–7",    title: "Разработка ядра агента",      tasks: ["Логика квалификации", "Подключение базы знаний (RAG)", "Промпты и тестовые сценарии", "Тон-оф-войс под бренд"], color: "#A78BFA", glow: "167,139,250" },
    { week: "Дни 8–11",   title: "Интеграции",                  tasks: ["Подключение CRM (Bitrix / amo)", "Интеграция с 1С-склад", "Каналы: WhatsApp, Telegram, виджет", "Передача лидов и уведомления"], color: "#22D3EE", glow: "34,211,238" },
    { week: "Дни 12–14",  title: "Тестирование и запуск",       tasks: ["Прогон 50+ сценариев", "Корректировка скриптов", "Обучение менеджеров", "Запуск в продакшен"], color: "#c8e636", glow: "200,230,54" },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 56 }}>
        <MonoLabel color="#A78BFA">07 — Сроки</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 920, textWrap: "balance",
        }}>
          От подписания договора до запуска — <ItalicLime>2 недели</ItalicLime>.
        </h2>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            padding: 26, borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(to right, ${p.color}, transparent)`,
              borderRadius: "16px 16px 0 0",
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{
                fontFamily: "Geist Mono, monospace", fontSize: 11,
                color: p.color, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>{p.week}</span>
              <span style={{
                fontFamily: "Fraunces, serif", fontStyle: "italic",
                fontSize: 32, color: `rgba(${p.glow}, 0.6)`, lineHeight: 1, fontWeight: 500,
              }}>0{i + 1}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "#fff", marginBottom: 16, letterSpacing: "-0.01em" }}>{p.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.tasks.map((t, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#9ca3af" }}>
                  <Ico name="check" size={12} color={p.color} />
                  <span style={{ lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── PRICING ──────────────────────────────────────────────
function Pricing() {
  return (
    <Section>
      <div style={{ marginBottom: 56 }}>
        <MonoLabel color="#c8e636">08 — Стоимость</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 920, textWrap: "balance",
        }}>
          Прозрачная цена.<br />
          Никаких <ItalicLime>скрытых</ItalicLime> доплат.
        </h2>
      </div>

      <div style={{
        display: "grid", gap: 20,
        gridTemplateColumns: "minmax(380px, 1.4fr) minmax(240px, 1fr)",
        alignItems: "stretch",
      }}>
        {/* Implementation (single card) */}
        <div style={{
          padding: "40px 36px", borderRadius: 24,
          background: "linear-gradient(180deg, rgba(96,165,250,0.10), rgba(167,139,250,0.04))",
          border: "1px solid rgba(96,165,250,0.25)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(96,165,250,0.15)",
              border: "1px solid rgba(96,165,250,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#60A5FA",
            }}><Ico name="zap" size={18} /></div>
            <MonoLabel color="#60A5FA">Внедрение · разово</MonoLabel>
          </div>
          <div style={{ marginBottom: 6, whiteSpace: "nowrap" }}>
            <span style={{
              fontFamily: "Fraunces, serif", fontStyle: "italic",
              fontSize: 64, fontWeight: 500, color: "#fff", lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>160 000</span>
            <span style={{
              fontFamily: "Geist Mono, monospace", fontSize: 18, color: "#9ca3af",
              marginLeft: 10,
            }}>₽</span>
          </div>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 28, marginTop: 8 }}>
            Полная разработка и запуск агента под ключ за 2 недели.
            Ежемесячное сопровождение — <span style={{ color: "#fff" }}>см. раздел 09</span>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Аудит процессов и ТЗ",
              "Разработка логики и промптов агента",
              "Подключение базы знаний (RAG)",
              "Интеграция с CRM (Bitrix / amoCRM)",
              "Интеграция с 1С: Склад",
              "Подключение каналов (WhatsApp, Telegram, сайт)",
              "Тестирование на 50+ сценариях",
              "Обучение команды и документация",
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Ico name="check" size={14} color="#60A5FA" />
                <span style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.5 }}>{it}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right capsules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Старт",        value: "160 000 ₽",   desc: "внедрение под ключ",   color: "#60A5FA", glow: "96,165,250"  },
            { label: "Окупаемость",  value: "3–5 месяцев", desc: "при текущем потоке",   color: "#c8e636", glow: "200,230,54"  },
            { label: "Гарантия",     value: "SLA 99.5%",   desc: "доступности",           color: "#A78BFA", glow: "167,139,250" },
          ].map((c, i) => (
            <div key={i} style={{
              flex: 1,
              padding: "22px 26px", borderRadius: 18,
              background: `rgba(${c.glow}, 0.06)`,
              border: `1px solid rgba(${c.glow}, 0.22)`,
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
            }}>
              <MonoLabel color={c.color}>{c.label}</MonoLabel>
              <div style={{
                fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500,
                fontSize: "clamp(22px, 2vw, 28px)", color: "#fff",
                letterSpacing: "-0.02em", lineHeight: 1,
              }}>{c.value}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── YOUTUBE PLAYER ───────────────────────────────────────
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(s);
    }
  });
  return ytApiPromise;
}

function YouTubeWithTint({ videoId, start = 0, title }) {
  const containerRef = useRef3(null);
  const [isPlaying, setIsPlaying] = useState3(false);

  useEffect3(() => {
    let cancelled = false;
    let player = null;
    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;
      if (!window.YT || !window.YT.Player) return;
      const target = document.createElement("div");
      containerRef.current.appendChild(target);
      player = new window.YT.Player(target, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { start, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            const PLAYING = (window.YT && window.YT.PlayerState && window.YT.PlayerState.PLAYING) || 1;
            setIsPlaying(e.data === PLAYING);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try { if (player && player.destroy) player.destroy(); } catch (e) { /* no-op */ }
    };
  }, [videoId, start]);

  return (
    <div
      title={title}
      style={{
        position: "absolute", inset: 0,
        background: "#000",
      }}
    >
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(8,18,44,0.45), rgba(4,10,28,0.6))",
          pointerEvents: "none",
          opacity: isPlaying ? 0 : 1,
          transition: "opacity 0.4s ease",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─── CASE SHOWCASE ────────────────────────────────────────
function CaseShowcase() {
  const metrics = [
    { v: "+30%",   l: "квалиф. лидов" },
    { v: "3 сек.", l: "первый ответ" },
    { v: "−60%",  l: "нагрузки на команду" },
  ];
  return (
    <Section>
      <div style={{
        marginBottom: 48,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 40, flexWrap: "wrap",
      }}>
        <div>
          <MonoLabel color="#22D3EE">10 — Кейс</MonoLabel>
          <h2 style={{
            marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
            fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
            maxWidth: 700, textWrap: "balance", margin: "16px 0 0 0",
          }}>
            Что получают клиенты <ItalicLime>после внедрения</ItalicLime>.
          </h2>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 24, overflow: "hidden",
        color: "inherit",
      }}>
        {/* Body */}
        <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 8px", borderRadius: 6,
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.30)",
              fontFamily: "Geist Mono, monospace", fontSize: 11,
              color: "#22D3EE", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>E-commerce · B2C</span>
            <span style={{
              fontFamily: "Geist Mono, monospace", fontSize: 11,
              color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>30 дней</span>
          </div>
          <h3 style={{
            fontSize: "clamp(24px, 2.5vw, 34px)",
            fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em",
            margin: 0, color: "#fff",
          }}>
            Как AI-агент автоматизировал обработку заявок и ускорил ответы клиентам.
          </h3>
          <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.55, margin: 0, maxWidth: 480 }}>
            Заменили ручную квалификацию лидов на агента, работающего в чате и WhatsApp.
            Первый ответ — за 3 секунды, 24/7.
          </p>
          <div style={{
            marginTop: "auto",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)",
          }}>
            {metrics.map((m, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(22px, 2vw, 30px)", color: "#c8e636",
                  letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6,
                }}>{m.v}</div>
                <div style={{
                  fontFamily: "Geist Mono, monospace", fontSize: 10,
                  color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em",
                }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div style={{
          position: "relative",
          background: "radial-gradient(circle at 70% 30%, rgba(96,165,250,0.18), transparent 60%), rgba(255,255,255,0.04)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 380,
        }}>
          <div style={{
            position: "absolute", top: 28, right: 28,
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 12px 6px 8px",
            background: "#0a0a0e",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 999, fontSize: 12, fontWeight: 500, color: "#fff",
            zIndex: 2,
          }}>
            <img
              src="assets/blueswan-logo.jpg"
              alt=""
              style={{
                width: 22, height: 22, borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(96,165,250,0.30)",
              }}
            />
            BlueSwan · Игровые ПК
          </div>
          <a
            href="https://www.avito.ru/brands/blueswanpc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BlueSwan на Авито"
            style={{
              position: "absolute", top: 28, left: 28,
              width: 40, height: 40, borderRadius: "50%",
              background: "#fff", color: "#0a0a0e",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2, textDecoration: "none",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, -2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; }}
          >
            <Ico name="arrow-up-right" size={16} />
          </a>
          <YouTubeWithTint videoId="sLYLylVqdJ0" start={1} title="Видео-отзыв BlueSwan" />
        </div>
      </div>
    </Section>
  );
}

// ─── SUPPORT DETAILS ──────────────────────────────────────
function SupportDetails() {
  const features = [
    { label: "Токены LLM-провайдера",            ext: "включены",     base: "включены" },
    { label: "Реакция на сбои и проблемы",       ext: "до 3 часов",   base: "до 48 часов" },
    { label: "Мониторинг работоспособности",     ext: "24/7",         base: "24/7" },
    { label: "Доработки и новые сценарии",       ext: "включены",     base: "—" },
    { label: "Дообучение на реальных диалогах",  ext: "ежемесячно",   base: "—" },
    { label: "Актуализация базы знаний",         ext: "ежемесячно",   base: "—" },
    { label: "Расширение семантики и скриптов",  ext: "включено",     base: "—" },
    { label: "Ежемесячный отчёт по метрикам",    ext: "включён",      base: "—" },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 48 }}>
        <MonoLabel color="#A78BFA">09 — Сопровождение</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(28px, 3.6vw, 42px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 880, textWrap: "balance",
        }}>
          Два <ItalicLime>тарифа</ItalicLime> на выбор.<br />
          Базовый — только токены, расширенный — живой агент.
        </h2>
      </div>

      <div style={{
        borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0a0a0e",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "Geist Mono, monospace",
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          <div style={{
            padding: "20px 28px", color: "#6b7280",
            background: "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center",
          }}>Условие</div>
          <div style={{
            padding: "20px 28px", color: "#c8e636",
            background: "rgba(200,230,54,0.10)",
            display: "flex", alignItems: "center",
          }}>Расширенное · 20 000 ₽/мес</div>
          <div style={{
            padding: "20px 28px", color: "#A78BFA",
            background: "rgba(167,139,250,0.10)",
            display: "flex", alignItems: "center",
          }}>Базовое · 10 000 ₽/мес</div>
        </div>
        {/* Feature rows */}
        {features.map((f, i) => {
          const isLast = i === features.length - 1;
          const rowBorder = !isLast ? "1px solid rgba(255,255,255,0.06)" : "none";
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
              fontSize: 14,
            }}>
              <div style={{
                padding: "16px 28px", color: "#fff",
                borderBottom: rowBorder,
                display: "flex", alignItems: "center",
              }}>{f.label}</div>
              <div style={{
                padding: "16px 28px",
                color: f.ext === "—" ? "#6b7280" : "#fff",
                background: "rgba(200,230,54,0.06)",
                borderBottom: rowBorder,
                display: "flex", alignItems: "center",
              }}>{f.ext}</div>
              <div style={{
                padding: "16px 28px",
                color: f.base === "—" ? "#6b7280" : "#fff",
                background: "rgba(167,139,250,0.06)",
                borderBottom: rowBorder,
                display: "flex", alignItems: "center",
              }}>{f.base}</div>
            </div>
          );
        })}
      </div>

      <p style={{
        fontSize: 13, color: "#9ca3af", marginTop: 20, lineHeight: 1.6,
        fontFamily: "Geist Mono, monospace", letterSpacing: "0.02em",
      }}>
        * Сопровождение начинается со 2-го месяца после запуска.<br />
        * Стоимость базового тарифа указана из расчёта 4 000 контактов в месяц.
      </p>
    </Section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────
function FinalCTA() {
  return (
    <Section style={{ paddingTop: 48, paddingBottom: 96 }}>
      <div style={{
        padding: "72px 56px",
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(20,30,40,0.6), rgba(15,20,30,0.6))",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <FilingsCanvas mode="grid" color="lime" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Eyebrow color="lime">Следующий шаг</Eyebrow>
          <h2 style={{
            marginTop: 28, fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 400, letterSpacing: "-0.035em", lineHeight: 1.05,
            marginBottom: 24, textWrap: "balance",
          }}>
            Запустим агента <ItalicLime>за 2 недели</ItalicLime>.<br />
            Окупится за квартал.
          </h2>
          <p style={{
            fontSize: 18, color: "#9ca3af", lineHeight: 1.55,
            maxWidth: 640, margin: "0 auto",
          }}>
            30 минут — и мы покажем, как агент будет вести именно ваших клиентов.
            Бесплатно, без обязательств.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: 32,
        display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
        fontSize: 13, color: "#9ca3af",
      }}>
        <a href="tel:+79827180576" style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
          <Ico name="phone" size={14} color="#c8e636" /> +7 (982) 718-05-76
        </a>
        <a href="mailto:envisionxai.co@gmail.com" style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
          <Ico name="mail" size={14} color="#c8e636" /> envisionxai.co@gmail.com
        </a>
        <a href="https://t.me/envisionxai" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
          <Ico name="message" size={14} color="#c8e636" /> Telegram · @envisionxai
        </a>
      </div>
    </Section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 10,
      borderTop: "1px solid rgba(255,255,255,0.08)",
      padding: "40px 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="assets/envision_xai_icon.svg" alt="" style={{ width: 22, height: 22, borderRadius: 6 }} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>EnvisionXAI</span>
          <span style={{ color: "#9ca3af", fontSize: 13, marginLeft: 8 }}>· Москва · 2026</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "Geist Mono, monospace", letterSpacing: "0.05em" }}>
          КП № 146 · Бот-квалификатор · Срок действия 30 дней
        </div>
      </div>
    </footer>
  );
}

window.Timeline = Timeline;
window.Pricing = Pricing;
window.SupportDetails = SupportDetails;
window.FinalCTA = FinalCTA;
window.Footer = Footer;
