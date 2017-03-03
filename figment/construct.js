// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// inject shapes, build orbits etc, make/remove selections 

function addConstruct(fig) {
  'use strict'
  
  //~ for(var prop in fig) this.prop=fig[prop]  //pull in all scope from mbase

  var jote=fig.jote 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
    
  var ins={
       x:-0, y:-0, z:-0
     ,vx:-0,vy:-0,vz:-0
     ,cr:-0,cg:-0,cb:-0
     ,mass:1,grp:1,knd:1,charge:0
     ,qw:0,qx:0,qy:0,qz:0
     ,seam:0.9
     ,due:0, cur:0, bfr:0, bfrclr:0
     ,adsta:function(){return 0}
     ,mdsta:function(){return 1}
    }
  
  function setpos(x,y,z){ ins.x=x,ins.y=y,ins.z=z}
  function setvel(vx,vy,vz){ ins.vx=vx,ins.vy=vy,ins.vz=vz }
  function setaslast(jt)
  { if(!isFinite(jt)) jt=(ins.due-1)
    ins.x=jote.x[jt]   ,ins.y=jote.y[jt]   ,ins.z=jote.z[jt] 
    ins.vx=jote.vx[jt] ,ins.vy=jote.vy[jt] ,ins.vz=jote.vz[jt] 
    ins.mass=jote.g[jt]
  }
  
  function setmass(m){ ins.mass=m }
  function setcharge(c){ ins.charge=c }
  function setgroup(g){ ins.grp=g }
  function setkind(k){ ins.knd=k }
  function setbasecol(r,g,b){ ins.cr=r,ins.cg=g,ins.cb=b }
  
  function setcarte(r,t,p){ ins.carte=r,ins.cartet=t,ins.cartep=p }
  function setorient(w,x,y,z){ ins.qw=w,ins.qx=x,ins.qy=y,ins.qz=z }
  
  function setseam(sm){ ins.seam=sm }
  
  var absnull = function(){ return 0 }
  var mulnull = function(){ return 1 }
  
  function setdistributionabsa(d)
  { ins.adsta=d||function(){return 0 } }
  function setdistributionmlta(d)
  { ins.mdsta=d||function(){return 1} }
  setdistributionabsa()
  setdistributionmlta()
  //do rotation matrix or get from threes.js
 
 
  function addspherea(p) //{num:,rad:, mass:, rfun:} 
  { 
    var rdst=ins.mdsta, rad=p.rad
    //if('rfun' in p){ rdst=p.rfun }
    //G=Sqrt(p.mass||ins.grav)
    
    var j = ins.due, je=j+p.num
    while( j++ < je ) {
    
      _tocarte(rad, Math.asin(((rndu()*2)-1))+hPi, rndu()*Tau)
      
      jote.x[j]=ins.x+_x 
      jote.y[j]=ins.y+_y 
      jote.z[j]=ins.z+_z 
      
      //~ _toorbitinzx(jote.x[i],jote.y[i],jote.z[i],0,G) //012 210 201 102 021 120	
      
      jote.vx[j]=ins.vx+Drand.gnorm()*p.hot
      jote.vy[j]=ins.vy+Drand.gnorm()*p.hot 
      jote.vz[j]=ins.vz+Drand.gnorm()*p.hot 
      
    }
   
    return (ins.due=j)-ins.bfr
  } 


  function addjote(x,y,z,g,vx,vy,vz){
    //~ console.log("addg u g",ins.due,g)
    var j=ins.due
    jote.x[j]=x, jote.y[j]=y, jote.z[j]=z, jote.g[j]=g||ins.mass
    jote.vx[j]=vx||ins.vx, jote.vy[j]=vy||ins.vy, jote.vz[j]=vz||ins.vz
    ins.due=j+1
  }
  
  
  function getprop(p,str,def,none){
    var ret,none=none||fnbyp
    if(str in p){
      if(typeof(p[str])==='function' ) { ret=p[str] }
      else { ret=def } } 
    else { ret = none }
    return ret
  }
  
  
  function addspinring(p){ //{num:,rad:, pull:, radf:, crvf:, velf: } 
    
    var rad=p.rad
    var rdf=getprop(p,'radf',ins.mdsta,mulnull)
    var cvf=getprop(p,'thkf',ins.mdsta,absnull)
    var vvf=getprop(p,'velf',ins.mdsta,absnull)
    var seam=(1-p.seam)||ins.seam
    var inskip=(p.inskip)||0
    var G=p.pull||ins.mass
    var axs=p.axs||1
    
    var inx=ins.x, iny=ins.y, inz=ins.z
    
    if(p.off){ inx+=(p.off.x)||0, iny+=(p.off.y)||0, inz+=(p.off.z)||0 }
    //console.log("G",G)
    
    var j = ins.due
    
    var ci=Tau*seam, thd=ci/(p.num)+inskip, sqirad=Sqrt(G/rad)
    var phi,phi2
    var thdr=thd*(p.crdf||0)
    
    if(p.phi=="rnd"){phi2=1}else(phi=(p.phi)||0)
    
    
    for(var thet=thd; thet<=ci; thet+=thd,j++) {
      
      var rdff=rdf()
   
      if(phi2){ phi=Drand.gteat() } 
      _tocarte( rad*rdff, thet+thdr*rndu(), phi ) //
      jote.x[j]=inx+_x*axs//+vvf()
      jote.y[j]=iny+_y+cvf()
      jote.z[j]=inz+_z/axs//+vvf()
      //~ console.log(j,thet,_x,_y,_z)
      
      sqirad=Sqrt(G/(rad*rdff))
      _tocarte( sqirad, thet+hPi, phi )
      jote.vx[j]=ins.vx + _x/axs// + vvf()
      jote.vy[j]=ins.vy + _y + cvf()*0.25
      jote.vz[j]=ins.vz + _z*axs// + vvf()
    }
    
    for(var c=ins.due;c<j;c++)
    {
      //~ jote.grp[c]=ins.grp
      //~ jote.knd[c]=ins.knd
    }
    
    //~ if(ins.carte){ carteprev() } 
    //~ if(ins.quart){ quartprev() }
    
    return (ins.due=j)-ins.bfr
    
  }

  function _normpoint(r){
    _x=Drand.gnorm(), _y=Drand.gnorm(), _z=(Drand.gnorm())||0.01
    if(isFinite(r)){
      var d=Sqrt(_x*_x+_y*_y+_z*_z)/r
      _x/=d, _y/=d,_z/=d 
    }
  }

  function _xyzrot(x,y,z,t){
    var ct=Math.cos(t),st=Math.sin(t)
    var ict=1-ct
    var 
      m0=ct+x*x*ict   ,m1= x*y*ict-z*st ,m2=x*z*ict+y*st
     ,m3=x*y*ict+z*st ,m4=ct+y*y*ict    ,m5=y*z*ict-x*st 
     ,m6=z*x*ict-y*st ,m7=z*y*ict+x*st  ,m8=ct+z*z*ict 
    
    var ax=_x,ay=_y,az=_z
    _x=m0*ax+m1*ay+m2*az
    _y=m3*ax+m4*ay+m5*az
    _z=m6*ax+m7*ay+m8*az
  }
  
  
  function addspinball(p){ //{num:,rad:, pull:, radf:, crvf:, velf: } 
    
    var rad=p.rad
    var rdf=getprop(p,'radf',ins.mdsta,mulnull)
    var thf=getprop(p,'thkf',ins.mdsta,mulnull)
    var vlf=getprop(p,'velf',ins.mdsta,mulnull)
      
    var G=p.pull||ins.mass
    //~ console.log("G",G)
    
    var j = ins.due
    
    var ci=Tau*ins.seam, thd=ci/(p.num), sqirad
    var phi=p.phi
    
    for(var thet=thd; thet<ci; thet+=thd,j++) {
      
      var rdff=rdf(),thff=thf(),vlff=vlf()
      
      sqirad=Sqrt(G/(rad*rdff))
      
      _normpoint(1) 
            
      jote.x[j]=ins.x + _x*rad*rdff 
      jote.y[j]=ins.y + _y*rad*rdff 
      jote.z[j]=ins.z + _z*rad*rdff 
      
      var rtx=_x,rty=_y,rtz=_z
      _topolar(_x,_y,_z)
      _tocarte(_rad, _the+hPi*(2-vlff),_phi) //
      _xyzrot(rtx,rty,rtz,Drand.f48()*Tau)
      
      jote.vx[j]=ins.vx + _x*sqirad*vlff
      jote.vy[j]=ins.vy + _y*sqirad*vlff
      jote.vz[j]=ins.vz + _z*sqirad*vlff
    }
    
    for(var c=ins.due;c<j;c++)
    {
      //~ jote.grp[c]=ins.grp
      //~ jote.knd[c]=ins.knd
    }
    
    //~ if(ins.carte){ carteprev() }
    //~ if(ins.quart){ quartprev() }
    
    return (ins.due=j)-ins.bfr
    
  }
  
  var fndef =function(a){return a*ins.mdsta()}
  var fnbyp =function(a){return a}
  
  
  function colorprev(cl) //{r:,g:,b:,rfun:,gfun:,bfun:}
  {
    var r,g,b,rf,gf,bf
    
    if(!cl){ r=ins.cr,g=ins.cg,b=ins.cb, rf=gf=bf=fnbyp }
    else{
      r=cl.r, g=cl.g, b=cl.b 
      rf=getprop(cl,'rfun',fndef,fnbyp)
      gf=getprop(cl,'gfun',fndef,fnbyp)
      bf=getprop(cl,'bfun',fndef,fnbyp)
    }
    
    for(var j=ins.bfrclr,i=j*3;j<ins.due;j++)
    {
      jote.bcolor[i++]= rf(r,jote.x[j],jote.y[j],jote.z[j])
      jote.bcolor[i++]= gf(g,jote.x[j],jote.y[j],jote.z[j])
      jote.bcolor[i++]= bf(b,jote.x[j],jote.y[j],jote.z[j])
      //~ console.log("j,g",j,jote.g[j])
      //~ console.log("r,g,b",jote.bcolor[i-3],jote.bcolor[i-2],jote.bcolor[i-1])
      //~ console.log("x,y,z",jote.x[j],jote.y[j],jote.z[j])
      //~ console.log("vx,vy,vz",jote.vx[j],jote.vy[j],jote.vz[j])
    }
    
    jote.top=ins.bfrclr=ins.due
  }


  function proplast(p) //{g: ,grp:, knd:, gfun:}
  {
    var gf =getprop(p,'gfun',mdsta,fnbyp)
    var grp=getprop(p,'grp',ins.grp,ins.grp)
    var knd=getprop(p,'knd',ins.knd,ins.knd)
    var g  =getprop(p,'g',ins.mass,ins.mass)
    
    for(var j=ins.bfr;j<ins.due;j++)
    { jote.g[j]= p.grav*gf()
      jote.grp[j]= grp
      jote.knd[j]= knd
    }
    ins.bfr=ins.due
  }


  function massallzeros(f)
  { if (typeof(f)!=='function')
    { var m=(isFinite(f))?f:1 ; f=function(){ return m } } 

    for(var i=0; i < jote.top; i++)
    { 
      if(!jote.g[i]){ jote.g[i]=f() }
    }
  } 


  function massuncolored(f) //{r:,g:,b:,rfun:,gfun:,bfun:}
  {
    if (typeof(f)!=='function')
    { var m=(isFinite(f))?f:1 ; f=function(){ return m } } 
  
    for(var j=ins.bfrclr; j<ins.due; j++)
    { jote.g[j]=f() }
  }
  
  
  function chargeuncolored(f) //{r:,g:,b:,rfun:,gfun:,bfun:}
  {
    if (typeof(f)!=='function')
    { var m=(isFinite(f))?f:1 ; f=function(){ return m } } 
  
    for(var j=ins.bfrclr; j<ins.due; j++)
    { jote.c[j]=f() }
  }
    
    
  function rndchargeall(h,f)
  { f=f||function(){return 1}
    for(var i=0; i < jote.top; i++)
    { 
      if(!jote.c[i]){ jote.c[i]=h*f() }
    }
  }

  
  function _toorbitinzx(rx,ry,rz,dphi,g) {
    _topolar( rx,ry,rz )
    _tocarte( Sqrt(1/_rad)*(g||1), _the+Pi/2, _phi  )
    //~ var c=Sqrt(1/_rad)*g/_rad
    //~ var cc=_x*c; _x=_y*c; _y=cc; //_z=cc
  }
  
  //plotting

  var _the,_phi,_rad
  function _topolar(x,y,z) {
    _rad = Math.sqrt(x*x+y*y+z*z+1.0e-40)
    _the = Math.acos(z/_rad) 
    _phi = Math.atan2(y,x) 
  }
  
  function topolar(x,y,z) {
    var r=Math.sqrt(x*x+y*y+z*z+1.0e-40)
    return [
      r,
      Math.acos(z/r),
      Math.atan2(y,x)
    ]
  }
  
  var _x,_y,_z
  function _tocarte(r,t,p) {
    _x=r*Math.sin(t)*Math.cos(p)
    _y=r*Math.sin(t)*Math.sin(p)
    _z=r*Math.cos(t)
  }
    
  function tocarte(r,t,p) {
    return [
       r*Math.sin(t)*Math.cos(p)
      ,r*Math.sin(t)*Math.sin(p)
      ,r*Math.cos(t)
    ]
  }
  
  function pointline(Ao,aloc,oloc,n,e)
  {
    if(!Ao) Ao= new Array(n*3)
    if(!e) e = Ao.length*3
    var ui=1/n
    for(var i=0,ii=0; i<n; i++) {
      Ao[ii++]=aloc[0]+oloc[0]*(i*ui)
      Ao[ii++]=aloc[1]+oloc[1]*(i*ui)
      Ao[ii++]=aloc[2]+oloc[2]*(i*ui)
    }
    return Ao
  }
  
  function settop(c) { 
    jote.top = ins.due
    for(var j=jote.top-1;j>=0;j--)
    { if(jote.g[j]){ jote.topg=j+1; break } }
    console.log("top", jote.top)
    console.log("topg", jote.topg, jote.g[jote.topg])
    console.log("gs:")
    for(var j=0;j<jote.topg;j++) console.log(jote.g[j])
  }
      
  fig.setpos               = setpos
  fig.setvel               = setvel
  fig.setaslast            = setaslast
  fig.setcharge            = setcharge
  fig.setmass              = setmass
  fig.setgroup             = setgroup
  fig.setbasecol           = setbasecol
  fig.setcarte             = setcarte
  fig.setorient            = setorient
  fig.setseam              = setseam
  fig.setdistributionabsa  = setdistributionabsa
  fig.setdistributionmlta  = setdistributionmlta
  fig.settop               = settop 

  fig.tocarte           = tocarte 
  fig.massallzeros      = massallzeros 
  fig.massuncolored     = massuncolored 
  fig.chargeuncolored   = chargeuncolored 
  fig.rndchargeall      = rndchargeall 

  fig.addspherea           = addspherea
  fig.addspinring          = addspinring
  fig.addspinball          = addspinball
  fig.colorprev            = colorprev
  fig.addjote              = addjote
  
  return fig

} 

