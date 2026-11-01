import { useEffect, useState } from "react";
import { LuGraduationCap, LuMapPin, LuMoon, LuSun } from "react-icons/lu";
import { profile } from "../data/content";

// Local time where I am, split so the clock and time zone can be styled apart.
function localTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: profile.timeZone,
    timeZoneName: "short",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour24 = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: profile.timeZone }).format(new Date())
  );
  return {
    clock: `${get("hour")}:${get("minute")}`,
    period: get("dayPeriod"),
    zone: get("timeZoneName"),
    isDay: hour24 >= 6 && hour24 < 19,
  };
}

const degreeProgress = () => {
  const start = new Date(profile.degreeStart).getTime();
  const end = new Date(profile.degreeEnd).getTime();
  return Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
};

const Status = () => {
  const [time, setTime] = useState(localTime);

  useEffect(() => {
    const id = setInterval(() => setTime(localTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  const progress = degreeProgress();

  return (
    <div className="tile flex flex-col justify-between gap-4 p-6">
      {/* Day/night wash behind the clock, based on my local time */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 bg-gradient-to-b ${
          time.isDay ? "from-amber-400/20" : "from-indigo-500/25"
        } to-transparent`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl font-bold leading-none tracking-tight text-fg">
            {time.clock}
            <span className="ml-1.5 text-base font-semibold text-muted">
              {time.period} {time.zone}
            </span>
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <LuMapPin /> {profile.location}
          </p>
        </div>
        <span
          className={`grid size-10 shrink-0 place-content-center rounded-full text-xl ${
            time.isDay ? "bg-amber-400/20 text-amber-500" : "bg-indigo-400/20 text-indigo-300"
          }`}
          title={time.isDay ? "Daytime here" : "Nighttime here"}
        >
          {time.isDay ? <LuSun /> : <LuMoon />}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Currently</p>
        <p className="mt-1 flex items-center gap-2 font-medium text-fg">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.current}
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-muted">
            <LuGraduationCap className="text-sm" /> {profile.school}
          </span>
          <span className="font-medium text-fg">{Math.round(progress * 100)}%</span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-line/10"
          role="progressbar"
          aria-label="Degree progress"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-muted">Graduating {profile.graduation}</p>
      </div>
    </div>
  );
};

export default Status;
