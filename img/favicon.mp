outputformat   := "svg";
outputtemplate := "%j.%o";

beginfig(1)
	pickup pencircle scaled 0;
	draw (0,0)--(0,100)--(100,100)--(0,100);

	pickup pencircle scaled 2pt;
	begingroup;
		paperheight := 85;

		z10 = (5,5);
		z20 = (20,5);
		z30 = (70,10);
		z40 = (90,5);

		z11 = (x10, y10+paperheight);
		z21 = (x20, y20+paperheight);
		z31 = (x30, y30+paperheight);
		z41 = (x40, y40+paperheight);

		path p;
		p = z10..z20..z30..z40--z41..z31..z21..z11--cycle;
		draw p;
		fill p withcolor white;
	endgroup;

	pickup pencircle scaled 4pt;
	begingroup
		% Letter I
		draw (20,20)--(20,70);
		% Letter L
		draw (32,72)--(32,22)..(40,24)..(50,24);
		% Letter B
		draw (60,75)--(60,25)..(78,30)..(60,49);
		draw (60,75)..(75,70)..(65,50);
	endgroup;
endfig;
bye
