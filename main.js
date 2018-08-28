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

page.setPage = function(p, handler) {
	xhr("./page/"+p+".htt", (r) => {
		page.currentPage = p;
		getTag("main")[0].innerHTML = r;
		window.history.pushState({ noBackExitsApp: true, page: p }, '');
		page.load(p);
		if (handler)
			handler();
		console.log("Page loaded");
	});
};

page.load = function(p) {
	switch (p) {
	case "select":
		getId("book").style.display = "block";
		getId("chapter").style.display = "none";
		getId("select_list").style.display = "none";
		break;
	case "stored":
		if (!navigator.serviceWorker.controller)
			break;
		navigator.serviceWorker.controller.postMessage({ command: "requestStored" });
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
				"<li><a href=\"#\" onclick=\"openBook('"+el.short_name+"', '"+el.path+"')\">"+el.name+"</a> in "+el.languages+"</li>";
		});
		console.log("Loaded stored books");
		break;
	default:
	}
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("./worker.js").then((reg) => { console.log("register success", reg); }).catch((err) => { console.warn("no register success", err); });
}

function offline(e) {
	getId("online").classList.add("icon-offline");
	getId("online").classList.remove("icon-online");
}

function online(e) {
	getId("online").classList.add("icon-online");
	getId("online").classList.remove("icon-offline");
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

function select_book(book) {
	selected.book = book;
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
	xhr("./library.json", (r) => {
		var obj = JSON.parse(r);
		getId("select_list").innerHTML = "";
		console.log("selectstring", selectstring);
		obj.list.forEach((el) => {
			if (el.select != selectstring)
				return;

			var book = el.short_name;
			var path = el.path;
			var lang = el.languages;

			getId("select_list").innerHTML +=
				"<li><a href=\"#\" onclick=\"openBook('"+book+"', '"+path+"');\">"+book+"</a> in "+el.languages+"</li>";
		});
	});
}

function select_search_button() {
	xhr("./library.json", (r) => {
		var obj = JSON.parse(r);
		var searchstr = getId("select_search").value.toLowerCase();
		getId("select_list").innerHTML = "";
		getId("select_list").style.display = "block";
		getId("book").style.display = "none";
		getId("chapter").style.display = "none";
		obj.list.forEach((el) => {
			var book = el.short_name;
			var name = el.name;
			var path = el.path;
			var lang = el.languages;

			if (book.toLowerCase().match(searchstr) || name.toLowerCase().match(searchstr))
				getId("select_list").innerHTML +=
					"<li><a href=\"#\" onclick=\"openBook('"+book+"','"+path+"');\">"+book+"</a> in "+el.languages+"</li>";
		});
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
				navigator.serviceWorker.controller.postMessage({
					command: "store",
					path: path
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
	navigator.serviceWorker.controller.postMessage({ command: "update" });
}
