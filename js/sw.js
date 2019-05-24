const currentCache = "restaurantCacheV4";

const itemsToCache = [
  './',
  '../index.html', 
  './dbhelper.js', 
  './main.js',
  './restaurant_info.js', 
  '../css/styles.css', 
  '../data/restaurants.json', 
  './img/1.jpg', 
  './img/2.jpg', 
  './img/3.jpg', 
  './img/4.jpg', 
  './img/5.jpg', 
  './img/6.jpg', 
  './img/7.jpg', 
  './img/8.jpg', 
  './img/9.jpg', 
  './img/10.jpg'
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

