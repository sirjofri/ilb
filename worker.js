var version = "0.1";

self.addEventListener("install", (e) => {
	e.waitUntil(caches.open(version).then((cache) => {
		return cache.addAll([
			"/",
			"/index.html",
			"/style.css",
			"/main.js",
			"/page/start.htt",
			"/page/info.htt",
			"/page/settings.htt",
			"/page/page.htt",
			"/page/select.htt",
			"/library.json"
		]);
	}).then(() => { return self.skipWaiting(); }));
});

self.addEventListener("activate", (e) => {
	e.waitUntil(self.skipWaiting());
	e.waitUntil(
		caches.keys().then((cnames) => {
			return Promise.all(
				cnames.map((cname) => {
					if (cname !== version && cname !== "library") {
						console.log("SW: deleting old cache:", cname);
						return caches.delete(cname);
					}
				})
			);
		}).then(() => {
			return self.clients.claim();
		})
	);
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

self.addEventListener("message", (e) => {
	console.log({ note: "received", msg: e.data });
	if (e.data.command == "store") {
		e.waitUntil(caches.open("library").then((cache) => {
			return cache.add(e.data.path);
		}));
		return;
	}
});
