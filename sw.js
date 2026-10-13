// Cache para que funcione sin señal en el gym. Subir la versión al cambiar archivos.
const C = 'enduro-gym-v5';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// cache:'reload' saltea la cache del navegador: si no, se podía guardar el index viejo.
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // La app (HTML): primero internet, así siempre ves la última versión. Sin señal (o si tarda más de 3 s), la guardada.
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.open(C).then(c => {
      const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) c.put('./index.html', r.clone()); return r; });
      const late = new Promise(ok => setTimeout(ok, 3000)).then(() => c.match('./index.html'));
      return Promise.race([net.catch(() => c.match('./index.html')), late.then(h => h || net)]);
    }));
    return;
  }
  // Lo demás (íconos, fuentes): responde al instante desde la cache y actualiza en segundo plano.
  e.respondWith(caches.open(C).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
