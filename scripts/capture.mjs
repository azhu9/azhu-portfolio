// Captures project screenshots and short demo clips from the live sites,
// driving your installed Chrome, and writes them straight into src/assets.
//
//   npm run capture:shots [-- <name>]   -> src/assets/projects/<name>.jpg
//   npm run capture:video [-- <name>]   -> src/assets/videos/<name>.webm
//   npm run capture:sheet               -> scripts/out/sheet.jpg (frames from every clip, for checking)
//
// The "portfolio" capture reads the local production build, so run
// `npm run build && npm run preview` in another terminal first.
// Set CHROME_PATH if Chrome isn't installed in the default Windows location.
import { chromium } from "playwright-core";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = 1280;
const H = 800;
const [mode = "shots", only] = process.argv.slice(2);

const root = fileURLToPath(new URL("..", import.meta.url));
const SHOTS = join(root, "src/assets/projects");
const VIDEOS = join(root, "src/assets/videos");
const SCRATCH = join(root, "scripts/out");
for (const dir of [SHOTS, VIDEOS, SCRATCH]) mkdirSync(dir, { recursive: true });
const GEAR = join(tmpdir(), "portfolio-gear-input.png");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function smoothScroll(page, to, ms) {
  await page.evaluate(
    ([to, ms]) =>
      new Promise((done) => {
        const from = window.scrollY;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / ms);
          const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          window.scrollTo(0, from + (to - from) * ease);
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      }),
    [to, ms]
  );
}

// Sample input for the Image -> DXF demo: a simple gear, rendered to PNG.
async function makeGear(browser) {
  const page = await browser.newPage({ viewport: { width: 600, height: 600 } });
  const teeth = 12;
  const pts = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const r = i % 4 < 2 ? 250 : 205;
    pts.push(`${300 + r * Math.cos(a)},${300 + r * Math.sin(a)}`);
  }
  await page.setContent(`<body style="margin:0;background:#fff">
    <svg width="600" height="600"><polygon points="${pts.join(" ")}" fill="#111"/>
    <circle cx="300" cy="300" r="70" fill="#fff"/></svg></body>`);
  await page.screenshot({ path: GEAR });
  await page.close();
  return GEAR;
}

