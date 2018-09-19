all: img/icon.svg img/icon.css favicons

deploy: download

download: x/localforage.min.js

libgen:
	find library -name "*.json" | ./tools/libgen.pl > library.json.gen
	@echo -e "\nGenerated output is in library.json.gen. Please review, adjust it and copy it over to library.json.\n"

img/icon.svg: img/icon.mp
	cd img && \
	mpost icon.mp

img/icon.css: img/icon.mp
	./img/iconcss.pl <$< > $@

favicons: img/favicon.svg favicon.ico img/favicon-32.png img/favicon-96.png apple-touch-icon.png mstile-144x144.png

img/favicon.svg: img/favicon.mp
	cd img && \
	mpost favicon.mp

apple-touch-icon.png: img/favicon.svg
	convert -density 1200 $< -resize 180x180 $@

favicon.ico: apple-touch-icon.png
	convert $< -resize 96x96 -colors 256 $@

img/favicon-32.png: apple-touch-icon.png
	convert $< -resize 32x32 $@

img/favicon-96.png: apple-touch-icon.png
	convert $< -resize 96x96 $@

mstile-144x144.png: apple-touch-icon.png
	convert $< -resize 144x144 $@

x/localforage.min.js:
	mkdir -p $(dir $@)
	curl -L https://raw.githubusercontent.com/mozilla/localForage/master/dist/localforage.min.js > $@
