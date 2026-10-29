// Ağ öncelikli: internet varken her zaman en son sürümü getirir, yoksa önbellekten açar
const C='galio-stl-v16';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  e.respondWith(
    fetch(req).then(res=>{ try{ const copy=res.clone(); caches.open(C).then(c=>c.put(req,copy)); }catch(_){ } return res; })
             .catch(()=> caches.match(req).then(hit=> hit || caches.match('./index.html')))
  );
});
