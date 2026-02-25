import { useState } from "react";

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

  .lab-root {
    background: #080604;
    padding: 110px 60px;
    font-family: 'Montserrat', sans-serif;
    color: #f0e8d6;
    position: relative;
    overflow: hidden;
  }
  .lab-root::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 700px; height: 700px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.05);
    pointer-events: none;
  }
  .lab-root::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 480px; height: 480px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.04);
    pointer-events: none;
  }

  .lab-inner { max-width: 1020px; margin: 0 auto; position: relative; }

  .lab-eyebrow {
    font-size: 10px; letter-spacing: 6px; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 20px; display: block; text-align: center;
  }
  .lab-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 56px; font-weight: 300; font-style: italic;
    line-height: 1.1; margin-bottom: 20px; color: #f0e8d6; text-align: center;
  }
  .lab-divider { width: 60px; height: 1px; background: #c9a84c; margin: 0 auto 20px; }
  .lab-subtitle {
    font-size: 13px; color: #5a4a2a; max-width: 500px;
    margin: 0 auto 72px; line-height: 1.9; text-align: center;
  }

  .lab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 2px; }
  .lab-field, .lab-field-full {
    background: #100e08; border: 1px solid #1e1a0e;
    padding: 28px 30px; transition: border-color 0.3s;
  }
  .lab-field-full { margin-bottom: 2px; }
  .lab-field:hover, .lab-field-full:hover { border-color: rgba(201,168,76,0.3); }

  .lab-label {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: #c9a84c; display: block; margin-bottom: 16px;
  }

  .lab-options { display: flex; flex-wrap: wrap; gap: 8px; }
  .lab-opt {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    background: transparent; border: 1px solid #2a2010;
    color: #6a5a3a; padding: 9px 18px; cursor: pointer; transition: all 0.25s;
  }
  .lab-opt:hover { border-color: rgba(201,168,76,0.5); color: #c9b99a; }
  .lab-opt.selected { border-color: #c9a84c; color: #c9a84c; background: rgba(201,168,76,0.06); }

  .lab-textarea {
    background: transparent; border: none;
    border-bottom: 1px solid #2a2010; color: #f0e8d6;
    font-family: 'Montserrat', sans-serif; font-size: 12px;
    padding: 10px 0; width: 100%; outline: none; resize: none;
    transition: border-color 0.3s; line-height: 1.7;
  }
  .lab-textarea:focus { border-bottom-color: #c9a84c; }
  .lab-textarea::placeholder { color: #3a2c18; }

  .lab-btn-wrap { text-align: center; margin-top: 40px; }
  .lab-btn-generate {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase;
    background: #c9a84c; border: 1px solid #c9a84c;
    color: #080604; padding: 18px 56px; cursor: pointer; transition: all 0.3s;
  }
  .lab-btn-generate:hover:not(:disabled) { background: transparent; color: #c9a84c; }
  .lab-btn-generate:disabled { opacity: 0.4; cursor: not-allowed; }

  .lab-loading { text-align: center; padding: 60px 0; animation: labFadeIn 0.4s ease; }
  .lab-loading-orb {
    width: 60px; height: 60px; margin: 0 auto 28px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.2);
    border-top-color: #c9a84c;
    animation: labSpin 1.2s linear infinite;
  }
  @keyframes labSpin { to { transform: rotate(360deg); } }
  .lab-loading-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-style: italic; color: #6a5a3a; letter-spacing: 1px;
  }
  .lab-loading-sub {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: #3a2c18; margin-top: 12px;
  }

  .lab-result {
    margin-top: 56px;
    border: 1px solid #c9a84c;
    background: linear-gradient(145deg, #0f0c06, #141008);
    overflow: hidden;
    animation: labFadeUp 0.8s ease both;
  }
  @keyframes labFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes labFadeIn  { from { opacity:0; } to { opacity:1; } }

  .lab-result-header {
    padding: 44px 48px 32px;
    border-bottom: 1px solid #1e1a0e;
    display: flex; align-items: flex-start; gap: 36px;
  }
  .lab-result-icon { font-size: 52px; flex: 0 0 60px; }
  .lab-result-title-block { flex: 1; }
  .lab-result-eyebrow {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 12px; display: block;
  }
  .lab-result-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 46px; font-weight: 300; font-style: italic;
    color: #f0e8d6; line-height: 1.1; margin-bottom: 18px;
  }
  .lab-eslogan {
    font-size: 11px; letter-spacing: 3px; color: #c9a84c;
    text-transform: uppercase; margin-bottom: 20px;
  }
  .lab-result-desc { font-size: 13px; color: #7a6a4a; line-height: 1.95; font-style: italic; max-width: 580px; }

  .lab-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid #1e1a0e; }
  .lab-meta-cell { padding: 24px 28px; border-right: 1px solid #1e1a0e; }
  .lab-meta-cell:last-child { border-right: none; }
  .lab-meta-label { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: #4a3c2a; margin-bottom: 10px; display: block; }
  .lab-meta-val { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; color: #c9a84c; line-height: 1.3; }

  .lab-result-section { padding: 24px 48px; border-top: 1px solid #1e1a0e; }
  .lab-section-title { font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: #4a3c2a; margin-bottom: 14px; display: block; }
  .lab-section-text { font-size: 13px; color: #6a5a3a; line-height: 1.9; }
  .lab-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .lab-tag { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #2a2010; color: #5a4a2a; padding: 6px 14px; }

  .lab-result-cta {
    padding: 26px 48px 34px; border-top: 1px solid #1e1a0e;
    display: flex; justify-content: space-between; align-items: center;
  }
  .lab-cta-text { font-size: 12px; color: #4a3c2a; letter-spacing: 1px; line-height: 1.7; }
  .lab-btn-contact {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase;
    background: transparent; border: 1px solid #c9a84c;
    color: #c9a84c; padding: 12px 28px; cursor: pointer; transition: all 0.3s;
    white-space: nowrap;
  }
  .lab-btn-contact:hover { background: #c9a84c; color: #080604; }

  .lab-btn-reset {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
    background: transparent; border: 1px solid #2a2010;
    color: #4a3c2a; padding: 12px 28px; cursor: pointer; transition: all 0.3s;
    margin: 20px auto 0; display: block;
  }
  .lab-btn-reset:hover { border-color: #c9a84c; color: #c9a84c; }

  .lab-error {
    background: rgba(180,60,60,0.08); border: 1px solid rgba(180,60,60,0.3);
    padding: 20px 28px; margin-top: 24px; text-align: center;
    font-size: 12px; color: #c07070; letter-spacing: 1px; line-height: 1.7;
  }

  .lab-progress {
    font-size: 10px; letter-spacing: 2px; color: #3a2c18;
    text-transform: uppercase; text-align: center; margin-top: 14px; min-height: 18px;
  }

  @media (max-width: 760px) {
    .lab-root { padding: 80px 24px; }
    .lab-title { font-size: 38px; }
    .lab-grid { grid-template-columns: 1fr; }
    .lab-meta-grid { grid-template-columns: 1fr 1fr; }
    .lab-result-header { flex-direction: column; }
    .lab-result-name { font-size: 32px; }
    .lab-result-cta { flex-direction: column; gap: 16px; text-align: center; }
  }
`;

// ─────────────────────────────────────────────
// OPCIONES DE SELECCIÓN
// ─────────────────────────────────────────────
const OPCIONES = {
  notaSalida: [
    { val: "Cítrico", emoji: "🍋" }, { val: "Bergamota", emoji: "🌿" },
    { val: "Frutal", emoji: "🍑" }, { val: "Verde", emoji: "🌱" },
    { val: "Marino", emoji: "🌊" }, { val: "Especiado", emoji: "🌶️" },
  ],
  notaCorazon: [
    { val: "Rosa", emoji: "🌹" }, { val: "Jazmín", emoji: "🌸" },
    { val: "Lirio", emoji: "💐" }, { val: "Iris", emoji: "🪻" },
    { val: "Especias", emoji: "🫚" }, { val: "Cuero", emoji: "🟤" },
  ],
  notaFondo: [
    { val: "Oud", emoji: "🪵" }, { val: "Ámbar", emoji: "🟡" },
    { val: "Vainilla", emoji: "🍦" }, { val: "Musgo", emoji: "🌾" },
    { val: "Sándalo", emoji: "🪨" }, { val: "Almizcle", emoji: "☁️" },
  ],
  ocasion: [
    { val: "Uso Diario" }, { val: "Noche / Salida" },
    { val: "Evento Formal" }, { val: "Romántico" },
    { val: "Ambiente Laboral" }, { val: "Verano / Playa" },
  ],
  personalidad: [
    { val: "Misterioso" }, { val: "Elegante" }, { val: "Romántico" },
    { val: "Fresco" }, { val: "Audaz" }, { val: "Sereno" },
  ],
};

// ─────────────────────────────────────────────
// LLAMADA A IA — OpenRouter
// ─────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = import.meta.env.VITE_GROQ_API_URL;

async function consultarIA({ notaSalida, notaCorazon, notaFondo, ocasion, personalidad }, deseoLibre) {
  const prompt = `Eres el maestro perfumista de "Pipe Fernández Perfumería", una perfumería artesanal de lujo en La Paz, Bolivia. Tu misión es crear una fragancia única y poética basada en las preferencias del cliente.

Preferencias del cliente:
- Nota de Salida: ${notaSalida}
- Nota de Corazón: ${notaCorazon}
- Nota de Fondo: ${notaFondo}
- Ocasión: ${ocasion}
- Personalidad: ${personalidad}
${deseoLibre ? `- Deseo especial: "${deseoLibre}"` : ""}

Responde SOLO con un JSON válido. Sin texto extra, sin markdown, sin bloques de código. Solo el objeto JSON:

{
  "nombre": "Nombre poético del perfume, elegante, puede mezclar español y francés, máximo 4 palabras",
  "eslogan": "Frase corta y memorable, máximo 8 palabras, poética",
  "descripcion": "Párrafo de 3-4 líneas en segunda persona. Describe cómo evoluciona la fragancia desde la salida hasta el fondo. Evoca emociones, momentos, sensaciones. Poético y sofisticado.",
  "intensidad": "Una de: Suave / Moderado / Moderado-Alto / Fuerte / Intenso",
  "estacion": "Estación ideal, ej: Primavera · Verano",
  "duracion": "Duración en horas, ej: 6–8 horas",
  "frasco": "Descripción visual del frasco ideal, específica y lujosa, 1 línea",
  "maridaje": "Con qué momento, ambiente o estado de ánimo combina perfectamente esta fragancia. 1-2 líneas.",
  "ocasionesIdeal": ["ocasion1", "ocasion2", "ocasion3"],
  "ingredientesComplementarios": ["ingrediente1", "ingrediente2", "ingrediente3"]
}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      max_tokens: 900,
    }),
  });

  if (!res.ok) throw new Error(`Error ${res.status}`);

  const data = await res.json();
  const texto = data.choices?.[0]?.message?.content?.trim() || "";

  // Extraer JSON robusto aunque venga con texto extra
  const match = texto.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Respuesta inesperada");
  return JSON.parse(match[0]);
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: Botones de opción
// ─────────────────────────────────────────────
function OpcionGroup({ campo, opciones, valor, onChange }) {
  return (
    <div className="lab-options">
      {opciones.map((op) => (
        <button
          key={op.val}
          type="button"
          className={`lab-opt ${valor === op.val ? "selected" : ""}`}
          onClick={() => onChange(campo, op.val)}
        >
          {op.emoji && <span style={{ marginRight: 6 }}>{op.emoji}</span>}
          {op.val}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function LaboratorioVirtual() {
  const [sel, setSel] = useState({
    notaSalida: "", notaCorazon: "", notaFondo: "", ocasion: "", personalidad: "",
  });
  const [deseoLibre, setDeseoLibre] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [paso, setPaso] = useState("");

  const completo = Object.values(sel).every(Boolean);
  const selCount = Object.values(sel).filter(Boolean).length;

  const handleSelect = (campo, val) => {
    setSel(p => ({ ...p, [campo]: val }));
    if (resultado) setResultado(null);
    if (error) setError("");
  };

  const handleGenerar = async () => {
    if (!completo || cargando) return;
    setCargando(true);
    setResultado(null);
    setError("");

    try {
      setPaso("Analizando tu perfil olfativo...");
      await new Promise(r => setTimeout(r, 500));
      setPaso("El maestro perfumista está componiendo...");
      const data = await consultarIA(sel, deseoLibre);
      setPaso("Finalizando tu fragancia exclusiva...");
      await new Promise(r => setTimeout(r, 400));
      setResultado(data);
    } catch (e) {
      console.error(e);
      setError("No fue posible contactar al maestro perfumista. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setCargando(false);
      setPaso("");
    }
  };

  const handleReset = () => {
    setSel({ notaSalida: "", notaCorazon: "", notaFondo: "", ocasion: "", personalidad: "" });
    setDeseoLibre("");
    setResultado(null);
    setError("");
  };

  const irAContacto = () => {
    document.getElementById("Contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>

      <section id="Laboratorio" className="lab-root">
        <div className="lab-inner">

          {/* HEADER */}
          <span className="lab-eyebrow">⚗️ Experiencia Interactiva con Inteligencia Artificial</span>
          <h2 className="lab-title">Laboratorio Virtual</h2>
          <div className="lab-divider" />
          <p className="lab-subtitle">
            Selecciona tus preferencias olfativas y nuestro maestro perfumista,
            impulsado por inteligencia artificial, creará una fragancia
            poética y exclusiva pensada únicamente para ti.
          </p>

          {/* SELECCIONES */}
          <div className="lab-grid">
            <div className="lab-field">
              <span className="lab-label">🌅 Nota de Salida</span>
              <OpcionGroup campo="notaSalida" opciones={OPCIONES.notaSalida} valor={sel.notaSalida} onChange={handleSelect} />
            </div>
            <div className="lab-field">
              <span className="lab-label">💛 Nota de Corazón</span>
              <OpcionGroup campo="notaCorazon" opciones={OPCIONES.notaCorazon} valor={sel.notaCorazon} onChange={handleSelect} />
            </div>
            <div className="lab-field">
              <span className="lab-label">🌙 Nota de Fondo</span>
              <OpcionGroup campo="notaFondo" opciones={OPCIONES.notaFondo} valor={sel.notaFondo} onChange={handleSelect} />
            </div>
            <div className="lab-field">
              <span className="lab-label">✦ Personalidad</span>
              <OpcionGroup campo="personalidad" opciones={OPCIONES.personalidad} valor={sel.personalidad} onChange={handleSelect} />
            </div>
          </div>

          <div className="lab-field-full">
            <span className="lab-label">🎭 Ocasión</span>
            <OpcionGroup campo="ocasion" opciones={OPCIONES.ocasion} valor={sel.ocasion} onChange={handleSelect} />
          </div>

          {/* DESEO LIBRE */}
          <div className="lab-field-full">
            <span className="lab-label">✍️ Cuéntale algo al perfumista (opcional)</span>
            <textarea
              className="lab-textarea"
              rows={2}
              placeholder="Ej: quiero que me recuerde a los veranos en el Mediterráneo, o algo que evoque nostalgia y calidez..."
              value={deseoLibre}
              maxLength={200}
              onChange={e => setDeseoLibre(e.target.value)}
            />
            <div style={{ fontSize: 9, color: "#2a2010", letterSpacing: 1, marginTop: 8, textAlign: "right" }}>
              {deseoLibre.length} / 200
            </div>
          </div>

          {/* BOTÓN */}
          <div className="lab-btn-wrap">
            <button
              type="button"
              className="lab-btn-generate"
              onClick={handleGenerar}
              disabled={!completo || cargando}
            >
              {cargando
                ? "Creando tu fragancia..."
                : completo
                  ? "✦ Crear Mi Fragancia con IA ✦"
                  : "Completa todas las selecciones"}
            </button>
            <div className="lab-progress">
              {cargando ? paso : `${selCount} / 5 seleccionados`}
            </div>
          </div>

          {/* LOADING */}
          {cargando && (
            <div className="lab-loading">
              <div className="lab-loading-orb" />
              <div className="lab-loading-text">El maestro está componiendo tu fragancia...</div>
              <div className="lab-loading-sub">{paso}</div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="lab-error">
              ⚠ {error}
            </div>
          )}

          {/* RESULTADO */}
          {resultado && !cargando && (
            <div className="lab-result" key={resultado.nombre}>

              {/* Nombre + descripción */}
              <div className="lab-result-header">
                <div className="lab-result-icon">🧪</div>
                <div className="lab-result-title-block">
                  <span className="lab-result-eyebrow">Tu Fragancia Exclusiva · Pipe Fernández Perfumería</span>
                  <div className="lab-result-name">{resultado.nombre}</div>
                  {resultado.eslogan && (
                    <div className="lab-eslogan">"{resultado.eslogan}"</div>
                  )}
                  <p className="lab-result-desc">{resultado.descripcion}</p>
                </div>
              </div>

              {/* Metadatos */}
              <div className="lab-meta-grid">
                {[
                  { label: "Intensidad", val: resultado.intensidad, small: false },
                  { label: "Estación", val: resultado.estacion, small: false },
                  { label: "Duración", val: resultado.duracion, small: false },
                  { label: "Frasco", val: resultado.frasco, small: true },
                ].map(m => (
                  <div key={m.label} className="lab-meta-cell">
                    <span className="lab-meta-label">{m.label}</span>
                    <div className="lab-meta-val" style={{
                      fontSize: m.small ? 11 : 17,
                      fontStyle: m.small ? "normal" : "italic",
                      fontFamily: m.small ? "'Montserrat',sans-serif" : undefined,
                    }}>
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Maridaje */}
              {resultado.maridaje && (
                <div className="lab-result-section">
                  <span className="lab-section-title">🍷 Maridaje Perfecto</span>
                  <p className="lab-section-text">{resultado.maridaje}</p>
                </div>
              )}

              {/* Ingredientes complementarios */}
              {resultado.ingredientesComplementarios?.length > 0 && (
                <div className="lab-result-section">
                  <span className="lab-section-title">✦ Ingredientes Complementarios</span>
                  <div className="lab-tags">
                    {resultado.ingredientesComplementarios.map(i => (
                      <span key={i} className="lab-tag">{i}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ocasiones ideales */}
              {resultado.ocasionesIdeal?.length > 0 && (
                <div className="lab-result-section">
                  <span className="lab-section-title">🎭 Ideal Para</span>
                  <div className="lab-tags">
                    {resultado.ocasionesIdeal.map(o => (
                      <span key={o} className="lab-tag">{o}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pirámide olfativa */}
              <div className="lab-result-section" style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ width: "100%" }}>
                  <span className="lab-section-title">🔺 Tu Pirámide Olfativa</span>
                </div>
                {[
                  { tier: "↑ Salida", val: sel.notaSalida },
                  { tier: "↑ Corazón", val: sel.notaCorazon },
                  { tier: "↑ Fondo", val: sel.notaFondo },
                ].map(n => (
                  <div key={n.tier}>
                    <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#4a3c2a", marginBottom: 6 }}>{n.tier}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: "#c9b99a" }}>{n.val}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="lab-result-cta">
                <div className="lab-cta-text">
                  ¿Te enamoraste de esta fragancia?<br />
                  <span style={{ color: "#4a3c2a" }}>La creamos artesanalmente solo para ti.</span>
                </div>
                <button type="button" className="lab-btn-contact" onClick={irAContacto}>
                  Solicitar Esta Fragancia →
                </button>
              </div>
            </div>
          )}

          {/* RESET */}
          {resultado && (
            <button type="button" className="lab-btn-reset" onClick={handleReset}>
              ↺ Crear otra fragancia
            </button>
          )}

        </div>
      </section>
    </>
  );
}
