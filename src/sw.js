const filesToCache = [
    "/",
    "manifest.json",
    "index.html",
    "offline.html",
    "404.html",
    "theme/global.css",
    "sb_icon.png"
];

const staticCacheName = "static-cache-v2";

self.addEventListener("install", (event) => {
    console.log("Attempting to install service worker and cache static assets");
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener("activate", (event) => {
    console.log("**************************************");
    console.log("**   Activating new service worker... **");
    console.log("**************************************");
    const cacheWhitelist = [staticCacheName];
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

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                console.log("----------------->> Network request for ",
                    event.request.url
                );
                return fetch(event.request).then((response) => {
                    if (response.status === 404) {
                        return caches.match("404.html");
                    }
                    return caches.open(staticCacheName).then((cache) => {
                        console.log(">>> Caching: " + event.request.url);
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                });
            })
            .catch((error) => {
                console.log("Error", event.request.url, error);
                if (event.request.url.includes('sb_icon.png')) {
                    return caches.match('sb_icon.png').then((cacheResponse) => {
                        if (cacheResponse) {
                            return cacheResponse;
                        }
                    });
                }
                return caches.match("offline.html");
            })
    );
});


