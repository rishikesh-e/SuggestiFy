import React, { useEffect, useRef, useState } from "react";

interface AnimatedDescriptionProps {
  text: string;
  speed?: number;
  batchSize?: number;
}

const AnimatedDescription: React.FC<AnimatedDescriptionProps> = ({
  text,
  speed = 0.1,
  batchSize = 10,
}) => {
  const displayRef = useRef<HTMLParagraphElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
        return;
      }

      const nextIndex = Math.min(index + batchSize, text.length);
      if (displayRef.current) {
        displayRef.current.textContent += text.slice(index, nextIndex);
      }
      index = nextIndex;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, batchSize]);

  return (
    <p className="text-2xl mb-6">
      <span ref={displayRef}></span>
      {!done && <span className="animate-pulse">|</span>}
    </p>
  );
};

export default AnimatedDescription;
