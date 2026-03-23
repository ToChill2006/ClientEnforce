"use client";
import { useEffect, useRef } from "react";

export function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("fade-up-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`opacity-0 ${className}`}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </div>
  );
}
