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
		if (handler)
			handler();
		console.log("Page loaded");
	});
};
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("./worker.js").then((reg) => { console.log("register success", reg); }).catch((err) => { console.warn("no register success", err); });
}

window.addEventListener("online", (e) => {
	console.log("you are online");
}, false);

window.addEventListener("offline", (e) => {
	console.log("you are offline");
}, false);

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
		//online
	} else {
		//offline
	}
}

function select_search_button() {
	xhr("./library.json", (r) => {
		var obj = JSON.parse(r);
		getId("select_list").innerHTML = "";
		obj.list.forEach((el) => {
			var book = el.book;
			var path = el.path;
			var lang = el.languages;

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
	console.log("string: "+strbuf);
}
