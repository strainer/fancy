// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */ 
/// instructor.js - hanging together 

var vplay = {
 
  worlds:{
    0:{name:"Solar System",desc:""}
   ,1:{name:"Near Earths",desc:""}
   ,2:{name:"TRAPPIST-1",desc:""}
   ,3:{name:"Blue Disk",desc:""}
   ,4:{name:"3Planets",desc:""}
   ,5:{name:"MassRing",desc:""}
   ,6:{name:"Cymball",desc:""}
   ,7:{name:"QuasiMags",desc:""}
   ,8:{name:"Pattern",desc:""}
   ,9:{name:"4MassRing",desc:""}
   ,10:{name:"47 Tuc X9",desc:""}
   ,11:{name:"Point Cloud",desc:""}
   ,12:{name:"Bloop",desc:""}
  }
    
  ,seed:0 ,world:12, seespots:-1
  ,geometry:{}, camera:{}, scene:{} 
  ,renderer:{}, displaybugi:20 //avoiding scrollbar
  
  ,instaprops:{}
  
  ,defaults:{
     //timing datums
     allframe_clock:0
    ,rendermode:0
    ,goframe_clock:0
    ,skipframe_step:1   // units of allframes
    ,skipframe_trip:0   // units of allframes
    ,lastframe:10000
    ,playedframe_clock:0 //units of played animframes
    ,rendermark:0        //time of last renderscope

    ,model_clock:0     // units of innate
    ,model_pace: 0.2    //(12hr) 0.15 // units of model_clock
    ,max_force:  5      // units of model_clock
    ,max_vel: 0
    ,nature: 0          //force and collision scheme
    ,forces: 0          //forces function
    
    ,runcycle_step: 1   // units of model_pace 
    ,runcycle_trip: 0   // units of model_clock
    
    ,movperframe:0
    
    ,particles:32000    // max particles 
    ,iota:0

    ,driftCount:0, camDrift:0.03, camRad:250, camRadd:0
    ,camThet:0, camPhi:Math.PI/1.5, spincam:0, firstfocus:0  //phi 
    ,nowfocus:0
    
    ,keyUD:0, keyLR:0, keyR:0 ,keyUDd:0, keyLRd:0, keyRd:0, keyCtrl:0
    
    ,paused:1, explode:0, pausetime:0 
    ,gravityoff:0
    ,gravity:1
    ,Gtweak:1 
    ,gravqual:0.005
    ,colorfac:0.5
    ,pradius:2
    ,printtime:function(a){ return (a).toFixed(2) }
    ,fps:0
  }
}

var urlpar=[]
if(window.location.hash) {
  var patt=/#[^\d]*(\d{1,2})?[^ps]*(pau)?s?[^s]*(spots)?/
  urlpar=window.location.hash.match(patt)
  //~ console.log("urls",urlpar)
  if(isFinite(urlpar[1])){ vplay.world=parseInt(urlpar[1]) }
}

var Fgm,Vpr

console.log(Math.hasTrigfills())

setupfigview(vplay.world)

if(urlpar[1]){ vplay.paused=0 }
if(urlpar[2]){ vplay.paused=1 }
if(urlpar[3]){ vplay.seespots=1 }

