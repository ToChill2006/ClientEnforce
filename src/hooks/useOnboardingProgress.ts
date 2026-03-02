"use client";

import * as React from "react";

type ProgressRow = {
  onboarding_id: string;
  required_total: number;
  required_completed: number;
  percent: number;
};

export function useOnboardingProgress(ids: string[]) {
  const [data, setData] = React.useState<Record<string, ProgressRow>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const uniq = Array.from(new Set(ids)).filter(Boolean);
    if (uniq.length === 0) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/onboardings/progress?ids=${encodeURIComponent(uniq.join(","))}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const map: Record<string, ProgressRow> = {};
        for (const row of json.onboardings || []) {
          map[row.onboarding_id] = row;
        }
        setData(map);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids.join(",")]);

  return { data, loading };
}