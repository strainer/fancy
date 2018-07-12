// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// miscellaneous helper functions, all global

// Multiline Function String - Nate Ferrero - P.D.
function heredoc (f,br) { 
  return (f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]).replace(/(?:\r\n|\r|\n)/g, br||'<br />')
};

// performance.now() polyfill from https://gist.github.com/paulirish/5438650
(function(){
  if (typeof window.performance === 'undefined') 
  {  window.performance = {} }
  
  if (!window.performance.now){
    var nowOffset = Date.now()
    if (performance.timing && performance.timing.navigationStart)
    { nowOffset = performance.timing.navigationStart }
    
    window.performance.now = function now(){
      return Date.now() - nowOffset
    } 
}})()

function perfnow(){ return window.performance.now() }

function emptyElement(elem) {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
}


//-------------

function mapfn(Ai,f){ //map
  
  var Ao=new Array(Ai.length)
  for(var j=0,e=Ai.length;j<e;j++){
    Ao[j]=f(Ai[j])
  }
  return Ao
}

function sumarray(Ai){ //reduce~
  
  var s=0
  for(var j=0,e=Ai.length;j<e;j++){
    s+=Ai[j]
  }
  return s
}


//----------------

function floorix(A,v,b){  //searchsorted
                          //small arrays floorex
                          //faster until around n>30
  var c=A.length-1

  if( b!==undefined && ( b==-1 || v>=A[b] ) && b<c && v<A[b+1] ){ return b }

  if( !(v>=A[0]) ){
    if(v<A[0]){ return -1 }
    //A[0] is nan
    if(c>30){ return floorixb(A,v,b) }
    while( !( v>=A[c]||c===-1 ) ){ c-- } //slow nan
    return c	
  }
  
  if(c>7){
    if( v<A[5]){ c=4 }
    else{
      if(c>27){
        if(c>58){ return floorixb(A,v,b) } 
        if( v<A[19]){ c=18 }
      }
    }
  }
  
  while( !(v>=A[c]) ){ c-- }
  
  return c
}


function floorixb(A,v,b){ //srtdsrch
  
  //A is sorted ascending 1,2,3...
  //return first elem in A with value less than or equal v
  //returns -1 if A[0] is more than v (no value less or equal)
  //skips undefs and nans, param b is optional hint
   
  var an=0, en=A.length-1, c=0 //anchor , end 
  
  if(b!==undefined){
    c=(en>>5)+1 
    var d = b-c
    if(d> 0){ if(A[d]<=v){ an=d }else{ if(A[d]>v){en=d-1} } }
    d=b+c
    if(d<en){ if(A[d]<=v){ an=d }else{ if(A[d]>v){en=d-1} } }
  }
    
  while( en-an>10 ){
    c=((an+en)>>1) 
    if(v<=A[c]){ en=c-1 }
    else{ 
      if(v>A[c]){ an=c }else{ break } //aborts for nan
    }
  }

  if( an===0 && !(A[0]<0||A[0]>=0) ){ //check for a non nan terminator
    while( !(v>=A[en] || en==-1) ){ en-- }
  }else{ 
    while( !(v>=A[en]) ){ en-- }
  }
  
  return en 
}


//-------------


function ntain(a,b,c){ //contain a by b and c
  if(a<b) return b
  if(c<a) return c
  return a
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) } //stacko, like isfinite

function castUlp(c,u){ //powers 2 are most stable for ratios
  return c*(u+1)-c*u
}

function hypo3(x,y,z){
  return Math.sqrt(x*x+y*y+z*z)
}
function hypo2(x,y){
  return Math.sqrt(x*x+y*y)
}


//----------------

conlog=console.log.bind( console )

conlogif=function(a,b){ //no good without some parameter trick
  if(a) conlog(b)
}

//----------------

