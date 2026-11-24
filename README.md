## Andy Zhu Portfolio website

Made with React, TypeScript, Tailwind, Vite and react-grid-layout. Live at [azhu.dev](https://www.azhu.dev/).

### Updating content

Everything shown on the site lives in [`src/data/content.ts`](src/data/content.ts):

- **Positions** — add an object to `experience` (newest first).
- **Projects** — add an object to `projects` with a unique `id`, put its screenshot in `src/assets/`, and import it at the top of the file. `image`, `github` and `live` are optional — a card without an image shows a placeholder, and buttons only appear when a link is set. Screenshots live in `src/assets/projects/` and demo clips in `src/assets/videos/` (a `video` plays on card hover and in the spotlight/popup). Mark a project `spotlight: true` to feature it in the big rotating spotlight on the About and Contact tabs (3–4 works best); the Projects tab shows every project as a card. A spotlight project can also have a `video` (short muted loop) that plays when it's the active slide.
- **Skills, bio, links, current status** — `skills`, `profile` and `links`.

The grid layout for each tab is generated from these lists in [`src/utils/layout.helper.ts`](src/utils/layout.helper.ts), so new projects get a tile automatically. Tile sizes and the per-tab ordering are configured there too.

The resume is served from `public/Andy_Zhu_Resume.pdf` — replace that file to update it.

### Dragging

Tiles can be dragged on desktop. Each visitor's arrangement is saved per tab in their browser's localStorage and can be cleared with the "Reset layout" button. Saved layouts are ignored automatically when tiles are added or removed.

### Other features

- **Expandable projects** — clicking a project card opens a detailed view. Add bullet points with a project's `details` array.
- **Command menu** — Ctrl+K / ⌘K (or the search button in the nav) to jump to tabs, open projects, copy the email, grab the resume, etc.
- **GitHub tile** — shows live repo/follower counts and recently pushed repos from the public GitHub API, cached for an hour per visitor.
- **Copy email** — the Email tile copies the address instead of opening a mail app.
- **Typing test** — a small tile shows my best WPM (`profile.typingWpm`); clicking it opens a 15s/30s test that compares the visitor's score to mine and remembers their best.
- **Cursor glow and first-visit intro** — both are skipped for visitors who prefer reduced motion or use touch screens.

### Development

```bash
npm install
npm run dev
```

### Re-recording project screenshots and clips

[`scripts/capture.mjs`](scripts/capture.mjs) drives your installed Chrome to screenshot each live project and record a short scripted demo, writing straight into `src/assets/projects/` and `src/assets/videos/`.

```bash
npm run capture:shots              # all screenshots
npm run capture:shots -- ruopen    # just one project
npm run capture:video              # all demo clips (WebM)
npm run capture:sheet              # scripts/out/sheet.jpg: start/middle/end frames of every clip
```

- The `portfolio` capture reads the local production build, so run `npm run build && npm run preview` first.
- Each project's URL and demo steps (clicks, typing, scrolling) are defined in the `projects` object at the top of the script; edit them when a site changes.
- Set `CHROME_PATH` if Chrome isn't in the default Windows location.

### Credits

Originally based on Jeffery Zhou's Bento Grid, a React grid layout template, licensed under the MIT License.
