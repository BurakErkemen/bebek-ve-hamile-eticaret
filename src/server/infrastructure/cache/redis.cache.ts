import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getCache<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}
