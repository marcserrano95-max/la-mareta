// Genera carta.html a partir de assets/carta.json.
// Uso (desde la carpeta del proyecto): node tools/generar-carta.mjs
// Para cambiar un precio o un plato: edita assets/carta.json y vuelve a ejecutar este archivo.
import fs from 'node:fs';
const C = JSON.parse(fs.readFileSync('assets/carta.json', 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const al = a => a ? `<span class="al" title="Alérgenos: ${esc(a.split(',').map(x => C.alergenos[x.trim()]).filter(Boolean).join(', '))}">${a.split(',').map(x => `<i>${x.trim()}</i>`).join('')}</span>` : '';

const row = it => `<li class="row" data-r><div class="rn"><b>${esc(it.n)}</b>${it.d ? `<small>${esc(it.d)}</small>` : ''}${al(it.a)}</div><span class="dots" aria-hidden="true"></span><span class="rp">${Array.isArray(it.p) ? it.p.map(p => `<em>${p} €</em>`).join('') : `<em>${it.p} €</em>`}</span></li>`;
const block = (g, cls = '') => `<section class="blk ${cls}" id="${slug(g.t)}" data-sec>
        <div class="bh" data-r><h3>${esc(g.t)}</h3>${g.cols ? `<span class="cols">${g.cols.map(c => `<i>${c}</i>`).join('')}</span>` : ''}</div>
        ${g.nota ? `<p class="bnote" data-r>${esc(g.nota)}</p>` : ''}
        <ul class="rows${g.cols ? ' two' : ''}">${g.items.map(row).join('')}</ul>
      </section>`;

const brunch = C.brunch.items.map((b, i) => `<article class="bcard" data-r style="--d:${(i % 3) * .08}s">
          <div class="bplate"><img src="assets/mesa/${b.id}.webp" alt="${esc(b.n)}" loading="lazy" decoding="async"></div>
          <h4>${esc(b.n)}</h4><p>${esc(b.d)}</p>
          <div class="bp"><span><small>Plato</small>${b.p} €</span><span><small>Menú brunch</small>${b.m} €</span></div>
          ${al(b.a)}
        </article>`).join('\n        ');

const des = C.desayunos;
const subnav = [['brunch', 'Brunch'], ...C.carta.map(g => [slug(g.t), g.t]), ...C.bebidas.map(g => [slug(g.t), g.t])];

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Carta — La Mareta, specialty coffee &amp; brunch en Paiporta</title>
<meta name="description" content="Carta de La Mareta en Paiporta: desayunos, brunch, tostadas, bocadillos, bowls, crepes, lattes, matcha y batidos, con precios y alérgenos.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='9' fill='%233a1d12'/><g fill='none' stroke='%23fbf4e8' stroke-width='2.4' stroke-linecap='round' transform='translate(4 4)'><path d='M4 12a8 8 0 0 1 16 0'/><path d='M3 17c2-1.6 3.6-1.6 5.4 0s3.6 1.6 5.4 0 3.6-1.6 5.4 0'/></g></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..900&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
:root{--bg:#fbf4e8;--ink:#3a1d12;--deep:#22100a;--soft:#efc6b4;--red:#d33a2c;--tan:#ecd6b2;--light2:#efdccb;--line:rgba(58,29,18,.14);--nav:64px;--ease:cubic-bezier(.22,1,.36,1)}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:140px}
body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}
.serif{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400}
/* barra */
.nav{position:sticky;top:0;z-index:50;height:var(--nav);background:rgba(251,244,232,.86);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);border-bottom:1px solid var(--line)}
.nav .bar{height:100%;max-width:1440px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.nav img{display:block;height:46px;width:auto}
.nav .back{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;background:var(--ink);color:var(--bg);text-decoration:none;font-weight:700;font-size:14px;transition:transform .25s var(--ease)}
.nav .back:hover{transform:translateY(-2px)}
/* cabecera */
.head{position:relative;overflow:hidden;padding:80px 32px 40px;max-width:1440px;margin:0 auto}
.head .eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--red)}
.head h1{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:clamp(84px,14vw,200px);line-height:.85;letter-spacing:-.03em;margin:14px 0 18px}
.head p{max-width:460px;font-size:18px;line-height:1.45;margin:0;opacity:.85}
.float{position:absolute;right:4vw;top:40px;width:min(520px,44vw);aspect-ratio:1;pointer-events:none;perspective:1200px}
.float img{position:absolute;width:46%;filter:drop-shadow(0 30px 30px rgba(34,16,10,.3));will-change:transform}
.float img:nth-child(1){left:2%;top:14%}
.float img:nth-child(2){right:0;top:0;width:40%}
.float img:nth-child(3){left:30%;bottom:2%;width:50%}
/* pestañas */
.tabs{position:sticky;top:var(--nav);z-index:40;background:rgba(251,244,232,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.tabs .in{max-width:1440px;margin:0 auto;padding:14px 32px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.tswitch{position:relative;display:inline-flex;background:var(--light2);border-radius:999px;padding:5px}
.tswitch button{position:relative;z-index:1;border:0;background:none;font:700 15px/1 Inter,sans-serif;color:var(--ink);padding:12px 22px;border-radius:999px;cursor:pointer;transition:color .4s var(--ease)}
.tswitch button[aria-selected="true"]{color:var(--bg)}
.tswitch .pill{position:absolute;z-index:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);transition:left .5s var(--ease),width .5s var(--ease)}
.chips[hidden]{display:none!important}
.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}
.chips::-webkit-scrollbar{display:none}
.chips a{flex:0 0 auto;font-size:13.5px;font-weight:600;text-decoration:none;padding:9px 14px;border-radius:999px;border:1.5px solid var(--line);transition:background .3s,color .3s,border-color .3s}
.chips a.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.panel{max-width:1440px;margin:0 auto;padding:40px 32px 100px}
.panel[hidden]{display:none}
.panel.enter{animation:pin .7s var(--ease)}
@keyframes pin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
/* desayunos */
.dmenu{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:40px;align-items:start}
.dcard{background:#fff8ee;border-radius:30px;padding:clamp(28px,4vw,56px);box-shadow:0 40px 80px -50px rgba(34,16,10,.5);position:relative;overflow:hidden}
.dcard h2{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:clamp(46px,5vw,72px);line-height:.95;margin:0}
.dcard .sub{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:14px 0 26px}
.dcard .sub b{font-size:14px;letter-spacing:.14em;text-transform:uppercase}
.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:13px;font-weight:700}
.dside{position:sticky;top:160px;display:grid;gap:16px}
.dside .ph{border-radius:26px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 30px 60px -40px rgba(34,16,10,.5)}
.dside .ph img{width:100%;height:100%;object-fit:cover}
.dside .note{background:var(--light2);border-radius:22px;padding:22px 24px;font-size:15px;line-height:1.5}
.dside .note a{font-weight:700}
/* filas */
.rows{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0}
.row{display:flex;align-items:flex-end;gap:10px;padding:14px 0;border-bottom:1px dashed var(--line)}
.rn{display:flex;flex-direction:column;gap:3px;min-width:0}
.rn b{font-size:16.5px;font-weight:650;letter-spacing:-.01em}
.rn small{font-size:14px;opacity:.68;line-height:1.4}
.dots{flex:1;min-width:20px;border-bottom:2px dotted rgba(58,29,18,.25);margin-bottom:6px}
.rp{display:flex;gap:18px;white-space:nowrap}
.rp em{font-family:"Instrument Serif",serif;font-style:normal;font-size:24px;line-height:1;min-width:58px;text-align:right}
.al{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}
.al i{font-style:normal;font-size:10.5px;font-weight:800;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--light2);color:var(--ink)}
/* bloques de la carta */
.sec-t{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:clamp(54px,7vw,104px);line-height:.9;letter-spacing:-.02em;margin:70px 0 30px}
.sec-t:first-child{margin-top:10px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px 60px;align-items:start}
.blk{scroll-margin-top:140px;margin-bottom:28px}
.bh{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2px solid var(--ink);padding-bottom:10px;margin-bottom:4px}
.bh h3{margin:0;font-size:14px;letter-spacing:.16em;text-transform:uppercase;font-weight:800}
.cols{display:flex;gap:18px}
.cols i{font-style:normal;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.6;min-width:58px;text-align:right}
.bnote{font-size:13.5px;opacity:.65;margin:10px 0 0;line-height:1.45}
/* brunch */
.bincl{display:flex;align-items:center;gap:20px;flex-wrap:wrap;background:var(--deep);color:var(--bg);border-radius:26px;padding:24px 28px;margin-bottom:26px}
.bincl b{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:30px}
.bincl ul{display:flex;gap:10px;flex-wrap:wrap;list-style:none;margin:0;padding:0}
.bincl li{font-size:14px;background:rgba(251,244,232,.12);padding:8px 14px;border-radius:999px}
.bgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;perspective:1400px}
.bcard{background:#fff8ee;border-radius:26px;padding:24px 24px 26px;transform-style:preserve-3d;transition:transform .5s var(--ease),box-shadow .5s var(--ease);box-shadow:0 30px 60px -48px rgba(34,16,10,.55)}
.bcard:hover{box-shadow:0 44px 80px -44px rgba(34,16,10,.6)}
.bplate{height:180px;display:grid;place-items:center;margin:0 0 18px;transform:translateZ(18px)}
.bplate img{height:170px;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 22px 20px rgba(34,16,10,.35));transition:transform .6s var(--ease)}
.bcard:hover .bplate img{transform:translateY(-8px) rotate(-3deg) scale(1.04)}
.bcard h4{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:30px;line-height:1;margin:0 0 10px}
.bcard p{font-size:14.5px;line-height:1.5;opacity:.75;margin:0 0 16px;min-height:4.5em}
.bp{display:flex;gap:22px;margin-bottom:10px}
.bp span{display:flex;flex-direction:column;font-family:"Instrument Serif",serif;font-size:26px;line-height:1.05}
.bp small{font-family:Inter,sans-serif;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.55}
/* alérgenos */
.alg{margin-top:80px;background:var(--light2);border-radius:30px;padding:clamp(26px,4vw,48px)}
.alg h2{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:clamp(40px,5vw,64px);margin:0 0 14px;line-height:1}
.alg p{font-size:14.5px;line-height:1.55;max-width:820px;opacity:.8;margin:0 0 10px}
.alg ul{list-style:none;padding:0;margin:20px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
.alg li{display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600}
.alg li i{font-style:normal;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:var(--bg);font-size:12px;font-weight:800}
footer{background:var(--deep);color:var(--bg);padding:60px 32px}
footer .in{max-width:1440px;margin:0 auto;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap;font-size:15px;line-height:1.6}
footer a{font-weight:700}
/* aparición */
[data-r]{opacity:0;transform:translateY(22px);transition:opacity .8s var(--ease),transform .9s var(--ease);transition-delay:var(--d,0s)}
.in[data-r]{opacity:1;transform:none}
@media (max-width:1000px){.bgrid{grid-template-columns:1fr 1fr}.dmenu{grid-template-columns:1fr}.dside{position:static}}
@media (max-width:760px){
  :root{--nav:58px}
  .nav .bar,.tabs .in,.panel,.head{padding-left:16px;padding-right:16px}
  .nav img{height:40px}
  .head{padding-top:44px}
  .float{position:relative;right:auto;top:auto;width:100%;max-width:420px;margin:10px auto -20px}
  .grid2,.bgrid{grid-template-columns:1fr}
  .rp em{font-size:21px;min-width:50px}
  .cols i{min-width:50px}
  .bp span{font-size:24px}
  .tswitch button{padding:11px 18px}
}
@media (prefers-reduced-motion:reduce){[data-r]{opacity:1;transform:none;transition:none}.panel.enter{animation:none}.bcard,.bplate img{transition:none}html{scroll-behavior:auto}}
</style>
</head>
<body>
<header class="nav">
  <div class="bar">
    <a href="index.html" aria-label="La Mareta, volver al inicio"><img src="assets/logo.webp" alt="La Mareta · Coffee &amp; Brunch" width="720" height="343"></a>
    <a class="back" href="index.html">← Volver a la web</a>
  </div>
</header>

<div class="head">
  <div class="float" id="float" aria-hidden="true">
    <img src="assets/mesa/american-dream.webp" alt="" data-k="1.2">
    <img src="assets/mesa/nordic-burrata.webp" alt="" data-k="-.8">
    <img src="assets/mesa/green-garden.webp" alt="" data-k=".6">
  </div>
  <div class="eyebrow">La Mareta · Coffee &amp; Brunch · Paiporta</div>
  <h1>La carta</h1>
  <p>Desayunos de tostadas y café, brunch hecho al momento, crepes, bowls y una barra de lattes y matcha. Precios en euros.</p>
</div>

<nav class="tabs" aria-label="Secciones de la carta">
  <div class="in">
    <div class="tswitch" role="tablist">
      <span class="pill" id="pill"></span>
      <button role="tab" id="t-desayunos" aria-controls="p-desayunos" aria-selected="true">Desayunos</button>
      <button role="tab" id="t-carta" aria-controls="p-carta" aria-selected="false">Carta</button>
    </div>
    <div class="chips" id="chips" hidden>${subnav.map(([id, t]) => `<a href="#${id}" data-to="${id}">${esc(t)}</a>`).join('')}</div>
  </div>
</nav>

<main>
  <section class="panel" id="p-desayunos" role="tabpanel" aria-labelledby="t-desayunos">
    <div class="dmenu">
      <div class="dcard" data-r>
        <h2>${esc(des.titulo)}</h2>
        <div class="sub"><b>${esc(des.subtitulo)}</b><span class="badge">${esc(des.horario)}</span></div>
        <ul class="rows">${des.items.map(row).join('')}</ul>
      </div>
      <aside class="dside">
        <div class="ph" data-r style="--d:.1s"><img src="assets/img/foto-14.jpg" alt="Tostada con huevo poché, jamón, tomates cherry, aguacate y salsa" loading="lazy"></div>
        <div class="note" data-r style="--d:.2s">Cada desayuno incluye tostada y café. Si prefieres la tostada sola, o te apetece algo dulce, mira <a href="#carta" data-tab="carta">la carta</a>.</div>
      </aside>
    </div>
  </section>

  <section class="panel" id="p-carta" role="tabpanel" aria-labelledby="t-carta" hidden>
    <h2 class="sec-t" data-r>Brunch</h2>
    <section class="blk" id="brunch" data-sec>
      <div class="bincl" data-r><b>Tu brunch incluye</b><ul>${C.brunch.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="bgrid">
        ${brunch}
      </div>
    </section>

    <h2 class="sec-t" data-r>Para comer</h2>
    <div class="grid2">
      ${C.carta.map(g => block(g)).join('\n      ')}
    </div>

    <h2 class="sec-t" data-r>Para beber</h2>
    <div class="grid2">
      ${C.bebidas.map(g => block(g)).join('\n      ')}
    </div>

    <section class="alg" id="alergenos" data-r>
      <h2>Alérgenos</h2>
      <p>Los números junto a cada plato indican sus alérgenos. Para consultar el listado de alérgenos de cada uno de nuestros productos, pregunta a nuestro personal.</p>
      <p>Por las características de instalación, manipulación y elaboración del establecimiento, todos nuestros productos son susceptibles de contener, de manera directa o a través de contaminación cruzada, algún tipo de alérgeno.</p>
      <ul>${Object.entries(C.alergenos).map(([k, v]) => `<li><i>${k}</i>${esc(v)}</li>`).join('')}</ul>
    </section>
  </section>
</main>

<footer>
  <div class="in">
    <div><b>La Mareta · Coffee &amp; Brunch</b><br>C/ Albal, 1 · 46200 Paiporta, Valencia</div>
    <div>Mañanas 08:00 – 14:00<br>Tardes 17:30 – 21:00 (lunes, martes, miércoles, viernes y domingo)</div>
    <div><a href="tel:+34664138279">+34 664 13 82 79</a><br><a href="index.html">Volver a la web</a></div>
  </div>
</footer>

<script>
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = { desayunos: document.getElementById('t-desayunos'), carta: document.getElementById('t-carta') };
  const panels = { desayunos: document.getElementById('p-desayunos'), carta: document.getElementById('p-carta') };
  const pill = document.getElementById('pill'), chips = document.getElementById('chips');
  let current = null, started = false;
  const placePill = () => { const b = tabs[current]; pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; };
  function open(name, scrollTo) {
    if (!panels[name]) name = 'desayunos';
    if (name !== current) {
      current = name;
      for (const k in panels) { const on = k === name; panels[k].hidden = !on; tabs[k].setAttribute('aria-selected', on); }
      panels[name].classList.remove('enter'); void panels[name].offsetWidth; panels[name].classList.add('enter');
      chips.hidden = name !== 'carta'; placePill();
      panels[name].querySelectorAll('[data-r]').forEach(el => io.observe(el));
    }
    if (scrollTo) { const el = scrollTo === 'top' ? panels[name] : document.getElementById(scrollTo); if (el) setTimeout(() => el.scrollIntoView({ behavior: (RM || !started) ? 'instant' : 'smooth' }), started ? 60 : 250); }
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.head [data-r]').forEach(el => io.observe(el));
  tabs.desayunos.addEventListener('click', () => { open('desayunos'); history.replaceState(null, '', '#desayunos'); });
  tabs.carta.addEventListener('click', () => { open('carta'); history.replaceState(null, '', '#carta'); });
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); open(a.dataset.tab, 'top'); history.replaceState(null, '', '#carta'); }));
  // ruta inicial: #desayunos, #carta o cualquier sección de la carta
  function route() { const h = location.hash.slice(1); const el = h && document.getElementById(h);
    if (el && panels.carta.contains(el)) open('carta', h); else open(h === 'carta' ? 'carta' : 'desayunos'); }
  route(); started = true; addEventListener('hashchange', route);
  addEventListener('resize', placePill);
  document.fonts && document.fonts.ready.then(placePill);
  // chips: marcar la sección visible
  const secs = [...document.querySelectorAll('[data-sec]')], links = [...chips.querySelectorAll('a')];
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(l => l.classList.toggle('on', l.dataset.to === e.target.id)); const on = chips.querySelector('.on'); if (on) chips.scrollTo({ left: on.offsetLeft - chips.clientWidth / 2 + on.offsetWidth / 2, behavior: RM ? 'auto' : 'smooth' }); } }), { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach(s => spy.observe(s));
  // tarjetas del brunch: inclinación 3D con el ratón
  document.querySelectorAll('.bcard').forEach(c => {
    c.addEventListener('pointermove', e => { if (RM || e.pointerType !== 'mouse') return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)'; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
  // platos flotando en la cabecera (scroll y ratón)
  const fl = [...document.querySelectorAll('#float img')]; let mx = 0, my = 0;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  (function loop(t) { if (!RM) fl.forEach((im, i) => { const k = +im.dataset.k; const y = scrollY * .15 * k + Math.sin(t / 1400 + i * 2) * 8; im.style.transform = 'translate3d(' + (mx * 24 * k).toFixed(1) + 'px,' + (y + my * 18 * k).toFixed(1) + 'px,0) rotate(' + (Math.sin(t / 2200 + i) * 4 + scrollY * .02 * k).toFixed(2) + 'deg)'; }); requestAnimationFrame(loop); })(0);
})();
</script>
</body>
</html>
`;
fs.writeFileSync('carta.html', html);
console.log('✓ carta.html generada (' + (html.length / 1024).toFixed(0) + ' KB)');
