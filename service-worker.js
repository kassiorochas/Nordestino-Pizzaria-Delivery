const CACHE_NAME = 'nordestino-pizzaria-cache-v1';
const urlsToCache = [
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
    './icon/maskable_icon.png',
    // Imagens do cardápio e promoções
    './images/hero-pizza-background.jpeg',
    './images/combo-pizza-refri.jpeg',
    './images/combo-pizza-dupla.jpeg',
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
    './images/trindade.jpeg',
    './images/italiano.jpeg',
    './images/pizza-modada-casa.jpeg',
    './images/strogonoff.jpeg',
    './images/palermo.jpeg',
    './images/brigadeiro.jpeg',
    './images/beijinho.jpeg',
    './images/cartola.jpeg',
    './images/romeu-e-julieta.jpeg',
    './images/m-m.jpeg',
    './images/borda-chocolate.jpeg',
    './images/borda-catupiry.jpeg',
    './images/borda-cheddar.jpeg',
    './images/borda-goiabada.jpeg',
    './images/borda-catupiry-origina.jpeg',
    './images/borda-creme-cheese.jpeg',
    './images/pastel-queijo.jpeg',
    './images/pastel-frango.jpeg',
    './images/pastel-calabresa.jpeg',
    './images/pastel-presunto.jpeg',
    './images/pastel-calabresa-presunto.jpeg',
    './images/pastel-queijo-frango.jpeg',
    './images/pastel-queijo-calabresa.jpeg',
    './images/pastel-queijo-presunto.jpeg',
    './images/pastel-frango-calabresa.jpeg',
    './images/pastel-frango-presunto.jpeg',
    './images/pastel-camarao.jpeg',
    './images/pastel-carne-sol.jpeg',
    './images/pastel-carne-bacon.jpeg',
    './images/coxinha-frango.jpeg',
    './images/coxinha-queijo.jpeg',
    './images/enroladinho-frango.jpeg',
    './images/enroladinho-misto.jpeg',
    './images/enroladinho-salsicha.jpeg',
    './images/batata-frita.jpeg',
    './images/batata-frita-cheddar-catupiry.jpeg',
    './images/refri-coca-1l.jpeg',
    './images/guarana-2l.jpeg',
    './images/refri-fanta-1l.jpeg',
    './images/refri-em-lata.jpeg',
    './images/h2o-500ml.jpeg',
    './images/agua-mineral.jpeg',
    // Font Awesome (apenas se for cachear, idealmente deixar vir do CDN)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    // Google Fonts (apenas se for cachear, idealmente deixar vir do CDN)
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone the response
                        // so that the browser can consume the original response and
                        // we can consume the clone.
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});