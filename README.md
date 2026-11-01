## Andy Zhu Portfolio website

Made with React, TypeScript, Tailwind, Vite and react-grid-layout. Live at [azhu.dev](https://www.azhu.dev/).

### Updating content

Everything shown on the site lives in [`src/data/content.ts`](src/data/content.ts):

- **Positions** — add an object to `experience` (newest first).
- **Projects** — add an object to `projects` with a unique `id`, put its screenshot in `src/assets/`, and import it at the top of the file. `image`, `github` and `live` are optional — a card without an image shows a placeholder, and buttons only appear when a link is set. Mark a project `featured: true` to also show it on the About and Contact tabs (the Projects tab shows everything).
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

### Credits

Originally based on Jeffery Zhou's Bento Grid, a React grid layout template, licensed under the MIT License.