//init make create instantiate
function setupfigview(fig){

  vplay.world=fig
  
  for( var p in vplay.defaults)
  { vplay[p]=vplay.defaults[p] }
  
  if(Fgm){ Fgm.recycle() } 
  Fgm=newFigment(vplay.particles)
  
  addConstruct(Fgm)  //adds service functions, doesnt initiate xx..
  addParanorm(Fgm)  //adds service function
  addSpotmap(Fgm,vplay)  //adds service function
  addSpotlog(Fgm,vplay)  //adds service function

  Tcreate(Fgm,vplay)
  //~ Fgm.spongeAll()
  
  for( var p in vplay.instaprops)
  { vplay[p]=vplay.instaprops[p] }

  if(vplay.unpause){ vplay.unpause=vplay.paused=0 }
  
  addForces(Fgm,vplay)  //adds service function
  addSpotgrav(Fgm,vplay)
  addSpotcollide(Fgm,vplay)
  
  Fgm.applyforces={
   0:Fgm.nbodygrav
  ,1:Fgm.nbodygravelec
  ,2:Fgm.grav_spots
  ,3:Fgm.stub_spots
  }[vplay.forces]

  addTemper(Fgm,vplay)  //adds service function
      
  //~ if(!Vpr)    //i shouldnt have to recreate this ..
  Vpr=newViewport(Fgm,vplay)
    
  Vpr.initview( document.getElementById( 'threediv' ), vplay)

  //~ Fgm.gtemperall(0, vplay.model_pace)
  Fgm.finetemperall(vplay.model_pace,5)
  //~ Fgm.spongeAll()
  //~ console.log("modpace",vplay.model_pace)
  Vpr.reFocusThree(vplay.firstfocus)
  
  //~ Vpr.velcolor(vplay.colorfac)
  //~ Vpr.velcolor(vplay.colorfac)
  //~ Vpr.velcolor(vplay.colorfac)
   
  Vpr.syncrender()
  Vpr.ctrlcam()
  
  vplay.renderer.render( vplay.scene, vplay.camera )
  vplay.iota = Fgm.jote.top
  //setfocusname(vplay.firstfocus)
  
  if(adash)adash.redrawDash()
  keysys.attachswipe(vplay)
}

/* - - - - - - - - - - - - - - - */

var adash= newDash("foo")
setdash(adash,vplay)

vplay.dash=adash
adash.redrawDash()

setkeys()

refreshrender()
framemaster()

function refreshrender(){
   
  Vpr.ctrlcam()
    
  var mtimeperframe= vplay.paused * vplay.model_pace * vplay.runcycle_step
  
  Vpr.syncrender( mtimeperframe )

  //if(vplay.pausetime++>3000) return
  if(vplay.spincam) Vpr.spincam()
  
  vplay.renderer.render( vplay.scene, vplay.camera )
  
  vplay.iota = Fgm.jote.top
}

var stilltime=300,waspau=0

function framemaster() { // master frame dispatch
  
  tickwatch('fps')
  vplay.fps=(1000/(readwatch('fps')[0])) 
  requestAnimationFrame(framemaster)
  
  vplay.allframe_clock++
  //~ if(vplay.model_clock>20){vplay.paused=1}

  if(vplay.paused) vplay.pausetime++
  //dash redraw and actions such as a click on dash controls
  var dashact; 
  while( dashact=adash.pullAction() ){ dashact() } 
    
  if( vplay.pausetime<40 && (vplay.allframe_clock)%3===0)
  {
    adash.redrawDash() 
  }
  //-----------------------
  
  var didkeys=keysys.dokeys()
  if(didkeys) vplay.pausetime=0
  
  if( (!vplay.paused) || didkeys
    ||(vplay.pausetime<stilltime) 
    ||Vpr.focus.chng 
  ){
    var btick=vplay.rendermark; vplay.rendermark=perfnow() 
    btick=vplay.rendermark-btick
    //rest for ui if browser is crawling under 20fps
    if( (waspau || btick<10) && !(vplay.paused))
    { liveframe(); vplay.pausetime=0; waspau=0 }else{ waspau=1 } 
      
    refreshrender()
    //~ vplay.fps=readwatch('fps')[0]
  }

}

var done=0

