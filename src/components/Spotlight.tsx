import { useEffect, useRef, useState } from "react";
import { VscGithubAlt } from "react-icons/vsc";
import { LuArrowUpRight, LuChevronLeft, LuChevronRight, LuMaximize2 } from "react-icons/lu";
import { projects } from "../data/content";

const slides = projects.filter((p) => p.spotlight);
const SLIDE_MS = 9000;
const SWIPE_PX = 50;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Large rotating showcase of my top projects. Auto-advances (paused while
// hovered or focused, off for reduced motion); arrows, thumbnails, arrow keys
// and swipes move between slides.
const Spotlight = ({ onOpenProject }: { onOpenProject: (id: string) => void }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay] = useState(() => !prefersReducedMotion());
  const swipeStart = useRef<number | null>(null);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);
  const slide = slides[index];

  // Only the active slide's video plays.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [index]);

  if (!slide) return null;

  return (
    <div
      className="tile flex flex-col gap-4 p-3 md:p-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
    >
      {/* no-drag: swipes and clicks in here change slides instead of moving the tile */}
      <div
        className="no-drag grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-4 md:grid-cols-[1.35fr_1fr] md:grid-rows-1 md:gap-6"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onPointerDown={(e) => (swipeStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {/* Media: every slide is stacked and crossfades in */}
        <div className="relative h-48 overflow-hidden rounded-2xl ring-1 ring-line/10 sm:h-60 md:h-full">
          {slides.map((p, i) => (
            <div
              key={p.id}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-all duration-500 ${
                i === index ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            >
              {p.video && i === index && autoplay ? (
                <video
                  ref={videoRef}
                  src={p.video}
                  poster={p.image}
                  muted
                  loop
                  playsInline
                  className="size-full object-cover object-top"
                />
              ) : p.image ? (
                <img src={p.image} alt={p.title} draggable={false} className="size-full object-cover object-top" />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-accent/35 via-accent/10 to-transparent">
                  <span className="px-6 text-center font-display text-3xl font-bold text-fg/85 md:text-4xl lg:text-5xl">
                    {p.title}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted">Screenshot coming soon</span>
                </div>
              )}
            </div>
          ))}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {[
              { label: "Previous project", icon: <LuChevronLeft />, to: index - 1 },
              { label: "Next project", icon: <LuChevronRight />, to: index + 1 },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => go(b.to)}
                aria-label={b.label}
                className="grid size-9 place-content-center rounded-full bg-black/45 text-lg text-white backdrop-blur transition-colors hover:bg-black/65"
              >
                {b.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Details for the active slide; keyed so it animates in on change */}
        <div key={slide.id} className="spotlight-in flex min-h-0 flex-col gap-3 px-2 pb-1 md:justify-center md:px-0 md:pr-4">
          <p className="text-xs uppercase tracking-wider text-muted">
            Featured project <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> /{" "}
            {String(slides.length).padStart(2, "0")}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-fg lg:text-4xl">{slide.title}</h2>
          <p className="line-clamp-4 text-sm leading-relaxed text-muted md:line-clamp-none lg:text-base">{slide.description}</p>
          {slide.details && (
            <ul className="hidden space-y-1.5 lg:block">
              {slide.details.slice(0, 3).map((d) => (
                <li key={d} className="flex gap-2.5 text-sm leading-snug text-fg/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {slide.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-line/10 px-2 py-0.5 text-xs text-fg/80">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onOpenProject(slide.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-line/10 px-4 py-2 text-sm font-medium text-fg ring-1 ring-line/15 transition-colors hover:bg-line/20"
            >
              <LuMaximize2 /> Details
            </button>
            {slide.github && (
              <a
                href={slide.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-line/10 px-4 py-2 text-sm font-medium text-fg ring-1 ring-line/15 transition-colors hover:bg-line/20"
              >
                <VscGithubAlt /> GitHub
              </a>
            )}
            {slide.live && (
              <a
                href={slide.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/85"
              >
                {slide.liveLabel ?? "Live site"} <LuArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Labeled thumbnails; the active one shows time until the next slide */}
      <div className="no-drag grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Choose a featured project">
        {slides.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === index}
            onClick={() => go(i)}
            className={`relative overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
              i === index ? "bg-accent/15 text-fg" : "bg-line/5 text-muted hover:bg-line/10 hover:text-fg"
            }`}
          >
            <span className="block truncate font-medium">{p.title}</span>
            {i === index && autoplay && (
              <span
                key={index}
                className="spotlight-progress absolute bottom-0 left-0 h-0.5 bg-accent"
                style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                onAnimationEnd={() => go(index + 1)}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Spotlight;
