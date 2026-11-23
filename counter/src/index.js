const SITE_ORIGIN = 'https://cataplum1414.github.io';

function responseHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store, private',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin !== SITE_ORIGIN) return new Response('Forbidden', { status: 403 });

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/visit') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const counter = env.VISITS.getByName('tu-sombra-digital');
    const visits = await counter.increment();
    return Response.json({ visits }, { headers: responseHeaders(origin) });
  }
};

export class VisitCounter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async increment() {
    const current = (await this.ctx.storage.get('visits')) || 0;
    const visits = current + 1;
    await this.ctx.storage.put('visits', visits);
    return visits;
  }
}