function liveframe(){

  //~ footest() //test for solar fig only
  
  if( vplay.goframe_clock++ < vplay.skipframe_trip) return 
  if( false && vplay.goframe_clock >= vplay.lastframe)
  { return }
  ///--------
  vplay.playedframe_clock++
  vplay.movperframe=0
  vplay.skipframe_trip += vplay.skipframe_step

  var movstep=vplay.model_pace/vplay.runcycle_step
  //console.log("clk:",vplay.model_clock,"mvs",movstep,"mp:",vplay.model_pace,"rnstp:",vplay.runcycle_step)
    
  if(vplay.model_pace>0){
    while( vplay.model_clock+movstep > vplay.runcycle_trip
        && vplay.model_clock <=  vplay.runcycle_trip )
    { //console.log("do")
      var bitstep = vplay.runcycle_trip-vplay.model_clock 
      //~ console.log("bitstep",bitstep)
      if(bitstep){ Fgm.velmove(bitstep,vplay.max_vel); }
      vplay.model_clock+=bitstep
      if(vplay.gravity){ donature(); vplay.movperframe++ }
      movstep-=bitstep
      vplay.runcycle_trip+=vplay.model_pace
    }
  }else{ //backward time
    while( vplay.model_clock+movstep < vplay.runcycle_trip
      && vplay.model_clock >=  vplay.runcycle_trip )
    { //console.log("do")
      var bitstep = -vplay.runcycle_trip+vplay.model_clock 
      //~ console.log("bitstep",bitstep)
      if(bitstep){ Fgm.velmove(bitstep,vplay.max_vel) }
      vplay.model_clock+=bitstep
      if(vplay.gravity){ donature(); vplay.movperframe++ }
      movstep-=bitstep
      vplay.runcycle_trip+=vplay.model_pace
    }
  } 
  //~ console.log("movstep",movstep)
  if(movstep){ Fgm.velmove(movstep,vplay.max_vel) }
  
  vplay.model_clock+=movstep
  //Fgm.frameshift() 
}

var soltest=1
function donature(){
  
  //~ if(vplay.model_clock>=31536000){ console.log("nbow now") }
  if((vplay.world==0)&&soltest&&(vplay.model_clock>=31536000)){
    soltest=0; console.log("solar test!"); solarlog()
  }
  
  if (vplay.explode){ Fgm.pulsevel(0.0004) }
  
  if(vplay.nature==0){ 
    Fgm.applyforces()
  }else if(vplay.nature==1){ //not used, used for collision or something
    //~ Fgm.bulk_load()
    //~ Fgm.measure_spots()
    //~ Fgm.grav_spots()
    //~ Fgm.descend_accel()
    //~ Fgm.acceltovel()
  }
}

//~ function toggleStats()
//~ {
  //~ var el = document.getElementById("rstatsd")
  //~ if( el.style.display == 'none') el.style.display = 'block'
  //~ else el.style.display = 'none'
//~ }

function togglePause(){ vplay.paused = (vplay.paused)^1 }
function toggleSeespots(){ vplay.seespots = (vplay.seespots)*-1 }
function toggleExplode(){ vplay.explode = (vplay.explode)^1 }

function setkeys(){
  function setgn(arg,ti){ vplay[arg[0]]=arg[1]*ti }
  function setgp(arg,ti){ vplay[arg[0]]=arg[1] }

  keysys.whilst("q"    , function(){ vplay.runcycle_step *= 15/14 } )
  keysys.whilst("w"    , function()
  { vplay.runcycle_step = vplay.runcycle_step*14/15+0.002 } )

  keysys.whilst("i"    , function(){ vplay.skipframe_step *= 15/14 } )
  keysys.whilst("o"    , function(){ 
    if((vplay.skipframe_step *= 14/15)<1)vplay.skipframe_step=1 } 
  )

  keysys.whenst("h"    , reverseTime )
  keysys.whenst("u"    , reverseTime2 )

  keysys.whilst("up"    , setgn , ["keyUD", 1] )
  keysys.whilst("down"  , setgn , ["keyUD",-1] )
  keysys.whilst("left"  , setgn , ["keyLR", 1] )
  keysys.whilst("right" , setgn , ["keyLR",-1] )
  keysys.whilst("a"     , setgn , ["keyR",-1] )
  keysys.whilst("z"     , setgn , ["keyR", 1] )
  keysys.whilst("ctrl"  , setgp , ["keyCtrl", 1] )

  keysys.whenup("up"    , setgp , ["keyUD", 0] )
  keysys.whenup("down"  , setgp , ["keyUD", 0] )
  keysys.whenup("left"  , setgp , ["keyLR", 0] )
  keysys.whenup("right" , setgp , ["keyLR", 0] )
  keysys.whenup("a"     , setgp , ["keyR", 0] )
  keysys.whenup("z"     , setgp , ["keyR", 0] )
  keysys.whenup("ctrl"  , setgp , ["keyCtrl", 0] )

  keysys.whenst ("s"    , toggleSeespots )
  keysys.whenst ("c"    , togglePause )
  keysys.whenst ("x"    , toggleExplode )
  //~ keysys.whenst ("w"    , function(){ vplay.spincam = (vplay.spincam)^1 } )
  keysys.whenst ("g" 
  , function(){ 
    var c=vplay.gravity
    vplay.gravity=vplay.gravityoff 
    vplay.gravityoff=c
    } 
  )
  //~ keysys.whenst ("s"    , toggleStats )
  keysys.whenst ("d"    , adash.togPane  )
  keysys.whenst ("."    , focustod  )
  keysys.whenst (","    , focustob  )
}

