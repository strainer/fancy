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

conlog=console.log.bind( console )

conlogif=function(a,b){ //no good without some parameter trick
  if(a) conlog(b)
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) } //stacko, like isfinite

//meters loggers watches
(function(w){
  
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
