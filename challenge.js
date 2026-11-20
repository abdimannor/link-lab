/* Challenge: order the five rules so three scenarios hit their target colour.
   The rules are written into a real <style> in the visitor's order; the check reads computed colours. */
(() => {
  'use strict';
  const root = document.getElementById('challenge');
  if (!root) return;
  root.hidden = false;

  const RULES = {
    link:    { sel: ':link',          decl: 'color: var(--c-link);' },
    visited: { sel: ':visited',       decl: 'color: var(--c-visited);' },
    focus:   { sel: ':focus-visible', decl: 'color: var(--c-focus);' },
    hover:   { sel: ':hover',         decl: 'color: var(--c-hover);' },
    active:  { sel: ':active',        decl: 'color: var(--c-active);' }
  };
  const SCENARIOS = [
    { on: ['visited', 'hover'], want: 'hover', label: 'A visited link under the pointer', why: ':hover must come after :visited.' },
    { on: ['link', 'hover', 'active'], want: 'active', label: 'An unvisited link being pressed', why: ':active must come after :hover (and :link).' },
    { on: ['link', 'focus', 'hover'], want: 'hover', label: 'A keyboard-focused link the pointer also rests on', why: ':focus-visible must come before :hover.' }
  ];
  let order = ['active', 'hover', 'focus', 'visited', 'link'];

  const sheet = document.createElement('style');
  document.head.appendChild(sheet);
  const list = root.querySelector('.ch-rules');
  const box = root.querySelector('.ch-scenarios');
  const score = root.querySelector('.ch-score');

  box.innerHTML = SCENARIOS.map((s, i) =>
    '<li class="ch-case" data-i="' + i + '">' +
    '<span class="ch-specimen ' + s.on.map((k) => 'is-' + k).join(' ') + '">HD</span>' +
    '<span class="ch-text"><strong>' + s.label + '</strong><small>Matching: ' + s.on.map((k) => '<code>' + RULES[k].sel + '</code>').join(' + ') +
    '</small><small>Target: <span class="ch-target" style="color: var(--c-' + s.want + ')">' + RULES[s.want].sel + ' colour</span></small>' +
    '<small class="ch-why"></small></span><em class="ch-mark">Not yet</em></li>').join('');

  function render(focusKey, dir) {
    sheet.textContent = order.map((k) => '.ch-specimen.is-' + k + ' { ' + RULES[k].decl + ' }').join('\n');
    list.innerHTML = order.map((k, i) =>
      '<li data-key="' + k + '"><span class="pg-num" aria-hidden="true">' + (i + 1) + '</span><code>a' + RULES[k].sel + ' { color: ' + (k === 'focus' ? 'focus' : k) + ' }</code>' +
      '<span class="pg-move"><button type="button" data-move="-1" aria-label="Move a' + RULES[k].sel + ' up"' + (i === 0 ? ' disabled' : '') + '>&uarr;</button>' +
      '<button type="button" data-move="1" aria-label="Move a' + RULES[k].sel + ' down"' + (i === order.length - 1 ? ' disabled' : '') + '>&darr;</button></span></li>').join('');
    let ok = 0;
    box.querySelectorAll('.ch-case').forEach((li) => {
      const s = SCENARIOS[li.dataset.i];
      const got = getComputedStyle(li.querySelector('.ch-specimen')).color;
      const want = getComputedStyle(li.querySelector('.ch-target')).color;
      const hit = got === want;
      li.classList.toggle('is-ok', hit);
      li.querySelector('.ch-mark').textContent = hit ? 'Solved' : 'Not yet';
      li.querySelector('.ch-why').textContent = hit ? '' : 'Hint: ' + s.why;
      if (hit) ok++;
    });
    score.textContent = ok === 3 ? 'All three scenarios solved. Every state can show.' : ok + ' of 3 scenarios solved';
    root.classList.toggle('is-solved', ok === 3);
    if (ok === 3 && window.courseDone) window.courseDone();
    if (focusKey) {
      const again = list.querySelector('li[data-key="' + focusKey + '"] [data-move="' + dir + '"]');
      (again && !again.disabled ? again : list.querySelector('li[data-key="' + focusKey + '"] button:not([disabled])')).focus();
    }
  }

  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-move]');
    if (!b) return;
    const k = b.closest('li').dataset.key;
    const i = order.indexOf(k), j = i + Number(b.dataset.move);
    order.splice(i, 1); order.splice(j, 0, k);
    render(k, b.dataset.move);
  });
  render();
})();