// Per-project setup: load the page and get it into the state worth showing.
// `demo` (video only) then runs the on-screen interaction.
const projects = {
  "media-multiwatch": {
    url: "https://chromewebstore.google.com/detail/media-multiwatch/ijmiandhiibldhplkbcaefdmmohhbija",
    // Capture one of the listing's own 1280x800 screenshots at full size (the
    // page shows them at half size). Slot 2 is the split-view shot.
    slot: 2,
    async shot(page, file, browser) {
      await wait(2000);
      const srcs = await page.evaluate(() => {
        const bySlot = {};
        for (const i of document.images) {
          const m = /Item media (\d+) \(screenshot\)/.exec(i.alt);
          if (m && i.naturalWidth >= 1280) bySlot[m[1]] = i.src;
        }
        return Object.keys(bySlot).sort().map((k) => bySlot[k]);
      });
      if (!srcs.length) throw new Error("no listing screenshots found");
      const src = srcs[this.slot - 1] ?? srcs[0];
      const viewer = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await viewer.setContent(`<body style="margin:0"><img src="${src}" style="display:block;width:1280px;height:800px"></body>`);
      await viewer.waitForFunction(() => document.images[0]?.complete && document.images[0].naturalWidth > 0);
      await viewer.screenshot({ path: file, type: "jpeg", quality: 88 });
      await viewer.close();
    },
  },
  ruopen: {
    url: "https://ruopen.vercel.app/",
    async demo(page) {
      for (const campus of ["Busch", "Livingston", "College Ave"]) {
        // Campus filters are a radio group.
        await page.getByRole("radio", { name: campus, exact: true }).click();
        await wait(1100);
      }
      await smoothScroll(page, 500, 1800);
      await wait(700);
    },
  },
  img2dxf: {
    url: "https://img2dwg.vercel.app",
    async setup(page, browser) {
      await page.setInputFiles("#file", await makeGear(browser));
      await page.waitForFunction(() => !document.body.innerText.includes("No drawing yet"), null, { timeout: 60000 });
      await wait(1500);
    },
    async demo(page) {
      await page.setInputFiles("#file", GEAR);
      await page.waitForFunction(() => !document.body.innerText.includes("No drawing yet"), null, { timeout: 60000 });
      await wait(1200);
      await page.locator("#show_nodes").check();
      await wait(1500);
      await page.locator("#show_nodes").uncheck();
      await wait(800);
    },
    // Fresh page for the demo so the upload is visible from the start.
    freshForDemo: true,
  },
  rieee: {
    url: "https://rieee.vercel.app/",
    async demo(page) {
      await wait(600);
      await smoothScroll(page, 2400, 6000);
      await wait(500);
    },
  },
  "scar-site": {
    url: "https://www.scarrobotics.com/",
    async setup() {
      await wait(6000); // let the hero intro finish
    },
    async demo(page) {
      await page.getByRole("button", { name: /Replay intro/ }).click();
      await wait(5500);
      await smoothScroll(page, 900, 2000);
      await wait(500);
    },
  },
  "belt-calc": {
    url: "https://belt-calculator.vercel.app/",
    async demo(page) {
      // Values chosen to land almost exactly on a stock 120T belt ("Good" fit).
      for (const [sel, value] of [["#n1", "24"], ["#n2", "48"], ["#center", "209"]]) {
        await page.locator(sel).fill("");
        await page.locator(sel).pressSequentially(value, { delay: 180 });
        await wait(700);
      }
      await wait(800);
    },
  },
  "qr-gen": {
    url: "https://fqr-gen.vercel.app",
    async setup(page) {
      await page.locator("#data").fill("https://azhu.dev");
      await page.locator("#style").selectOption({ label: "Rounded" });
      await wait(500);
    },
    async demo(page) {
      await page.locator("#data").fill("");
      await page.locator("#data").pressSequentially("https://azhu.dev", { delay: 110 });
      await wait(700);
      await page.locator("#style").selectOption({ label: "Rounded" });
      await wait(1200);
    },
    freshForDemo: true,
  },
  portfolio: {
    url: "http://localhost:4173/",
    dark: true,
    async setup(page) {
      await wait(2500); // intro animation
    },
    async demo(page) {
      await wait(800);
      await page.getByRole("button", { name: "Projects", exact: true }).click();
      await wait(1600);
      await page.getByRole("button", { name: "Contact", exact: true }).click();
      await wait(1600);
      await page.getByRole("button", { name: "About", exact: true }).click();
      await wait(1200);
      await smoothScroll(page, 1200, 2000);
      await wait(600);
    },
  },
};

async function newPage(browser, { scale, dark }) {
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: scale,
    colorScheme: dark ? "dark" : "light",
    reducedMotion: "no-preference",
  });
  return [context, await context.newPage()];
}

async function takeShot(browser, name, p) {
  const [context, page] = await newPage(browser, { scale: 1.5, dark: p.dark });
  await page.goto(p.url, { waitUntil: "networkidle", timeout: 60000 });
  await wait(1200);
  if (p.setup) await p.setup(page, browser);
  const file = join(SHOTS, `${name}.jpg`);
  if (p.shot) await p.shot.call(p, page, file, browser);
  else await page.screenshot({ path: file, type: "jpeg", quality: 82 });
  await context.close();
  console.log("shot", file);
}

