(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Radno vrijeme (0 = nedjelja … 6 = subota), sati u Europe/Zagreb ---------- */
  const HOURS = { 0: null, 1: [15, 22], 2: [15, 22], 3: [15, 22], 4: [15, 22], 5: [15, 22], 6: [15, 22] };
  const DAY_NAMES = ['nedjelju', 'ponedjeljak', 'utorak', 'srijedu', 'četvrtak', 'petak', 'subotu'];

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const overlay = $('#menu-overlay');
  const setMenu = (open) => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Zatvori izbornik' : 'Otvori izbornik');
    overlay.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('a', overlay).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 1000px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Menu illustrations ---------- */
  const FILLS = {
    'chicken':         { a: '#EE9A80' },
    'cheese-sausage':  { a: '#EE9A80', dots: true },
    'half-chicken':    { a: '#FFD447', b: '#EE9A80' },
    'mozzarella':      { a: '#FFF3CF', strands: true },
    'debrecinka':      { a: '#B8412B', specks: true },
    'half-debrecinka': { a: '#FFD447', b: '#B8412B' },
    'vege':            { a: '#D08A57', leaf: true },
  };
  const CRUST = 'M70 16c30 0 40 22 40 52v126c0 28-16 44-40 44s-40-16-40-44V68c0-30 10-52 40-52z';

  const lens = (f) => {
    const cx = 112, cy = 70;
    let inner;
    if (f.b) {
      inner = `<path d="M${cx} ${cy - 17}a17 17 0 0 0 0 34z" fill="${f.a}"/><path d="M${cx} ${cy - 17}a17 17 0 0 1 0 34z" fill="${f.b}"/>` +
              `<path d="M${cx} ${cy - 17}v34" stroke="#141110" stroke-width="2"/>`;
    } else {
      inner = `<circle cx="${cx}" cy="${cy}" r="17" fill="${f.a}"/>`;
    }
    if (f.dots) inner += `<circle cx="${cx - 6}" cy="${cy - 5}" r="3.4" fill="#FFD447"/><circle cx="${cx + 6}" cy="${cy + 2}" r="3" fill="#FFD447"/><circle cx="${cx - 2}" cy="${cy + 8}" r="2.6" fill="#FFD447"/>`;
    if (f.specks) inner += `<circle cx="${cx - 6}" cy="${cy - 4}" r="2" fill="#E9826A"/><circle cx="${cx + 5}" cy="${cy + 5}" r="2.2" fill="#E9826A"/><circle cx="${cx + 4}" cy="${cy - 8}" r="1.6" fill="#E9826A"/><circle cx="${cx - 4}" cy="${cy + 9}" r="1.5" fill="#E9826A"/>`;
    if (f.strands) inner += `<path d="M${cx - 10} ${cy - 3}q10 -8 20 0M${cx - 8} ${cy + 6}q8 -6 16 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
    let leaf = '';
    if (f.leaf) leaf = `<g transform="translate(${cx + 16} ${cy - 34}) rotate(20)"><path d="M0 18C0 6 8 0 20 0c0 12-8 18-20 18z" fill="#6DBE5B" stroke="#141110" stroke-width="3" stroke-linejoin="round"/><path d="M3 15 15 4" stroke="#141110" stroke-width="2.4" stroke-linecap="round"/></g>`;
    return `<g class="cd__lens">
        <circle cx="${cx}" cy="${cy}" r="34" class="cd__crust" fill="url(#crust-nacho)" stroke="#141110" stroke-width="4"/>
        <circle cx="${cx}" cy="${cy}" r="25" fill="#FFE3A3" stroke="#141110" stroke-width="3"/>
        ${inner}
        <circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="#141110" stroke-width="3"/>
        ${leaf}
      </g>`;
  };

  const cornDog = (type, i) => {
    const f = FILLS[type] || FILLS.chicken;
    const tilt = [-9, 7, -5, 9, -7, 6, -8][i % 7];
    return `<svg viewBox="0 0 150 300" aria-hidden="true" focusable="false">
      <g transform="rotate(${tilt} 70 150)">
        <g class="cd">
          <rect x="62" y="226" width="16" height="72" rx="6" fill="#EBC58E" stroke="#141110" stroke-width="4"/>
          <path class="cd__crust" d="${CRUST}" fill="url(#crust-nacho)"/>
          <g clip-path="url(#cd-clip)">
            <path d="M92 30c10 10 12 30 12 60v100c0 16-4 30-12 38" fill="none" stroke="#9E4A12" stroke-opacity=".22" stroke-width="16"/>
            <path d="M48 60c0-18 6-30 16-36" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/>
            <path class="cd__drip" d="M22 62 118 86 22 110 118 134 22 158 118 182 22 206" fill="none" stroke="#D63A1F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="cd__drip" d="M22 76 118 100 22 124 118 148 22 172 118 196" fill="none" stroke="#FFE7AE" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <path d="${CRUST}" fill="none" stroke="#141110" stroke-width="4"/>
        </g>
      </g>
      ${lens(f)}
    </svg>`;
  };

  $$('.card[data-fill]').forEach((card, i) => {
    const art = $('.card__art', card);
    if (art) art.innerHTML = cornDog(card.dataset.fill, i);
  });

  const menu = $('.menu');
  const crustBtns = $$('[data-crust-btn]');
  const setCrust = (kind) => {
    if (menu.dataset.crust === kind) return;
    menu.dataset.crust = kind;
    const url = kind === 'flakes' ? 'url(#crust-flakes)' : 'url(#crust-nacho)';
    $$('.cd__crust', menu).forEach((el) => el.setAttribute('fill', url));
    crustBtns.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.crustBtn === kind)));
    if (!reduceMotion) {
      menu.classList.remove('is-switching');
      void menu.offsetWidth;
      menu.classList.add('is-switching');
    }
  };
  crustBtns.forEach((b) => b.addEventListener('click', () => setCrust(b.dataset.crustBtn)));
  crustBtns.forEach((b) => b.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const next = b.dataset.crustBtn === 'nacho' ? 'flakes' : 'nacho';
      setCrust(next);
      $(`[data-crust-btn="${next}"]`).focus();
    }
  }));

  /* ---------- About: word-by-word ---------- */
  const wordsEl = $('[data-words]');
  let words = [];
  if (wordsEl) {
    const HL = new Set(['hit', 'prvi', 'corn', 'dog', 'place', 'razvlači', 'draškovićevu']);
    const txt = wordsEl.textContent.trim().split(/\s+/);
    wordsEl.setAttribute('aria-label', wordsEl.textContent.trim());
    wordsEl.innerHTML = txt.map((w) => {
      const key = w.toLowerCase().replace(/[.,–!?]/g, '');
      return `<span class="w${HL.has(key) ? ' hl' : ''}" aria-hidden="true">${w}</span>`;
    }).join(' ');
    words = $$('.w', wordsEl);
    if (reduceMotion) words.forEach((w) => w.classList.add('on'));
  }

  /* ---------- Reveal on scroll ---------- */
  const countUp = (el) => {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const fmt = (v) => el.dataset.sep
      ? Math.round(v).toLocaleString('hr-HR')
      : v.toFixed(dec).replace('.', ',');
    if (reduceMotion) { el.textContent = fmt(to); return; }
    const dur = 1600, t0 = performance.now();
    const tick = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      const e = 1 - Math.pow(2, -10 * k);
      el.textContent = fmt(k === 1 ? to : to * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      $$('.count', el).forEach(countUp);
      if (el.classList.contains('count')) countUp(el);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], .foot__giant').forEach((el) => io.observe(el));

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.nav__links a');
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['o-nama', 'meni', 'kako', 'kvatric', 'lokacija'].forEach((id) => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  /* ---------- Cheese pull ---------- */
  const pull = $('.pull');
  const stage = pull && $('.pull__stage', pull);
  const track = pull && $('.pull__track', pull);
  const pieces = pull ? { l: $('.pull__piece--l', pull), m: $('.pull__piece--m', pull), r: $('.pull__piece--r', pull) } : null;
  const steps = pull ? $$('.pull__title span', pull) : [];
  const num = pull && $('.pull__num b', pull);
  const IMG = { w: 2292, h: 588, cutL: 470, cutR: 1660 };
  let geo = null;
  let pullTarget = reduceMotion ? 1 : 0, pullCur = pullTarget, lastStep = -1;

  const layoutPull = () => {
    if (!pull) return;
    const sw = stage.clientWidth, sh = stage.clientHeight;
    const portrait = sh > sw * 1.1;
    const ratio = IMG.w / IMG.h;
    let T;
    if (portrait) T = Math.min(sw * 0.62, (sh / ratio) * 1.3);
    else T = Math.min(sh * 0.44, (sw / ratio) * 1.06, 440);
    const W = T * ratio, k = T / IMG.h;
    const wL = IMG.cutL * k, wM = (IMG.cutR - IMG.cutL) * k, wR = W - wL - wM;
    track.style.width = W + 'px';
    track.style.height = T + 'px';
    track.style.top = portrait ? '56%' : '54%';
    const bg = `${W}px ${T}px`;
    Object.assign(pieces.l.style, { left: '0px', width: wL + 'px', backgroundSize: bg, backgroundPosition: '0 0' });
    // M overlaps its neighbours by 2px so no hairline seam shows while it is scaled
    Object.assign(pieces.m.style, { left: wL - 2 + 'px', width: wM + 4 + 'px', backgroundSize: bg, backgroundPosition: `${-(wL - 2)}px 0` });
    Object.assign(pieces.r.style, { left: wL + wM + 'px', width: wR + 'px', backgroundSize: bg, backgroundPosition: `${-(wL + wM)}px 0` });
    geo = { portrait, wM };
    renderPull(pullCur);
  };

  const renderPull = (p) => {
    if (!geo) return;
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const s = 0.035 + 0.965 * e;
    const shift = (1 - s) * geo.wM / 2;
    const wob = Math.sin(p * Math.PI) * -3.5;
    track.style.transform = `translate(-50%, -50%) rotate(${(geo.portrait ? 90 : 0) + wob}deg)`;
    pieces.l.style.transform = `translateX(${shift}px)`;
    pieces.r.style.transform = `translateX(${-shift}px)`;
    pieces.m.style.transform = `scaleX(${s})`;
    pieces.m.style.opacity = clamp((s - 0.03) * 14, 0, 1).toFixed(3);
    pull.style.setProperty('--p', p.toFixed(4));
    const step = p < 0.34 ? 0 : p < 0.8 ? 1 : 2;
    if (step !== lastStep) {
      steps.forEach((el, i) => el.classList.toggle('on', i === step));
      lastStep = step;
    }
    if (num) num.textContent = p > 0.985 ? '∞' : String(Math.round(e * 60));
    pull.classList.toggle('is-done', p > 0.04);
  };

  /* ---------- Scroll loop ---------- */
  const progress = $('.progress span');
  const nav = $('#nav');
  const bands = $$('.band');
  const parallax = reduceMotion ? [] : $$('[data-parallax]').map((el) => ({ el, f: parseFloat(el.dataset.parallax) }));
  let lastY = window.scrollY, skew = 0, ticking = false, vh = window.innerHeight;

  const onFrame = () => {
    ticking = false;
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;

    // progress bar
    const max = root.scrollHeight - vh;
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    // nav
    nav.classList.toggle('is-scrolled', y > 20);
    if (!root.classList.contains('menu-open')) {
      if (y > vh * 0.9 && dy > 4) nav.classList.add('is-hidden');
      else if (dy < -4 || y < vh * 0.9) nav.classList.remove('is-hidden');
    }

    // parallax
    for (const p of parallax) {
      const r = p.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const c = r.top + r.height / 2 - vh / 2;
      p.el.style.translate = `0 ${(c * p.f).toFixed(1)}px`;
    }

    // words
    if (words.length && !reduceMotion) {
      const r = wordsEl.getBoundingClientRect();
      const start = vh * 0.88, end = vh * 0.38;
      const k = clamp((start - r.top) / (start - end + r.height * 0.6), 0, 1);
      const n = Math.round(k * words.length);
      for (let i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
    }

    // cheese pull target
    if (pull && !reduceMotion) {
      const r = pull.getBoundingClientRect();
      const total = pull.offsetHeight - stage.clientHeight;
      pullTarget = clamp(-r.top / (total * 0.92), 0, 1);
      startPullLoop();
    }

    // marquee skew from scroll velocity
    if (!reduceMotion) {
      skew += (clamp(dy * -0.25, -9, 9) - skew) * 0.35;
      startSkewLoop();
    }
  };

  let pullLoop = false;
  const startPullLoop = () => {
    if (pullLoop) return;
    pullLoop = true;
    const step = () => {
      const d = pullTarget - pullCur;
      pullCur += d * 0.16;
      if (Math.abs(d) < 0.0005) pullCur = pullTarget;
      renderPull(pullCur);
      if (pullCur !== pullTarget) requestAnimationFrame(step);
      else pullLoop = false;
    };
    requestAnimationFrame(step);
  };

  let skewLoop = false;
  const startSkewLoop = () => {
    if (skewLoop) return;
    skewLoop = true;
    const step = () => {
      skew *= 0.9;
      if (Math.abs(skew) < 0.05) skew = 0;
      bands.forEach((b) => { b.style.transform = `skewX(${skew.toFixed(2)}deg)`; });
      if (skew !== 0) requestAnimationFrame(step);
      else skewLoop = false;
    };
    requestAnimationFrame(step);
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const onResize = () => {
    vh = window.innerHeight;
    layoutPull();
    onScroll();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => setTimeout(onResize, 250));

  layoutPull();
  onFrame();

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }

  /* ---------- Open now ---------- */
  const status = $('#status');
  const hoursList = $$('.hours__list li');
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zagreb', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const now = parseInt(get('hour'), 10) + parseInt(get('minute'), 10) / 60;
    hoursList.forEach((li) => li.classList.toggle('is-today', li.dataset.days.split(',').map(Number).includes(day)));

    if (status && day !== 5) {
      const today = HOURS[day];
      let text, open = false;
      if (today && now >= today[0] && now < today[1]) {
        open = true;
        text = `Otvoreno · do ${today[1]} h`;
      } else if (today && now < today[0]) {
        text = `Otvaramo u ${today[0]} h`;
      } else {
        let d = (day + 1) % 7, guard = 0;
        while (!HOURS[d] && guard++ < 7) d = (d + 1) % 7;
        text = d === (day + 1) % 7 ? `Zatvoreno · sutra od ${HOURS[d][0]} h` : `Zatvoreno · otvaramo u ${DAY_NAMES[d]}`;
      }
      status.textContent = text;
      status.classList.toggle('is-closed', !open);
      status.hidden = false;
    }
  } catch (_) { /* Intl nije dostupan – samo prikaži statično radno vrijeme */ }
})();
