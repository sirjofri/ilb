function xhr(path, handler) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		var DONE = this.DONE || 4;
		if (this.readyState == DONE && this.status == 200) {
			handler(request.responseText);
		}
	};
	request.open("GET", path, true);
	request.send();
}

function getId(id) {
	return document.getElementById(id);
}

function getTag(tag) {
	return document.getElementsByTagName(tag);
}

function getClass(cls) {
	return document.getElementsByClassName(cls);
}

page = {};
gllanguage = {};

page.setPage = function(p, handler) {
	xhr("./page/"+p+".htt", (r) => {
		page.currentPage = p;
		getTag("main")[0].innerHTML = r.replace(/@.+@/g, langreplace);
		window.history.pushState({ noBackExitsApp: true, page: p }, '');
		page.load(p);
		if (handler)
			handler();
		console.log("Page loaded");
	});
};

function langreplace(match) {
	var pattern = match.substring(1, match.length-1);
	return gllanguage[pattern];
}

gllibrary = {};

page.load = function(p) {
	switch (p) {
	case "select":
		localforage.getItem("settings-library").then((value) => {
			xhr(value+"/library.json", (r) => {
				gllibrary = JSON.parse(r);
			});
		});
		getId("book").style.display = "block";
		select_getBooklist();
		getId("chapter").style.display = "none";
		getId("select_list").style.display = "none";
		break;
	case "stored":
		if (!navigator.serviceWorker.controller)
			break;
		localforage.getItem("settings-library").then((value) => {
			navigator.serviceWorker.controller.postMessage({ command: "requestStored", library: value });
		});
		break;
	case "settings":
		localforage.getItem('settings-style').then((value) => {
			if (value == null) {
				getId("style").value = "default";
				localforage.setItem('settigs-style', "default");
				return;
			}
			getId("style").value = value;
		});
		localforage.getItem('settings-language').then((value) => {
			if (value == null) {
				getId("language").value = "english";
				localforage.setItem('settings-language', "english");
				return;
			}
			getId("language").value = value;
		});
		localforage.getItem('settings-library').then((value) => {
			if (value == null) {
				getId("library").value = "default path";
				localforage.setItem('settings-library', "default path");
				return;
			}
			getId("library").value = value;
		});
		break;
	default:
	}
};

