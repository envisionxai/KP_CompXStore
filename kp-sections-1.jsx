// kp-sections-1.jsx — Hero, What we offer, Problem, Solution
const { useState, useEffect, useRef } = React;

// ─── Reusable section wrapper ─────────────────────────────
function Section({ children, id, style = {} }) {
  const isMobile = useIsMobile();
  return (
    <section id={id} style={{
      position: "relative", zIndex: 10,
      padding: isMobile ? "56px 16px" : "96px 24px",
      maxWidth: 1200, margin: "0 auto", width: "100%",
      ...style,
    }}>
      {children}
    </section>
  );
}

function MonoLabel({ children, color = "#9ca3af" }) {
  return (
    <span style={{
      fontFamily: "Geist Mono, monospace",
      fontSize: 11, color, textTransform: "uppercase",
      letterSpacing: "0.1em",
    }}>{children}</span>
  );
}

// ─── HERO ─────────────────────────────────────────────────
function KPHero() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      position: "relative", zIndex: 10,
      paddingTop: isMobile ? 64 : 140,
      paddingBottom: isMobile ? 48 : 80,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>

        {/* Top meta bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16, marginBottom: 56,
          paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#c8e636", boxShadow: "0 0 10px #c8e636",
              animation: "blink 2s ease-in-out infinite",
            }} />
            <MonoLabel color="#c8e636">
              Коммерческое предложение · 2026
              <span style={{ paddingLeft: 20 }}>· CompX Store</span>
            </MonoLabel>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div><MonoLabel>№</MonoLabel> <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 15, color: "#fff" }}>146</span></div>
            <div><MonoLabel>Срок действия</MonoLabel> <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 15, color: "#fff" }}>30 дней</span></div>
          </div>
        </div>

        <h1 style={{
          fontSize: "clamp(44px, 6.2vw, 88px)", fontWeight: 400,
          letterSpacing: "-0.035em", lineHeight: 1.02,
          margin: "32px 0 28px 0", textWrap: "balance",
        }}>
          AI-агент, который<br />
          <ItalicLime>квалифицирует</ItalicLime> клиентов<br />
          <GradientText>за вашу команду.</GradientText>
        </h1>

        <p style={{
          fontSize: 20, color: "#9ca3af", lineHeight: 1.5,
          maxWidth: 720, margin: "0 0 48px 0",
        }}>
          Первичный контакт, выявление потребностей, бюджета и сроков — без участия менеджера.
          В CRM попадает только тёплый лид с понятным запросом и готовый к закрытию.
        </p>

        {/* Quick metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16, marginBottom: 32,
        }}>
          {[
            { v: "−60%", l: "нагрузки на менеджеров", c: "#60A5FA" },
            { v: "24/7", l: "обработка входящих", c: "#A78BFA" },
            { v: "30 сек", l: "до первого ответа", c: "#22D3EE" },
            { v: "×2", l: "конверсия в квал. лид", c: "#c8e636" },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
            }}>
              <div style={{
                fontFamily: "Fraunces, serif", fontStyle: "italic",
                fontSize: 36, fontWeight: 500, color: m.c, lineHeight: 1,
                marginBottom: 8,
              }}>{m.v}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHAT WE OFFER ────────────────────────────────────────
function WhatWeOffer() {
  const isMobile = useIsMobile();
  return (
    <Section>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(200px, 280px) 1fr",
        gap: isMobile ? 24 : 80,
      }}>
        <div>
          <MonoLabel color="#60A5FA">01 — Суть</MonoLabel>
          <h2 style={{
            marginTop: 16, fontSize: 28, fontWeight: 500,
            letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            Что мы<br />предлагаем
          </h2>
        </div>
        <div>
          <p style={{
            fontSize: 24, color: "#fff", lineHeight: 1.45, fontWeight: 300,
            letterSpacing: "-0.01em", marginBottom: 32, textWrap: "balance",
          }}>
            Разработку и внедрение <ItalicLime thickness={2} offset={3}>AI-агента-квалификатора</ItalicLime>,
            который ведёт первичный диалог с клиентом, отвечает на типовые вопросы по
            базе знаний, проверяет наличие на 1С-складе и передаёт менеджеру
            готовый к закрытию лид.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, marginTop: 40 }}>
            {[
              { icon: "filter",   color: "#60A5FA", glow: "96,165,250",  t: "Квалифицирует",  d: "потребность, бюджет, сроки" },
              { icon: "brain",    color: "#A78BFA", glow: "167,139,250", t: "Консультирует",  d: "по базе знаний и каталогу" },
              { icon: "package",  color: "#22D3EE", glow: "34,211,238",  t: "Проверяет",      d: "наличие через 1С-склад" },
              { icon: "send",     color: "#c8e636", glow: "200,230,54",  t: "Передаёт",       d: "тёплый лид в CRM менеджеру" },
            ].map((x, i) => (
              <div key={i} style={{
                padding: "24px 24px 24px 0",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `rgba(${x.glow}, 0.12)`,
                  border: `1px solid rgba(${x.glow}, 0.30)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: x.color, marginBottom: 16,
                  boxShadow: `0 0 24px rgba(${x.glow}, 0.15)`,
                }}>
                  <Ico name={x.icon} size={20} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 6 }}>{x.t}</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── PROBLEM ──────────────────────────────────────────────
function ProblemBlock() {
  const isMobile = useIsMobile();
  const pains = [
    { i: "filter",     t: "Менеджер тонет в нецелевых заявках", d: "До 60% входящих — «просто узнать», вакансии, спам. Время продаж сгорает на сортировке." },
    { i: "clock",      t: "Клиент ждёт ответа часами",          d: "Заявка вечером, ответ утром. К моменту контакта клиент уже ушёл к конкуренту." },
    { i: "git-branch", t: "Каждый менеджер квалифицирует по-своему", d: "Нет единого скрипта — лид приходит на закрытие без бюджета, без сроков, без контекста." },
    { i: "message",    t: "Типовые вопросы повторяются 100 раз в день", d: "«Сколько стоит?», «Есть в наличии?», «Какие сроки?» — менеджер отвечает вручную." },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 48 }}>
        <MonoLabel color="#f87171">02 — Проблема</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 900, textWrap: "balance",
        }}>
          Отдел продаж тратит до <ItalicLime>40%</ItalicLime> времени<br />
          не на закрытие, а на сортировку.
        </h2>
      </div>
      <div style={{
        display: "grid", gap: 16,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      }}>
        {pains.map((p, i) => (
          <div key={i} style={{
            padding: 28, borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(248,113,113,0.12)",
              border: "1px solid rgba(248,113,113,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#f87171",
              boxShadow: "0 0 24px rgba(248,113,113,0.15)",
            }}>
              <Ico name={p.i} size={20} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>{p.t}</div>
            <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.55 }}>{p.d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── SOLUTION ─────────────────────────────────────────────
function SolutionBlock() {
  const steps = [
    { n: "01", t: "Принимает", d: "Подключается к WhatsApp / Telegram / сайту. Отвечает за <1 минуту, 24/7." },
    { n: "02", t: "Квалифицирует", d: "Собирает потребность, бюджет, сроки, контакт. По вашему скрипту, не отступая ни на шаг." },
    { n: "03", t: "Консультирует", d: "Отвечает на типовые вопросы: цены, наличие, характеристики, сроки доставки. Ссылается на базу знаний." },
    { n: "04", t: "Передаёт", d: "Тёплый лид с заполненной карточкой и контекстом диалога — в CRM на ответственного менеджера." },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 56 }}>
        <MonoLabel color="#c8e636">03 — Решение</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 920, textWrap: "balance",
        }}>
          AI-агент с собственной <ItalicLime>логикой</ItalicLime>,<br />
          а не сценарный чат-бот.
        </h2>
        <p style={{ marginTop: 20, fontSize: 17, color: "#9ca3af", maxWidth: 720 }}>
          Понимает живой язык клиента. Ведёт диалог, а не следует скрипту по кнопкам.
          Принимает решения на основе вашей базы знаний и данных из 1С.
        </p>
      </div>

      <div style={{
        display: "grid", gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            padding: 28, borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              fontFamily: "Fraunces, serif", fontStyle: "italic",
              fontSize: 56, fontWeight: 500, color: "rgba(96,165,250,0.5)",
              lineHeight: 1, marginBottom: 16,
            }}>{s.n}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 10, letterSpacing: "-0.01em" }}>{s.t}</div>
            <div style={{ fontSize: 13.5, color: "#9ca3af", lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

window.KPHero = KPHero;
window.WhatWeOffer = WhatWeOffer;
window.ProblemBlock = ProblemBlock;
window.SolutionBlock = SolutionBlock;
window.Section = Section;
window.MonoLabel = MonoLabel;