//meters loggers watches
;(function(w){
  
  // metering functions // 
  var nullfunc=function(){}
  
  var mtrec={} ,mtlogged=0 ,mtlogstp=50
  
  var mtlistspots = 1 //a dumb raw listing of spots,parent,child 
  
  var mtinc = function(p,v){
    if(p in mtrec){mtrec[p]+=v||1}
    else{mtrec[p]=1}
  }

  var mtary = function(p,v){
    if(p==="assess"){v=levstr()+v}
    
    if(p in mtrec){ mtrec[p].push(v) }
    else{ 
      mtrec[p]=[] 
      mtrec[p].push(v) 
    }
  }

  var logmeters = function(spot){
    
    var mrecs="",numkeys=[]
    for(var p in mtrec){ 
      if(typeof(mtrec[p])==='number'){ numkeys.push(p) }
    }
    numkeys.sort()

    for(var i=0;i<numkeys.length;i++)
    { mrecs=mrecs+numkeys[i]+":"+mtrec[numkeys[i]]+" ";mtrec[numkeys[i]]=0
      //~ console.log("zeroing:",numkeys[i])
      }
    
    if(spot){
      var lefs=mtrec['totalleafs'],lefp=(lefs*(lefs-1))*0.5

      var tria=(spot.top*(spot.top-1))*0.5
      console.log("Telling of spots:",spot.top,"sppairs:"
       ,tria,"leafs:",lefs,"lfpairs:",lefp)
    }
    
    console.log(mrecs)
        
    for(p in mtrec){
      if((mtrec[p].length)) { console.info(":"+p,mtrec[p]); mtrec[p]=[] }
    } 
        
    if(mtlogged++>mtlogstp){ mtinc=logmters=nullfunc }
  }

  w.mtlogcn  = mtinc
  w.mtlogar  = mtary
  w.logmtrs = logmeters
  w.nullfunc = nullfunc
  
  
  // stopwatch functions // 
  
  var w_rdng=[],w_starts=[],w_stops=[], w_rdmod=25
  function startwatch(w,t){
    if(!w_rdng.hasOwnProperty(w)){
      w_rdng[w]=0 ,w_starts[w]=[] ,w_stops[w]=[]
    }
    return w_starts[w][w_rdng[w]]= (t||perfnow())
  }

  function tickwatch(w,t){
    t=t||perfnow()
    if(!w_rdng.hasOwnProperty(w)){
      w_rdng[w]=-1 ,w_starts[w]=[] ,w_stops[w]=[]
      //w_starts[w][w_rdng[w]++]=t
    }else{
      w_stops[w][w_rdng[w]]=t
    }
    w_rdng[w]=(w_rdng[w]+1)%w_rdmod
    //~ if(w==='fps'){ conlog("iszer:",w_rdng[w]) }
    return w_starts[w][w_rdng[w]]=t
  }

  function stopwatch(w,t){
    t=t||perfnow()
    w_stops[w][w_rdng[w]]=t
    w_rdng[w]=(w_rdng[w]+1)%w_rdmod
    return t
  }

  //w_rdng[w] is the indexe of the last written tstamp 
  //~ var zag=0
  var rwret=[-0,-0,-0]
  function readwatch(w){
    
    ///w_rdng[w] 
    //if is this is 5 start[5] may or may not be written
    //stop[5] should not have been written because stops always incs
              
    var d=w_rdng[w], ta=0, max=0, min=w_stops[w][0]-w_starts[w][0]

    var c=0,cc=0     //all readings 0 to d
    for(;c<d;c++){   //safe hasdone range 
      var tm=w_stops[w][c]-w_starts[w][c]
      //~ if((zag++<300)&&w==='fps') console.log(c,tm)
      if(tm<min) min=tm 
      if(tm>max) max=tm
      ta+=tm,cc++
    }
    
    if(isFinite(w_stops[w][w_rdmod-1])){ d=w_rdmod }
    //tally whole ring if last is not undef 
    //~ if((zag++<300)&&w==='fps') console.log("sk",c,w_stops[w][c]-w_starts[w][c])

    for(c=c+1 ;c<d;c++){ 
      var tm=w_stops[w][c]-w_starts[w][c]
      //~ if((zag<300)&&w==='fps') console.log(c,tm)
      if(tm<min) min=tm 
      if(tm>max) max=tm
      ta+=tm,cc++
    }

    rwret[0]=ta/cc ,rwret[1]=min ,rwret[2]=max
    //~ if((zag<300)&&w==='fps') console.log(rwret)
    return rwret
    
  }

  function cologwatch(wa,gap){
    if(typeof(wa)!=='object'){ wa=[wa]} else console.log()
    if(gap&&(w_rdng[wa[0]]%gap)){ return }

    for(var w=wa[0],i=0 ; i<wa.length ; w=wa[++i] ){
      var tms=readwatch(w)
        
      w=("         " + w).slice(-9)
      var av=tms[0], minc=(tms[1]*100/av).toFixed(1), maxc=(tms[2]*100/av).toFixed(1) 
      console.log("Timing :{",w,"}:",av.toFixed(3),"(",minc,"%min",maxc,"%max)") 
    }
    //~ console.log(w_starts)
  }
    
  w.startwatch =startwatch
  w.tickwatch  =tickwatch
  w.stopwatch  =stopwatch
  w.readwatch  =readwatch
  w.cologwatch =cologwatch
  
  })(window)


