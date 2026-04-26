import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 40, delay = 0, className = "", onComplete }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse text-amber-400">|</span>
      )}
    </span>
  );
}

interface TypewriterListProps {
  items: string[];
  speed?: number;
  itemDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function TypewriterList({ items, speed = 30, itemDelay = 200, className = "", itemClassName = "" }: TypewriterListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  return (
    <div className={className}>
      {completedItems.map((item, i) => (
        <div key={i} className={itemClassName}>{item}</div>
      ))}
      {currentIndex < items.length && (
        <Typewriter
          text={items[currentIndex]}
          speed={speed}
          delay={currentIndex === 0 ? 0 : itemDelay}
          className={itemClassName}
          onComplete={() => {
            setCompletedItems(prev => [...prev, items[currentIndex]]);
            setCurrentIndex(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}
