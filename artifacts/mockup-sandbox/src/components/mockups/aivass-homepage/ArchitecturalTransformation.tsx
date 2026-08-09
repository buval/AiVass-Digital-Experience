import { useState } from "react";

const paths = ["Individuals", "Businesses", "Organizations"];

function Star({ x, y, size = 9 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 ${-size} L${size * 0.28} ${-size * 0.28} L${size} 0 L${size * 0.28} ${size * 0.28} L0 ${size} L${-size * 0.28} ${size * 0.28} L${-size} 0 L${-size * 0.28} ${-size * 0.28}Z`} />
      <circle r="2" />
    </g>
  );
}

export function ArchitecturalTransformation() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="av-page">
      <style>{`
        @keyframes av-arrive { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes av-node-a { 0%,18% { transform: translate(-50px, -26px); opacity:.3 } 58%,100% { transform: translate(0,0); opacity:1 } }
        @keyframes av-node-b { 0%,18% { transform: translate(44px, -20px); opacity:.3 } 58%,100% { transform: translate(0,0); opacity:1 } }
        @keyframes av-node-c { 0%,18% { transform: translate(0, 50px); opacity:.3 } 58%,100% { transform: translate(0,0); opacity:1 } }
        @keyframes av-line { 0%,32% { opacity:0; stroke-dashoffset:130 } 68%,100% { opacity:.7; stroke-dashoffset:0 } }
        @keyframes av-word { 0%,65% { opacity:0; transform:translateY(10px) } 100% { opacity:1; transform:translateY(0) } }
        .av-page { --navy:#12233F; --navymid:#2C405D; --ox:#7E3033; --oxlight:#D9A39B; --cream:#F7F3E9; --paper:#FDFBF6; --grey:#5F6673; min-height:100dvh; color:var(--navy); background:var(--cream); overflow:hidden; font-family:'DM_Sans', ui-sans-serif, sans-serif; }
        .av-page * { box-sizing:border-box; }
        .av-grain { position:fixed; inset:0; pointer-events:none; opacity:.038; z-index:10; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E"); }
        .av-nav { height:84px; display:flex; align-items:center; justify-content:space-between; max-width:1320px; margin:auto; padding:0 6vw; border-bottom:1px solid rgba(18,35,63,.16); position:relative; z-index:2; }
        .av-logo { color:var(--navy); letter-spacing:-.055em; font:500 25px 'Playfair_Display', Georgia, serif; text-decoration:none; }
        .av-logo i { display:inline-block; width:7px; height:7px; margin-left:4px; background:var(--ox); transform:rotate(45deg); vertical-align:5px; }
        .av-navlinks { display:flex; align-items:center; gap:31px; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .av-navlinks a { color:var(--navy); text-decoration:none; transition:color .2s; }
        .av-navlinks a:hover { color:var(--ox); }
        .av-cta { padding:12px 17px; border:1px solid var(--navy); color:var(--navy); text-decoration:none; font-size:10px; letter-spacing:.12em; text-transform:uppercase; transition:background .2s,color .2s; }
        .av-cta:hover { background:var(--navy); color:var(--cream); }
        .av-menu { display:none; border:0; background:none; color:var(--navy); font:11px 'DM_Sans'; letter-spacing:.15em; text-transform:uppercase; }
        .av-hero { min-height:calc(100dvh - 84px); max-width:1320px; margin:auto; padding:clamp(45px,7vw,95px) 6vw 62px; display:grid; grid-template-columns:1.03fr .97fr; align-items:center; gap:3vw; position:relative; }
        .av-copy { animation:av-arrive .9s .1s both ease-out; position:relative; z-index:1; }
        .av-kicker { display:flex; align-items:center; gap:12px; color:var(--ox); font-size:10px; letter-spacing:.24em; text-transform:uppercase; margin-bottom:26px; }
        .av-kicker:before { content:""; width:34px; height:1px; background:var(--ox); }
        .av-title { max-width:700px; margin:0; font:400 clamp(50px,6.4vw,92px)/.91 'Playfair_Display', Georgia, serif; letter-spacing:-.065em; }
        .av-title em { color:var(--ox); font-style:italic; }
        .av-rule { width:78px; height:1px; background:var(--navy); opacity:.5; margin:33px 0 25px; }
        .av-support { max-width:465px; margin:0; font-size:16px; line-height:1.6; color:var(--navymid); }
        .av-actions { display:flex; align-items:center; gap:25px; margin-top:34px; }
        .av-primary { background:var(--navy); color:var(--cream); border:1px solid var(--navy); padding:15px 22px; text-decoration:none; font-size:10px; letter-spacing:.13em; text-transform:uppercase; }
        .av-secondary { color:var(--navy); text-decoration:none; border-bottom:1px solid var(--ox); padding-bottom:5px; font-size:10px; letter-spacing:.13em; text-transform:uppercase; }
        .av-soul { margin-top:66px; color:var(--grey); font:italic 19px 'Playfair_Display',Georgia,serif; }
        .av-soul span { color:var(--ox); font-style:normal; padding:0 7px; }
        .av-architect { height:490px; position:relative; display:flex; justify-content:center; align-items:center; }
        .av-architect:before { content:""; position:absolute; width:72%; height:80%; border:1px solid rgba(18,35,63,.16); border-bottom:0; border-radius:260px 260px 0 0; top:10%; left:14%; }
        .av-architect:after { content:""; position:absolute; width:56%; height:64%; border:1px solid rgba(126,48,51,.3); border-bottom:0; border-radius:220px 220px 0 0; top:18%; left:22%; }
        .av-svg { width:min(100%,500px); height:auto; position:relative; z-index:1; overflow:visible; }
        .av-svg .triad-line { fill:none; stroke:var(--navymid); stroke-width:1; stroke-dasharray:130; animation:av-line 2.1s .3s both ease-out; }
        .av-svg .node-a { animation:av-node-a 2.1s both cubic-bezier(.2,.7,.2,1); transform-origin:200px 133px; }
        .av-svg .node-b { animation:av-node-b 2.1s both cubic-bezier(.2,.7,.2,1); transform-origin:340px 133px; }
        .av-svg .node-c { animation:av-node-c 2.1s both cubic-bezier(.2,.7,.2,1); transform-origin:270px 254px; }
        .av-svg g { fill:var(--ox); stroke:var(--ox); stroke-width:1; }
        .av-architect-label { position:absolute; right:2%; top:15%; writing-mode:vertical-rl; transform:rotate(180deg); font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:var(--grey); }
        .av-wordmark { position:absolute; bottom:7%; left:50%; transform:translateX(-50%); text-align:center; animation:av-word 1.4s 1.35s both ease-out; white-space:nowrap; }
        .av-wordmark strong { display:block; font:400 25px 'Playfair_Display',Georgia,serif; letter-spacing:-.04em; }
        .av-wordmark small { font-size:8px; letter-spacing:.23em; }
        .av-next { background:var(--navy); color:var(--cream); min-height:220px; display:grid; grid-template-columns:1fr 2.2fr; padding:42px 6vw; gap:5vw; align-items:start; }
        .av-next-intro { color:var(--oxlight); font-size:11px; letter-spacing:.15em; text-transform:uppercase; line-height:1.6; }
        .av-next-intro b { display:block; color:var(--cream); font:400 25px/1.1 'Playfair_Display',Georgia,serif; letter-spacing:-.03em; margin-top:8px; }
        .av-paths { display:grid; grid-template-columns:repeat(3,1fr); border-left:1px solid rgba(247,243,233,.3); }
        .av-path { min-height:132px; padding:0 25px; border-right:1px solid rgba(247,243,233,.3); position:relative; }
        .av-path:before { content:""; display:block; width:45px; height:70px; border:1px solid var(--oxlight); border-bottom:0; border-radius:40px 40px 0 0; margin:0 0 18px 0; opacity:.8; }
        .av-path span { color:var(--cream); font:400 21px 'Playfair_Display',Georgia,serif; }
        @media (max-width: 700px) {
          .av-nav { height:70px; padding:0 23px; } .av-navlinks { display:none; position:absolute; top:70px; left:0; right:0; padding:23px; background:var(--paper); border-bottom:1px solid rgba(18,35,63,.15); flex-direction:column; align-items:flex-start; gap:18px; } .av-navlinks.open { display:flex; } .av-menu { display:block; }
          .av-hero { min-height:calc(100dvh - 70px); display:flex; flex-direction:column; align-items:stretch; padding:48px 23px 44px; gap:0; } .av-kicker { margin-bottom:19px; } .av-title { font-size:56px; line-height:.93; } .av-support { font-size:14px; max-width:330px; } .av-rule { margin:25px 0 20px; } .av-actions { margin-top:25px; gap:18px; } .av-soul { margin-top:32px; font-size:17px; } .av-architect { height:270px; margin-top:10px; } .av-architect:before { width:80%; left:10%; height:90%; } .av-architect:after { width:62%; left:19%; height:73%; } .av-wordmark { bottom:3%; } .av-wordmark strong { font-size:21px; } .av-next { padding:35px 23px 0; display:block; min-height:310px; } .av-next-intro { margin-bottom:27px; } .av-paths { margin:0 -23px; } .av-path { padding:0 14px; min-height:128px; } .av-path:before { width:34px; height:55px; } .av-path span { font-size:16px; } .av-architect-label { right:-1%; top:11%; }
        }
      `}</style>
      <div className="av-grain" />
      <nav className="av-nav">
        <a className="av-logo" href="#top">AiVass<i /></a>
        <div className={`av-navlinks ${menuOpen ? "open" : ""}`}>
          {["Solutions", "Insights", "About", "Contact"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
          <a className="av-cta" href="#conversation">Start a Conversation</a>
        </div>
        <button className="av-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
      </nav>
      <section className="av-hero" id="top">
        <div className="av-copy">
          <div className="av-kicker">Transformation studio · 01</div>
          <h1 className="av-title">Building<br /><em>extraordinary</em><br />futures.</h1>
          <div className="av-rule" />
          <p className="av-support">A boutique transformation studio where intelligent systems, human connection and strategic architecture come together to build what comes next.</p>
          <div className="av-actions"><a className="av-primary" href="#paths">Explore AiVass</a><a className="av-secondary" href="#paths">Find Your Path ↗</a></div>
          <div className="av-soul">Automation <span>with</span> Soul.</div>
        </div>
        <div className="av-architect" aria-label="AiVass connected transformation triad">
          <div className="av-architect-label">Three points · one direction</div>
          <svg className="av-svg" viewBox="0 0 540 370" role="img">
            <path className="triad-line" d="M200 133 L340 133 L270 254 Z M200 133 L270 254" />
            <g className="node-a"><Star x={200} y={133} size={10} /></g>
            <g className="node-b"><Star x={340} y={133} size={10} /></g>
            <g className="node-c"><Star x={270} y={254} size={10} /></g>
            <path d="M70 310 H470" fill="none" stroke="rgba(18,35,63,.22)" strokeWidth="1" />
          </svg>
          <div className="av-wordmark"><strong>AiVass</strong><small>BUILDING EXTRAORDINARY FUTURES</small></div>
        </div>
      </section>
      <section className="av-next" id="paths">
        <div className="av-next-intro">The next threshold <b>Find your<br />direction.</b></div>
        <div className="av-paths">
          {paths.map((path) => <a className="av-path" href={`#${path.toLowerCase()}`} key={path}><span>{path}</span></a>)}
        </div>
      </section>
    </main>
  );
}

export default ArchitecturalTransformation;