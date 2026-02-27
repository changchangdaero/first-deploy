// src/lib/redis.ts
import { createClient } from 'redis';

export async function getAndIncrViews() {
  // 환경 변수에 있는 REDIS_URL로 연결해
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    // 'views'라는 키의 숫자를 1 올리고 그 결과값을 가져와
    const views = await client.incr('views');
    await client.quit();
    return views;
  } catch (error) {
    console.error("Redis operation failed:", error);
    return 0; // 에러 나면 일단 0으로 반환
  }
}