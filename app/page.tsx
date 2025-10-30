'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hey! I\'m SimpleStart AI. How can I help today?' }]);
  const [input, setInput] = useState('');
  const [brand, setBrand] = useState('demo');

  useEffect(() => {
    const url = new URL(window.location.href);
    const b = url.searchParams.get('brand');
    if (b) setBrand(b);
  }, []);

  async function send() {
    if (!input.trim()) return;
    const user = { role: 'user', text: input };
    setMessages(m => [...m, user]);
    setInput('');
    const res = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandHandle: brand, userText: user.text })
    });
    const data = await res.json();
    setMessages(m => [...m, { role: 'assistant', text: data.reply }]);
  }

  return (
    <main className="min-h-screen flex flex-col items-center gap-4 p-6" style={{fontFamily:'Inter, Manrope, Poppins, system-ui'}}>
      <h1 className="text-2xl font-bold">SimpleStart AI — Local Demo</h1>
      <div className="w-full max-w-xl border rounded p-4 space-y-2" style={{borderColor:'#ddd'}}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'assistant' ? 'text-blue-700' : 'text-gray-900'}>
            <strong>{m.role === 'assistant' ? 'Assistant' : 'You'}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="w-full max-w-xl flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? send() : null}
          style={{borderColor:'#ddd'}}
        />
        <button onClick={send} className="border rounded px-4 py-2" style={{borderColor:'#ddd'}}>Send</button>
      </div>
      <p className="text-sm" style={{color:'#666'}}>Current brand: <code>{brand}</code> — try <code>?brand=simplestart</code> in the URL</p>
    </main>
  );
}
