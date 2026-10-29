import { useEffect, useState } from "react";
import { LuBriefcase, LuGraduationCap, LuMapPin } from "react-icons/lu";
import { profile } from "../data/content";

const formatTime = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: profile.timeZone,
    timeZoneName: "short",
  }).format(new Date());

const Status = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { icon: <LuBriefcase />, label: "Currently", value: profile.current },
    { icon: <LuGraduationCap />, label: "Studying", value: `${profile.school} · ${profile.graduation}` },
    { icon: <LuMapPin />, label: "Based in", value: `${profile.location} · ${time}` },
  ];

  return (
    <div className="tile flex flex-col justify-center gap-4 p-6">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-content-center rounded-lg bg-accent/15 text-lg text-accent">
            {row.icon}
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted">{row.label}</p>
            <p className="text-sm font-medium text-fg md:text-base">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Status;
