import { VscGithubAlt } from "react-icons/vsc";
import { LuArrowUpRight, LuMaximize2 } from "react-icons/lu";
import type { Project as ProjectData } from "../data/content";
import { useTap } from "../utils/useTap";

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors";

// Sized so the longest card still fits in a 5-row tile at each breakpoint.
const imageClass = "h-36 w-full shrink-0 rounded-2xl md:h-48 lg:h-44";

interface ProjectProps extends ProjectData {
  onOpen: () => void;
}

const Project: React.FC<ProjectProps> = ({ image, title, description, tags, github, live, onOpen }) => {
  const tap = useTap(onOpen);

  return (
    <div {...tap} aria-label={`Open ${title}`} className="project-card tile group flex flex-col p-4">
      <span className="pointer-events-none absolute right-6 top-6 z-10 grid size-8 place-content-center rounded-full bg-black/45 text-sm text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <LuMaximize2 />
      </span>
      {image ? (
        <img
          src={image}
          alt={title}
          draggable={false}
          loading="lazy"
          className={`${imageClass} object-cover object-top`}
        />
      ) : (
        <div
          className={`${imageClass} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent ring-1 ring-inset ring-line/10`}
        >
          <span className="px-6 text-center font-display text-2xl font-bold text-fg/80 md:text-3xl lg:text-2xl">{title}</span>
          <span className="text-xs uppercase tracking-wider text-muted">Screenshot coming soon</span>
        </div>
      )}
      <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-fg md:text-2xl lg:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-md bg-line/10 px-2 py-0.5 text-xs text-fg/80">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex gap-3 pt-4">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} bg-line/10 text-fg ring-1 ring-line/15 hover:bg-line/20`}
          >
            <VscGithubAlt /> GitHub
          </a>
        )}
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} bg-accent text-accent-fg hover:bg-accent/85`}
          >
            Live site <LuArrowUpRight />
          </a>
        )}
      </div>
    </div>
  );
};

export default Project;
