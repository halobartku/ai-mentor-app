import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Anthropic } from '@anthropic-ai/sdk';
import { AIPipelineService } from '@/services/ai-pipeline.service';

const aiPipeline = new AIPipelineService();

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Check cache
    const cacheKey = `chat:${message.slice(0, 100)}`;
    const cached = await kv.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const response = await aiPipeline.processInput(message, {});
    
    // Cache response
    await kv.set(cacheKey, response, { ex: 3600 });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}