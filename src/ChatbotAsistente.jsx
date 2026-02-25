import { useState, useRef, useEffect } from "react";

const CATALOG = [
    { id: 1, name: "Noir Élégance", category: "Masculino", notes: "Cedro · Ámbar · Vetiver", price: "Bs. 280", family: "amaderado" },
    { id: 2, name: "Rosa Aurum", category: "Femenino", notes: "Rosa · Jazmín · Vainilla", price: "Bs. 310", family: "floral oriental" },
    { id: 3, name: "Brisa Marina", category: "Unisex", notes: "Sal Marina · Bergamota · Musgo", price: "Bs. 260", family: "acuático" },
    { id: 4, name: "Oud Royale", category: "Masculino", notes: "Oud · Pachulí · Incienso", price: "Bs. 420", family: "oriental" },
    { id: 5, name: "Fleur Blanc", category: "Femenino", notes: "Azahar · Nardo · Almizcle", price: "Bs. 290", family: "floral" },
    { id: 6, name: "Terra Mystica", category: "Unisex", notes: "Tierra · Sándalo · Tabaco", price: "Bs. 350", family: "terroso" },
];

const SYSTEM_PROMPT = `Eres el asistente virtual de Pipe Fernández Perfumería Artesanal, una perfumería de lujo en La Paz, Bolivia. Tu nombre es Aura.

CATÁLOGO DISPONIBLE:
${CATALOG.map(p => `- ${p.name} (${p.category}): ${p.notes} - ${p.price}`).join("\n")}

TU PERSONALIDAD:
- Elegante, cálida y apasionada por los aromas
- Usas un lenguaje sofisticado pero accesible
- Eres experta en familias olfativas, duración e intensidad de fragancias
- Puedes sugerir regalos personalizados según ocasión y personalidad
- Guías a los usuarios hacia el Laboratorio Virtual si detectas interés creativo
- Sugieres productos del catálogo de forma estratégica y natural

RESTRICCIONES:
- No das información médica ni asesoramiento químico técnico avanzado
- No procesas datos personales sensibles
- Mantén siempre el tono de la marca: lujoso, artesanal, íntimo
- Respuestas concisas (máximo 3 párrafos)
- Si el usuario quiere comprar, invítalo a contactar vía WhatsApp o formulario

Responde siempre en español. Sé específica y útil.`;

const QUICK_ACTIONS = [
    { icon: "🌹", text: "Familias olfativas" },
    { icon: "🎁", text: "Recomendar regalo" },
    { icon: "⚗️", text: "Usar el laboratorio" },
    { icon: "💧", text: "Duración e intensidad" },
];

