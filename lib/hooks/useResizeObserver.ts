"use client";
import { useEffect, useRef } from 'react';

export function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  delay = 100 // debounce delay in ms
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ref, callback, delay]);
}