navigator.serviceWorker.addEventListener("message", (e) => {
	switch (e.data.command) {
	case "requestStored":
		getId("stored_list").innerHTML = "";
		e.data.data.forEach((el) => {
			getId("stored_list").innerHTML +=
				"<li><a href=\"#\" onclick=\"openBook('"+el.short_name+"', '"+el.path+"')\">"+el.name+" in "+el.languages+"</a></li>";
		});
		console.log("Loaded stored books");
		break;
	case "updateStyle":
		getId("styleset").setAttribute("href", "/style/"+e.data.style+".css");
		break;
	case "updateLanguage":
		xhr("/lang/"+e.data.language+".json", (r) => {
			gllanguage = JSON.parse(r);
		});
		break;
	case "updateLibrary":
		xhr(e.data.library+"/library.json", (r) => {
			gllibrary = JSON.parse(r);
		});
	default:
	}
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("./worker.js").then((reg) => { console.log("register success", reg); }).catch((err) => { console.warn("no register success", err); });
}

function offline(e) {
	getId("online").classList.add("icon-offline");
	getId("online").classList.remove("icon-online");
	getId("updatediv").classList.add("icon-readonly");
	getId("updatebutton").style.display = "none";
}

function online(e) {
	getId("online").classList.add("icon-online");
	getId("online").classList.remove("icon-offline");
	getId("updatediv").classList.remove("icon-readonly");
	getId("updatebutton").style.display = "block";
}

window.addEventListener("online", online, false);
window.addEventListener("offline", offline, false);

window.addEventListener("load", () => {
	window.history.pushState({ noBackExitsApp: true, page: "start" }, '');
});

window.addEventListener("popstate", (ev) => {
	if (ev.state && ev.state.page)
		page.setPage(ev.state.page);
});

window.onload = function() {
	localforage.getItem('settings-language').then((value) => {
		if (value == null) {
			localforage.setItem('settings-language', 'english');
			xhr("/lang/english.json", (r) => {
				gllanguage = JSON.parse(r);
				page.setPage("start");
			});
			return;
		}
		xhr("/lang/"+value+".json", (r) => {
			gllanguage = JSON.parse(r);
			page.setPage("start");
		});
	});
	localforage.getItem('settings-style').then((value) => {
		if (value == null) {
			localforage.setItem('settings-style', 'default');
			getId("styleset").setAttribute("href", '/style/default.css');
			return;
		}
		getId("styleset").setAttribute("href", "/style/"+value+".css");
	});
	localforage.getItem('settings-library').then((value) => {
		if (value == null) {
			localforage.setItem('settings-library', '/library');
			xhr("/library/library.json", (r) => {
				gllibrary = JSON.parse(r);
			});
			return;
		}
		xhr(value+"/library.json", (r) => {
			gllibrary = JSON.parse(r);
		});
	});
	page.setPage("start");
	updatePage();
};

function updatePage() {
	if (navigator.onLine) {
		online();
	} else {
		offline();
	}
}

var selected = {};

function select_getBooklist()
{
	var list = [];
	gllibrary.list.forEach((el) => {
		list.push(el.select);
	});
	
	getId("book").innerHTML = "";
	list.forEach((select) => {
		var book = select.split("/")[0];
		getId("book").innerHTML +=
			"<a href=\"#\" onclick=\"select_book('"+book+"');\">"+book+"</a>";
	});
}

function select_getChapterlist()
{
	var list = [];
	gllibrary.list.forEach((el) => {
		if (el.select.split("/")[0] == selected.book)
			list.push(el.select);
	});

	getId("chapter").innerHTML = "";
	list.forEach((select) => {
		var chapter = select.split("/")[1];
		console.log("chapter ", chapter);
		getId("chapter").innerHTML +=
			"<a href=\"#\" onclick=\"select_chapter('"+chapter+"');\">"+chapter+"</a>";
	});
}

function select_book(book) {
	selected.book = book;
	select_getChapterlist();
	getId("book").style.display = "none";
	getId("chapter").style.display = "block";
}

function select_chapter(chapter) {
	selected.chapter = chapter;
	getId("chapter").style.display = "none";
	getId("select_list").style.display = "block";
	select_open();
}

function select_open() {
	if (!selected.book || !selected.chapter) {
		selected = {};
		getId("select_list").style.display = "none";
		getId("book").style.display = "block";
		return;
	}

	var selectstring = selected.book+"/"+selected.chapter;
	getId("select_list").innerHTML = "";
	console.log("selectstring", selectstring);
	gllibrary.list.forEach((el) => {
		if (el.select != selectstring)
			return;

		var book = el.short_name;
		var path = el.path;
		var lang = el.languages;

		getId("select_list").innerHTML +=
			"<li><a href=\"#\" onclick=\"openBook('"+book+"', '"+path+"');\">"+book+" in "+el.languages+"</a></li>";
	});
}

function select_search_button() {
	var searchstr = getId("select_search").value.toLowerCase();
	getId("select_list").innerHTML = "";
	getId("select_list").style.display = "block";
	getId("book").style.display = "none";
	getId("chapter").style.display = "none";
	gllibrary.list.forEach((el) => {
		var book = el.short_name;
		var name = el.name;
		var path = el.path;
		var lang = el.languages;

		if (book.toLowerCase().match(searchstr) || name.toLowerCase().match(searchstr))
			getId("select_list").innerHTML +=
				"<li><a href=\"#\" onclick=\"openBook('"+book+"','"+path+"');\">"+book+" in "+el.languages+"</a></li>";
	});
}

function openBook(title, path) {
	xhr(path, (r) => {
		console.log("Loaded content");
		page.setPage("page", function() {
			getId("page_title").innerHTML = title;
			getId("page_storelink").addEventListener("click", () => {
				if (!navigator.serviceWorker.controller)
					return;
				localforage.getItem("settings-library").then((value) => {
					navigator.serviceWorker.controller.postMessage({
						command: "store",
						path: path,
						library: value
					});
				});
			});
			var obj = JSON.parse(r);
			var num = obj.languages.length;
			strbuf = "";
			obj.content.forEach((i, n) => { build_part_str(i, n, num); });
			getId("page_container").innerHTML = strbuf;
			getId("page_container").style.flexDirection = (obj.direction == "left" ? "row" : "row-reverse");
		});
	});
}

var strbuf = "";

function build_part_str(item, index, mod) {
	if (index%mod == 0) {
		strbuf += "<div class=\"col\"><span class=\"t"+(index%mod)+"\">"+item+"</span>";
	} else if (index%mod == mod-1) {
		strbuf += "<span class=\"t"+(index%mod)+"\">"+item+"</span></div>";
	} else {
		strbuf += "<span class=\"t"+(index%mod)+"\">"+item+"</span>";
	}
}

function update_stored() {
	if (!navigator.serviceWorker.controller)
		return;
	localforage.getItem("settings-library").then((value) => {
		navigator.serviceWorker.controller.postMessage({ command: "update", library: value });
	});
}

function saveLanguage() {
	localforage.setItem('settings-language', getId('language').value);
	navigator.serviceWorker.controller.postMessage({ command: "updateLanguage", language: getId('language').value });
}

function saveStyle() {
	localforage.setItem('settings-style', getId('style').value);
	navigator.serviceWorker.controller.postMessage({ command: "updateStyle", style: getId('style').value });
}

function saveLibrary() {
	if (!navigator.serviceWorker.controller)
		return;
	localforage.setItem('settings-library', getId('library').value);
	navigator.serviceWorker.controller.postMessage({ command: "updateLibrary", library: getId('library').value });
}
