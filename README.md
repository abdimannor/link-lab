# Link Lab

Live: [link-lab-flax.vercel.app](https://link-lab-flax.vercel.app/) · [Svenska](README.sv.md)

Lesson 3 of 4 in a small web course built from my first coursework pages from 2023. Each lesson keeps the original exercise, explains it, and adds something to try; a course bar at the top tracks which lessons you have finished (stored only in your browser) and links to the next one.

Lektion 1: [Hello Web](https://hello-web-kappa.vercel.app/) · Lektion 2: [Tech World](https://tech-world-zeta.vercel.app/) · Lektion 3: Link Lab (this one) · Lektion 4: [Dress Code](https://dress-code-bay.vercel.app/)

A small exercise on styling links, from an early web course in 2023. The page has three links, each drawn as a coloured box. They now point to the first website at CERN, Wikipedia's article on hyperlinks and the Wayback Machine. A stylesheet changes their text colour depending on the state of the link: unvisited, visited, under the mouse, and being clicked.

## The reworked version

The front page is now a designed lesson built around the exercise, which is kept as `original.html` and shown in a browser frame.

- **The lesson stays in the page.** The link-state rules are still in the `<style>` block of `index.html`, in LVHA order. Layout lives in `style.css`.
- **Five states.** `:focus-visible` is added between `:visited` and `:hover`, so keyboard users see a clear outline and pointer states still win.
- **Specimen strip.** All five states are shown side by side as static labels, so they can be compared without clicking.
- **Rule order explained.** Each rule is shown next to a sentence on why it sits where it does.
- **Contrast fixed.** In the original, the first box had a yellow background and `:active` made the text yellow, so the label disappeared while pressed. Each state now has AA contrast on a white card; `:active` is dark text on a yellow highlight.
- The inline box styles are gone (the old lesson about inline styles beating the stylesheet is covered in [dress-code](https://github.com/abdimannor/dress-code)). Every link opens in a new tab with `rel="noopener noreferrer"`.

## On the page now

- **State playground.** Put a link into any of the five states and shuffle the rule order. The rules are rebuilt as real CSS in the order shown, so the browser's cascade decides, with the explanation computed alongside.
- **Order challenge.** Arrange the five rules so three scenarios hit their target colour. The check reads the computed colours, and passing it marks the lesson done.

The course bar, the next-lesson block and the motion switch come from `course.css` and `course.js`, which are identical in all four repos.

## What a link really is

From the state rules the lesson now goes outward, to what a link carries beyond its colour:

- **Why `:visited` keeps a secret.** Pages once read people's browsing history by styling `:visited` and measuring the result. Browsers now allow only colour properties on visited links and make `getComputedStyle` answer as if every link were unvisited ([MDN: Privacy and the :visited selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Privacy_and_:visited)). A button asks the browser for the colour of a link to the page you are on: you see pink, the script is told green.
- **Focus.** `:focus` matches however focus arrived; `:focus-visible` only when the browser decides it should be shown, usually for the keyboard ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible)). Three buttons and a live log compare mouse and keyboard focus, and one has its outline removed with nothing instead, to show why [WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) and [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) exist.
- **Links that tell the truth.** A checker flags vague texts ("läs mer", "click here"), bare URLs and duplicates; a second button builds the page's own links list as a screen reader would list it. The section also explains `target="_blank"`: the 2023 links had no `rel`, browsers now treat `target="_blank"` as `noopener` by default, and `noreferrer` also drops the `Referer` header ([MDN: noopener](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener), [MDN: noreferrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer)).

The original 2023 page is still in the history: `git show 785d476:index.html`.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/link-lab.git
cd link-lab
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

Some parts read the live page, so a local server is closer to the real site: `python3 -m http.server 8000`.

## Tests

```
npm ci
npx playwright install chromium
npm test
```

The Playwright suite checks that the page loads without errors, has no axe violations, that motion is on by default (even under reduced motion), the motion button pauses it and the choice is remembered, and that the :visited, focus and link-text demos behave as described. CI runs it (`test.yml`) next to the HTML checker (`check.yml`).

The site is hosted on Vercel; every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
