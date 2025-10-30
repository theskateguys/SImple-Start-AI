type LLMArgs = { system: string; brand: any; userText: string; kb: string; intent: string; };

export async function callLLM({ system, brand, userText, kb, intent }: LLMArgs): Promise<{ reply: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  // Fallback if no API key
  if (!apiKey) {
    const lower = userText.toLowerCase();
    if (/(hello|hi|hey)/.test(lower)) return { reply: brand.greeting || 'Hey there! How can I help?' };
    if (/(price|cost|how much)/.test(lower)) {
      const offers = (brand.offerings || []).map((o:any) => `${o.name} — ${o.price}`).join('; ');
      return { reply: `Here are our options: ${offers}. Would you like to book?` };
    }
    if (/(book|schedule|available)/.test(lower))
      return { reply: `You can book via this link: ${brand.booking?.url}. Share a preferred day/time and I can suggest a slot.` };
    return { reply: `Got it! Quick info: ${brand.description} — Ask me about pricing, booking, or FAQs.` };
  }

  // OpenAI path
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: [system, '--- KNOWLEDGE ---', kb, '--- USER ---', userText, 'Return a concise helpful reply.'].join('\n') }
      ],
      temperature: 0.4
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenAI error:', err);
    return { reply: 'I had trouble reaching the AI service. Please try again.' };
  }
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || 'Sorry, I do not have a reply right now.';
  return { reply };
}
