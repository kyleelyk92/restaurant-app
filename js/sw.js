const currentCache = "restaurantCacheV4";

const itemsToCache = [
  './',
  '../index.html', 
  './dbhelper.js', 
  './main.js',
  './restaurant_info.js', 
  '../css/styles.css', 
  '../data/restaurants.json', 
  '../restaurant-app/img/1.jpg', 
  '../restaurant-app/img/2.jpg', 
  '../restaurant-app/img/3.jpg', 
  '../restaurant-app/img/4.jpg', 
  '../restaurant-app/img/5.jpg', 
  '../restaurant-app/img/6.jpg', 
  '../restaurant-app/img/7.jpg', 
  '../restaurant-app/img/8.jpg', 
  '../restaurant-app/img/9.jpg', 
  '../restaurant-app/img/10.jpg'
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

