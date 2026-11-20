# Link Lab

A small exercise on styling links, from an early web course in 2023. The page has three links, to articles in Helsingborgs Dagblad and SVT and to my LinkedIn profile, each drawn as a coloured box. A stylesheet changes their text colour depending on the state of the link: unvisited, visited, under the mouse, and being clicked.

## The reworked version

The page is now a small specimen sheet for link states. The three links (HD, SVT, LinkedIn) are the same; the original page is in the git history.

- **The lesson stays in the page.** The link-state rules are still in the `<style>` block of `index.html`, in LVHA order. Layout lives in `style.css`.
- **Five states.** `:focus-visible` is added between `:visited` and `:hover`, so keyboard users see a clear outline and pointer states still win.
- **Specimen strip.** All five states are shown side by side as static labels, so they can be compared without clicking.
- **Rule order explained.** Each rule is shown next to a sentence on why it sits where it does.
- **Contrast fixed.** In the original, the HD box had a yellow background and `:active` made the text yellow, so the label disappeared while pressed. Each state now has AA contrast on a white card; `:active` is dark text on a yellow highlight.
- The inline box styles are gone (the old lesson about inline styles beating the stylesheet is covered in [dress-code](https://github.com/abdimannor/dress-code)). Every link opens in a new tab with `rel="noopener noreferrer"`.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/link-lab.git
cd link-lab
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

Live at [link-lab-flax.vercel.app](https://link-lab-flax.vercel.app/), hosted on Vercel and open to everyone. Every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
