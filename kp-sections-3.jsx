// kp-sections-3.jsx — Timeline, Pricing, Support, Final CTA, Footer
const { useEffect: useEffect3, useRef: useRef3 } = React;

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

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>

        {/* Implementation */}
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
            }}>250 000</span>
            <span style={{
              fontFamily: "Geist Mono, monospace", fontSize: 18, color: "#9ca3af",
              marginLeft: 10,
            }}>₽</span>
          </div>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 28, marginTop: 8 }}>
            Полная разработка и запуск агента под ключ за 2 недели.
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

        {/* Расширенное сопровождение (рекомендуем) */}
        <div style={{
          padding: "40px 36px", borderRadius: 24,
          background: "linear-gradient(180deg, rgba(200,230,54,0.10), rgba(34,211,238,0.04))",
          border: "1px solid rgba(200,230,54,0.30)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 20, right: 20,
            padding: "4px 10px", borderRadius: 999,
            background: "rgba(200,230,54,0.15)",
            border: "1px solid rgba(200,230,54,0.35)",
            fontFamily: "Geist Mono, monospace",
            fontSize: 10, color: "#c8e636",
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>Рекомендуем</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(200,230,54,0.12)",
              border: "1px solid rgba(200,230,54,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#c8e636",
            }}><Ico name="settings" size={18} /></div>
            <MonoLabel color="#c8e636">Расширенное · ежемесячно</MonoLabel>
          </div>
          <div style={{ marginBottom: 6, whiteSpace: "nowrap" }}>
            <span style={{
              fontFamily: "Fraunces, serif", fontStyle: "italic",
              fontSize: 64, fontWeight: 500, color: "#fff", lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>20 000</span>
            <span style={{
              fontFamily: "Geist Mono, monospace", fontSize: 18, color: "#9ca3af",
              marginLeft: 10,
            }}>₽ / мес</span>
          </div>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 28, marginTop: 8 }}>
            Агент остаётся актуальным, обучается и улучшается каждый месяц.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Токены LLM-провайдера (включены)",
              "Реакция на сбои — до 3 часов",
              "Доработки и новые сценарии",
              "Дообучение на реальных диалогах",
              "Актуализация базы знаний",
              "Мониторинг 24/7",
              "Ежемесячный отчёт по метрикам",
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Ico name="check" size={14} color="#c8e636" />
                <span style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.5 }}>{it}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Базовое сопровождение */}
        <div style={{
          padding: "40px 36px", borderRadius: 24,
          background: "linear-gradient(180deg, rgba(167,139,250,0.08), rgba(255,255,255,0.02))",
          border: "1px solid rgba(167,139,250,0.22)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#A78BFA",
            }}><Ico name="zap" size={18} /></div>
            <MonoLabel color="#A78BFA">Базовое · только токены</MonoLabel>
          </div>
          <div style={{ marginBottom: 6, whiteSpace: "nowrap" }}>
            <span style={{
              fontFamily: "Fraunces, serif", fontStyle: "italic",
              fontSize: 64, fontWeight: 500, color: "#fff", lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>10 000</span>
            <span style={{
              fontFamily: "Geist Mono, monospace", fontSize: 18, color: "#9ca3af",
              marginLeft: 10,
            }}>₽ / мес</span>
          </div>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 28, marginTop: 8 }}>
            Только токены LLM. Цена указана из расчёта <span style={{ color: "#fff" }}>4 000 контактов / мес</span>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Токены LLM-провайдера (включены)",
              "Реакция на сбои — до 48 часов",
              "Мониторинг работоспособности",
              "Без доработок и дообучения",
              "Без обновления базы знаний",
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Ico name="check" size={14} color="#A78BFA" />
                <span style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.5 }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total bar */}
      <div style={{
        marginTop: 24, padding: "24px 32px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <MonoLabel>Старт</MonoLabel>
          <div style={{ fontSize: 15, color: "#fff", marginTop: 4 }}>
            <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", color: "#60A5FA" }}>250 000 ₽</span>
            {" "}+ от 10 000 ₽/мес со 2-го месяца
          </div>
        </div>
        <div>
          <MonoLabel>Окупаемость</MonoLabel>
          <div style={{ fontSize: 15, color: "#fff", marginTop: 4 }}>
            <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", color: "#c8e636" }}>3–5 месяцев</span>
            {" "}при текущем потоке заявок
          </div>
        </div>
        <div>
          <MonoLabel>Гарантия</MonoLabel>
          <div style={{ fontSize: 15, color: "#fff", marginTop: 4 }}>
            <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", color: "#A78BFA" }}>SLA 99.5%</span>
            {" "}доступности
          </div>
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
          padding: "20px 28px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "Geist Mono, monospace",
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
          alignItems: "center",
        }}>
          <div style={{ color: "#6b7280" }}>Условие</div>
          <div style={{ color: "#c8e636" }}>Расширенное · 20 000 ₽/мес</div>
          <div style={{ color: "#A78BFA" }}>Базовое · 10 000 ₽/мес</div>
        </div>
        {/* Feature rows */}
        {features.map((f, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
            padding: "16px 28px",
            borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            fontSize: 14, alignItems: "center",
          }}>
            <div style={{ color: "#fff" }}>{f.label}</div>
            <div style={{ color: f.ext === "—" ? "#6b7280" : "#fff" }}>{f.ext}</div>
            <div style={{ color: f.base === "—" ? "#6b7280" : "#fff" }}>{f.base}</div>
          </div>
        ))}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Ico name="phone" size={14} color="#c8e636" /> +7 (495) 000-00-00
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Ico name="mail" size={14} color="#c8e636" /> hello@envisionxai.ru
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Ico name="message" size={14} color="#c8e636" /> Telegram · @envisionxai
        </div>
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
