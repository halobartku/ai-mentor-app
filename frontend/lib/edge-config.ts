import { get, getAll, has } from '@vercel/edge-config';

interface CacheConfig {
  ttl: number;
  key: string;
}

export async function getFromEdge<T>(key: string): Promise<T | null> {
  try {
    return await get<T>(key);
  } catch (error) {
    console.error('Edge Config Error:', error);
    return null;
  }
}

export async function getAllFromEdge<T>(): Promise<T | null> {
  try {
    return await getAll<T>();
  } catch (error) {
    console.error('Edge Config Error:', error);
    return null;
  }
}

export async function checkEdgeKey(key: string): Promise<boolean> {
  try {
    return await has(key);
  } catch (error) {
    console.error('Edge Config Error:', error);
    return false;
  }
}