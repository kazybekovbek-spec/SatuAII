import { NextResponse } from 'next/server';

const SYSTEM = `You are SatuAI Sales Manager, a concise bilingual Kazakh/Russian sales assistant for SatuAI.
SatuAI builds premium websites, AI sales managers, WhatsApp/CRM integrations and business automation.
Current packages: START 29,900 KZT; BUSINESS 50,000 KZT; AI SALES 89,000 KZT.
BUSINESS is the most popular package. Never invent discounts, deadlines, client counts, guarantees, or capabilities.
Answer in the user's language (Kazakh or Russian). Keep answers clear and sales-oriented, normally 2-5 sentences.
When the user is ready to order, recommend contacting WhatsApp and include this exact link: https://wa.me/message/DT4AYUWH6RRCE1
If asked about something outside SatuAI, politely steer back to SatuAI services.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;
    if (!apiKey || !model) return NextResponse.json({ error: 'AI environment variables are not configured.' }, { status: 503 });
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    const input = messages.map((m:any)=>({role:m.role === 'assistant' ? 'assistant' : 'user', content:[{type:'input_text',text:String(m.content||'').slice(0,3000)}]}));
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, instructions: SYSTEM, input, max_output_tokens: 350 })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || 'AI request failed' }, { status: response.status });
    const reply = data.output_text || data.output?.flatMap((x:any)=>x.content||[]).find((x:any)=>x.type==='output_text')?.text || 'Жауап алу мүмкін болмады.';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
