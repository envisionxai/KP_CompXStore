// kp-sections-2.jsx — Chat Showcase, Capabilities, How It Works
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

// ─── CHAT SHOWCASE ────────────────────────────────────────
const CHAT_SCRIPT = [
  { who: "user", text: "Привет! Хочу собрать игровой ПК, что посоветуете?", delay: 600 },
  { who: "bot",  text: "Привет! Помогу подобрать. Подскажите — в какие игры планируете играть и в каком разрешении: 1080p, 1440p или 4K?", delay: 1400 },
  { who: "user", text: "Cyberpunk и шутеры, монитор 1440p 165 Гц.", delay: 700 },
  { who: "bot",  text: "Понял. Под 1440p high-refresh подойдут сборки на RTX 4070 Super / 4070 Ti. По наличию: «Compx Striker» — 4 шт., «Compx Predator» — 6 шт., «Compx Apex» — 2 шт.", delay: 1600 },
  { who: "user", text: "А по цене?", delay: 600 },
  { who: "bot",  text: "От 220 000 до 360 000 ₽ под ключ — со сборкой, стресс-тестами и доставкой. Какой ориентир по бюджету и к какому сроку нужен ПК?", delay: 1500 },
  { who: "user", text: "Бюджет до 280 000, нужен к концу месяца.", delay: 700 },
  { who: "bot",  text: "Отлично, в этой вилке есть 2 конфигурации со сборкой за 3 рабочих дня. Передаю вас менеджеру — Михаилу (@compx_helper). Свяжется в течение 15 минут с финальной комплектацией и гарантией.", delay: 1500, tag: "handoff" },
];

