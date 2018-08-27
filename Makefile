all: img/icon.svg img/icon.css

img/icon.svg: img/icon.mp
	cd img && \
	mpost icon.mp

img/icon.css: img/icon.mp
	./img/iconcss.pl <$< > $@
