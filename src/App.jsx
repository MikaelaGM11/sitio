import { useState, useEffect } from "react";
import LaboratorioVirtual from "./LaboratorioVirtual";

const NAV_LINKS = ["Inicio", "Catálogo", "Personalizado", "Sobre Nosotros", "Contacto"];

const CATALOG = [
  {
    id: 1,
    name: "Noir Élégance",
    category: "Masculino",
    notes: "Cedro · Ámbar · Vetiver",
    price: "Bs. 280",
    desc: "Una composición oscura y sofisticada que evoca la elegancia atemporal de la noche.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoDzsugz3zEVwd0JKf5SAx034rkekGri1PVA&s",
  },
  {
    id: 2,
    name: "Rosa Aurum",
    category: "Femenino",
    notes: "Rosa · Jazmín · Vainilla",
    price: "Bs. 310",
    desc: "Delicadeza floral envuelta en el calor dorado de la vainilla oriental.",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
  },
  {
    id: 3,
    name: "Brisa Marina",
    category: "Unisex",
    notes: "Sal Marina · Bergamota · Musgo",
    price: "Bs. 260",
    desc: "La frescura del océano Pacífico en cada spray. Libre y eterno.",
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
  },
  {
    id: 4,
    name: "Oud Royale",
    category: "Masculino",
    notes: "Oud · Pachulí · Incienso",
    price: "Bs. 420",
    desc: "La majestuosidad del oud árabe fusionada con especias del oriente medio.",
    img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
  },
  {
    id: 5,
    name: "Fleur Blanc",
    category: "Femenino",
    notes: "Azahar · Nardo · Almizcle",
    price: "Bs. 290",
    desc: "Pureza floral blanca que deja un rastro sutil e irresistible.",
    img: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&q=80",
  },
  {
    id: 6,
    name: "Terra Mystica",
    category: "Unisex",
    notes: "Tierra · Sándalo · Tabaco",
    price: "Bs. 350",
    desc: "Arraigado en la tierra, misterioso como el bosque al amanecer.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNTWLTgNEn2VC4GYsn4h9tD0lnJ3EeV_Arkw&s",
  },
];

const TESTIMONIALS = [
  { name: "María González", text: "Mi perfume personalizado es exactamente lo que soñé. Pipe tiene un talento extraordinario para capturar tu esencia.", city: "La Paz" },
  { name: "Carlos Mendoza", text: "Llevo años usando Noir Élégance. Siempre recibo cumplidos a donde voy. ¡Calidad excepcional!", city: "Cochabamba" },
  { name: "Sofía Herrera", text: "El proceso de creación personalizada fue una experiencia mágica. Me sentí escuchada en cada detalle.", city: "Santa Cruz" },
];

const PROCESS_STEPS = [
  { num: "01", title: "Consulta Inicial", desc: "Conversamos sobre tu personalidad, recuerdos y el aroma que quieres proyectar al mundo.", icon: "💬" },
  { num: "02", title: "Exploración", desc: "Pruebas con distintas familias olfativas para identificar tus preferencias únicas.", icon: "🔍" },
  { num: "03", title: "Creación", desc: "Formulamos tu fragancia de manera artesanal con los mejores ingredientes del mundo.", icon: "⚗️" },
  { num: "04", title: "Tu Perfume", desc: "Recibes tu fragancia única, sellada y etiquetada con tu nombre. Solo tuya.", icon: "✨" },
];

