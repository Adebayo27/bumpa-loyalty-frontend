let PUSHER_KEY = 'test-key';
if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUSHER_KEY) {
  PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
} else if (process.env.VITE_PUSHER_KEY) {
  PUSHER_KEY = process.env.VITE_PUSHER_KEY;
}
// src/utils/initEcho.ts
export async function initEcho() {
  if (typeof window === 'undefined') return;
  if (window.Echo) return;
  try {
    const Echo = (await import('laravel-echo')).default;
    // @ts-ignore
    window.Pusher = (await import('pusher-js')).default;
    const env = (globalThis as any)?.import?.meta?.env || ({} as any);
    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: PUSHER_KEY,
      wsHost: 'bumpa-loyalty.test',
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
    //   authEndpoint: 'http://localhost:8080/broadcasting/auth'
    });
  } catch (e) {
    console.warn('Echo global init failed', e);
  }
}
