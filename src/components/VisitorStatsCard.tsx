'use client';

import { useEffect, useRef, useState } from 'react';
import type { VisitorStats } from '@/types/visitor';

const VISITOR_ID_STORAGE_KEY = 'portfolio_visitor_id';
const VISITOR_ID_COOKIE = 'visitor_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type VisitorStatsCardProps = {
  initialStats?: VisitorStats | null;
};

function createVisitorIdWithTimestampFallback() {
  let timestamp = Date.now();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);

    return (character === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function createVisitorIdWithRandomValues(cryptoApi: Crypto) {
  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hexValues = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

  return [
    hexValues.slice(0, 4).join(''),
    hexValues.slice(4, 6).join(''),
    hexValues.slice(6, 8).join(''),
    hexValues.slice(8, 10).join(''),
    hexValues.slice(10, 16).join(''),
  ].join('-');
}

function createVisitorId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const cryptoApi = window.crypto;

  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  if (typeof cryptoApi?.getRandomValues === 'function') {
    return createVisitorIdWithRandomValues(cryptoApi);
  }

  return createVisitorIdWithTimestampFallback();
}

function getVisitorId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);

  if (existing) {
    document.cookie = `${VISITOR_ID_COOKIE}=${existing}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    return existing;
  }

  const visitorId = createVisitorId();

  if (!visitorId) {
    return null;
  }

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

function VisitorCountValue({ value }: { value?: number }) {
  if (typeof value !== 'number') {
    return <>-</>;
  }

  return <AnimatedCount value={value} />;
}

export default function VisitorStatsCard({
  initialStats = null,
}: VisitorStatsCardProps) {
  const [stats, setStats] = useState<VisitorStats | null>(initialStats);

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
          setStats(initialStats);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialStats]);

  return (
    <>
      <span className="portfolio-footer__separator">·</span>
      <span className="portfolio-footer__stat">
        <span className="portfolio-footer__stat-label">TODAY</span>
        <span className="portfolio-footer__stat-value">
          <VisitorCountValue value={stats?.today} />
        </span>
      </span>
      <span className="portfolio-footer__separator">·</span>
      <span className="portfolio-footer__stat">
        <span className="portfolio-footer__stat-label">TOTAL</span>
        <span className="portfolio-footer__stat-value">
          <VisitorCountValue value={stats?.total} />
        </span>
      </span>
    </>
  );
}
