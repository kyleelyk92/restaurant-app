const currentCache = "restaurantCacheV4";

const itemsToCache = [
  './',
  'index.html', 
  './js/dbhelper.js', 
  './js/main.js',
  './js/restaurant_info.js', 
  './css/styles.css', 
  './data/restaurants.json'
]


self.addEventListener("install", event => {
  console.log("service worker installed");
  event.waitUntil(
    caches.open(currentCache).then(function(cache) {
      return cache.addAll(itemsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  console.log('service worker activated')
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith("restaurant") && cacheName != currentCache
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});


self.addEventListener("fetch", event => {
  console.log(event)
  event.respondWith(
    caches.open(currentCache).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (
          response ||
          fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
});

