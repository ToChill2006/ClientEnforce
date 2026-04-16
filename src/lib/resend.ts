import { Resend } from "resend";

// Lazy singleton — only instantiated on first method call inside a request handler,
// not at module evaluation time. This prevents build failures when RESEND_API_KEY
// is absent from the build environment.
let _client: Resend | null = null;

function getClient(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured.");
    _client = new Resend(key);
  }
  return _client;
}

export const resend = new Proxy({} as Resend, {
  get(_: Resend, prop: string | symbol) {
    const client = getClient();
    const val = Reflect.get(client, prop, client);
    return typeof val === "function" ? val.bind(client) : val;
  },
});