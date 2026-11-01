import { useEffect, useLayoutEffect, useRef, useState } from "react";

// GitHub's own API needs a token for contribution data, so this uses a free
// community API that serves the public contributions calendar.
const CACHE_KEY = "github-contributions-v1";
const CACHE_MS = 60 * 60 * 1000;
const CELL = 10;
const GAP = 3;

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Contributions {
  total: number;
  days: Day[];
}

const levelOpacity = [0, 0.3, 0.55, 0.8, 1];

function readCache(): Contributions | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    return cached && Date.now() - cached.at < CACHE_MS ? cached.data : null;
  } catch {
    return null;
  }
}

async function fetchContributions(user: string): Promise<Contributions> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
  if (!res.ok) throw new Error("Contributions request failed");
  const json = await res.json();
  const data = { total: json.total.lastYear as number, days: json.contributions as Day[] };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // storage unavailable
  }
  return data;
}

const parseDay = (date: string) => new Date(`${date}T00:00:00`);

// Group days into Sunday-first weeks, padding the first week so each row is
// always the same weekday.
function toWeeks(days: Day[]) {
  const padded: (Day | null)[] = [...Array(days.length ? parseDay(days[0].date).getDay() : 0).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

const ContributionCalendar = ({ user }: { user: string }) => {
  const [data, setData] = useState<Contributions | null>(readCache);
  const [failed, setFailed] = useState(false);
  const [visibleWeeks, setVisibleWeeks] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) return;
    fetchContributions(user).then(setData, () => setFailed(true));
  }, [data, user]);

  // Show as many of the most recent weeks as fit the tile's width.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setVisibleWeeks(Math.floor((el.clientWidth + GAP) / (CELL + GAP)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (failed) return null;

  const weeks = data && visibleWeeks > 0 ? toWeeks(data.days).slice(-visibleWeeks) : [];

  // Label each month where it starts, skipping labels that would overlap.
  const months: { index: number; label: string }[] = [];
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const label = parseDay(first.date).toLocaleString("en-US", { month: "short" });
    const prev = months[months.length - 1];
    if (prev && (prev.label === label || i - prev.index < 3)) return;
    months.push({ index: i, label });
  });

  return (
    <div>
      <div ref={ref} className="relative w-full">
        <div className="relative mb-1 h-3.5 text-[10px] leading-none text-muted">
          {months.map((m) => (
            <span key={`${m.label}-${m.index}`} className="absolute" style={{ left: m.index * (CELL + GAP) }}>
              {m.label}
            </span>
          ))}
        </div>
        {data ? (
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gridAutoFlow: "column",
              gridAutoColumns: `${CELL}px`,
              gap: GAP,
            }}
          >
            {weeks.flat().map((day, i) =>
              day ? (
                <span
                  key={day.date}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${parseDay(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                  className="rounded-[2px]"
                  style={{
                    background: day.level
                      ? `hsl(var(--accent) / ${levelOpacity[day.level]})`
                      : "hsl(var(--line) / 0.08)",
                  }}
                />
              ) : (
                <span key={`pad-${i}`} />
              )
            )}
          </div>
        ) : (
          <div className="animate-pulse rounded-md bg-line/10" style={{ height: 7 * CELL + 6 * GAP }} />
        )}
      </div>
      {data && (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
          <span>
            <span className="font-semibold text-fg">{data.total}</span> contributions in the last year ·{" "}
            <span className="font-semibold text-fg">{longestStreak(data.days)}</span>-day best streak
          </span>
          <span className="hidden items-center gap-1 sm:flex" aria-hidden>
            Less
            {levelOpacity.map((o, level) => (
              <span
                key={level}
                className="size-2.5 rounded-[2px]"
                style={{ background: level ? `hsl(var(--accent) / ${o})` : "hsl(var(--line) / 0.08)" }}
              />
            ))}
            More
          </span>
        </div>
      )}
    </div>
  );
};

export default ContributionCalendar;
