var cacheName = "0.1";

self.addEventListener("install", (e) => {
	e.waitUntil(caches.open(cacheName).then((cache) => {
		return cache.addAll([
			"./index.html",
			"./style.css",
			"./main.js",
			"./page/start.htt",
			"./page/info.htt",
			"./page/settings.htt",
			"./page/page.htt",
			"./page/select.htt"
		]).then(() => {
			self.skipWaiting();
		});
	}));
});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		caches.match(e.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(e.request);
		})
	);
});
