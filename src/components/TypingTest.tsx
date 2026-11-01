import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LuKeyboard, LuRotateCcw } from "react-icons/lu";

// Everyday words mixed with a few from my own projects.
const WORDS = (
  "the of and to in is you that it he was for on are as with his they at be this have from or one had by word but not " +
  "what all were we when your can said there use an each which she do how their if will up other about out many then " +
  "them these so some her would make like him into time has look two more write go see number no way could people my " +
  "than first water been call who oil its now find long down day did get come made may part over new sound take only " +
  "little work know place year live me back give most very after thing our just name good sentence man think say great " +
  "where help through much before line right too mean old any same tell boy follow came want show also around form three " +
  "small set put end does another well large must big even such because turn here why ask went men read need land " +
  "react robot sketch build code design pixel vector render debug deploy stack sensor motor drive piano model"
).split(" ");

const MODES = [15, 30] as const;
const BEST_KEY = "typing-best";

const shuffledWords = (count = 120) =>
  Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);

// The visitor's best score, saved in their browser.
export function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

// Correct characters typed (including the space after each fully correct
// word), which is what WPM is based on.
function correctChars(words: string[], typed: string[], current: string) {
  let n = 0;
  typed.forEach((t, i) => {
    for (let c = 0; c < Math.min(t.length, words[i].length); c++) if (t[c] === words[i][c]) n++;
    if (t === words[i]) n++;
  });
  const target = words[typed.length] ?? "";
  for (let c = 0; c < Math.min(current.length, target.length); c++) if (current[c] === target[c]) n++;
  return n;
}

interface TypingTestProps {
  targetWpm: number; // my best, shown as the score to beat
}

