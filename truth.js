// Deeper parts of the lesson: :visited privacy, focus modality, honest link text.
(() => {
  // 1. getComputedStyle never admits a visited link.
  const self = document.getElementById('vp-self');
  const ask = document.getElementById('vp-ask');
  if (self && ask) {
    self.href = location.href.split('#')[0];
    ask.addEventListener('click', () => {
      const c = getComputedStyle(self).color;
      document.getElementById('vp-computed').textContent = c;
      const unvisited = document.getElementById('vp-unvisited').textContent;
      document.getElementById('vp-verdict').textContent = c === unvisited
        ? 'The browser reports the unvisited colour, even though the link points to the page you are on. Your eyes and the script see different things, and that is on purpose.'
        : 'The browser reported a colour other than the unvisited one. Check that link colours have not been changed by an extension or forced colours.';
    });
  }

  // 2. :focus vs :focus-visible, logged per focus.
  const log = document.getElementById('fo-log');
  let lastInput = 'none';
  addEventListener('pointerdown', () => { lastInput = 'pointer'; }, true);
  addEventListener('keydown', () => { lastInput = 'keyboard'; }, true);
  for (const b of document.querySelectorAll('.fo-buttons button')) {
    b.addEventListener('focus', () => {
      const li = document.createElement('li');
      li.textContent = `${b.textContent.trim()} via ${lastInput}: :focus ${b.matches(':focus') ? 'yes' : 'no'}, :focus-visible ${b.matches(':focus-visible') ? 'yes' : 'no'}`;
      log.prepend(li);
      while (log.children.length > 6) log.lastElementChild.remove();
    });
  }

  // 3. Link text checker.
  const vague = ['läs mer', 'klicka här', 'här', 'mer', 'länk', 'click here', 'read more', 'here', 'more', 'link', 'learn more', 'läs här', 'this', 'this page', 'go'];
  const check = document.getElementById('tr-check');
  const out = document.getElementById('tr-results');
  function verdict(text) {
    const t = text.trim();
    const n = t.toLowerCase().replace(/[.!?…:\s]+$/, '');
    if (vague.includes(n)) return [false, 'says nothing about where it goes. Name the destination instead.'];
    if (/^(https?:\/\/|www\.)/i.test(t)) return [false, 'is a bare address. A screen reader reads it character by character; describe the page instead.'];
    if (n.length < 4) return [false, 'is very short. It may only make sense next to its surroundings.'];
    return [true, 'describes its destination.'];
  }
  if (check) check.addEventListener('click', () => {
    out.textContent = '';
    const lines = document.getElementById('tr-input').value.split('\n').map((l) => l.trim()).filter(Boolean);
    const seen = new Map();
    for (const l of lines) seen.set(l.toLowerCase(), (seen.get(l.toLowerCase()) || 0) + 1);
    for (const l of lines) {
      let [ok, why] = verdict(l);
      if (ok && seen.get(l.toLowerCase()) > 1) { ok = false; why = 'appears more than once. Two links with the same text should go to the same place.'; }
      const li = document.createElement('li');
      li.className = ok ? 'tr-ok' : 'tr-bad';
      li.textContent = `${ok ? 'Good' : 'Fix'}: "${l}" ${why}`;
      out.append(li);
    }
  });

  // Links list, like a screen reader's.
  const listBtn = document.getElementById('tr-list');
  if (listBtn) listBtn.addEventListener('click', () => {
    const ol = document.getElementById('tr-links');
    ol.textContent = '';
    for (const a of document.querySelectorAll('a[href]')) {
      const name = (a.getAttribute('aria-label') || a.innerText || a.textContent).replace(/\s+/g, ' ').trim();
      const li = document.createElement('li');
      const [ok] = verdict(name);
      li.textContent = name + (a.target === '_blank' ? ' (new tab)' : '');
      if (!ok) li.className = 'tr-bad';
      ol.append(li);
    }
  });
})();
