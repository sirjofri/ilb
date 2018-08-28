all: img/icon.svg img/icon.css favicons

img/icon.svg: img/icon.mp
	cd img && \
	mpost icon.mp

img/icon.css: img/icon.mp
	./img/iconcss.pl <$< > $@

favicons: img/favicon.svg favicon.ico img/favicon-32.png img/favicon-96.png apple-touch-icon.png

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
