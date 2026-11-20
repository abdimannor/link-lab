/* State playground and rule-order shuffler.
   The five rules are rebuilt as class rules (.pg.is-hover etc.) in the order shown,
   so the real cascade decides; the explanation is computed alongside. */
(() => {
  'use strict';
  const root = document.getElementById('playground');
  if (!root) return;
  root.hidden = false;

  const RULES = {
    link:    { sel: ':link',          decl: { color: 'var(--c-link)', 'text-decoration': 'none' } },
    visited: { sel: ':visited',       decl: { color: 'var(--c-visited)', 'text-decoration': 'none' } },
    focus:   { sel: ':focus-visible', decl: { color: 'var(--c-focus)', outline: '3px solid var(--c-focus)' } },
    hover:   { sel: ':hover',         decl: { color: 'var(--c-hover)', 'text-decoration': 'underline' } },
    active:  { sel: ':active',        decl: { color: 'var(--c-active)', 'background-color': 'var(--c-active-bg)', 'text-decoration': 'underline' } }
  };
  const LVHA = ['link', 'visited', 'focus', 'hover', 'active'];
  let order = LVHA.slice();
  const state = { visited: false, focus: false, hover: false, active: false };

  const sheet = document.createElement('style');
  sheet.id = 'pg-rules';
  document.head.appendChild(sheet);

  const specimen = root.querySelector('.pg-link');
  const list = root.querySelector('.pg-rules');
  const verdict = root.querySelector('.pg-verdict');
  const status = root.querySelector('.pg-status');

  const matches = (k) => k === 'link' ? !state.visited : k === 'visited' ? state.visited : state[k];

  function renderCSS() {
    sheet.textContent = order.map((k) => '.pg-link.is-' + k + ' { ' +
      Object.entries(RULES[k].decl).map(([p, v]) => p + ': ' + v + ';').join(' ') + ' }').join('\n');
    LVHA.forEach((k) => specimen.classList.toggle('is-' + k, matches(k)));
  }

  function renderList() {
    list.innerHTML = '';
    order.forEach((k, i) => {
      const li = document.createElement('li');
      li.className = 'pg-rule' + (matches(k) ? ' is-matching' : '');
      li.draggable = true;
      li.dataset.key = k;
      const body = Object.entries(RULES[k].decl).map(([p, v]) => '  ' + p + ': ' + v.replace(/var\(--c-([a-z-]+)\)/, '$1') + ';').join('\n');
      li.innerHTML =
        '<span class="pg-num" aria-hidden="true">' + (i + 1) + '</span>' +
        '<pre><code>a' + RULES[k].sel + ' {\n' + body + '\n}</code></pre>' +
        '<span class="pg-move">' +
        '<button type="button" data-move="-1" aria-label="Move a' + RULES[k].sel + ' up"' + (i === 0 ? ' disabled' : '') + '>&uarr;</button>' +
        '<button type="button" data-move="1" aria-label="Move a' + RULES[k].sel + ' down"' + (i === order.length - 1 ? ' disabled' : '') + '>&darr;</button>' +
        '</span>';
      list.appendChild(li);
    });
  }

  function explain() {
    const props = {};
    order.forEach((k, i) => {
      if (!matches(k)) return;
      Object.entries(RULES[k].decl).forEach(([p]) => { (props[p] = props[p] || []).push({ k, i }); });
    });
    const rows = Object.entries(props).map(([p, hits]) => {
      const win = hits[hits.length - 1];
      const lost = hits.slice(0, -1).map((h) => '<code>' + RULES[h.k].sel + '</code> (rule ' + (h.i + 1) + ')').join(', ');
      return '<li><code class="pg-prop">' + p + '</code> &rarr; <strong><code>' + RULES[win.k].sel + '</code></strong> wins as rule ' + (win.i + 1) +
        (lost ? '. It beats ' + lost + ' because every selector here is <code>(0,1,1)</code>, so the later rule wins.' : '. Nothing else sets it.') + '</li>';
    });
    const warnings = [];
    const pos = (k) => order.indexOf(k);
    if (pos('hover') < pos('visited')) warnings.push('<code>:visited</code> sits after <code>:hover</code>: a visited link will not turn red under the pointer.');
    if (pos('hover') < pos('link')) warnings.push('<code>:link</code> sits after <code>:hover</code>: an unvisited link will not turn red under the pointer.');
    if (pos('active') < pos('hover')) warnings.push('<code>:active</code> sits before <code>:hover</code>: while pressed the link is also hovered, so the press colour loses.');
    if (pos('focus') > pos('hover')) warnings.push('<code>:focus-visible</code> sits after <code>:hover</code>: its colour now beats the pointer states.');
    verdict.innerHTML = '<ul class="pg-why">' + rows.join('') + '</ul>' +
      (warnings.length ? '<ul class="pg-warn">' + warnings.map((w) => '<li>' + w + '</li>').join('') + '</ul>'
        : '<p class="pg-ok">Order is ' + (order.join() === LVHA.join() ? 'LVHA' : 'safe') + ': every state can show.</p>');
    const on = LVHA.filter(matches).map((k) => RULES[k].sel).join(' + ');
    status.textContent = 'Matching: ' + on + '. Colour now ' + getComputedStyle(specimen).color + '.';
  }

  function render() { renderCSS(); renderList(); explain(); }

  root.querySelectorAll('[data-state]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.state;
    state[k] = !state[k];
    b.setAttribute('aria-pressed', String(state[k]));
    if (k === 'visited') root.querySelector('.pg-visit-label').textContent = state.visited ? ':visited' : ':link';
    render();
  }));

  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-move]');
    if (!b) return;
    const k = b.closest('li').dataset.key;
    const i = order.indexOf(k), j = i + Number(b.dataset.move);
    order.splice(i, 1); order.splice(j, 0, k);
    render();
    const again = list.querySelector('li[data-key="' + k + '"] [data-move="' + b.dataset.move + '"]');
    (again && !again.disabled ? again : list.querySelector('li[data-key="' + k + '"] button:not([disabled])')).focus();
  });

  let dragKey = null;
  list.addEventListener('dragstart', (e) => { const li = e.target.closest('li'); dragKey = li.dataset.key; li.classList.add('is-dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragKey); });
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const li = e.target.closest('li');
    if (!li || li.dataset.key === dragKey) return;
    const i = order.indexOf(dragKey), j = order.indexOf(li.dataset.key);
    order.splice(i, 1); order.splice(j, 0, dragKey);
    renderList(); list.querySelector('li[data-key="' + dragKey + '"]').classList.add('is-dragging');
  });
  list.addEventListener('dragend', () => { dragKey = null; render(); });

  root.querySelector('[data-action=shuffle]').addEventListener('click', () => {
    do { for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
    while (order.join() === LVHA.join());
    render();
  });
  root.querySelector('[data-action=reset]').addEventListener('click', () => { order = LVHA.slice(); render(); });

  render();
})();