function focustob(){ focustod(-1) }
function focustod(c){
  c=c||1
  var jf=Vpr.focus.je+c
  Vpr.reFocusThree(Vpr.focus.je+c)
  if(adash)adash.redrawDash() 
}

function reverseTime()
{
  Fgm.temper(vplay.gravity, 0)
  Fgm.invertMov()
  Fgm.temper(vplay.gravity, vplay.model_pace) 
}

function reverseTime2()
{
  vplay.model_pace*=-1
  vplay.runcycle_trip+=vplay.model_pace 
  //~ gp.runcycle_step*=-1 
  //~ gp.model_clock*=-1
}


function solarlog(){
  console.log("Comparing positions at time:",vplay.model_clock)
  //~ console.log("SunPos: x,y,z")
  //~ console.log( Fgm.jote.x[0],Fgm.jote.y[0],Fgm.jote.z[0])
  
  var ex=Fgm.jote.x[3] - Fgm.jote.x[0] //earth pos - sun pos
     ,ey=Fgm.jote.y[3] - Fgm.jote.y[0]
     ,ez=Fgm.jote.z[3] - Fgm.jote.z[0]
      
  var mx=Fgm.jote.x[3]-Fgm.jote.x[4] //moon dists
     ,my=Fgm.jote.y[3]-Fgm.jote.y[4]
     ,mz=Fgm.jote.z[3]-Fgm.jote.z[4]
     
  var moondist=Math.sqrt(mx*mx+my*my+mz*mz)
  
  //~ console.log("EarthFromSunPos: x,y,z")
  //~ console.log( ex,ey,ez )
 
  var jez=-2.621254793799914e+07
     ,jex=1.447454142463674e+08
     ,jey=-5.684340452872217e+03
     
  console.log("Earth Offset From JPL Earth: dx,dy,dz, hyp")
  var eoff=Math.sqrt((jex-ex)*(jex-ex)+(jey-ey)*(jey-ey)+(jez-ez)*(jez-ez))

  console.log( jex-ex,jey-ey,jez-ez,eoff )
  console.log("Earth Offset in moondists")
  console.log( (jex-ex)/moondist,(jey-ey)/moondist,(jez-ez)/moondist,eoff/moondist )
  
  console.log("Earth Vel m/s Offset From JPL Earth: dx,dy,dz")
  console.log( 
   Fgm.jote.vx[3]- (-2.978321979483584e+01) -Fgm.jote.vx[0]
  ,Fgm.jote.vy[3]- (-5.419948414057951e+00) -Fgm.jote.vy[0]
  ,Fgm.jote.vz[3]- (-4.395459903603349e-04) -Fgm.jote.vz[0]
  )

/*
2458119.500000000 = A.D. 2018-Jan-01 00:00:00.0000 TDB
-2.621254793799914E+07  1.447454142463674E+08 -5.684340452872217E+03
-2.978321979483584E+01 -5.419948414057951E+00 -4.395459903603349E-04
4.906719070077783E+02  1.470997370734093E+08 -2.595925284507031E-02

*/
}