# Link Lab

Live: [link-lab-flax.vercel.app](https://link-lab-flax.vercel.app/)

Lesson 3 of 4 in a small web course built from my first coursework pages from 2023. Each lesson keeps the original exercise, explains it, and adds something to try; a course bar at the top tracks which lessons you have finished (stored only in your browser) and links to the next one.

Lektion 1: [Hello Web](https://hello-web-kappa.vercel.app/) · Lektion 2: [Tech World](https://tech-world-zeta.vercel.app/) · Lektion 3: Link Lab (this one) · Lektion 4: [Dress Code](https://dress-code-bay.vercel.app/)

A small exercise on styling links, from an early web course in 2023. The page has three links, to articles in Helsingborgs Dagblad and SVT and to my LinkedIn profile, each drawn as a coloured box. A stylesheet changes their text colour depending on the state of the link: unvisited, visited, under the mouse, and being clicked.

## The reworked version

The page is now a small specimen sheet for link states. The three links (HD, SVT, LinkedIn) are the same; the original page is in the git history.

- **The lesson stays in the page.** The link-state rules are still in the `<style>` block of `index.html`, in LVHA order. Layout lives in `style.css`.
- **Five states.** `:focus-visible` is added between `:visited` and `:hover`, so keyboard users see a clear outline and pointer states still win.
- **Specimen strip.** All five states are shown side by side as static labels, so they can be compared without clicking.
- **Rule order explained.** Each rule is shown next to a sentence on why it sits where it does.
- **Contrast fixed.** In the original, the HD box had a yellow background and `:active` made the text yellow, so the label disappeared while pressed. Each state now has AA contrast on a white card; `:active` is dark text on a yellow highlight.
- The inline box styles are gone (the old lesson about inline styles beating the stylesheet is covered in [dress-code](https://github.com/abdimannor/dress-code)). Every link opens in a new tab with `rel="noopener noreferrer"`.

## On the page now

- **State playground.** Put a link into any of the five states and shuffle the rule order. The rules are rebuilt as real CSS in the order shown, so the browser's cascade decides, with the explanation computed alongside.
- **Order challenge.** Arrange the five rules so three scenarios hit their target colour. The check reads the computed colours, and passing it marks the lesson done.

The course bar, the next-lesson block and the motion switch come from `course.css` and `course.js`, which are identical in all four repos.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/link-lab.git
cd link-lab
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

The site is hosted on Vercel; every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
