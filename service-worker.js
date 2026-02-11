const CACHE_NAME = 'nordestino-pizzaria-cache-v3';
const STATIC_CACHE = 'nordestino-static-v3';
const DYNAMIC_CACHE = 'nordestino-dynamic-v3';

const staticAssets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    // Ícones
    './icon/favicon.ico',
    './icon/logo-nordestino-pizzaria.png',
    './icon/icon-192x192.png',
    './icon/icon-512x512.png',
    './icon/maskable_icon.png'
];

const imageAssets = [
    // Imagens do cardápio e promoções
    './images/hero-pizza-background.jpeg',
    './images/combo-pizza-refri-hq.jpeg',
    './images/pizza-mussarela.jpeg',
    './images/pizza-calabresa.jpeg',
    './images/pizza-frango-catupiry.jpeg',
    './images/pizza-frango-cheddar.jpeg',
    './images/pizza-frango-acebolado.jpeg',
    './images/pizza-especial-frango.jpeg',
    './images/pizza-tres-queijos.jpeg',
    './images/pizza-bacon.jpeg',
    './images/pizza-baiana.jpeg',
    './images/pizza-mista.jpeg',
    './images/pizza-napolitana.jpeg',
    './images/pizza-romana.jpeg',
    './images/pizza-carioca.jpeg',
    './images/pizza-caipira.jpeg',
    './images/pizza-portuguesa.jpeg',
    './images/pizza-quatro-queijos.jpeg',
    './images/pizza-camarao.jpeg',
    './images/pizza-atum.jpeg',
    './images/pizza-nordestina.jpeg',
    './images/pizza-a-moda.jpeg',
    './images/pizza-trindade.jpeg',
    './images/pizza-italiano.jpeg',
    './images/pizza-modada-casa.jpeg',
    './images/pizza-strogonoff.jpeg',
    './images/pizza-palermo.jpeg',
    './images/pizza-brigadeiro.jpeg',
    './images/pizza-beijinho.jpeg',
    './images/pizza-cartola.jpeg',
    './images/pizza-romeu-e-julieta.jpeg',
    './images/pizza-m-m.jpeg',
    './images/borda-chocolate.jpeg',
    './images/borda-catupiry.jpeg',
    './images/borda-cheddar.jpeg',
    './images/borda-goiabada.jpeg',
    './images/borda-catupiry-origina.jpeg',
    './images/borda-creme-cheese.jpeg',
    './images/refri-coca-1l.jpeg',
    './images/refri-guarana-1l.jpeg',
    './images/refri-fanta-1l.jpeg',
    './images/refri-em-lata.jpeg',
    './images/h2o-500ml.jpeg',
    './images/agua-mineral.jpeg'
];

// Estratégia de cache: Cache First para recursos estáticos, Network First para conteúdo dinâmico
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Caching static assets');
                return cache.addAll(staticAssets);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Pre-caching images');
                return cache.addAll(imageAssets);
            })
        ])
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Estratégia para recursos estáticos (HTML, CSS, JS)
    if (staticAssets.includes(url.pathname) || request.destination === 'document') {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // Estratégia para imagens
    if (request.destination === 'image') {
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
        return;
    }

    // Estratégia para recursos externos (CDN)
    if (url.origin !== location.origin) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        return;
    }

    // Fallback para outros recursos
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('Fetch failed for:', request.url);
        // Retorna uma resposta offline personalizada se necessário
        if (request.destination === 'document') {
            return cache.match('./index.html');
        }
        throw error;
    }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('Network failed, trying cache for:', request.url);
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}