import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

/**
 * Upstash Redis tabanlı sliding-window rate limiter.
 * UPSTASH_REDIS_REST_URL / TOKEN env değişkenleri tanımlı değilse
 * rate-limit atlanır (geliştirme ortamı için güvenli).
 */

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

interface RateLimitOptions {
  /** Redis key prefix — her uç için benzersiz olmalı */
  prefix: string;
  /** Zaman penceresi (saniye) */
  windowSeconds: number;
  /** Pencere içinde izin verilen maksimum istek sayısı */
  maxRequests: number;
}

/**
 * İstek başına rate-limit kontrolü.
 * Limitin aşıldığı durumda 429 yanıtı döner; aksi halde null döner (devam et).
 */
export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions,
): Promise<NextResponse | null> {
  const client = getRedis();
  if (!client) return null; // Redis yoksa atla

  const ip = getClientIp(req);
  const key = `rl:${options.prefix}:${ip}`;

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - options.windowSeconds;

  const pipe = client.pipeline();
  // Eski kayıtları temizle
  pipe.zremrangebyscore(key, 0, windowStart);
  // Mevcut sayıyı al
  pipe.zcard(key);
  // Yeni isteği ekle
  pipe.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  // TTL'i taze tut
  pipe.expire(key, options.windowSeconds);

  const results = await pipe.exec<[number, number, number, number]>();
  const count = results[1] as number;

  if (count >= options.maxRequests) {
    return NextResponse.json(
      { error: "Çok fazla istek gönderdiniz. Lütfen bekleyin." },
      {
        status: 429,
        headers: {
          "Retry-After": String(options.windowSeconds),
          "X-RateLimit-Limit": String(options.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return null;
}
