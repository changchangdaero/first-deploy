const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

type AttemptBucket = {
  attempts: number[];
};

const attemptStore = new Map<string, AttemptBucket>();

function pruneExpiredAttempts(now: number, timestamps: number[]) {
  return timestamps.filter((timestamp) => now - timestamp < LOGIN_WINDOW_MS);
}

export function getClientIpFromHeaders(headerValue: string | null) {
  if (!headerValue) {
    return 'unknown';
  }

  return headerValue.split(',')[0]?.trim() || 'unknown';
}

export function checkAdminLoginRateLimit(ip: string) {
  const now = Date.now();
  const bucket = attemptStore.get(ip);
  const recentAttempts = pruneExpiredAttempts(now, bucket?.attempts ?? []);

  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    const oldestAttempt = recentAttempts[0] ?? now;
    const retryAfterMs = Math.max(LOGIN_WINDOW_MS - (now - oldestAttempt), 0);

    attemptStore.set(ip, { attempts: recentAttempts });

    return {
      allowed: false,
      retryAfterMs,
    };
  }

  attemptStore.set(ip, { attempts: recentAttempts });

  return {
    allowed: true,
    retryAfterMs: 0,
  };
}

export function recordAdminLoginFailure(ip: string) {
  const now = Date.now();
  const bucket = attemptStore.get(ip);
  const recentAttempts = pruneExpiredAttempts(now, bucket?.attempts ?? []);

  recentAttempts.push(now);
  attemptStore.set(ip, { attempts: recentAttempts });
}

export function clearAdminLoginFailures(ip: string) {
  attemptStore.delete(ip);
}
