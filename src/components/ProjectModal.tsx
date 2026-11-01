import { VscGithubAlt } from "react-icons/vsc";
import { LuArrowUpRight } from "react-icons/lu";
import type { Project } from "../data/content";
import Modal from "./Modal";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { title, description, image, tags, github, live, details } = project;

  return (
    <Modal label={title} onClose={onClose}>
      {image ? (
        <img src={image} alt={title} className="max-h-[45vh] w-full object-cover object-top" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-accent/30 via-accent/10 to-transparent md:h-64">
          <span className="px-6 text-center font-display text-3xl font-bold text-fg/80 md:text-4xl">
            {title}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <h2 className="font-display text-3xl font-bold text-fg md:text-4xl">{title}</h2>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-accent/15 px-2 py-0.5 text-xs text-fg ring-1 ring-accent/25">
              {tag}
            </span>
          ))}
        </div>
        <p className="leading-relaxed text-muted md:text-lg">{description}</p>
        {details && (
          <ul className="space-y-2">
            {details.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-fg/90 md:text-base">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        )}
        {(github || live) && (
          <div className="flex gap-3 pt-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-line/10 px-4 py-2 text-sm font-medium text-fg ring-1 ring-line/15 transition-colors hover:bg-line/20"
              >
                <VscGithubAlt /> GitHub
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/85"
              >
                Live site <LuArrowUpRight />
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProjectModal;
