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

%icon:offline:
	o := (2*width, 0);
	begingroup
		dist := 3;
		plugheight := 10;
		len := 10;
		draw  o+(width/2-5, height)
			--o+(width/2-5, height/2+plugheight){(-1,0)}
			..{(0,-1)}o+(width/2-10, height/2)
			--o+(width/2+10, height/2){(0,1)}
			..{(-1,0)}o+(width/2+5, height/2+plugheight)
			--o+(width/2+5, height);
		draw  o+(width/2, height/2)
			--o+(width/2, height/2-len);
		draw  o+(width/2-1*dist, height/2)
			--o+(width/2-1*dist, height/2-len);
		draw  o+(width/2-2*dist, height/2)
			--o+(width/2-2*dist, height/2-len);
		draw  o+(width/2+1*dist, height/2)
			--o+(width/2+1*dist, height/2-len);
		draw  o+(width/2+2*dist, height/2)
			--o+(width/2+2*dist, height/2-len);
	endgroup;

%icon:online:
	o := (3*width, 0);
	begingroup
		plugheight := 10;
		draw  o+(width/2-5, height)
			--o+(width/2-5, height/2+plugheight){(-1,0)}
			..{(0,-1)}o+(width/2-10, height/2)
			--o+(width/2+10, height/2){(0,1)}
			..{(-1,0)}o+(width/2+5, height/2+plugheight)
			--o+(width/2+5, height);
		draw  o+(width/2-7, 0)
			--o+(width/2-7, height/2-plugheight){(-1,0)}
			..{(0,1)}o+(width/2-10, height/2);
		draw  o+(width/2+7, 0)
			--o+(width/2+7, height/2-plugheight){(1,0)}
			..{(0,1)}o+(width/2+10, height/2);
	endgroup;

%icon:update:
	o := (4*width, 0);
	begingroup
		offset := 10;
		len := 5;
		arroff := 2.5;
		draw  o+(width/2, height-offset){(-1,0)}
			..{(0,-1)}o+(offset, height/2){(0,-1)}
			..{(1,0)}o+(width/2, offset){(1,0)}
			..{(0,1)}o+(width-offset, height/2){(0,1)}
			..{(-1,0)}cycle;
		draw  o+(width/2+len-arroff, height-offset+len)
			--o+(width/2-arroff, height-offset)
			--o+(width/2+len-arroff, height-offset-len);
		draw  o+(width/2-len+arroff, offset+len)
			--o+(width/2+arroff, offset)
			--o+(width/2-len+arroff, offset-len);
	endgroup;

	o := (5*width, 0);
	pickup pencircle scaled 0pt;
	draw (0,0)--o+(0,height); % image size

	% debug lines
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