const TypingTest: React.FC<TypingTestProps> = ({ targetWpm }) => {
  const [mode, setMode] = useState<(typeof MODES)[number]>(15);
  const [words, setWords] = useState(shuffledWords);
  const [typed, setTyped] = useState<string[]>([]); // completed words
  const [current, setCurrent] = useState("");
  const [keystrokes, setKeystrokes] = useState({ total: 0, correct: 0 });
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [focused, setFocused] = useState(false);
  const [best, setBest] = useState(readBest);
  const [offset, setOffset] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const elapsed = startedAt ? Math.min((now - startedAt) / 1000, mode) : 0;
  const finished = startedAt !== null && elapsed >= mode;
  const remaining = Math.ceil(mode - elapsed);

  const wpm = useMemo(() => {
    if (!startedAt || elapsed < 1) return 0;
    return Math.round(correctChars(words, typed, current) / 5 / (elapsed / 60));
  }, [words, typed, current, elapsed, startedAt]);

  // The live readout updates once a second so it doesn't flicker on every key.
  const wpmRef = useRef(0);
  wpmRef.current = wpm;
  const [liveWpm, setLiveWpm] = useState(0);
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => setLiveWpm(wpmRef.current), 1000);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  const accuracy = keystrokes.total ? Math.round((keystrokes.correct / keystrokes.total) * 100) : 100;

  // Start ready to type when the test opens.
  useEffect(() => inputRef.current?.focus(), []);

  // Tick while a test is running.
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  // Save a new best when a test ends.
  useEffect(() => {
    if (!finished || wpm <= best) return;
    setBest(wpm);
    try {
      localStorage.setItem(BEST_KEY, String(wpm));
    } catch {
      // storage unavailable
    }
  }, [finished, wpm, best]);

  // Keep the active word on the first or second visible line by shifting the
  // word list up a line at a time.
  useLayoutEffect(() => {
    const active = wordsRef.current?.querySelector<HTMLElement>("[data-active]");
    if (!active) return;
    const lineHeight = active.offsetHeight;
    const line = Math.round(active.offsetTop / lineHeight);
    setOffset(Math.max(0, line - 1) * lineHeight);
  }, [typed.length]);

  const restart = (nextMode = mode) => {
    setMode(nextMode);
    setWords(shuffledWords());
    setTyped([]);
    setCurrent("");
    setKeystrokes({ total: 0, correct: 0 });
    setStartedAt(null);
    setLiveWpm(0);
    setOffset(0);
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const value = e.target.value;
    if (!startedAt && value.trim()) {
      setStartedAt(Date.now());
      setNow(Date.now());
    }

    // Score each added character. Input can arrive several characters at a
    // time (paste, phone keyboards), so walk through all of them.
    if (value.startsWith(current) && value.length > current.length) {
      let total = 0;
      let correct = 0;
      let word = typed.length;
      let attempt = current;
      for (const ch of value.slice(current.length)) {
        total++;
        if (ch === " ") {
          // A space is correct when it ends a correctly typed word.
          if (attempt && attempt === words[word]) correct++;
          if (attempt) word++;
          attempt = "";
        } else {
          if (words[word]?.[attempt.length] === ch) correct++;
          attempt += ch;
        }
      }
      setKeystrokes((k) => ({ total: k.total + total, correct: k.correct + correct }));
    }

    // Every space ends a word; whatever follows the last space is in progress.
    const parts = value.split(" ");
    const rest = parts.pop() ?? "";
    const completed = parts.filter(Boolean);
    if (completed.length) {
      setTyped((t) => [...t, ...completed]);
      if (typed.length + completed.length > words.length - 20) setWords((w) => [...w, ...shuffledWords(60)]);
    }
    setCurrent(rest);
  };

  const diff = wpm - targetWpm;

  return (
    <div className="flex flex-col gap-4 p-6 md:p-8">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:pr-10">
        <div className="pr-10 sm:pr-0">
          <h2 className="flex items-center gap-2 whitespace-nowrap font-display text-2xl font-bold text-fg">
            <LuKeyboard className="text-accent" /> Typing test
          </h2>
          <p className="mt-1 text-sm text-muted">
            My best is <span className="font-semibold text-accent">{targetWpm} wpm</span>
            {best > 0 && <> · yours is <span className="font-semibold text-fg">{best} wpm</span></>}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => restart(m)}
              className={`rounded-md px-2 py-0.5 transition-colors ${
                mode === m ? "bg-accent/15 font-medium text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {m}s
            </button>
          ))}
          <button
            onClick={() => restart()}
            aria-label="Restart typing test"
            className="ml-1 rounded-md p-1 text-muted transition-colors hover:text-fg"
          >
            <LuRotateCcw />
          </button>
        </div>
      </div>

      <div
        className="relative min-h-[6.75rem] cursor-text"
        // Focus on press (not click) so the browser doesn't move focus to the
        // page in between.
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          value={current}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => finished && e.key === "Enter" && restart()}
          aria-label="Type the words shown"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          // Kept tiny and click-through so it never covers the buttons; the
          // wrapper's onMouseDown focuses it instead.
          className="pointer-events-none absolute left-0 top-0 h-px w-px text-base opacity-0"
        />

        {finished ? (
          <div className="flex h-[6.75rem] flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-accent">{wpm}</p>
              <p className="text-xs uppercase tracking-wider text-muted">wpm</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-fg">{accuracy}%</p>
              <p className="text-xs uppercase tracking-wider text-muted">accuracy</p>
            </div>
            <button
              onClick={() => restart()}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/85"
            >
              <LuRotateCcw /> Try again
            </button>
          </div>
        ) : (
          // Three visible lines; the list slides up as you type.
          <div className={`h-[6.75rem] overflow-hidden font-mono text-lg transition-opacity md:text-xl ${focused ? "" : "opacity-40 blur-[1px]"}`}>
            <div
              ref={wordsRef}
              className="flex flex-wrap transition-transform duration-150"
              style={{ transform: `translateY(-${offset}px)` }}
            >
              {words.map((word, i) => {
                const isActive = i === typed.length;
                const done = i < typed.length;
                const attempt = done ? typed[i] : isActive ? current : "";
                const extra = attempt.slice(word.length);
                return (
                  <span
                    key={i}
                    data-active={isActive || undefined}
                    className={`relative mr-[0.6em] leading-[2.25rem] ${
                      done && attempt !== word ? "underline decoration-red-500/70 underline-offset-4" : ""
                    }`}
                  >
                    {word.split("").map((ch, c) => (
                      <span
                        key={c}
                        className={
                          c >= attempt.length ? "typing-untyped" : attempt[c] === ch ? "typing-correct" : "typing-wrong"
                        }
                      >
                        {isActive && c === current.length && <Caret />}
                        {ch}
                      </span>
                    ))}
                    {extra && <span className="typing-wrong opacity-70">{extra}</span>}
                    {isActive && current.length >= word.length && <Caret />}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {!focused && !finished && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-fg">
            Click here and start typing
          </p>
        )}
      </div>

      <div className="flex min-h-7 items-center justify-between gap-4 text-sm text-muted">
        {finished ? (
          <>
            <span className={`font-medium ${diff > 0 ? "text-accent" : "text-fg"}`}>
              {diff > 0
                ? `You beat my best by ${diff} wpm!`
                : diff === 0
                  ? "A tie with my best!"
                  : `${-diff} wpm short of my best. One more try?`}
            </span>
            <span className="hidden sm:inline">Enter to retry · Esc to close</span>
          </>
        ) : (
          <>
            <span className="font-mono text-lg font-semibold text-accent">{startedAt ? remaining : mode}</span>
            <span>{startedAt ? `${liveWpm} wpm` : "timer starts when you type"}</span>
          </>
        )}
      </div>
    </div>
  );
};

const Caret = () => (
  <span
    aria-hidden
    className="typing-caret absolute -ml-px mt-1.5 h-6 w-0.5 rounded-full bg-accent"
  />
);

export default TypingTest;
