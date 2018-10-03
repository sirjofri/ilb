var version = "0.31";

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
			"/page/stored.htt",
			"/img/icon.css",
			"/img/icon.svg",
			"/img/favicon.svg",
			"/img/favicon-32.png",
			"/img/favicon-96.png",
			"/apple-touch-icon.png",
			"/mstile-144x144.png",
			"/favicon.ico",
			"/x/localforage.min.js",
			"/lang/english.json"
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
	switch (e.data.command) {
	case "store":
		e.waitUntil(caches.open("library").then((cache) => {
			console.log("[SW]: stored library", e.data.library);
			return cache.addAll([e.data.path, e.data.library+"/library.json"]);
		}));
		break;
	case "update":
		console.log("[SW] update function is nearly untested!");
		e.waitUntil(fetch(e.data.library+"/library.json").then((response) => {
			return response.json();
		}).then((data) => {
			data.list.forEach((el) => {
				caches.match(e.data.library+"/library.json").then((response) => {
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
			caches.open("library").then((cache) => {
				cache.add(e.data.library+"/library.json");
			});
		}));
		break;
	case "requestStored":
		// TODO
		e.waitUntil(caches.match(e.data.library+"/library.json").then((response) => {
			return response.json();
		}).then((lib) => {
			var promises = [];
			lib.list.forEach((el) => {
				promises.push(caches.match(lib.path+"/"+el.path));
			});
			return Promise.all(promises);
		}).then((responses) => {
			var reslist = [];
			responses.forEach((el) => {
				if (el == undefined)
					return;
				reslist.push(el.json());
			});
			return Promise.all(reslist);
		}).then((list) => {
			list.forEach((el) => {
				caches.match(e.data.library+"/library.json").then((response) => { // async TODO
					return response.json();
				}).then((lib) => {
					lib.list.forEach((ob) => {
						if (ob.short_name != el.short_name)
							return;
						el.path = lib.path + "/" + ob.path;
					});
					return Promise.resolve(lib.list);
				}).then((liblist) => {
					self.clients.matchAll().then((clients) => {
						clients.forEach((client) => {
							client.postMessage({ command: "requestStored", data: list });
						});
					});
				});
			});
		}));
		break;
	case "updateLibrary":
		e.waitUntil(caches.delete("library").then(() => { return self.skipWaiting(); }));
		break;
	case "updateLanguage":
		e.waitUntil(caches.open(version).then((cache) => {
			return cache.add("/lang/" + e.data.language + ".json");
		}).then(() => {
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage(e.data);
				});
			});
			return self.skipWaiting();
		}));
		break;
	case "updateStyle":
		e.waitUntil(caches.open(version).then((cache) => {
			return cache.add("/style/" + e.data.style + ".css");
		}).then(() => {
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage(e.data);
				});
			});
			return self.skipWaiting();
		}));
		break;
	default:
	}
});