var trigfill = (function(){ 
  'use strict'

  var tau=Math.PI*2   ,pi=Math.PI 
     ,hpi=Math.PI*0.5 ,qpi=Math.PI*0.25 ,epi=Math.PI*0.125 
     ,sq3=1.7320508075688772 //sqrt(3)
      
  function version(){
    return "beta0" 
  } 
      
  function modp(a,b){
    return a-Math.floor(a/b)*b //removes neg
  }

  function modn(a,b){
    return a-Math.round(a/b)*b //creates neg
  }
  
  function castulp(c,u){ 
    u=u||256
    return c*(u+1)-c*u
  }

  var f3=1/3,f6=1/6,f120=1/120,f5k=1/5040,f362k=1/364840  //362880 
  function sintay(x){ //taylor series calculation, last fac is tweaked
    
    if(x>qpi){ return costay(hpi-x) }
    var c=x*x*x
    return x-(c*f6)+(c*x*x*f120)-(c*c*x*f5k)+(c*c*c*f362k) 
    
  }

  var f24=1/24,f720=1/720,f40k=1/40580   //orig: 40320
  function costay(x){
    
    if(x>qpi){ return sintay(hpi-x) }
    var x2=x*x,x4=x2*x2
    return 1- x2*0.5 + x4*f24 - x2*x4*f720 + x4*x4*f40k 
    
  }

  function sin(x){
    
    x=x-Math.floor(x/tau)*tau
    
    if(x<pi){
      if(x<hpi){ return sintay(x) }
      return sintay(pi-x) 
    }else{
      x-=pi
      if(x<hpi){ return -0-sintay(x) }
      return -0-sintay(pi-x)
    }	
  }

  function cos(x){ return sin(hpi-x) }
  
  //mined tweaked factors give some extra accuracy
               
  var ff3 =100000000000/300000000002
     ,ff5 =100000/500002
     ,ff7 =1000/7001 ,ff9 =1000/8995 ,ff11=1000/1102
                      
  function atan(x){
    
    var inv=1, mut=0, mut2=0
    
    if(x<0){ inv=-1,x=0-x }

    if(x>1){ x=1/x , mut=1  }

    if(x>0.26794919){
      x=(sq3*x-1)/(sq3+x) 
      mut2=1;
    }

    var x2=x*x, x4=x2*x2,x8=x4*x4

    x=x- x*x2*ff3 + x4*x*ff5 - x4*x2*x*ff7 + x8*x*ff9 - x8*x2*x*ff11

    if(mut2){ x+= hpi*f3  }
    if(mut){x = hpi-x }
   
    return inv*x
  }
                                                //155925  ,  145813
  var f15=2/15,f315=17/315,f2k=62/2835,f155k=1382/146555
                              //crude tweak of last fac improved acc by 100s
  function tan(x){

    var inv=1 ,mut=0 ,mut2=0
    x=modp(x,pi)

    if(x>hpi){ inv=-1 ,x=pi-x }
    if(x>qpi){ mut=1 ,x=hpi-x }
    if(x>epi){ mut2=2, x=x*0.5 } 
    
    var c=x*x*x, cc=c*c  //funky maclaurin series
                  
    x=  x  +c*f3  +c*x*x*f15  +cc*x*f315  +cc*c*f2k  +cc*c*x*x*f155k
      
    if(mut2){ x= 2*x/(1-x*x) }
    if(mut){ x=1/x           }

    return inv*x
  }


  function acos(x){
   if(x==-1) return Math.PI
   return modp(atan( Math.sqrt(1-x*x)/x),Math.PI )
  }

  function asin(x){
   return atan( x/Math.sqrt(1-x*x) )
  }

  function setmaths(){
    Math.sin=sin, Math.cos=cos, Math.tan=tan 
   ,Math.acos=acos ,Math.asin=asin ,Math.atan=atan 
   ,Math.modp=modp ,Math.modn=modn ,Math.culp=castulp
   ,Math.hasTrigfills=version
  }
  
  return{
    sin:sin 
   ,cos:cos 
   ,tan:tan 
   ,acos:acos
   ,asin:asin
   ,atan:atan
   ,setmaths:setmaths
   ,modp:modp
   ,modn:modn
   ,culp:castulp
   ,version:version
  }

})()

trigfill.setmaths()