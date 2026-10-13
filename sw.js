// Cache para que funcione sin señal en el gym. Subir la versión al cambiar archivos.
const C = 'enduro-gym-v10';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// Fotos de los ejercicios: se bajan al instalar, así se ven sin señal. Si alguna falla, no frena la instalación.
const IMGS = ['./img/ex/a1-0.jpg', './img/ex/a1-1.jpg', './img/ex/a2-0.jpg', './img/ex/a2-1.jpg', './img/ex/a3-0.jpg', './img/ex/a3-1.jpg', './img/ex/a4-1.jpg', './img/ex/a5-0.jpg', './img/ex/a5-1.jpg', './img/ex/a6-0.jpg', './img/ex/a6-1.jpg', './img/ex/b1-0.jpg', './img/ex/b1-1.jpg', './img/ex/b2-0.jpg', './img/ex/b2-1.jpg', './img/ex/b3-0.jpg', './img/ex/b3-1.jpg', './img/ex/b4-0.jpg', './img/ex/b4-1.jpg', './img/ex/b5-0.jpg', './img/ex/b5-1.jpg', './img/ex/b6-0.jpg', './img/ex/b6-1.jpg', './img/ex/b7-0.jpg', './img/ex/b8-0.jpg', './img/ex/b8-1.jpg', './img/ex/bf-0.jpg', './img/ex/bf-1.jpg', './img/ex/c1-0.jpg', './img/ex/c1-1.jpg', './img/ex/c2-0.jpg', './img/ex/c2-1.jpg', './img/ex/c4-0.jpg', './img/ex/c4-1.jpg', './img/ex/c5-0.jpg', './img/ex/c5-1.jpg', './img/ex/pu-0.jpg', './img/ex/pu-1.jpg', './img/ex/sw-0.jpg', './img/ex/sw-1.jpg', './img/ex/nd-0.jpg', './img/ex/nd-1.jpg', './img/ex/nk-0.jpg', './img/ex/nk-1.jpg'];
// cache:'reload' saltea la cache del navegador: si no, se podía guardar el index viejo.
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))).then(() => Promise.all(IMGS.map(f => c.add(f).catch(() => {})))))); self.skipWaiting(); });
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
