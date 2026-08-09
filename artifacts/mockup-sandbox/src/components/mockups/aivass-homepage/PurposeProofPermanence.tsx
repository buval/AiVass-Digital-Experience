import { useState, type CSSProperties } from "react";

const palette = {
  navy: "#12233F",
  navyMid: "#2C405D",
  ox: "#7E3033",
  oxLight: "#D9A39B",
  cream: "#F7F3E9",
  paper: "#FDFBF6",
  grey: "#5F6673",
};

function Star({ x, y, label, caption, delay }: { x: number; y: number; label: string; caption: string; delay: string }) {
  return (
    <g className="pp-star" style={{ "--delay": delay } as CSSProperties}>
      <circle cx={x} cy={y} r="47" fill={palette.paper} stroke={palette.navy} strokeWidth="1" />
      <path d={`M ${x} ${y - 17} L ${x + 5} ${y - 5} L ${x + 17} ${y} L ${x + 5} ${y + 5} L ${x} ${y + 17} L ${x - 5} ${y + 5} L ${x - 17} ${y} L ${x - 5} ${y - 5} Z`} fill={palette.ox} />
      <text x={x} y={y + 72} textAnchor="middle" className="pp-node-label">{label}</text>
      <text x={x} y={y + 88} textAnchor="middle" className="pp-node-caption">{caption}</text>
    </g>
  );
}

