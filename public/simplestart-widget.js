(function() {
  function ready(fn){ document.readyState!='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const brand = document.currentScript?.dataset?.brand || 'demo';

    const btn = document.createElement('button');
    btn.textContent = 'Chat';
    Object.assign(btn.style, { position: 'fixed', right: '20px', bottom: '20px', padding: '10px 14px', borderRadius: '999px', border: '1px solid #ccc', background: '#fff', zIndex: 999999 });
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    Object.assign(panel.style, { position: 'fixed', right: '20px', bottom: '70px', width: '320px', height: '420px', border: '1px solid #ddd', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'none', zIndex: 999999 });
    panel.innerHTML = '<div style="padding:8px;font-weight:600;border-bottom:1px solid #eee">SimpleStart AI</div>' +
      '<div id="ss-messages" style="height:320px;overflow:auto;padding:8px;font-size:14px"></div>' +
      '<div style="display:flex;gap:6px;padding:8px;border-top:1px solid #eee">' +
      '<input id="ss-input" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:8px" placeholder="Type..."/>' +
      '<button id="ss-send" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#f7f7f7">Send</button>' +
      '</div>';
    document.body.appendChild(panel);

    const msgs = panel.querySelector('#ss-messages');
    const inp = panel.querySelector('#ss-input');
    const sendBtn = panel.querySelector('#ss-send');

    function add(role, text){
      const el = document.createElement('div');
      el.innerHTML = '<strong>' + (role==='assistant'?'Assistant':'You') + ':</strong> ' + text;
      el.style.margin = '6px 0';
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
    }

    btn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block' && !msgs.dataset.welcome) {
        add('assistant', "Hey! I'm SimpleStart AI. Ask me about pricing, booking, or FAQs.");
        msgs.dataset.welcome = '1';
      }
    });
    function send() {
      const text = inp.value.trim();
      if (!text) return;
      add('user', text);
      inp.value='';
      fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandHandle: brand, userText: text })
      }).then(r => r.json()).then(data => {
        add('assistant', data.reply || '...');
      }).catch(() => add('assistant', 'Network error.'));
    }
    sendBtn.addEventListener('click', send);
    inp.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') send(); });
  });
})();
