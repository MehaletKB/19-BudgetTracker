
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "db.js",
    "index.js",
    "manifest.webmanifest",
    "service-worker.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "styles.css"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(console.log("Pre-cache data success!"))
        .then(self.skipWaiting())
    )
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
        .keys()
        .then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Old cache data remove success", key);
                        return caches.delete(key);
                    }
                })
        );
    })
);
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")) {
        event
        .respondWith(
            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch((error) => {
                    return cache.match(event.request);
                });
            })
            .catch((error) => console.log(error))
        );
        return;
    }

    event.respondWith(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            return cache.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            });
        })
    );
});