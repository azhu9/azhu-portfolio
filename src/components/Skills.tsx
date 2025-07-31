import { useState, useEffect, useRef } from "react";

const techStack = [
  { name: "JavaScript", icon: "🟨", bg: "bg-yellow-400" },
  { name: "TypeScript", icon: "🟦", bg: "bg-blue-500" },
  { name: "React", icon: "⚛️", bg: "bg-cyan-500" },
  { name: "Node.js", icon: "🟩", bg: "bg-green-600" },
  { name: "Next.js", icon: "⬛", bg: "bg-neutral-900" },
  { name: "Python", icon: "🐍", bg: "bg-yellow-600" },
  { name: "Flask", icon: "💧", bg: "bg-blue-400" },
  { name: "Java", icon: "☕", bg: "bg-orange-600" },
  { name: "C++", icon: "💠", bg: "bg-blue-500" },
  { name: "C", icon: "🔧", bg: "bg-gray-500" },
  { name: "SQL", icon: "🗄️", bg: "bg-blue-800" },
  { name: "MongoDB", icon: "🍃", bg: "bg-emerald-600" },
  { name: "Matlab", icon: "📈", bg: "bg-red-600" },
];

const ITEM_WIDTH = 80; // Fixed width for each icon container
const GAP = 12; // Gap between items

export default function Skills() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate how many items can fit based on container width
  useEffect(() => {
    const calculateVisibleCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemsWithGaps = Math.floor(
          (containerWidth + GAP) / (ITEM_WIDTH + GAP)
        );
        setVisibleCount(Math.max(1, Math.min(itemsWithGaps, techStack.length)));
      }
    };

    calculateVisibleCount();

    const resizeObserver = new ResizeObserver(calculateVisibleCount);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || visibleCount >= techStack.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = techStack.length - visibleCount;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, visibleCount]);

  // Reset index if it's out of bounds when container resizes
  useEffect(() => {
    const maxIndex = Math.max(0, techStack.length - visibleCount);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, currentIndex]);

  const maxSlides = Math.max(1, techStack.length - visibleCount + 1);

  return (
    <div className="background pt-8 px-8">
      <div className="mb-12">
        <p className="text-gray-400 font-light text-sm mb-2 tracking-wide">
          What am I building with?
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          My Tech Stack
        </h1>
        <p className="text-gray-300 text-lg">
          See my resume for a full list of skills/technologies!
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-1000 ease-in-out mt-6"
          style={{
            transform: `translateX(-${currentIndex * (ITEM_WIDTH + GAP)}px)`,
            gap: `${GAP}px`,
          }}
        >
          {techStack.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="mx-auto flex-shrink-0 dark:bg-gray-700/50 bg-gray-300/50  backdrop-blur-sm rounded-lg p-2 border border-gray-600/30 hover:bg-gray-600/50 transition-all duration-300 hover:border-gray-500/50"
              style={{
                width: `${ITEM_WIDTH}px`,
                height: `${ITEM_WIDTH}px`,
              }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-1">
                <div
                  className={`w-8 h-8 ${tech.bg} rounded-md flex items-center justify-center dark:text-white text-black font-bold text-xs shadow-lg`}
                >
                  {tech.icon}
                </div>
                <span className="dark:text-white text-black font-medium text-[10px] text-center leading-tight">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {maxSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "dark:bg-white bg-gray-700 w-8"
                  : "dark:bg-gray-600 bg-gray-400 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
