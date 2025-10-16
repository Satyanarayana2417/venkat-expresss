import { useEffect, useRef, useState } from 'react';

interface UseCountUpProps {
  end: number;
  duration?: number;
  startOnView?: boolean;
}

export const useCountUp = ({ end, duration = 2000, startOnView = true }: UseCountUpProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!startOnView && !hasAnimated) {
      animateCount();
      return;
    }

    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  const animateCount = () => {
    setHasAnimated(true);
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  };

  return { count, elementRef };
};
