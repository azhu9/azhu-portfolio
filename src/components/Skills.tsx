import type { CSSProperties } from "react";
import { skills, type Skill } from "../data/content";

const total = skills.reduce((n, g) => n + g.items.length, 0);

const SkillTile = ({ name, icon: Icon, color, duplicate }: Skill & { duplicate?: boolean }) => (
  <li
    aria-hidden={duplicate}
    className={`skill-tile flex w-20 shrink-0 flex-col items-center gap-1.5 md:w-24 ${duplicate ? "marquee-dup" : ""}`}
    style={{ "--brand": color ?? "hsl(var(--fg))" } as CSSProperties}
  >
    <span className="skill-icon grid size-14 place-content-center rounded-2xl bg-line/5 text-3xl ring-1 ring-line/10 md:size-16 md:text-4xl">
      <Icon style={{ color: "var(--brand)" }} />
    </span>
    <span className="text-[11px] font-medium text-muted md:text-xs">{name}</span>
  </li>
);

// Each row is rendered twice back to back and scrolled by half its width,
// which makes the loop seamless.
const Marquee = ({ items, reverse }: { items: Skill[]; reverse?: boolean }) => (
  <div className="marquee">
    <ul className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
      {items.map((skill) => (
        <SkillTile key={skill.name} {...skill} />
      ))}
      {items.map((skill) => (
        <SkillTile key={`${skill.name}-dup`} {...skill} duplicate />
      ))}
    </ul>
  </div>
);

export default function Skills() {
  return (
    <div className="tile flex flex-col py-6 md:py-8">
      <div className="mb-6 flex items-end justify-between gap-4 px-6 md:px-8">
        <div>
          <p className="mb-2 text-sm tracking-wide text-muted">What am I building with?</p>
          <h2 className="font-display text-3xl font-bold text-fg lg:text-4xl">Tech Stack</h2>
        </div>
        <p className="shrink-0 text-right text-xs leading-tight text-muted">
          <span className="block font-display text-3xl font-bold text-accent">{total}</span>
          technologies
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-5">
        {skills.map(({ group, items }, i) => (
          <div key={group}>
            <h3 className="mb-3 px-6 text-xs uppercase tracking-wider text-muted md:px-8">{group}</h3>
            <Marquee items={items} reverse={i % 2 === 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
