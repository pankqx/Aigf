// Cloudflare Worker: lets visitors chat with Meera without ever seeing your OpenRouter key.
// Secrets and settings (set with wrangler, never in this file):
//   OPENROUTER_KEY   your OpenRouter API key (secret)
//   ALLOWED_ORIGIN   the site that may call this, e.g. https://pankqx.github.io (no trailing slash)
//   MODEL            optional, defaults to openai/gpt-4o-mini
export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const origin = request.headers.get('Origin') || '';
    if (request.method !== 'POST' || !allowed || origin !== allowed) {
      return new Response('Forbidden', { status: 403, headers: cors });
    }

    let body;
    try { body = await request.json(); } catch { return new Response('Bad request', { status: 400, headers: cors }); }

    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .slice(-20)
      .map((m) => ({
        role: ['system', 'user', 'assistant'].includes(m.role) ? m.role : 'user',
        content: String(m.content || '').slice(0, 4000),
      }));

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.OPENROUTER_KEY,
        'Content-Type': 'application/json',
        'X-Title': 'Meera',
      },
      body: JSON.stringify({
        model: env.MODEL || 'openai/gpt-4o-mini',
        stream: true,
        max_tokens: 300,
        messages,
      }),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': upstream.headers.get('Content-Type') || 'text/event-stream' },
    });
  },
};
