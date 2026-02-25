import { useState, useEffect, useRef } from "react";

const CATALOG = [
  { id: 1, name: "Noir Élégance", category: "Masculino", notes: "Cedro · Ámbar · Vetiver", price: "Bs. 280", family: "amaderado", intensity: "Intenso", duration: "8-10h", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoDzsugz3zEVwd0JKf5SAx034rkekGri1PVA&s", desc: "Una composición oscura y sofisticada que evoca la elegancia atemporal de la noche." },
  { id: 2, name: "Rosa Aurum", category: "Femenino", notes: "Rosa · Jazmín · Vainilla", price: "Bs. 310", family: "floral oriental", intensity: "Moderado", duration: "6-8h", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", desc: "Delicadeza floral envuelta en el calor dorado de la vainilla oriental." },
  { id: 3, name: "Brisa Marina", category: "Unisex", notes: "Sal Marina · Bergamota · Musgo", price: "Bs. 260", family: "acuático", intensity: "Suave", duration: "4-6h", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80", desc: "La frescura del océano Pacífico en cada spray. Libre y eterno." },
  { id: 4, name: "Oud Royale", category: "Masculino", notes: "Oud · Pachulí · Incienso", price: "Bs. 420", family: "oriental", intensity: "Muy Intenso", duration: "12h+", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80", desc: "La majestuosidad del oud árabe fusionada con especias del oriente medio." },
  { id: 5, name: "Fleur Blanc", category: "Femenino", notes: "Azahar · Nardo · Almizcle", price: "Bs. 290", family: "floral", intensity: "Suave", duration: "5-7h", img: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&q=80", desc: "Pureza floral blanca que deja un rastro sutil e irresistible." },
  { id: 6, name: "Terra Mystica", category: "Unisex", notes: "Tierra · Sándalo · Tabaco", price: "Bs. 350", family: "terroso", intensity: "Intenso", duration: "8-10h", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNTWLTgNEn2VC4GYsn4h9tD0lnJ3EeV_Arkw&s", desc: "Arraigado en la tierra, misterioso como el bosque al amanecer." },
];

const QUESTIONS = [
  {
    id: "occasion",
    question: "¿Para qué ocasión buscas el perfume?",
    icon: "🎭",
    options: [
      { label: "Uso diario", value: "diario", icon: "☀️" },
      { label: "Noche / eventos", value: "noche", icon: "🌙" },
      { label: "Trabajo", value: "trabajo", icon: "💼" },
      { label: "Regalo especial", value: "regalo", icon: "🎁" },
    ],
  },
  {
    id: "personality",
    question: "¿Cómo describirías tu personalidad?",
    icon: "✨",
    options: [
      { label: "Clásico y sofisticado", value: "clasico", icon: "🎩" },
      { label: "Fresco y aventurero", value: "fresco", icon: "🌊" },
      { label: "Romántico y sensible", value: "romantico", icon: "🌹" },
      { label: "Misterioso e intenso", value: "misterioso", icon: "🌑" },
    ],
  },
  {
    id: "intensity",
    question: "¿Qué intensidad prefieres?",
    icon: "💧",
    options: [
      { label: "Sutil y ligero", value: "suave", icon: "🪶" },
      { label: "Moderado", value: "moderado", icon: "⚖️" },
      { label: "Intenso y duradero", value: "intenso", icon: "🔥" },
      { label: "Muy intenso", value: "muy_intenso", icon: "⚡" },
    ],
  },
];

const SYSTEM_PROMPT_REC = `Eres el sistema de recomendación de Pipe Fernández Perfumería Artesanal. Analiza las preferencias del usuario y recomienda perfumes del catálogo con un razonamiento elegante y persuasivo.

CATÁLOGO:
${CATALOG.map(p => `- ID:${p.id} | ${p.name} | ${p.category} | Familia:${p.family} | ${p.notes} | ${p.price} | Intensidad:${p.intensity} | Duración:${p.duration}`).join("\n")}

TAREA:
1. Analiza las preferencias: ocasión=${"{occasion}"}, personalidad=${"{personality}"}, intensidad=${"{intensity}"}
2. Selecciona los 3 perfumes más adecuados (por ID)
3. Para cada uno explica brevemente por qué es perfecto para este usuario (1-2 oraciones, elegante y persuasivo)

RESPONDE SOLO en formato JSON válido (sin markdown):
{
  "recommendations": [
    {"id": 1, "reason": "..."},
    {"id": 2, "reason": "..."},
    {"id": 3, "reason": "..."}
  ],
  "summary": "Una frase poética sobre el perfil olfativo del usuario"
}`;

export default function RecomendadorInteligente({ onScrollTo }) {
  const [step, setStep] = useState(0); // 0=intro, 1-3=preguntas, 4=loading, 5=resultados
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const containerRef = useRef(null);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length) {
      setStep(s => s + 1);
    }
    if (step === QUESTIONS.length - 1) {
      // Última pregunta: solicitar recomendación
      fetchRecommendations({ ...newAnswers });
    }
  };

  const fetchRecommendations = async (ans) => {
    setStep(4); // loading
    setError("");

    const prompt = SYSTEM_PROMPT_REC
      .replace("{occasion}", ans.occasion || "")
      .replace("{personality}", ans.personality || "")
      .replace("{intensity}", ans.intensity || "");

    try {
      const res = await fetch("/.netlify/functions/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: "recommender",
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || "";

      // Parsear JSON
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const recs = (parsed.recommendations || []).map(r => {
        const product = CATALOG.find(p => p.id === r.id);
        return product ? { ...product, reason: r.reason } : null;
      }).filter(Boolean);

      setRecommendations(recs);
      setSummary(parsed.summary || "");
      setStep(5);
    } catch (err) {
      // Fallback: recomendar top 3 por defecto
      setRecommendations(CATALOG.slice(0, 3).map(p => ({ ...p, reason: "Una fragancia que complementa perfectamente tu perfil olfativo." })));
      setSummary("Tu aura olfativa revela una personalidad única y sofisticada.");
      setStep(5);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setRecommendations([]);
    setSummary("");
    setSelectedCard(null);
  };

  const progress = step <= QUESTIONS.length ? (step / QUESTIONS.length) * 100 : 100;
  const currentQ = QUESTIONS[step - 1];

  return (
    <section id="Recomendador" style={{ padding: "110px 60px", background: "#06050300" }}>
      <style>{`
        .rec-container { max-width: 860px; margin: 0 auto; }
        .rec-option {
          background: #100e08; border: 1px solid #1e1a0e;
          padding: 20px 24px; cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; gap: 14px;
          font-family: 'Montserrat', sans-serif;
        }
        .rec-option:hover { border-color: #c9a84c; transform: translateX(4px); }
        .rec-option.selected { border-color: #c9a84c; background: #1a1208; }
        .rec-card {
          background: #0d0b07; border: 1px solid #1e1a0e;
          overflow: hidden; transition: all 0.35s; cursor: pointer;
        }
        .rec-card:hover { border-color: #c9a84c; transform: translateY(-4px); box-shadow: 0 20px 60px rgba(201,168,76,0.1); }
        .rec-card.expanded { border-color: #c9a84c; }
        .progress-bar {
          height: 1px; background: #1e1a0e; position: relative; overflow: hidden;
          margin-bottom: 48px;
        }
        .progress-fill {
          height: 100%; background: linear-gradient(90deg, #c9a84c, #f5e08b);
          transition: width 0.5s ease;
        }
        .step-indicator {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase; color: #4a3c2a;
          margin-bottom: 8px;
        }
        @keyframes recFadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .anim-in { animation: recFadeIn 0.4s ease both; }
        .spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .reason-tag {
          background: #1a1208; border-left: 2px solid #c9a84c;
          padding: 10px 14px; margin-top: 12px;
          font-family: 'Montserrat', sans-serif; font-size: 11px;
          color: #7a6a4a; line-height: 1.7; font-style: italic;
        }
        @media (max-width: 680px) {
          .rec-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="rec-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>
            Inteligencia Olfativa
          </div>
          <h2 className="pfp" style={{ fontSize: 50, fontWeight: 300, fontStyle: "italic", marginBottom: 20 }}>
            {step === 5 ? "Tu Perfil Olfativo" : "Descubre Tu Fragancia"}
          </h2>
          <div style={{ width: 60, height: 1, background: "#c9a84c", margin: "0 auto 20px" }} />
          {step === 0 && (
            <p className="sans" style={{ fontSize: 13, color: "#5a4a2a", maxWidth: 460, margin: "0 auto" }}>
              Nuestro sistema analiza tu personalidad y preferencias para recomendarte la fragancia perfecta. Solo 3 preguntas.
            </p>
          )}
        </div>

        {/* Progreso */}
        {step > 0 && step < 5 && (
          <div>
            <div className="step-indicator">Pregunta {Math.min(step, QUESTIONS.length)} de {QUESTIONS.length}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* INTRO */}
        {step === 0 && (
          <div className="anim-in" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 32 }}>🌸</div>
            <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
              {[
                { icon: "🎯", text: "Análisis personalizado" },
                { icon: "⚡", text: "Respuesta en segundos" },
                { icon: "✨", text: "3 recomendaciones únicas" },
              ].map((f, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                  <div className="sans" style={{ fontSize: 9, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase" }}>{f.text}</div>
                </div>
              ))}
            </div>
            <button
              className="btn-fill"
              style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 500,
                letterSpacing: 3, textTransform: "uppercase", background: "#c9a84c",
                border: "1px solid #c9a84c", color: "#0a0804", padding: "16px 40px",
                cursor: "pointer", transition: "all 0.3s",
              }}
              onClick={() => setStep(1)}
              onMouseEnter={e => { e.target.style.background = "transparent"; e.target.style.color = "#c9a84c"; }}
              onMouseLeave={e => { e.target.style.background = "#c9a84c"; e.target.style.color = "#0a0804"; }}
            >
              Iniciar análisis
            </button>
          </div>
        )}

        {/* PREGUNTAS */}
        {step >= 1 && step <= QUESTIONS.length && currentQ && (
          <div className="anim-in" key={step}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{currentQ.icon}</div>
              <h3 className="pfp" style={{ fontSize: 34, fontStyle: "italic", fontWeight: 300, marginBottom: 8 }}>
                {currentQ.question}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {currentQ.options.map(opt => (
                <div
                  key={opt.value}
                  className={`rec-option ${answers[currentQ.id] === opt.value ? "selected" : ""}`}
                  onClick={() => handleAnswer(currentQ.id, opt.value)}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.icon}</span>
                  <span className="sans" style={{ fontSize: 13, color: "#c9b99a" }}>{opt.label}</span>
                  <span style={{ marginLeft: "auto", color: "#4a3c2a", fontSize: 12 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === 4 && (
          <div className="anim-in" style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="spin" style={{ fontSize: 48, display: "inline-block", marginBottom: 28 }}>⚗️</div>
            <h3 className="pfp" style={{ fontSize: 28, fontStyle: "italic", marginBottom: 12 }}>
              Analizando tu perfil olfativo
            </h3>
            <p className="sans" style={{ fontSize: 12, color: "#5a4a2a" }}>
              Nuestro sistema está seleccionando las fragancias perfectas para ti...
            </p>
          </div>
        )}

        {/* RESULTADOS */}
        {step === 5 && (
          <div className="anim-in">
            {/* Summary */}
            {summary && (
              <div style={{
                background: "#1a1208", border: "1px solid #2a2010",
                borderLeft: "3px solid #c9a84c", padding: "20px 28px", marginBottom: 40,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>✨</div>
                <p className="pfp" style={{ fontSize: 20, fontStyle: "italic", color: "#c9b99a", lineHeight: 1.6 }}>
                  {summary}
                </p>
              </div>
            )}

            {/* Cards */}
            <div
              className="rec-cards-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 48 }}
            >
              {recommendations.map((p, i) => (
                <div
                  key={p.id}
                  className={`rec-card ${selectedCard === p.id ? "expanded" : ""}`}
                  style={{ animationDelay: `${i * 0.12}s` }}
                  onClick={() => setSelectedCard(selectedCard === p.id ? null : p.id)}
                >
                  {/* Badge */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={p.img} alt={p.name}
                      style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                      onError={e => e.target.style.display = "none"}
                    />
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                      background: "rgba(10,8,4,0.9)", border: "1px solid #c9a84c",
                      padding: "3px 10px",
                      fontFamily: "Montserrat, sans-serif", fontSize: 8,
                      letterSpacing: 2, color: "#c9a84c", textTransform: "uppercase",
                    }}>
                      #{i + 1}
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 22px" }}>
                    <div className="sans" style={{ fontSize: 8, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase", marginBottom: 6 }}>
                      {p.category} · {p.intensity}
                    </div>
                    <h4 className="pfp" style={{ fontSize: 22, fontStyle: "italic", marginBottom: 6 }}>{p.name}</h4>
                    <div className="sans" style={{ fontSize: 9, color: "#3a2a10", letterSpacing: 1, marginBottom: 12 }}>{p.notes}</div>

                    {/* Expanded: reason + details */}
                    {selectedCard === p.id && (
                      <div>
                        <div className="reason-tag">{p.reason}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                          <div>
                            <div className="sans" style={{ fontSize: 8, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase", marginBottom: 4 }}>Duración</div>
                            <div className="pfp" style={{ fontSize: 14, color: "#c9b99a" }}>{p.duration}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="sans" style={{ fontSize: 8, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase", marginBottom: 4 }}>Precio</div>
                            <div className="pfp" style={{ fontSize: 18, color: "#c9a84c", fontStyle: "italic" }}>{p.price}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedCard !== p.id && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="pfp" style={{ fontSize: 18, color: "#c9a84c", fontStyle: "italic" }}>{p.price}</span>
                        <span className="sans" style={{ fontSize: 9, color: "#4a3c2a", letterSpacing: 1 }}>Ver detalles →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 500,
                  letterSpacing: 3, textTransform: "uppercase",
                  background: "#c9a84c", border: "1px solid #c9a84c",
                  color: "#0a0804", padding: "14px 32px", cursor: "pointer", transition: "all 0.3s",
                }}
                onClick={() => {
                  if (onScrollTo) onScrollTo("Contacto");
                  else {
                    const el = document.getElementById("Contacto");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                onMouseEnter={e => { e.target.style.background = "transparent"; e.target.style.color = "#c9a84c"; }}
                onMouseLeave={e => { e.target.style.background = "#c9a84c"; e.target.style.color = "#0a0804"; }}
              >
                Consultar ahora
              </button>
              <button
                style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 500,
                  letterSpacing: 3, textTransform: "uppercase",
                  background: "transparent", border: "1px solid #2a2010",
                  color: "#4a3c2a", padding: "14px 32px", cursor: "pointer", transition: "all 0.3s",
                }}
                onClick={reset}
                onMouseEnter={e => { e.target.style.borderColor = "#c9a84c"; e.target.style.color = "#c9a84c"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#2a2010"; e.target.style.color = "#4a3c2a"; }}
              >
                Reiniciar análisis
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}