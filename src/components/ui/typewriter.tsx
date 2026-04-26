import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export function Typewriter({ text, speed = 30, delay = 0, className = "", onComplete, cursor = true }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && <span className="animate-pulse text-amber-400">|</span>}
    </span>
  );
}

interface TypewriterLoopProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export function TypewriterLoop({ words, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000, className = "" }: TypewriterLoopProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    
    if (!isDeleting && displayed === current) {
      const timer = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timer);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayed(current.slice(0, displayed.length - 1));
      } else {
        setDisplayed(current.slice(0, displayed.length + 1));
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-amber-400">|</span>
    </span>
  );
}