export function PurposeProofPermanence() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="pp-shell">
      <style>{`
        .pp-shell { --navy:${palette.navy}; --mid:${palette.navyMid}; --ox:${palette.ox}; --oxLight:${palette.oxLight}; --cream:${palette.cream}; --paper:${palette.paper}; --grey:${palette.grey}; min-height:100dvh; background:var(--cream); color:var(--navy); overflow:hidden; font-family:'DM Sans', sans-serif; }
        .pp-shell * { box-sizing:border-box; }
        .pp-nav { height:82px; display:flex; align-items:center; justify-content:space-between; padding:0 5.3vw; border-bottom:1px solid rgba(18,35,63,.18); position:relative; z-index:5; }
        .pp-mark { display:flex; align-items:center; gap:11px; color:var(--navy); text-decoration:none; }
        .pp-mark svg { width:25px; height:25px; }
        .pp-mark-name { font:600 18px 'DM Sans', sans-serif; letter-spacing:-.045em; }
        .pp-navlinks { display:flex; gap:29px; align-items:center; }
        .pp-navlinks a { color:var(--navy); font-size:11px; letter-spacing:.07em; text-decoration:none; text-transform:uppercase; }
        .pp-navlinks a:hover { color:var(--ox); }
        .pp-nav-cta { border:1px solid var(--navy); padding:12px 18px; text-transform:none!important; letter-spacing:.01em!important; font-size:12px!important; transition:background .25s,color .25s; }
        .pp-nav-cta:hover { background:var(--navy); color:var(--paper)!important; }
        .pp-menu { display:none; background:none; border:0; color:var(--navy); font:500 11px 'DM Sans'; letter-spacing:.1em; text-transform:uppercase; }
        .pp-hero { min-height:690px; display:grid; grid-template-columns: minmax(0, .95fr) minmax(460px,1.05fr); padding:0 5.3vw; position:relative; }
        .pp-copy { align-self:center; padding:18px 0 85px; max-width:580px; }
        .pp-kicker { font:600 10px 'DM Sans'; letter-spacing:.2em; color:var(--ox); text-transform:uppercase; margin:0 0 29px; display:flex; align-items:center; gap:11px; }
        .pp-kicker:before { content:""; width:28px; height:1px; background:var(--ox); }
        .pp-title { font:400 clamp(54px, 6.2vw, 90px)/.92 'Playfair Display', serif; letter-spacing:-.065em; margin:0; max-width:620px; }
        .pp-title em { color:var(--ox); font-style:italic; }
        .pp-support { max-width:425px; font-size:15px; line-height:1.65; color:var(--grey); margin:30px 0 27px; }
        .pp-actions { display:flex; gap:12px; align-items:center; }
        .pp-button { appearance:none; border:1px solid var(--navy); background:var(--navy); color:var(--paper); padding:14px 21px; font:500 12px 'DM Sans'; letter-spacing:.02em; cursor:pointer; }
        .pp-button.secondary { color:var(--navy); background:transparent; }
        .pp-button:hover { background:var(--ox); border-color:var(--ox); color:var(--paper); }
        .pp-soul { margin-top:56px; color:var(--navyMid); font:italic 16px 'Playfair Display'; letter-spacing:.01em; }
        .pp-diagram-wrap { display:flex; align-items:center; justify-content:center; position:relative; min-height:580px; }
        .pp-diagram-wrap:before { content:""; position:absolute; width:390px; height:390px; border:1px solid rgba(18,35,63,.15); border-radius:50%; }
        .pp-diagram-wrap:after { content:""; position:absolute; width:1px; height:100%; background:rgba(18,35,63,.09); left:50%; top:0; }
        .pp-diagram { width:min(100%,590px); height:auto; position:relative; z-index:1; overflow:visible; }
        .pp-diagram .pp-lines { stroke-dasharray:500; stroke-dashoffset:500; animation:pp-draw 2.1s cubic-bezier(.55,0,.2,1) .5s forwards; }
        .pp-star { opacity:0; animation:pp-arrive .8s cubic-bezier(.2,.8,.2,1) var(--delay) forwards; }
        .pp-node-label { font:600 10px 'DM Sans'; letter-spacing:.18em; fill:var(--navy); }
        .pp-node-caption { font:italic 12px 'Playfair Display'; fill:var(--grey); }
        .pp-diagram-note { position:absolute; right:9%; top:17%; writing-mode:vertical-rl; text-transform:uppercase; letter-spacing:.22em; font-size:9px; color:var(--grey); }
        .pp-bottom { background:var(--navy); color:var(--paper); padding:27px 5.3vw 34px; display:flex; align-items:end; justify-content:space-between; min-height:126px; position:relative; }
        .pp-bottom:before { content:""; position:absolute; left:5.3vw; right:5.3vw; top:0; border-top:1px solid rgba(217,163,155,.55); }
        .pp-bottom-overline { color:var(--oxLight); text-transform:uppercase; letter-spacing:.2em; font-size:9px; margin:0 0 12px; }
        .pp-bottom h2 { font:400 28px/1.05 'Playfair Display'; margin:0; letter-spacing:-.03em; }
        .pp-paths { display:flex; gap:27px; color:var(--oxLight); font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
        .pp-paths span { display:flex; align-items:center; gap:8px; }
        .pp-paths i { width:6px; height:6px; border:1px solid var(--oxLight); transform:rotate(45deg); display:inline-block; }
        .pp-modal { position:fixed; inset:0; background:rgba(18,35,63,.72); z-index:20; display:grid; place-items:center; padding:20px; }
        .pp-modal-card { background:var(--paper); width:min(450px,100%); padding:36px; box-shadow:0 20px 60px rgba(18,35,63,.2); }
        .pp-modal-card h3 { font:400 34px 'Playfair Display'; margin:0 0 10px; }
        .pp-modal-card p { color:var(--grey); line-height:1.6; font-size:14px; }
        .pp-close { float:right; border:0; background:none; font-size:20px; cursor:pointer; color:var(--navy); }
        @keyframes pp-draw { to { stroke-dashoffset:0; } }
        @keyframes pp-arrive { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width:767px) {
          .pp-nav { height:70px; padding:0 22px; } .pp-navlinks { display:none; position:absolute; top:70px; left:0; right:0; padding:20px 22px 24px; background:var(--paper); border-bottom:1px solid rgba(18,35,63,.18); flex-direction:column; align-items:flex-start; gap:18px; } .pp-navlinks.open { display:flex; } .pp-menu { display:block; }
          .pp-hero { display:flex; flex-direction:column; padding:0 22px; min-height:0; } .pp-copy { padding:55px 0 15px; } .pp-kicker { margin-bottom:21px; } .pp-title { font-size:57px; line-height:.94; max-width:350px; } .pp-support { font-size:14px; margin:24px 0 22px; max-width:340px; } .pp-soul { margin-top:33px; } .pp-actions { flex-wrap:wrap; }
          .pp-diagram-wrap { min-height:375px; margin-top:5px; } .pp-diagram-wrap:before { width:280px; height:280px; } .pp-diagram-wrap:after { height:92%; } .pp-diagram { width:100%; } .pp-diagram-note { right:3%; top:12%; font-size:8px; }
          .pp-bottom { min-height:166px; padding:25px 22px 26px; display:block; } .pp-bottom:before { left:22px; right:22px; } .pp-bottom h2 { font-size:25px; max-width:280px; } .pp-paths { margin-top:23px; gap:17px; flex-wrap:wrap; }
        }
      `}</style>
      <nav className="pp-nav">
        <a className="pp-mark" href="#top" aria-label="AiVass home">
          <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 2 18 12 28 15 18 18 15 28 12 18 2 15 12 12Z" fill={palette.ox} /></svg>
          <span className="pp-mark-name">AiVass</span>
        </a>
        <div className={`pp-navlinks ${menuOpen ? "open" : ""}`}>
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#insights" onClick={() => setMenuOpen(false)}>Insights</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setContactOpen(true)}>Contact</a>
          <a className="pp-nav-cta" href="#contact" onClick={() => setContactOpen(true)}>Start a Conversation</a>
        </div>
        <button className="pp-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>{menuOpen ? "Close" : "Menu"}</button>
      </nav>
      <section className="pp-hero" id="top">
        <div className="pp-copy">
          <p className="pp-kicker">Purpose / Proof / Permanence</p>
          <h1 className="pp-title">Building <em>extraordinary</em> futures.</h1>
          <p className="pp-support">A boutique transformation studio where intelligent systems, human connection and strategic architecture come together to build what comes next.</p>
          <div className="pp-actions"><button className="pp-button" onClick={() => setContactOpen(true)}>Explore AiVass</button><a className="pp-button secondary" href="#paths">Find Your Path</a></div>
          <p className="pp-soul">Automation with Soul.</p>
        </div>
        <div className="pp-diagram-wrap" aria-label="Purpose, Proof and Permanence triad">
          <span className="pp-diagram-note">A connected transformation architecture</span>
          <svg className="pp-diagram" viewBox="0 0 620 440" role="img">
            <path className="pp-lines" d="M310 103 L165 300 L455 300 Z" fill="none" stroke={palette.navy} strokeWidth="1.1" />
            <path className="pp-lines" d="M310 103 L310 300" fill="none" stroke={palette.navyMid} strokeWidth=".6" opacity=".55" />
            <Star x={310} y={103} label="PURPOSE" caption="why it matters" delay=".1s" />
            <Star x={165} y={300} label="PROOF" caption="make it visible" delay=".32s" />
            <Star x={455} y={300} label="PERMANENCE" caption="what remains" delay=".54s" />
          </svg>
        </div>
      </section>
      <section className="pp-bottom" id="paths">
        <div><p className="pp-bottom-overline">The same architecture. Your path.</p><h2>Where transformation<br />becomes personal.</h2></div>
        <div className="pp-paths"><span><i />Individuals</span><span><i />Businesses</span><span><i />Organizations</span></div>
      </section>
      {contactOpen && <div className="pp-modal" role="dialog" aria-modal="true" onClick={() => setContactOpen(false)}><div className="pp-modal-card" onClick={(e) => e.stopPropagation()}><button className="pp-close" onClick={() => setContactOpen(false)} aria-label="Close">×</button><p className="pp-kicker">Start a conversation</p><h3>Let’s build what comes next.</h3><p>Tell us where you are headed. A member of the AiVass studio will be in touch.</p><button className="pp-button" onClick={() => setContactOpen(false)}>Continue</button></div></div>}
    </main>
  );
}

export default PurposeProofPermanence;