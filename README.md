# For Suveccha 🌸

A tiny, cute, static website. No database, no build step, no dependencies. Just HTML, CSS and JS.

## Structure

```
suveccha-site/
├── index.html          Home: photo, typed intro, cheer-o-meter, "bin the bad day"
├── momos.html          Momo Catch game (win a coupon for momos)
├── report-card.html    Teacher's report card, but she gets graded
├── letter.html         Envelope + love letter + "open when..." notes
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── config.js   Names, cheer messages, the letter text (edit this!)
    │   ├── main.js     Shared: hearts, click sparkles, typewriter
    │   ├── home.js
    │   ├── momos.js
    │   ├── report.js
    │   └── letter.js
    └── img/
        └── suveccha.png   <- replace with her photo (same file name)
```

## Personalise it

1. **Her photo:** replace `assets/img/suveccha.png` with her picture, keeping the name `suveccha.png`
   (or change the `src` in `index.html`). Square-ish photos look best.
2. **Words:** open `assets/js/config.js` to change her name, who the letter is from,
   the cheer-up messages, the letter itself and the "open when" notes.
3. **Report card remarks:** edit the text directly in `report-card.html`.

## Run / host

- Locally: just double-click `index.html`.
- Online: drag the whole folder into Netlify Drop, or push it to GitHub and enable GitHub Pages.
  The only external thing is Google Fonts (Pacifico + Quicksand); without internet the site still works with fallback fonts.
