// node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const C = require('../ui/checkout.js');

const res = (status, body, headers = {}) => ({
  status, json: async () => body, headers: { get: (h) => headers[h] ?? null }
});

test('200 con url de checkout.stripe.com -> redirect', () => {
  assert.deepStrictEqual(C.classifyResponse(200, { url: 'https://checkout.stripe.com/c/pay/cs_test_1' }),
    { kind: 'redirect', url: 'https://checkout.stripe.com/c/pay/cs_test_1' });
});
test('200 con url ajena o http -> fatal', () => {
  assert.strictEqual(C.classifyResponse(200, { url: 'https://evil.com/x' }).kind, 'fatal');
  assert.strictEqual(C.classifyResponse(200, { url: 'http://checkout.stripe.com/x' }).kind, 'fatal');
  assert.strictEqual(C.classifyResponse(200, { url: 'https://checkout.stripe.com.evil.com/' }).kind, 'fatal');
});
test('400 invalid_product -> fatal, no reintentable', () => {
  assert.deepStrictEqual(C.classifyResponse(400, { error: 'invalid_product' }), { kind: 'fatal', code: 'invalid_product' });
});
test('429 respeta Retry-After (segundos y fecha)', () => {
  assert.deepStrictEqual(C.classifyResponse(429, { error: 'rate_limited' }, (h) => h === 'Retry-After' ? '7' : null),
    { kind: 'rate_limited', retryAfter: 7 });
  assert.strictEqual(C.parseRetryAfter(new Date(10000 + 5000).toUTCString(), 10000), 5);
  assert.strictEqual(C.parseRetryAfter(null), 1);
});
test('502 stripe_unavailable -> reintentable', () => {
  assert.deepStrictEqual(C.classifyResponse(502, { error: 'stripe_unavailable' }), { kind: 'retryable', code: 'stripe_unavailable' });
});
test('reintentos reusan la misma Idempotency-Key y mandan {product:"pro"}', async () => {
  const calls = [];
  let n = 0;
  const fetch = async (url, init) => { calls.push({ url, init }); return n++ === 0 ? res(502, { error: 'stripe_unavailable' }) : res(200, { url: 'https://checkout.stripe.com/c/pay/x' }); };
  const a = C.createCheckoutAttempt({ fetch, crypto: { randomUUID: () => 'uuid-1' } });
  assert.strictEqual((await a.request()).kind, 'retryable');
  assert.strictEqual((await a.request()).kind, 'redirect');
  assert.strictEqual(calls[0].url, '/api/checkout');
  assert.strictEqual(calls[0].init.mode, 'cors');
  assert.strictEqual(calls[0].init.method, 'POST');
  assert.deepStrictEqual(JSON.parse(calls[0].init.body), { product: 'pro' });
  assert.strictEqual(calls[0].init.headers['Idempotency-Key'], 'uuid-1');
  assert.strictEqual(calls[1].init.headers['Idempotency-Key'], 'uuid-1');
});
test('error de red y timeout -> reintentables', async () => {
  const a = C.createCheckoutAttempt({ fetch: async () => { throw new TypeError('fail'); }, crypto: { randomUUID: () => 'k' } });
  assert.deepStrictEqual(await a.request(), { kind: 'retryable', code: 'network_error' });
  const b = C.createCheckoutAttempt({ timeoutMs: 20, crypto: { randomUUID: () => 'k' },
    fetch: (u, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => { const e = new Error('a'); e.name = 'AbortError'; rej(e); })) });
  assert.deepStrictEqual(await b.request(), { kind: 'retryable', code: 'timeout' });
});

test('base URL configurable', async () => {
  assert.strictEqual(C.checkoutUrl(''), '/api/checkout');
  assert.strictEqual(C.checkoutUrl('https://pay.example.dev/'), 'https://pay.example.dev/api/checkout');
  let url;
  const a = C.createCheckoutAttempt({ base: 'https://pay.example.dev', crypto: { randomUUID: () => 'k' },
    fetch: async (u) => { url = u; return res(502, {}); } });
  await a.request();
  assert.strictEqual(url, 'https://pay.example.dev/api/checkout');
});
test('opener: usa window.openai.openExternal con {href} si existe', () => {
  const got = []; let opened = false;
  const o = C.prepareOpener({ openai: { openExternal: (x) => got.push(x) }, open: () => { opened = true; } });
  assert.strictEqual(o.mode, 'openExternal');
  assert.deepStrictEqual(o.navigate('https://checkout.stripe.com/x'), { opened: true });
  assert.deepStrictEqual(got, [{ href: 'https://checkout.stripe.com/x' }]);
  assert.strictEqual(opened, false);
});
test('opener: ventana abierta antes del fetch, navega o se cierra en error', () => {
  const args = []; const w = { location: {}, closed: false, close() { this.closed = true; } };
  const o = C.prepareOpener({ open: (...a) => { args.push(a); return w; } });
  assert.deepStrictEqual(args, [['', '_blank']]);
  assert.strictEqual(w.opener, null);
  o.navigate('https://checkout.stripe.com/y');
  assert.strictEqual(w.location.href, 'https://checkout.stripe.com/y');
  const w2 = { location: {}, closed: false, close() { this.closed = true; } };
  C.prepareOpener({ open: () => w2 }).cancel();
  assert.strictEqual(w2.closed, true);
});
test('opener: popup bloqueado -> devuelve url para mostrar link', () => {
  const o = C.prepareOpener({ open: () => null });
  assert.strictEqual(o.mode, 'link');
  assert.deepStrictEqual(o.navigate('https://checkout.stripe.com/z'), { opened: false, url: 'https://checkout.stripe.com/z' });
});
