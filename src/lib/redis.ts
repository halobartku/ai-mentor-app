import { kv } from '@vercel/kv'

if (!process.env.KV_URL || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('Redis KV environment variables not set')
}

export { kv }