function Bubble({ who, text, isLast }) {
  const isBot = who === "bot";
  return (
    <div style={{
      display: "flex", justifyContent: isBot ? "flex-start" : "flex-end",
      animation: "fadeInUp 0.4s ease-out",
    }}>
      <div style={{
        maxWidth: "78%",
        padding: "12px 16px", borderRadius: 16,
        borderBottomLeftRadius: isBot ? 4 : 16,
        borderBottomRightRadius: isBot ? 16 : 4,
        background: isBot
          ? "linear-gradient(135deg, rgba(96,165,250,0.14), rgba(167,139,250,0.10))"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${isBot ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.08)"}`,
        color: "#fff", fontSize: 14.5, lineHeight: 1.5,
      }}>
        {text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
      background: "rgba(96,165,250,0.10)",
      border: "1px solid rgba(96,165,250,0.20)",
      width: "fit-content",
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#60A5FA",
          animation: `typing 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ChatShowcase() {
  const [shown, setShown] = useState2([]);
  const [typing, setTyping] = useState2(false);
  const scrollRef = useRef2(null);

  useEffect2(() => {
    let cancelled = false;
    let i = 0;
    const next = () => {
      if (cancelled || i >= CHAT_SCRIPT.length) return;
      const m = CHAT_SCRIPT[i];
      if (m.who === "bot") {
        setTyping(true);
        setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setShown(prev => [...prev, m]);
          i++;
          setTimeout(next, 700);
        }, m.delay);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setShown(prev => [...prev, m]);
          i++;
          setTimeout(next, 400);
        }, m.delay);
      }
    };
    setTimeout(next, 800);
    return () => { cancelled = true; };
  }, []);

  useEffect2(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [shown, typing]);

  return (
    <Section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "stretch" }}>

        <div style={{ paddingTop: 32 }}>
          <MonoLabel color="#A78BFA">04 — Демо</MonoLabel>
          <h2 style={{
            marginTop: 16, fontSize: "clamp(30px, 3.6vw, 44px)",
            fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
            marginBottom: 24, textWrap: "balance",
          }}>
            Так выглядит<br />
            <ItalicLime>квалификация</ItalicLime> в действии.
          </h2>
          <p style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.6, marginBottom: 32 }}>
            Реальный сценарий: входящий запрос на игровой ПК. Агент уточняет
            задачи и разрешение, подсказывает наличие из каталога, выясняет
            бюджет и срок — и передаёт лид менеджеру с заполненной карточкой.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { i: "filter", t: "Потребность зафиксирована", d: "1440p 165 Гц · шутеры + Cyberpunk" },
              { i: "package", t: "Наличие проверено в каталоге", d: "Compx Striker — 4 шт., Predator — 6 шт." },
              { i: "ruble",  t: "Бюджет квалифицирован",   d: "До 280 000 ₽" },
              { i: "calendar", t: "Срок выяснен",          d: "Доставка до конца месяца" },
              { i: "send",   t: "Лид передан менеджеру",   d: "Михаил · @compx_helper" },
            ].map((x, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                paddingBottom: 14, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <div style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: 8,
                  background: "rgba(200,230,54,0.10)",
                  border: "1px solid rgba(200,230,54,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#c8e636",
                }}>
                  <Ico name={x.i} size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 500, marginBottom: 2 }}>{x.t}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af" }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{
          background: "rgba(11,11,15,0.7)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24, overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column",
          minHeight: 560,
        }}>
          {/* Chat header */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.02)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Ico name="bot" size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>AI-агент compXstore</div>
              <div style={{ fontSize: 12, color: "#22D3EE", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3EE" }} />
                онлайн · отвечает за 30 сек
              </div>
            </div>
            <MonoLabel color="#9ca3af">Telegram</MonoLabel>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, padding: "24px 20px",
            display: "flex", flexDirection: "column", gap: 12,
            overflowY: "auto", maxHeight: 480,
          }}>
            {shown.map((m, i) => (
              <Bubble key={i} who={m.who} text={m.text} isLast={i === shown.length - 1} />
            ))}
            {typing && <TypingDots />}
            {shown.some(m => m.tag === "handoff") && (
              <div style={{
                marginTop: 8, padding: "12px 16px", borderRadius: 12,
                background: "rgba(200,230,54,0.08)",
                border: "1px solid rgba(200,230,54,0.25)",
                color: "#c8e636", fontSize: 12.5,
                display: "flex", alignItems: "center", gap: 10,
                animation: "fadeInUp 0.4s ease-out",
              }}>
                <Ico name="check-circle" size={14} />
                Лид создан в CRM · присвоен Михаилу · карточка заполнена
              </div>
            )}
          </div>

          {/* Input mock */}
          <div style={{
            padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 10, alignItems: "center",
          }}>
            <div style={{
              flex: 1, padding: "10px 14px", borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#6b7280", fontSize: 13,
            }}>Сообщение…</div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}>
              <Ico name="send" size={14} />
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}

// ─── CAPABILITIES ─────────────────────────────────────────
function Capabilities() {
  const groups = [
    {
      color: "#60A5FA", glow: "96,165,250", icon: "filter",
      title: "Квалификация",
      items: [
        "Сбор потребности по вашему скрипту",
        "Уточнение бюджета и сроков покупки",
        "Идентификация ЛПР и канала контакта",
        "Скоринг лида: горячий / тёплый / холодный",
      ],
    },
    {
      color: "#A78BFA", glow: "167,139,250", icon: "brain",
      title: "Консультация",
      items: [
        "Ответы на типовые вопросы из базы знаний",
        "Подбор позиций по параметрам клиента",
        "Расчёт стоимости и сроков доставки",
        "Презентация преимуществ — на языке клиента",
      ],
    },
    {
      color: "#22D3EE", glow: "34,211,238", icon: "package",
      title: "Интеграция с 1С",
      items: [
        "Проверка наличия на складе в реальном времени",
        "Резервирование позиций",
        "Сроки поставки под заказ",
        "Цены с учётом текущих остатков",
      ],
    },
    {
      color: "#c8e636", glow: "200,230,54", icon: "send",
      title: "Передача в CRM",
      items: [
        "Заполненная карточка с контекстом",
        "Транскрипт диалога и ключевые поля",
        "Назначение ответственного менеджера",
        "Уведомление в Telegram / на почту",
      ],
    },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 56 }}>
        <MonoLabel color="#60A5FA">05 — Возможности</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 920, textWrap: "balance",
        }}>
          Не «отвечает на вопросы».<br />
          <ItalicLime>Ведёт сделку</ItalicLime> до передачи менеджеру.
        </h2>
      </div>

      <div style={{
        display: "grid", gap: 20,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}>
        {groups.map((g, i) => (
          <div key={i} style={{
            padding: 28, borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", gap: 18,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `rgba(${g.glow}, 0.12)`,
              border: `1px solid rgba(${g.glow}, 0.30)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: g.color,
              boxShadow: `0 0 24px rgba(${g.glow}, 0.15)`,
            }}>
              <Ico name={g.icon} size={20} />
            </div>
            <div style={{ fontSize: 19, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>{g.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {g.items.map((it, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    flexShrink: 0, marginTop: 6, width: 5, height: 5, borderRadius: "50%",
                    background: g.color,
                  }} />
                  <span style={{ fontSize: 13.5, color: "#9ca3af", lineHeight: 1.55 }}>{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────
function HowItWorks() {
  const flow = [
    { side: "in",   icon: "message",  label: "Канал входа",   desc: "WhatsApp · Telegram · виджет на сайте · Avito" },
    { side: "core", icon: "bot",      label: "AI-агент",      desc: "Понимает контекст, ведёт диалог, принимает решения" },
    { side: "kb",   icon: "brain",    label: "База знаний",   desc: "Документы, прайсы, скрипты, FAQ компании" },
    { side: "1c",   icon: "package",  label: "1С-склад",      desc: "Остатки, цены, сроки поставки в реальном времени" },
    { side: "out",  icon: "database", label: "Ваша CRM",      desc: "Bitrix24 · amoCRM · 1C:CRM · Custom" },
    { side: "mgr",  icon: "user",     label: "Менеджер",      desc: "Получает тёплый лид с готовой карточкой" },
  ];
  return (
    <Section>
      <div style={{ marginBottom: 56 }}>
        <MonoLabel color="#22D3EE">06 — Архитектура</MonoLabel>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(32px, 4.4vw, 52px)",
          fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1,
          maxWidth: 920, textWrap: "balance",
        }}>
          Как это <ItalicLime>устроено</ItalicLime> внутри.
        </h2>
      </div>

      <div style={{
        position: "relative",
        padding: "48px 32px",
        background: "rgba(11,11,15,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr 1fr",
          gap: 48, alignItems: "center",
        }}>

          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FlowNode color="#60A5FA" glow="96,165,250" icon="message" label="WhatsApp / Telegram" sub="Вход" />
            <FlowNode color="#60A5FA" glow="96,165,250" icon="users" label="Виджет на сайте" sub="Вход" />
            <FlowNode color="#60A5FA" glow="96,165,250" icon="phone" label="Avito · Email" sub="Вход" />
          </div>

          {/* Core */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <div style={{
              padding: 28, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.14))",
              border: "1px solid rgba(167,139,250,0.35)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              boxShadow: "0 0 64px rgba(167,139,250,0.20)",
              width: "100%",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 24px rgba(96,165,250,0.5)",
              }}>
                <Ico name="bot" size={28} color="#fff" />
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>AI-агент</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                Квалификация · Консультация · Передача
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <FlowNode color="#A78BFA" glow="167,139,250" icon="brain" label="База знаний" sub="RAG" compact />
              <FlowNode color="#22D3EE" glow="34,211,238" icon="package" label="1С Склад" sub="API" compact />
            </div>
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FlowNode color="#c8e636" glow="200,230,54" icon="database" label="CRM (Bitrix / amo)" sub="Выход" />
            <FlowNode color="#c8e636" glow="200,230,54" icon="user" label="Менеджер" sub="Выход" />
            <FlowNode color="#c8e636" glow="200,230,54" icon="chart" label="Аналитика" sub="Выход" />
          </div>

        </div>
      </div>
    </Section>
  );
}

function FlowNode({ color, glow, icon, label, sub, compact }) {
  return (
    <div style={{
      flex: 1,
      padding: compact ? "12px 14px" : "16px 18px",
      borderRadius: 12,
      background: "rgba(11,11,15,0.85)",
      border: `1px solid rgba(${glow}, 0.30)`,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        flexShrink: 0,
        width: compact ? 30 : 36, height: compact ? 30 : 36, borderRadius: 9,
        background: `rgba(${glow}, 0.12)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color,
      }}>
        <Ico name={icon} size={compact ? 14 : 17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontFamily: "Geist Mono, monospace", color,
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2,
        }}>{sub}</div>
        <div style={{ fontSize: compact ? 12.5 : 13.5, color: "#fff", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      </div>
    </div>
  );
}

window.ChatShowcase = ChatShowcase;
window.Capabilities = Capabilities;
window.HowItWorks = HowItWorks;
