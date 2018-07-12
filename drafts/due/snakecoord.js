//resequence through cuboid


var dvn =[3,3,3], e=3*3*3

var nx=dvn[0],ny=dvn[1],nz=dvn[2]
   ,sx=-1,sy=0,sz=0, tx=1,ty=1

for(var Isec=0; Isec<e+2;Isec++)
{
  var xsec,ysec,zsec
  var x,y,z
  var R=Isec/dvn[0] , U=Math.floor(R)	
  ysec=U%dvn[1]
  xsec=Isec-U*dvn[0]
  zsec=(U-ysec)/dvn[1]
   
  xi=xsec,yi=ysec,zi=zsec
  
  //~ zsec=Math.floor(Isec/(dvn[0]*dvn[1]))
  //~ ysec=Math.floor(Isec/dvn[0])-(zz=zsec*dvn[1])
  //~ xsec=Isec-(ysec+zz)*dvn[0]
 
  var zz,yy=Math.floor(Isec/dvn[0])	
  zsec=Math.floor(yy/dvn[1])
  ysec=yy-(zz=zsec*dvn[1])
  xsec=Isec-(zz+ysec)*dvn[0]
  
  //~ console.log(xsec,ysec,zsec)
  //~ 
  //snakecoords
  if(ysec/2!==Math.floor(ysec/2)) { xsec=dvn[0]-xsec-1 }
  if((zsec)/2!==Math.floor((zsec)/2)){ xsec=dvn[0]-xsec-1,ysec=dvn[0]-ysec-1 }
  
  console.log(xsec,ysec,zsec)
  
  sx+=tx
  if(sx==-1||sx==nx){
    tx*=-1,sx+=tx  //chngdir and step back 
    sy+=ty         //chng line
    if(sy==-1||sy==ny){
      ty*=-1,sy+=ty //chngdir and step back
      sz++ 
    }
  }
  
  console.log(sx,sy,sz)
  //~ console.log()
  //~ if(xi!=xsec||yi!=ysec||zi!=zsec){
    //~ console.log(xi,yi,zi)
  //~ }
  
}