export default function PipeFernandezPerfumeria() {
  const [activeSection, setActiveSection] = useState("Inicio");
  const [filterCat, setFilterCat] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = filterCat === "Todos" ? CATALOG : CATALOG.filter(p => p.category === filterCat);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0a0804", color: "#f0e8d6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pfp { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans { font-family: 'Montserrat', sans-serif; }
        .gold { color: #c9a84c; }
        .nav-link {
          font-family: 'Montserrat', sans-serif; font-size: 11px;
          font-weight: 400; letter-spacing: 3px; text-transform: uppercase;
          color: #c9b99a; cursor: pointer; transition: color 0.3s;
          background: none; border: none; padding: 4px 0;
        }
        .nav-link:hover, .nav-link.active { color: #c9a84c; }
        .btn-gold {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          background: transparent; border: 1px solid #c9a84c;
          color: #c9a84c; padding: 14px 32px; cursor: pointer; transition: all 0.3s;
        }
        .btn-gold:hover { background: #c9a84c; color: #0a0804; }
        .btn-fill {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          background: #c9a84c; border: 1px solid #c9a84c;
          color: #0a0804; padding: 14px 32px; cursor: pointer; transition: all 0.3s;
        }
        .btn-fill:hover { background: transparent; color: #c9a84c; }
        .card {
          background: #100e08; border: 1px solid #1e1a0e;
          transition: all 0.4s; cursor: pointer; overflow: hidden;
        }
        .card:hover { border-color: #c9a84c; transform: translateY(-6px); box-shadow: 0 24px 60px rgba(201,168,76,0.12); }
        .card:hover .cimg { transform: scale(1.07); }
        .cimg { transition: transform 0.6s ease; width: 100%; height: 220px; object-fit: cover; display: block; }
        .filter-btn {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 2px; text-transform: uppercase;
          background: transparent; border: 1px solid #2a2010;
          color: #c9b99a; padding: 10px 24px; cursor: pointer; transition: all 0.3s;
        }
        .filter-btn:hover, .filter-btn.active { border-color: #c9a84c; color: #c9a84c; }
        .ifield {
          background: transparent; border: none; border-bottom: 1px solid #2a2010;
          color: #f0e8d6; font-family: 'Montserrat', sans-serif;
          font-size: 13px; padding: 12px 0; width: 100%; outline: none; transition: border-color 0.3s;
        }
        .ifield:focus { border-bottom-color: #c9a84c; }
        .ifield::placeholder { color: #4a3c2a; }
        textarea.ifield { resize: none; }
        .divider { width: 60px; height: 1px; background: #c9a84c; margin: 0 auto; }
        .ha { animation: fadeUp 1.2s ease both; }
        .ha:nth-child(2) { animation-delay: 0.2s; }
        .ha:nth-child(3) { animation-delay: 0.4s; }
        .ha:nth-child(4) { animation-delay: 0.6s; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        .overlay {
          position: fixed; top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.85); z-index: 1000;
          display: flex; align-items:center; justify-content:center;
          backdrop-filter: blur(5px);
        }
        .modal { background: #100e08; border: 1px solid #c9a84c; max-width: 560px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; }
        @media (max-width: 820px) {
          .cat-grid { grid-template-columns: 1fr 1fr !important; }
          .ab-row, .ct-row { flex-direction: column !important; }
          .st-grid { grid-template-columns: 1fr !important; }
          .te-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .hero-h { font-size: 46px !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* Scroll bar */}
      <div style={{
        position: "fixed", left: 0, top: 0, height: 2, zIndex: 9999,
        background: "linear-gradient(90deg,#c9a84c,#f5e08b)",
        width: `${Math.min((scrollY / Math.max(3000 - (typeof window !== "undefined" ? window.innerHeight : 800), 1)) * 100, 100)}%`,
        transition: "width 0.15s",
      }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 998,
        padding: "22px 60px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 60 ? "rgba(10,8,4,0.97)" : "transparent",
        borderBottom: scrollY > 60 ? "1px solid #1e1a0e" : "none",
        backdropFilter: scrollY > 60 ? "blur(12px)" : "none",
        transition: "all 0.4s",
      }}>
        <div onClick={() => scrollToSection("Inicio")} style={{ cursor: "pointer" }}>
          <div className="pfp gold" style={{ fontSize: 22, fontWeight: 300, letterSpacing: 2, fontStyle: "italic" }}>Pipe Fernández</div>
          <div className="sans" style={{ fontSize: 8, letterSpacing: 5, color: "#6a5a3a", textTransform: "uppercase", marginTop: 2 }}>Perfumería Artesanal</div>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 36 }}>
          {NAV_LINKS.map(l => (
            <button key={l} className={`nav-link ${activeSection === l ? "active" : ""}`} onClick={() => scrollToSection(l)}>{l}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="Inicio" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Parallax bg */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img
            src="https://mayence.es/wp-content/uploads/2023/04/Mayence-791-x-527-px-Blog-2.jpg"
            alt="Perfumería de lujo"
            style={{ width: "100%", height: "120%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.18) sepia(0.3)", transform: `translateY(${scrollY * 0.25}px)` }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,4,0.3) 0%, rgba(10,8,4,0.15) 40%, rgba(10,8,4,0.92) 100%)" }} />
        </div>

        {/* Rings */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.09)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 860, padding: "0 40px", paddingTop: 80 }}>
          <div className="ha sans" style={{ fontSize: 10, letterSpacing: 6, color: "#c9a84c", textTransform: "uppercase", marginBottom: 28 }}>
            — Perfumería Artesanal · La Paz, Bolivia —
          </div>
          <h1 className="ha pfp hero-h" style={{ fontSize: 84, fontWeight: 300, fontStyle: "italic", lineHeight: 1.08, marginBottom: 28 }}>
            El arte de crear<br /><span className="gold">tu aroma único</span>
          </h1>
          <p className="ha sans" style={{ fontSize: 13, fontWeight: 300, lineHeight: 2, color: "#9a8a6a", maxWidth: 500, margin: "0 auto 44px", letterSpacing: 0.5 }}>
            Fragancias únicas creadas a mano con los mejores ingredientes del mundo. Desde nuestra colección exclusiva hasta tu perfume completamente personalizado.
          </p>
          <div className="ha" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-fill" onClick={() => scrollToSection("Catálogo")}>Ver Catálogo</button>
            <button className="btn-gold" onClick={() => scrollToSection("Personalizado")}>Crear Mi Perfume</button>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div className="sans" style={{ fontSize: 8, letterSpacing: 5, color: "#4a3c2a", textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, #c9a84c, transparent)" }} />
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: "1px solid #1e1a0e", borderBottom: "1px solid #1e1a0e", padding: "44px 60px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 28 }}>
        {[{ num: "10+", label: "Años de Experiencia" }, { num: "500+", label: "Fragancias Creadas" }, { num: "98%", label: "Clientes Satisfechos" }, { num: "∞", label: "Posibilidades" }].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div className="pfp gold" style={{ fontSize: 44, fontWeight: 300, fontStyle: "italic" }}>{s.num}</div>
            <div className="sans" style={{ fontSize: 9, letterSpacing: 3, color: "#4a3c2a", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CATÁLOGO */}
      <section id="Catálogo" style={{ padding: "110px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>Nuestras Creaciones</div>
          <h2 className="pfp" style={{ fontSize: 54, fontWeight: 300, fontStyle: "italic", marginBottom: 20 }}>Colección</h2>
          <div className="divider" style={{ marginBottom: 20 }} />
          <p className="sans" style={{ fontSize: 13, color: "#5a4a2a", maxWidth: 460, margin: "0 auto" }}>
            Cada fragancia nace de la pasión por el arte perfumístico y los mejores ingredientes naturales.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 48, flexWrap: "wrap" }}>
          {["Todos", "Masculino", "Femenino", "Unisex"].map(cat => (
            <button key={cat} className={`filter-btn ${filterCat === cat ? "active" : ""}`} onClick={() => setFilterCat(cat)}>{cat}</button>
          ))}
        </div>

        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 1140, margin: "0 auto" }}>
          {filtered.map(product => (
            <div key={product.id} className="card" onClick={() => setSelectedProduct(product)}>
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img className="cimg" src={product.img} alt={product.name} onError={e => { e.target.style.display = "none"; }} />
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(10,8,4,0.8)", border: "1px solid #2a2010", padding: "4px 12px" }}>
                  <span className="sans" style={{ fontSize: 8, letterSpacing: 2, color: "#c9a84c", textTransform: "uppercase" }}>{product.category}</span>
                </div>
              </div>
              <div style={{ padding: "26px 26px 30px" }}>
                <h3 className="pfp" style={{ fontSize: 26, fontWeight: 300, fontStyle: "italic", marginBottom: 8 }}>{product.name}</h3>
                <div className="sans" style={{ fontSize: 9, color: "#4a3c2a", letterSpacing: 2, marginBottom: 12 }}>{product.notes}</div>
                <p className="sans" style={{ fontSize: 12, color: "#5a4a2a", lineHeight: 1.8, marginBottom: 22 }}>{product.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="pfp gold" style={{ fontSize: 22, fontStyle: "italic" }}>{product.price}</span>
                  <span className="sans" style={{ fontSize: 9, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase" }}>Ver más →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img src={selectedProduct.img} alt={selectedProduct.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 14, right: 20, background: "none", border: "none", color: "#c9a84c", fontSize: 30, cursor: "pointer" }}>×</button>
            <div style={{ padding: "38px 40px" }}>
              <div className="sans" style={{ fontSize: 8, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 10 }}>{selectedProduct.category}</div>
              <h3 className="pfp" style={{ fontSize: 36, fontStyle: "italic", marginBottom: 10 }}>{selectedProduct.name}</h3>
              <div className="sans" style={{ fontSize: 9, color: "#4a3c2a", letterSpacing: 2, marginBottom: 18 }}>{selectedProduct.notes}</div>
              <p className="sans" style={{ fontSize: 13, color: "#7a6a4a", lineHeight: 1.9, marginBottom: 30 }}>{selectedProduct.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="pfp gold" style={{ fontSize: 30, fontStyle: "italic" }}>{selectedProduct.price}</span>
                <button className="btn-fill" onClick={() => { setSelectedProduct(null); scrollToSection("Contacto"); }}>Consultar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANNER */}
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        <img
          src="https://www.essenza.ng/cdn/shop/articles/733068459365d1aab72388dbfef2ec01.jpg?v=1627477859"
          alt="Ingredientes naturales"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.18) sepia(0.3)" }}
          onError={e => { e.target.parentElement.style.background = "#080604"; e.target.style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px" }}>
          <div className="sans" style={{ fontSize: 9, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 18 }}>Ingredientes de todo el mundo</div>
          <h2 className="pfp" style={{ fontSize: 46, fontStyle: "italic", marginBottom: 20 }}>Naturaleza destilada en frasco</h2>
          <p className="sans" style={{ fontSize: 12, color: "#7a6a4a", maxWidth: 480 }}>
            Rosas de Bulgaria, oud de Arabia, cedro del Líbano, vainilla de Madagascar. Solo lo mejor para tu fragancia.
          </p>
        </div>
      </div>

      {/* PERSONALIZADO */}
      <section id="Personalizado" style={{ padding: "110px 60px", background: "#080604" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>Tu Identidad Olfativa</div>
            <h2 className="pfp" style={{ fontSize: 54, fontWeight: 300, fontStyle: "italic", marginBottom: 20 }}>Perfume Personalizado</h2>
            <div className="divider" style={{ marginBottom: 20 }} />
            <p className="sans" style={{ fontSize: 13, color: "#5a4a2a", maxWidth: 480, margin: "0 auto" }}>
              Trabajamos juntos para crear una fragancia que sea únicamente tuya — un aroma que cuente tu historia.
            </p>
          </div>

          <div style={{ display: "flex", gap: 2, marginBottom: 60, flexWrap: "wrap" }}>
            {/* Workshop image */}
            <div style={{ flex: "0 0 340px", minHeight: 400, position: "relative", overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&q=80"
                alt="Taller de perfumes"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) sepia(0.2)" }}
                onError={e => { e.target.parentElement.style.background = "#100e08"; e.target.style.display = "none"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(8,6,4,0.9))" }} />
              <div style={{ position: "absolute", bottom: 30, left: 28 }}>
                <div className="pfp" style={{ fontSize: 18, fontStyle: "italic" }}>Artesanía pura</div>
                <div className="sans" style={{ fontSize: 8, letterSpacing: 3, color: "#c9a84c", marginTop: 6, textTransform: "uppercase" }}>Desde 2014 · La Paz</div>
              </div>
            </div>
            {/* Steps */}
            <div className="st-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, minWidth: 300 }}>
              {PROCESS_STEPS.map(step => (
                <div key={step.num} style={{ background: "#100e08", border: "1px solid #1e1a0e", padding: "36px 32px", transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a84c"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1a0e"}
                >
                  <div style={{ fontSize: 30, marginBottom: 14 }}>{step.icon}</div>
                  <div className="pfp gold" style={{ fontSize: 14, letterSpacing: 2, marginBottom: 10, opacity: 0.45 }}>{step.num}</div>
                  <h3 className="pfp" style={{ fontSize: 22, fontWeight: 300, marginBottom: 10 }}>{step.title}</h3>
                  <p className="sans" style={{ fontSize: 11, color: "#5a4a2a", lineHeight: 1.8 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btn-gold" onClick={() => scrollToSection("Contacto")}>Iniciar el Proceso</button>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="Sobre Nosotros" style={{ padding: "110px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="ab-row" style={{ display: "flex", gap: 72, alignItems: "center", marginBottom: 100 }}>
            {/* Photo */}
            <div style={{ flex: "0 0 400px", position: "relative" }}>
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=700&q=80"
                  alt="Pipe Fernández"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) sepia(0.15)" }}
                  onError={e => { e.target.parentElement.style.background = "#100e08"; e.target.style.display = "none"; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.75) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                  <div className="pfp" style={{ fontSize: 20, fontStyle: "italic" }}>Pipe Fernández</div>
                  <div className="sans" style={{ fontSize: 8, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginTop: 6 }}>Master Perfumer · La Paz</div>
                </div>
              </div>
              <div style={{ position: "absolute", top: -8, left: -8, width: 44, height: 44, borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" }} />
              <div style={{ position: "absolute", bottom: -8, right: -8, width: 44, height: 44, borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" }} />
            </div>
            {/* Text */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>Nuestra Historia</div>
              <h2 className="pfp" style={{ fontSize: 46, fontWeight: 300, fontStyle: "italic", marginBottom: 28, lineHeight: 1.2 }}>Pasión convertida<br />en arte</h2>
              <div style={{ width: 60, height: 1, background: "#c9a84c", marginBottom: 28 }} />
              <p className="sans" style={{ fontSize: 13, color: "#5a4a2a", lineHeight: 2, marginBottom: 20 }}>
                Soy Pipe Fernández, perfumista artesanal con más de una década dedicada al arte de crear fragancias únicas en Bolivia. Mi camino comenzó con una fascinación profunda por los aromas del mundo natural y la capacidad de los perfumes para evocar emociones y memorias.
              </p>
              <p className="sans" style={{ fontSize: 13, color: "#5a4a2a", lineHeight: 2, marginBottom: 36 }}>
                Trabajo con materias primas de la más alta calidad provenientes de Francia, Medio Oriente y América Latina, combinando técnicas tradicionales con una visión contemporánea única.
              </p>
              <div style={{ display: "flex", gap: 48 }}>
                {[{ num: "2014", label: "Fundación" }, { num: "100%", label: "Natural" }, { num: "La Paz", label: "Bolivia" }].map(s => (
                  <div key={s.label}>
                    <div className="pfp gold" style={{ fontSize: 28, fontStyle: "italic" }}>{s.num}</div>
                    <div className="sans" style={{ fontSize: 9, letterSpacing: 2, color: "#4a3c2a", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 14 }}>Testimonios</div>
            <h3 className="pfp" style={{ fontSize: 38, fontStyle: "italic" }}>Lo que dicen nuestros clientes</h3>
          </div>
          <div className="te-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 1000, margin: "0 auto" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#100e08", border: "1px solid #1e1a0e", padding: "34px" }}>
                <div className="gold" style={{ fontSize: 38, lineHeight: 1, marginBottom: 14, fontFamily: "serif" }}>"</div>
                <p className="sans" style={{ fontSize: 12, color: "#5a4a2a", lineHeight: 1.9, marginBottom: 24, fontStyle: "italic" }}>{t.text}</p>
                <div style={{ borderTop: "1px solid #1e1a0e", paddingTop: 18 }}>
                  <div className="pfp" style={{ fontSize: 16 }}>{t.name}</div>
                  <div className="sans" style={{ fontSize: 9, color: "#4a3c2a", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LaboratorioVirtual />
      {/* CONTACTO */}
      <section id="Contacto" style={{ padding: "110px 60px", background: "#080604" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="sans" style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>Hablemos</div>
            <h2 className="pfp" style={{ fontSize: 54, fontWeight: 300, fontStyle: "italic", marginBottom: 20 }}>Contáctanos</h2>
            <div className="divider" style={{ marginBottom: 20 }} />
            <p className="sans" style={{ fontSize: 13, color: "#5a4a2a" }}>¿Preguntas o deseas crear tu fragancia personalizada? Estamos aquí.</p>
          </div>

          {/* Contact banner image */}
          <div style={{ position: "relative", height: 200, overflow: "hidden", marginBottom: 64 }}>
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4b8af5?w=1200&q=80"
              alt="Fragancias de lujo"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2) sepia(0.2)" }}
              onError={e => { e.target.parentElement.style.background = "#100e08"; e.target.style.display = "none"; }}
            />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div className="pfp" style={{ fontSize: 30, fontStyle: "italic" }}>Una fragancia para cada historia</div>
              <div className="sans" style={{ fontSize: 9, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginTop: 12 }}>Pipe Fernández Perfumería · La Paz, Bolivia</div>
            </div>
          </div>

          <div className="ct-row" style={{ display: "flex", gap: 80 }}>
            {/* Info */}
            <div style={{ flex: "0 0 240px" }}>
              {[
                { label: "Ubicación", val: "La Paz, Bolivia" },
                { label: "WhatsApp", val: "+591 7X XXX XXXX" },
                { label: "Email", val: "info@pipefernandez.com" },
                { label: "Horario", val: "Lun – Sáb · 9:00–19:00" },
              ].map(c => (
                <div key={c.label} style={{ marginBottom: 32 }}>
                  <div className="sans" style={{ fontSize: 8, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
                  <div className="pfp" style={{ fontSize: 16 }}>{c.val}</div>
                </div>
              ))}
              <div>
                <div className="sans" style={{ fontSize: 8, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 12 }}>Síguenos</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {["Instagram", "Facebook", "TikTok"].map(s => (
                    <span key={s} className="sans" style={{ fontSize: 9, letterSpacing: 1, color: "#4a3c2a", textTransform: "uppercase", cursor: "pointer", transition: "color 0.3s" }}
                      onMouseEnter={e => e.target.style.color = "#c9a84c"} onMouseLeave={e => e.target.style.color = "#4a3c2a"}
                    >{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ flex: 1, minWidth: 260 }}>
              {formSent ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div className="gold" style={{ fontSize: 56 }}>✓</div>
                  <h3 className="pfp" style={{ fontSize: 28, fontStyle: "italic", marginTop: 24, marginBottom: 12 }}>¡Mensaje enviado!</h3>
                  <p className="sans" style={{ fontSize: 12, color: "#5a4a2a" }}>Nos pondremos en contacto pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
                  {[
                    { key: "nombre", label: "Nombre completo", placeholder: "Tu nombre", type: "text", req: true },
                    { key: "email", label: "Email", placeholder: "tu@email.com", type: "email", req: true },
                    { key: "telefono", label: "Teléfono / WhatsApp", placeholder: "+591 7X XXX XXXX", type: "text", req: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="sans" style={{ fontSize: 8, letterSpacing: 3, color: "#4a3c2a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input className="ifield" type={f.type} placeholder={f.placeholder} required={f.req}
                        value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label className="sans" style={{ fontSize: 8, letterSpacing: 3, color: "#4a3c2a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Mensaje</label>
                    <textarea className="ifield" rows={4} required placeholder="Cuéntanos qué estás buscando..."
                      value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-fill" style={{ padding: 18 }}>Enviar Mensaje</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1e1a0e", padding: "52px 60px 32px", textAlign: "center" }}>
        <div className="pfp gold" style={{ fontSize: 26, fontStyle: "italic", marginBottom: 6 }}>Pipe Fernández</div>
        <div className="sans" style={{ fontSize: 8, letterSpacing: 5, color: "#2a2010", textTransform: "uppercase", marginBottom: 32 }}>Perfumería Artesanal · La Paz, Bolivia</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
          {NAV_LINKS.map(l => (
            <button key={l} className="nav-link" onClick={() => scrollToSection(l)} style={{ fontSize: 10 }}>{l}</button>
          ))}
        </div>
        <div style={{ width: "100%", height: 1, background: "#1e1a0e", marginBottom: 24 }} />
        <div className="sans" style={{ fontSize: 10, color: "#2a2010", letterSpacing: 1 }}>
          © {new Date().getFullYear()} Pipe Fernández Perfumería · Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}
