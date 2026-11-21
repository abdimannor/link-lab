# Link Lab

Lektion 3 i en liten webbkurs. Live: https://link-lab-flax.vercel.app/ ([English](README.md))

## Vad lektionen lär ut

En länk ser ut som det enklaste på en sida, men den bär mycket. Lektionen börjar i länkens fem tillstånd och går utåt:

1. **Tillstånden och deras ordning.** `:link`, `:visited`, `:focus-visible`, `:hover` och `:active` har samma specificitet, så regeln som står sist vinner. Därför spelar ordningen (LVHA, "LoVe HAte") roll.
2. **Varför `:visited` håller tyst.** Sidor kunde förr läsa ut besökarens webbhistorik genom att styla `:visited` och mäta resultatet. I dag tillåter webbläsarna bara färgegenskaper på besökta länkar, och `getComputedStyle` svarar som om ingen länk var besökt ([MDN: Privacy and the :visited selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Privacy_and_:visited)).
3. **Fokus.** `:focus` mot `:focus-visible`, och varför en fokusmarkering aldrig får tas bort utan ersättning ([WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)).
4. **Länkar som säger sanningen.** Beskrivande länktext i stället för "läs mer", och vad `target="_blank"` med `rel="noopener noreferrer"` gör ([MDN: noopener](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener), [MDN: noreferrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer)).

## Varifrån den kommer

Den började som en övning 2023: en HTML-fil med tre länkar som öppnas i nya flikar (i dag till den första webbplatsen hos CERN, Wikipedias artikel om hyperlänkar och Wayback Machine), och fyra regler för `a:link`, `a:visited`, `a:hover` och `a:active` i grönt, rosa, rött och gult. Originalet finns kvar som `original.html`. Länkreglerna i sidans `<style>`-block är den övningen, med `:focus-visible` tillagd.

## Vad du kan göra på sidan

- Hovra, klicka och återbesök de tre länkarna.
- Tvinga fram valfri blandning av tillstånd på en länk och flytta om reglerna i lekplatsen, och laga sedan en trasig ordning i utmaningen.
- Fråga webbläsaren vilken färg en länk till sidan du står på har, och se `getComputedStyle` svara med den obesökta färgen.
- Fokusera tre knappar med mus och tangentbord och läs en logg över vilka pseudoklasser som matchade.
- Klistra in länktexter i en granskare som pekar ut vaga texter, nakna adresser och dubbletter, och bygg sidans egen länklista så som en skärmläsare visar den.

## Köra och testa

```sh
python3 -m http.server 8000      # öppna sedan http://localhost:8000/
npm ci
npx playwright install chromium
npm test                          # Playwright: sidans hälsa, axe, rörelsereglaget, funktionerna
```

CI kör HTML-kontrollen (`check.yml`) och Playwright-sviten (`test.yml`). Animationer är på från start; rörelseknappen i kursraden pausar dem och valet sparas.
