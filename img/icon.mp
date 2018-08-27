outputformat   := "svg";
outputtemplate := "%j.svg";

width  := 64;
height := 64;

pair o;

beginfig(1)
	pickup pencircle scaled 2pt;

	% home icon
%icon:home:
	o := (0*width, 0);
	begingroup
		roof := height-32;
		roofind := 7;
		xdoor := 25;
		ydoor := 20;
		draw  o+(5+roofind,5)
			--o+(xdoor,5)
			--o+(xdoor,ydoor)
			--o+(width-xdoor,ydoor)
			--o+(width-xdoor,5)
			--o+(width-5-roofind,5)
			--o+(width-5-roofind,roof)
			--o+(width-5,roof)
			--o+(width/2,height-5)
			--o+(5,roof)
			--o+(5+roofind,roof)
			--cycle;
	endgroup;
	
	% select icon
%icon:select:
	o := (1*width, 0);
	begingroup
		%draw o--o+(width,0)--o+(width,height)--o+(0,height)--cycle;
		start := xpart o + 10;
		ystart := 25;
		yoffset := 7;
		xoffset := 10;
		w := 4;
		for i=0 upto 4:
			for j=0 upto 4:
				draw  (start+j*xoffset, ystart+i*yoffset)
					--(start+w+j*xoffset, ystart+i*yoffset)
					--(start+w+j*xoffset, ystart+i*yoffset+1)
					--(start+j*xoffset, ystart+i*yoffset+1)
					--cycle;
			endfor;
		endfor;
	endgroup;

	o := (2*width, 0);
	pickup pencircle scaled 0pt;
	draw (0,0)--o+(width,height);

	begingroup
		pickup pencircle scaled 0.1pt;
		for i=0 upto (xpart o)/width:
			draw (i*width, 0)--(i*width, height);
		endfor;
		draw (0, 0) -- o;
		draw (0, height) -- o+(0, height);
	endgroup;
endfig;

bye