export default function ChatbotAsistente() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Bienvenido a Pipe Fernández Perfumería. Soy *Aura*, tu asistente olfativa. ¿Buscas una fragancia para ti, un regalo especial, o quieres explorar el Laboratorio Virtual?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
        return () => clearInterval(interval);
    }, [loading]);

    const sendMessage = async (text) => {
        const userText = text || input.trim();
        if (!userText || loading) return;
        setInput("");

        const newMessages = [...messages, { role: "user", content: userText }];
        setMessages(newMessages);
        setLoading(true);

        // Construir historial con system prompt como primer mensaje
        const history = [
            { role: "user", content: SYSTEM_PROMPT },        // ← inyectar como primer user
            { role: "assistant", content: "Entendido. Soy Aura, la asistente olfativa de Pipe Fernández. Estoy aquí para ayudarte." },
            ...newMessages,
        ];

        try {
            const response = await fetch("/.netlify/functions/groq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: history,   // ← enviar messages directamente, no dentro de prompt
                }),
            });

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content
                || "Lo siento, no pude procesar tu consulta. ¿Puedes intentarlo de nuevo?";

            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (err) {
            console.error("Error chatbot:", err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Hubo un problema de conexión. Por favor intenta nuevamente."
            }]);
        } finally {
            setLoading(false);
        }
    };
    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMsg = (text) =>
        text.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");

    return (
        <>
            <style>{`
        .chat-bubble-btn {
          position: fixed; bottom: 32px; right: 32px; z-index: 9990;
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #c9a84c, #8a6a1e);
          border: none; cursor: pointer;
          box-shadow: 0 8px 32px rgba(201,168,76,0.35);
          transition: all 0.3s; display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .chat-bubble-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(201,168,76,0.5); }
        .chat-bubble-btn.open { background: linear-gradient(135deg, #2a2010, #1a1208); }

        .chat-panel {
          position: fixed; bottom: 106px; right: 32px; z-index: 9989;
          width: 380px; max-width: calc(100vw - 48px);
          background: #0d0b07; border: 1px solid #2a2010;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08);
          display: flex; flex-direction: column;
          transform-origin: bottom right;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        .chat-panel.closed {
          transform: scale(0.85) translateY(20px);
          opacity: 0; pointer-events: none;
        }
        .chat-panel.opened { transform: scale(1) translateY(0); opacity: 1; }

        .chat-header {
          background: linear-gradient(135deg, #1a1208, #0d0b07);
          border-bottom: 1px solid #2a2010;
          padding: 18px 20px; display: flex; align-items: center; gap: 14px;
        }
        .chat-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #c9a84c22, #c9a84c11);
          border: 1px solid #c9a84c44;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .online-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4caf7d; box-shadow: 0 0 6px #4caf7d88;
          display: inline-block; margin-left: 6px;
        }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 14px;
          min-height: 280px; max-height: 380px;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: #2a2010; border-radius: 3px; }

        .msg { display: flex; gap: 8px; animation: msgIn 0.25s ease; max-width: 100%; }
        .msg.user { flex-direction: row-reverse; }
        @keyframes msgIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

        .msg-bubble {
          font-family: 'Montserrat', sans-serif; font-size: 12px;
          line-height: 1.7; padding: 12px 16px; max-width: 82%;
          border-radius: 2px;
        }
        .msg.assistant .msg-bubble {
          background: #1a1208; border: 1px solid #2a2010;
          color: #c9b99a;
        }
        .msg.user .msg-bubble {
          background: linear-gradient(135deg, #c9a84c, #a08030);
          color: #0a0804; font-weight: 500;
        }

        .typing-indicator {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 16px; background: #1a1208;
          border: 1px solid #2a2010; width: fit-content;
          font-family: 'Montserrat', sans-serif; font-size: 11px;
          color: #4a3c2a; font-style: italic;
        }
        .typing-dots { display: flex; gap: 4px; }
        .typing-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #c9a84c; animation: typingPulse 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingPulse { 0%,80%,100% { opacity:0.3; transform:scale(0.8); } 40% { opacity:1; transform:scale(1); } }

        .quick-actions {
          padding: 10px 16px; display: flex; gap: 6px; flex-wrap: wrap;
          border-top: 1px solid #1a1208;
        }
        .qa-btn {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 1px; text-transform: uppercase;
          background: transparent; border: 1px solid #2a2010;
          color: #4a3c2a; padding: 6px 10px; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .qa-btn:hover { border-color: #c9a84c; color: #c9a84c; }

        .chat-input-row {
          padding: 14px 16px; border-top: 1px solid #1e1a0e;
          display: flex; gap: 10px; align-items: flex-end;
          background: #0d0b07;
        }
        .chat-input {
          flex: 1; background: transparent; border: none;
          border-bottom: 1px solid #2a2010;
          color: #f0e8d6; font-family: 'Montserrat', sans-serif;
          font-size: 12px; padding: 8px 0; outline: none;
          resize: none; line-height: 1.5; max-height: 80px;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-bottom-color: #c9a84c; }
        .chat-input::placeholder { color: #2a2010; }
        .send-btn {
          background: #c9a84c; border: none; cursor: pointer;
          width: 34px; height: 34px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; transition: all 0.2s;
          font-size: 14px;
        }
        .send-btn:hover { background: #a08030; }
        .send-btn:disabled { background: #2a2010; cursor: not-allowed; }

        .chat-badge {
          position: absolute; top: -4px; right: -4px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #c9a84c; color: #0a0804;
          font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badgePop { from { transform:scale(0); } to { transform:scale(1); } }
      `}</style>

            {/* Botón flotante */}
            <button
                className={`chat-bubble-btn ${open ? "open" : ""}`}
                onClick={() => setOpen(o => !o)}
                title="Asistente Olfativo"
                style={{ position: "fixed" }}
            >
                {open ? "✕" : "💬"}
                {!open && messages.length === 1 && (
                    <div className="chat-badge">1</div>
                )}
            </button>

            {/* Panel de chat */}
            <div className={`chat-panel ${open ? "opened" : "closed"}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-avatar">✨</div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontSize: 16, fontStyle: "italic", color: "#f0e8d6",
                            display: "flex", alignItems: "center", gap: 6
                        }}>
                            Aura <span className="online-dot" />
                        </div>
                        <div style={{
                            fontFamily: "Montserrat, sans-serif", fontSize: 9,
                            letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase", marginTop: 2
                        }}>
                            Asistente Olfativa · Pipe Fernández
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        style={{ background: "none", border: "none", color: "#4a3c2a", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
                    >
                        ×
                    </button>
                </div>

                {/* Mensajes */}
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`msg ${msg.role}`}>
                            {msg.role === "assistant" && (
                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1a1208", border: "1px solid #2a2010", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✨</div>
                            )}
                            <div
                                className="msg-bubble"
                                dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
                            />
                        </div>
                    ))}

                    {loading && (
                        <div className="msg assistant">
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1a1208", border: "1px solid #2a2010", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✨</div>
                            <div className="typing-indicator">
                                <div className="typing-dots">
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                                escribiendo
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Acciones rápidas (solo si pocas mensajes) */}
                {messages.length <= 2 && (
                    <div className="quick-actions">
                        {QUICK_ACTIONS.map((qa, i) => (
                            <button key={i} className="qa-btn" onClick={() => sendMessage(qa.text)}>
                                {qa.icon} {qa.text}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="chat-input-row">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder="Escribe tu consulta..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <button
                        className="send-btn"
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                    >
                        →
                    </button>
                </div>
            </div>
        </>
    );
}