import { experience } from "../data/content";

const Experience = () => {
  return (
    <div className="tile flex flex-col">
      <div className="px-8 pb-4 pt-8">
        <p className="mb-2 text-sm tracking-wide text-muted">Where have I worked?</p>
        <h2 className="font-display text-3xl font-bold text-fg lg:text-4xl">Experience</h2>
      </div>
      {/* no-drag: lets the list scroll (and its scrollbar be grabbed) without moving the tile */}
      <ol className="no-drag relative mx-8 mb-6 flex-1 space-y-7 overflow-y-auto pr-2 pl-5 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line/20">
        {experience.map((xp) => {
          const current = xp.end === "Present";
          return (
            <li key={`${xp.company}-${xp.role}`} className="relative">
              <span
                className={`absolute -left-5 top-1.5 size-[11px] rounded-full ${
                  current ? "bg-accent" : "bg-line/40"
                }`}
              />
              <p className="text-xs text-muted">
                {xp.start} – {xp.end}
                {xp.location && ` · ${xp.location}`}
              </p>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-fg">{xp.role}</h3>
              <p className="text-sm font-medium text-accent">{xp.company}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{xp.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {xp.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-line/10 px-2 py-0.5 text-xs text-fg/80">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Experience;
