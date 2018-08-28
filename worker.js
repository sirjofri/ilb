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
			"/library.json",
			"/img/icon.css",
			"/img/icon.svg",
			"/img/favicon.svg",
			"/img/favicon-32.png",
			"/img/favicon-96.png",
			"/apple-touch-icon.png",
			"/favicon.ico"
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
	console.log("[SW]: message", e.data);
	if (!e.data.command) return;
	if (e.data.command == "store") {
		e.waitUntil(caches.open("library").then((cache) => {
			console.log("[SW]: stored library");
			return cache.add(e.data.path);
		}));
		return;
	}
	if (e.data.command == "update") {
		console.log("[SW] update function is nearly untested!");
		e.waitUntil(fetch("/library.json").then((response) => {
			return response.json();
		}).then((data) => {
			data.list.forEach((el) => {
				caches.match("/library.json").then((response) => {
					return response.json();
				}).then((cached) => {
					cached.list.forEach((cel) => {
						if (cel.short_name !== el.short_name)
							return;
						if (Number(cel.version) >= Number(el.version)) // TODO: what about versions like: "1.0.2"?
							return;
						console.log("[SW] update", cel, el);
						caches.open("library").then((cache) => {
							cache.add(cel.path);
						});
					});
				});
			});
			caches.open(version).then((cache) => {
				cache.add("/library.json");
			});
		}));
	}
});
