// DataCanvas checkout client: el pago lo arma el servidor (POST /api/checkout).
// Lógica pura y testeable; sin dependencias. Funciona en navegador y en Node.
(function (root) {
  'use strict';

  var CHECKOUT_ENDPOINT = '/api/checkout';
  var TIMEOUT_MS = 10000;
  var SUPPORT_EMAIL = 'soporte@ranuk.dev';

  var TEXT = {
    idle: 'Upgrade to Pro',
    loading: 'Opening secure checkout\u2026',
    retry: 'Try again',
    unavailable: 'Checkout is temporarily unavailable. Try again',
    rateLimited: function (n) { return 'Too many attempts. You can try again in ' + n + ' s.'; },
    fatal: 'Something went wrong on our side. Please contact ' + SUPPORT_EMAIL,
    note: 'Redirects to Stripe secure checkout.'
  };

  function isStripeCheckoutUrl(url) {
    try {
      var u = new URL(url);
      return u.protocol === 'https:' && u.hostname === 'checkout.stripe.com';
    } catch (e) { return false; }
  }

  function parseRetryAfter(value, nowMs) {
    if (value == null || value === '') return 1;
    var n = Number(value);
    if (Number.isFinite(n)) return Math.max(1, Math.ceil(n));
    var t = Date.parse(value);
    if (!Number.isNaN(t)) return Math.max(1, Math.ceil((t - (nowMs || Date.now())) / 1000));
    return 1;
  }

  // Pura: (status, body, headers.get) -> resultado normalizado.
  // kind: 'redirect' | 'fatal' | 'rate_limited' | 'retryable'
  function classifyResponse(status, body, getHeader, nowMs) {
    if (status === 200) {
      if (body && typeof body.url === 'string' && isStripeCheckoutUrl(body.url)) {
        return { kind: 'redirect', url: body.url };
      }
      return { kind: 'fatal', code: 'invalid_checkout_url' };
    }
    if (status === 429) {
      return { kind: 'rate_limited', retryAfter: parseRetryAfter(getHeader && getHeader('Retry-After'), nowMs) };
    }
    if (status === 502) return { kind: 'retryable', code: 'stripe_unavailable' };
    // 400 invalid_product y cualquier otro estado: no reintentable.
    return { kind: 'fatal', code: (body && body.error) || ('http_' + status) };
  }

  function newIdempotencyKey(cryptoObj) {
    var c = cryptoObj || (typeof crypto !== 'undefined' ? crypto : null);
    return c.randomUUID();
  }

  // Un "intento de compra" mantiene la misma Idempotency-Key en todos sus reintentos.
  function createCheckoutAttempt(opts) {
    opts = opts || {};
    var fetchFn = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(root) : null);
    var key = opts.idempotencyKey || newIdempotencyKey(opts.crypto);
    var timeoutMs = opts.timeoutMs || TIMEOUT_MS;
    return {
      idempotencyKey: key,
      request: async function () {
        var ctrl = new AbortController();
        var timer = setTimeout(function () { ctrl.abort(); }, timeoutMs);
        try {
          var res = await fetchFn(opts.endpoint || CHECKOUT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
            body: JSON.stringify({ product: 'pro' }),
            signal: ctrl.signal
          });
          var body = null;
          try { body = await res.json(); } catch (e) { body = null; }
          return classifyResponse(res.status, body, function (h) { return res.headers.get(h); });
        } catch (e) {
          return { kind: 'retryable', code: e && e.name === 'AbortError' ? 'timeout' : 'network_error' };
        } finally {
          clearTimeout(timer);
        }
      }
    };
  }

  var api = {
    CHECKOUT_ENDPOINT: CHECKOUT_ENDPOINT, TIMEOUT_MS: TIMEOUT_MS, TEXT: TEXT,
    isStripeCheckoutUrl: isStripeCheckoutUrl, parseRetryAfter: parseRetryAfter,
    classifyResponse: classifyResponse, createCheckoutAttempt: createCheckoutAttempt
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DataCanvasCheckout = api;
})(typeof window !== 'undefined' ? window : globalThis);
