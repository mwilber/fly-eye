var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

var STATIC_CACHE_REF = [
    '/',
    '/index.html',
    'app-shell.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_CACHE_REF);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request)
                    .then(function(res) {
                    return caches.open(CACHE_DYNAMIC_NAME)
                        .then(function(cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                        });
                    })
                    .catch(function(err) {
                        if( event.request.headers.get('accept').includes('text/html')){
                            return cache.match('offline.html');
                        }
                    });
                }
        })
    );
});
