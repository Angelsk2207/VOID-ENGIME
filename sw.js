
const CACHE_NAME = 'horror-story-generator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/components/Header.tsx',
  '/components/PromptForm.tsx',
  '/components/StoryOutput.tsx',
  '/components/LoadingSpinner.tsx',
  '/components/IconComponents.tsx',
  '/components/CinematicViewer.tsx',
  '/manifest.json',
  '/favicon.svg',
  'https://cdn.tailwindcss.com'
];

// Instala o service worker
self.addEventListener('install', event => {
  // Executa os passos de instalação
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições para servir do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Se encontrar no cache, retorna a resposta
        if (response) {
          return response;
        }
        // Senão, faz a requisição na rede
        return fetch(event.request);
      }
    )
  );
});

// Atualiza o service worker e limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