// Records the demo with Chrome's screencast (frames only while it runs, so no
// blank loading frames), then re-encodes the frames to WebM in a canvas.
async function takeVideo(browser, name, p) {
  if (!p.demo) return;
  const [context, page] = await newPage(browser, { scale: 1, dark: p.dark });
  await page.goto(p.url, { waitUntil: "networkidle", timeout: 60000 });
  await wait(1200);
  if (p.setup && !p.freshForDemo) await p.setup(page, browser);
  if (p.freshForDemo) await makeGear(browser); // the demo re-uploads the sample

  const cdp = await context.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ data: f.data, t: f.metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  await wait(300);
  await p.demo(page);
  await cdp.send("Page.stopScreencast");
  await context.close();
  if (frames.length < 2) throw new Error("no frames captured");

  const t0 = frames[0].t;
  const timeline = frames.map((f) => ({ data: f.data, at: (f.t - t0) * 1000 }));
  const duration = timeline[timeline.length - 1].at + 600; // hold the last frame briefly

  const enc = await browser.newPage({ viewport: { width: W, height: H } });
  await enc.setContent(`<canvas id="c" width="${W}" height="${H}"></canvas>`);
  const CHUNK = 40;
  await enc.evaluate(() => (window.frames_ = []));
  for (let i = 0; i < timeline.length; i += CHUNK) {
    await enc.evaluate((chunk) => window.frames_.push(...chunk), timeline.slice(i, i + CHUNK));
  }
  const b64 = await enc.evaluate(
    async ({ duration }) => {
      const canvas = document.getElementById("c");
      const ctx = canvas.getContext("2d");
      const imgs = await Promise.all(
        window.frames_.map(
          (f) =>
            new Promise((res) => {
              const im = new Image();
              im.onload = () => res({ im, at: f.at });
              im.src = "data:image/jpeg;base64," + f.data;
            })
        )
      );
      ctx.drawImage(imgs[0].im, 0, 0, canvas.width, canvas.height);
      const stream = canvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 1_800_000 });
      const chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      const stopped = new Promise((r) => (rec.onstop = r));
      rec.start();
      const start = performance.now();
      let i = 0;
      await new Promise((done) => {
        const tick = () => {
          const now = performance.now() - start;
          while (i + 1 < imgs.length && imgs[i + 1].at <= now) i++;
          ctx.drawImage(imgs[i].im, 0, 0, canvas.width, canvas.height);
          now < duration ? requestAnimationFrame(tick) : done();
        };
        requestAnimationFrame(tick);
      });
      rec.stop();
      await stopped;
      const blob = new Blob(chunks, { type: "video/webm" });
      const buf = new Uint8Array(await blob.arrayBuffer());
      let s = "";
      for (let j = 0; j < buf.length; j += 0x8000) s += String.fromCharCode(...buf.subarray(j, j + 0x8000));
      return btoa(s);
    },
    { duration }
  );
  await enc.close();
  const file = join(VIDEOS, `${name}.webm`);
  writeFileSync(file, Buffer.from(b64, "base64"));
  console.log("video", file, `${frames.length} frames`, `${(duration / 1000).toFixed(1)}s`, `${(b64.length * 0.75 / 1e6).toFixed(2)} MB`);
}

// Contact sheet of start / middle / end frames from every clip, so the videos
// can be checked without a video player.
async function writeSheet(browser) {
  const files = readdirSync(VIDEOS).filter((f) => f.endsWith(".webm"));
  const page = await browser.newPage({ viewport: { width: 1000, height: 220 * files.length + 20 } });
  await page.setContent(`<body style="margin:0;background:#222;color:#eee;font:14px sans-serif"><div id="s"></div></body>`);
  for (const f of files) {
    const b64 = readFileSync(join(VIDEOS, f)).toString("base64");
    await page.evaluate(
      async ({ f, b64 }) => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex;gap:8px;align-items:center;padding:6px 8px";
        row.innerHTML = `<div style="width:110px">${f}</div>`;
        document.getElementById("s").appendChild(row);
        const v = document.createElement("video");
        v.muted = true;
        v.src = "data:video/webm;base64," + b64;
        await new Promise((r) => (v.onloadedmetadata = r));
        // MediaRecorder WebM reports Infinity duration until seeked to the end.
        if (!isFinite(v.duration)) {
          v.currentTime = 1e9;
          await new Promise((r) => (v.ondurationchange = r));
        }
        for (const frac of [0.08, 0.5, 0.95]) {
          v.currentTime = v.duration * frac;
          await new Promise((r) => (v.onseeked = r));
          const c = document.createElement("canvas");
          c.width = 288;
          c.height = 180;
          c.getContext("2d").drawImage(v, 0, 0, 288, 180);
          row.appendChild(c);
        }
      },
      { f, b64 }
    );
  }
  const out = join(SCRATCH, "sheet.jpg");
  await page.screenshot({ path: out, type: "jpeg", quality: 80, fullPage: true });
  console.log("sheet", out);
}

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
if (mode === "sheet") {
  await writeSheet(browser);
  await browser.close();
  process.exit(0);
}
for (const [name, p] of Object.entries(projects)) {
  if (only && only !== name) continue;
  try {
    if (mode === "shots") await takeShot(browser, name, p);
    else await takeVideo(browser, name, p);
  } catch (e) {
    console.log("FAILED", name, e.message.split("\n")[0]);
  }
}
await browser.close();
