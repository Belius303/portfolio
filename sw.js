const CACHE_NAME = 'p-beliu-v3';

// Liste des ressources à mettre en cache
const ASSETS_TO_CACHE = [
    '.',
    'index.html',
    'styles.css',
    'manifest.json',
    'sw.js',
    'img/project-1.webp',
    'img/project-2.webp',
    'img/project-3.webp'
];

// Ressources externes à mettre en cache
const EXTERNAL_TO_CACHE = [
    'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@200;300;400;500;600;700&display=swap',
    'https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js',
    'https://fonts.gstatic.com/s/firacode/v22/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV37Nv7g.woff2',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    'https://fonts.gstatic.com/s/notoserifjp/v21/xn7mYHs72GKoTvER4Gn3b5eMXNikYkY0T84.woff2'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            // Cache des ressources locales
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            }),
            // Cache des ressources externes
            caches.open(CACHE_NAME + '-external').then(cache => {
                return cache.addAll(EXTERNAL_TO_CACHE);
            })
        ])
    );
    // Force l'activation immédiate
    self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Supprime les anciens caches
                    if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-external') {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Prend le contrôle immédiatement
            clients.claim();
        })
    );
});

// Stratégie de cache : Cache First, Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourne la réponse du cache si elle existe
                if (response) {
                    return response;
                }

                // Sinon, fait la requête réseau
                return fetch(event.request).then(
                    networkResponse => {
                        // Vérifie si la réponse est valide
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Met en cache la nouvelle ressource
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                        return networkResponse;
                    }
                );
            })
            .catch(() => {
                // Retourne une page d'erreur si hors ligne
                if (event.request.mode === 'navigate') {
                    return caches.match('index.html');
                }
                return new Response('Hors ligne - Contenu non disponible', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
}); 