# Link Lab

A small exercise on styling links, from an early web course in 2023. The page has three links, to articles in Helsingborgs Dagblad and SVT and to my LinkedIn profile, each drawn as a coloured box. A stylesheet changes their text colour depending on the state of the link: unvisited, visited, under the mouse, and being clicked.

## What to look at

- **The LVHA order.** The `<style>` block in `index.html` (lines 16 to 35) sets `a:link`, `a:visited`, `a:hover` and `a:active` in that order. The order matters. All four selectors have the same specificity, so when more than one state applies, the rule that comes last wins. Because `:hover` comes after `:visited`, a visited link still turns red under the mouse. Because `:active` is last, the yellow click colour wins over hover.
- **Inline style beats the stylesheet.** Each link also has a `style` attribute (lines 39 to 50) that sets border, padding, margin, font and background colour. The stylesheet sets `background-color: transparent` for every state, but the inline values (yellow, greenyellow, lightblue) win, because an inline style outranks any rule in a `<style>` block. That is why the boxes keep their colour.
- **A side effect worth noticing.** The HD box has a yellow background and `:active` makes the text yellow, so the label disappears for the moment the link is pressed.
- **`:visited` is restricted.** For privacy, browsers only let `:visited` change colour-type properties, so in practice that rule only makes the text pink.

The links open in a new tab and now carry `rel="noopener noreferrer"`, so the opened page cannot reach back to this one.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/link-lab.git
cd link-lab
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

A private copy runs at [link-lab-flax.vercel.app](https://link-lab-flax.vercel.app/) on Vercel. It sits behind Vercel Authentication, so it opens only for signed-in members of the Vercel team; everyone else is sent to a login page. Every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
