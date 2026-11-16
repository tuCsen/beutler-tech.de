// Beutler Tech – Steuerung der Animation „Warum Beutler Tech“ auf der Startseite.
(() => {
  const host = document.getElementById('warum-anim');
  if (!host) return;
  // Ältere Browser ohne deklaratives Shadow DOM: Template von Hand einhängen.
  if (!host.shadowRoot) {
    const tpl = host.querySelector('template');
    if (!tpl || !host.attachShadow) return;
    host.attachShadow({ mode: 'open' }).appendChild(tpl.content);
    tpl.remove();
  }
  const root = host.shadowRoot;
  const $ = id => root.getElementById(id);
  const stage = $('stage');
  const scenes = [...stage.querySelectorAll('.scene')];
  const durs = scenes.map(s => parseFloat(s.dataset.dur));
  const starts = durs.reduce((a, d, i) => (a.push(i ? a[i - 1] + durs[i - 1] : 0), a), []);
  const total = durs.reduce((a, b) => a + b, 0);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // S1 chips
  const words = ['ChatGPT','Copilot','KI-Agenten','Prompts','Automatisierung','DSGVO','KI-Verordnung','Chatbots','RAG','Lizenzen','Claude','Mistral','Gemini','n8n','Bildgeneratoren','Lokale Modelle','Schatten-KI','Make'];
  const spots = [[6,10],[30,6],[62,9],[82,16],[4,32],[78,36],[12,70],[40,84],[70,78],[86,60],[20,50],[52,22],[60,62],[2,88],[86,88],[34,32],[24,90],[74,4]];
  const noise = $('noise');
  words.forEach((w, i) => {
    const c = document.createElement('span');
    c.className = 'chip anim';
    c.textContent = w;
    const [x, y] = spots[i];
    c.style.cssText = `--x:${x}%;--y:${y}%;--d:${(i * 0.12).toFixed(2)}s;--dur:${3 + (i % 4)}s;--dx:${(i % 2 ? 1 : -1) * (1 + i % 3)}cqw;--dy:${(i % 3 ? -1 : 1) * (1 + i % 2)}cqw`;
    noise.appendChild(c);
  });

  // S7 matrix: f = ja, h = teilweise, n = meist nicht
  const cols = ['KI-Agentur','Online-Kurs','Förder&shy;programm','Tool-Anbieter','Beutler Tech'];
  const rows = [
    ['Ein fester Ansprechpartner', 'h','n','h','n','f'],
    ['Umsetzung in Ihrem Betrieb', 'f','n','h','h','f'],
    ['Schulung mit echten Aufgaben', 'h','h','h','h','f'],
    ['Herstellerunabhängig', 'h','f','f','n','f'],
    ['Persönlich vor Ort am Bodensee', 'h','n','h','n','f'],
    ['Kosten vorher klar', 'h','f','f','f','f'],
  ];
  const words7 = { f: 'ja', h: 'teilweise', n: 'meist nicht' };
  const m = $('matrix');
  let html = '<div class="ch rl" role="columnheader"></div>' + cols.map((c, i) => `<div class="ch${i === 4 ? ' bt' : ''}" role="columnheader">${c}</div>`).join('');
  rows.forEach((r, ri) => {
    html += `<div class="rl" role="rowheader">${r[0]}</div>`;
    r.slice(1).forEach((v, ci) => {
      const d = (ci === 4 ? 4.2 + ri * 0.25 : 0.8 + ri * 0.22 + ci * 0.08).toFixed(2);
      html += `<div class="${ci === 4 ? 'bt' : ''}" role="cell"><i class="dot ${v} cell anim" style="--d:${d}s" aria-label="${words7[v]}"></i></div>`;
    });
  });
  m.innerHTML = html;

  // Chapters
  const chaps = $('chapters');
  chaps.style.setProperty('--cols', durs.map(d => d + 'fr').join(' '));
  scenes.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chap';
    b.setAttribute('aria-label', `Szene ${i + 1}: ${s.dataset.label}`);
    b.innerHTML = `<span class="bar"><i></i></span><span class="lbl">${s.dataset.label}</span>`;
    b.addEventListener('click', () => go(i, true));
    chaps.appendChild(b);
  });
  const fills = [...chaps.querySelectorAll('.bar i')];
  const chapBtns = [...chaps.children];

  const playBtn = $('play');
  const timeEl = $('time');
  const icPause = playBtn.innerHTML;
  const icPlay = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>';

  let t = 0, cur = -1, playing = false, last = performance.now();
  let userPaused = reduce, inView = false;

  function activate(i) {
    scenes.forEach((s, k) => { if (k !== i) s.classList.remove('on'); });
    const s = scenes[i];
    s.classList.remove('on'); void s.offsetWidth; s.classList.add('on');
    chapBtns.forEach((b, k) => b.classList.toggle('cur', k === i));
    cur = i;
  }
  function go(i, user) {
    t = starts[i];
    activate(i);
    if (user && reduce) render();
  }
  function setPlaying(p) {
    playing = p;
    stage.classList.toggle('paused', !p);
    playBtn.innerHTML = p ? icPause : icPlay;
    playBtn.setAttribute('aria-label', p ? 'Pause' : 'Abspielen');
    last = performance.now();
  }
  function render() {
    const idx = starts.findLastIndex ? starts.findLastIndex(s => t >= s) : starts.filter(s => t >= s).length - 1;
    if (idx !== cur) activate(idx);
    fills.forEach((f, k) => {
      const p = k < idx ? 1 : k > idx ? 0 : (t - starts[k]) / durs[k];
      f.style.width = (reduce && k === idx ? 100 : Math.min(100, p * 100)) + '%';
    });
    const sec = Math.floor(t);
    timeEl.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  }
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing) {
      t += dt;
      if (t >= total) { t = total - 0.001; setPlaying(false); }
    }
    render();
    requestAnimationFrame(tick);
  }

  playBtn.addEventListener('click', () => {
    if (!playing && t >= total - 0.01) go(0);
    userPaused = playing;
    setPlaying(!playing);
  });
  $('replay').addEventListener('click', () => { go(0); userPaused = reduce; setPlaying(!reduce); });
  // Tastatur nur, wenn die Animation den Fokus hat – sonst scrollt die Leertaste die Seite.
  stage.addEventListener('keydown', e => {
    if (e.key === ' ') { e.preventDefault(); playBtn.click(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(scenes.length - 1, cur + 1), true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, cur - 1), true); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (playing) setPlaying(false); }
    else if (inView && !userPaused && t < total - 0.01) setPlaying(true);
  });

  root.querySelector('.controls').hidden = false;
  root.querySelector('.hint').hidden = false;

  setPlaying(false);
  go(0);
  render();
  requestAnimationFrame(tick);

  // Läuft nur, solange die Animation sichtbar ist.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView && !userPaused && !playing && t < total - 0.01) setPlaying(true);
      if (!inView && playing) setPlaying(false);
    }, { threshold: 0.35 }).observe(stage);
  } else if (!reduce) {
    inView = true;
    setPlaying(true);
  }
})();
