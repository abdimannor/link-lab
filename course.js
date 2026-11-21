/* Webbkursen: progress marks in the course bar, the course-complete card and the motion button.
   Shared by all four lessons. Labels follow the page language (sv or en). */
(() => {
  'use strict';
  /* Framed copies of the page (previews) carry no course chrome. */
  if (window.self !== window.top) {
    for (const el of document.querySelectorAll('.course-bar, .course-next')) el.remove();
    return;
  }
  const sv = (document.documentElement.lang || 'sv').startsWith('sv');
  const T = sv
    ? { pause: 'Pausa r\u00f6relse', play: 'Starta r\u00f6relse', lesson: 'Lektion', done: 'Kursen klar', all: 'Alla fyra lektioner \u00e4r markerade som klara.' }
    : { pause: 'Pause motion', play: 'Play motion', lesson: 'Lesson', done: 'Course complete', all: 'All four lessons are marked as done.' };
  const KEY = 'course-done';
  const SEEN = 'course-progress';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* Each site only knows its own flag (localStorage is per origin). Progress on the
     other lessons is self-reported: the course links carry it as #done=1,2,3, and
     each site keeps what it has been told in SEEN, merged with its own flag. */
  const items = [...document.querySelectorAll('.course-bar ol > li')];
  const here = items.findIndex((li) => li.querySelector('[aria-current="page"]')) + 1;
  const parse = (s) => String(s || '').split(',').map(Number).filter((n) => n >= 1 && n <= items.length);
  const told = /^#done=([\d,]*)$/.exec(location.hash);
  const done = new Set([...parse(store.get(SEEN)), ...(told ? parse(told[1]) : [])]);
  if (told) history.replaceState(null, '', location.pathname + location.search);

  function list() {
    const all = new Set(done);
    if (here && store.get(KEY) === '1') all.add(here);
    return [...all].sort((a, b) => a - b);
  }

  function paint() {
    const now = list();
    store.set(SEEN, now.filter((n) => n !== here).join(','));
    items.forEach((li, i) => {
      const m = li.querySelector('.course-mark');
      if (m) m.hidden = !now.includes(i + 1);
    });
    /* Pass the progress along on every course link (other sites only). */
    for (const a of document.querySelectorAll('.course-bar a, .course-next a')) {
      const url = a.href.split('#')[0];
      if (url === location.href.split('#')[0]) continue;
      a.href = now.length ? url + '#done=' + now.join(',') : url;
    }
    complete(now);
  }

  /* The last lesson shows a completion card once all lessons are marked done. */
  const SUMMARY = sv ? [
    'Rubriker, stycken, f\u00e4rg, en bild och en l\u00e4nk.',
    'En extern stilmall och klassv\u00e4ljare.',
    'L\u00e4nkarnas tillst\u00e5nd: :link, :visited, :hover och :active.',
    'Samma inneh\u00e5ll med extern, intern och inline-CSS.',
  ] : [
    'Headings, paragraphs, colour, an image and a link.',
    'An external stylesheet and class selectors.',
    'Link states: :link, :visited, :hover and :active.',
    'The same content with external, internal and inline CSS.',
  ];
  let card = null;
  function complete(now) {
    if (here !== items.length || now.length < items.length || card) return;
    const next = document.querySelector('.course-next');
    if (!next) return;
    card = document.createElement('section');
    card.className = 'course-complete';
    card.setAttribute('aria-labelledby', 'course-complete-title');
    const h = document.createElement('h2');
    h.id = 'course-complete-title';
    h.textContent = T.done;
    const p = document.createElement('p');
    p.textContent = T.all;
    const ol = document.createElement('ol');
    items.forEach((li, i) => {
      const item = document.createElement('li');
      const name = document.createElement('strong');
      const t = li.querySelector('.course-title');
      name.textContent = t ? t.textContent.trim() : '';
      const num = document.createElement('span');
      num.className = 'course-num';
      num.textContent = T.lesson + ' ' + (i + 1);
      item.append(num, name, document.createTextNode(SUMMARY[i] || ''));
      ol.append(item);
    });
    card.append(h, p, ol);
    next.before(card);
  }

  window.courseDone = () => { store.set(KEY, '1'); paint(); };
  paint();

  /* Motion: on by default; the head script reads the stored choice before first paint. */
  const btn = document.querySelector('.course-motion');
  if (!btn) return;
  const root = document.documentElement;
  const PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="7" y="5.5" width="3.4" height="13" rx="1.2"/><rect x="13.6" y="5.5" width="3.4" height="13" rx="1.2"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.8v12.4a1 1 0 0 0 1.5.86l10-6.2a1 1 0 0 0 0-1.72l-10-6.2A1 1 0 0 0 8 5.8z"/></svg>';
  const storageKey = btn.dataset.key || 'motion';
  function show() {
    const on = root.dataset.motion !== 'off';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? T.pause : T.play);
    btn.title = on ? T.pause : T.play;
    btn.innerHTML = on ? PAUSE : PLAY;
  }
  btn.addEventListener('click', () => {
    root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off';
    store.set(storageKey, root.dataset.motion);
    show();
  });
  show();
})();
