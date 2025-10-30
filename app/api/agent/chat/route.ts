import { NextResponse } from 'next/server';
import { loadBrandPack, saveLead, saveMessage } from '@/lib/storage';
import { callLLM } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const { brandHandle = 'demo', userText = '' } = await request.json();
    const brand = await loadBrandPack(brandHandle);
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const t = (userText || '').toLowerCase();
    const intent = /(book|schedule|class|available)/.test(t) ? 'BOOKING'
      : /(price|cost|how much)/.test(t) ? 'PRICING'
      : /(where|location|address)/.test(t) ? 'FAQ'
      : 'SMALL_TALK';

    const maybePhone = t.match(/\+?\d[\d\s\-]{6,}/)?.[0];
    const maybeEmail = t.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0];
    if (maybePhone || maybeEmail) {
      await saveLead(brand.handle, { phone: maybePhone || null, email: maybeEmail || null, source: 'web' });
    }

    const system = `You are SimpleStart AI for ${brand.name}. Keep replies under 120 words. Use friendly Caribbean-neutral tone.`;
    const kb = [
      `Greeting: ${brand.greeting}`,
      `Offerings: ${(brand.offerings || []).map((o:any)=>o.name + ' ' + o.price).join('; ')}`,
      `Booking: ${brand.booking?.method} ${brand.booking?.url}`,
      `Top FAQs: ${(brand.faqs || []).map((f:any)=>f.q + ': ' + f.a).join(' | ')}`
    ].join('\n');

    const { reply } = await callLLM({ system, brand, userText, kb, intent });

    await saveMessage(brand.handle, { role: 'user', text: userText });
    await saveMessage(brand.handle, { role: 'assistant', text: reply });

    return NextResponse.json({ reply });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
