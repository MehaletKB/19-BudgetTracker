
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

self.addEventListener("activate", function (event) {
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