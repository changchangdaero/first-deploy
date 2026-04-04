'use client';

import { useEffect, useRef, useState } from 'react';
import type { VisitorStats } from '@/types/visitor';

const VISITOR_ID_STORAGE_KEY = 'portfolio_visitor_id';
const VISITOR_ID_COOKIE = 'visitor_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type VisitorStatsCardProps = {
  initialStats: VisitorStats;
};

function getVisitorId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);

  if (existing) {
    document.cookie = `${VISITOR_ID_COOKIE}=${existing}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    return existing;
  }

  const visitorId = crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
  document.cookie = `${VISITOR_ID_COOKIE}=${visitorId}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;

  return visitorId;
}

function AnimatedCount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const duration = 500;
    const startValue = previousValueRef.current;
    const difference = value - startValue;

    if (difference === 0) {
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + difference * eased);
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        previousValueRef.current = value;
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return <>{displayValue.toLocaleString('en-US')}</>;
}

export default function VisitorStatsCard({
  initialStats,
}: VisitorStatsCardProps) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const visitorId = getVisitorId();

    if (!visitorId) {
      return;
    }

    let isMounted = true;

    void fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitorId }),
    })
      .then(async (response) => {
        const result = (await response.json()) as VisitorStats & { error?: string };

        if (!response.ok || typeof result.today !== 'number' || typeof result.total !== 'number') {
          return;
        }

        if (isMounted) {
          setStats({
            today: result.today,
            total: result.total,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setStats({ today: 0, total: 0 });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span className="text-[var(--text-faint)]">
      {' · '}
      <span className="font-medium tracking-[0.08em]">TODAY </span>
      <span className="text-[var(--text-muted)]">
        <AnimatedCount value={stats.today} />
      </span>
      {' · '}
      <span className="font-medium tracking-[0.08em]">TOTAL </span>
      <span className="text-[var(--text-muted)]">
        <AnimatedCount value={stats.total} />
      </span>
    </span>
  );
}
