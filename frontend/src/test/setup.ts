// Polyfill for global fetch in tests if not present
if (!globalThis.fetch) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { fetch, Headers, Request, Response } = require('undici');
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}
