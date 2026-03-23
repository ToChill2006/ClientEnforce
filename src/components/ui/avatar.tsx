import * as React from "react";

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-pink-600",
];

function pickGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return gradients[Math.abs(hash) % gradients.length];
}

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
};

export function Avatar({
  name,
  size = "md",
  className = "",
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        pickGradient(name),
        sizes[size],
        className,
      ].join(" ")}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
