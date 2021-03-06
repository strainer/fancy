// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */ 
/// arch.js - hanging together 

arch={}

var vplay = benchdat()

var urlpar=[]

if(window.location.hash) 
{
  var patt=/#[^\d]*(\d{1,2})?[^ps]*(pau)?s?[^s]*(spots)?/
  urlpar=window.location.hash.match(patt)
  // urls Array [ "#09pau_spots", "09", "pau", "spots" ]
  //~ urlpar="#09pau_spots".match(patt)
  //~ console.log("urls",urlpar)
  //~ #09pau_spots
  
  if(isFinite(urlpar[1])){ vplay.world=parseInt(urlpar[1]) }
}

var Fgm,Fgs,Vpr

prepfigandview(vplay.world)

if(urlpar[1]){ vplay.paused=0 }
if(urlpar[2]){ vplay.paused=1 }
if(urlpar[3]){ vplay.seespots=1;vplay.paused=0; } 
//spots are invisible till running ..fix

//~ vplay.seespots=-1

//init make create instantiate
function prepfigandview(wrldc){

  vplay.world=wrldc
  
  for( var p in vplay.defaults)
  { vplay[p]=vplay.defaults[p] }
   
  Fgs=newFigstate(vplay)
  
  if(!Fgm){ Fgm=newFigbase(Fgs)}
  else    { Fgm.infusestate(Fgs) } //maybe destroy the old state
  
  //add service functions in order..
  
  addSpotmap(Fgm) 
  addSpotlog(Fgm)
  
  addFigchore(Fgm)

  addConstruct(Fgm) 
  addParanorm(Fgm) 

  Tcreate(Fgm,vplay)
  //~ Fgm.joteclearulp()
  
  for( var p in vplay.instaprops)
  { vplay[p]=vplay.instaprops[p] }

  if(vplay.unpause){ vplay.unpause=vplay.paused=0 }
  
  addNbodygrav(Fgm) 
  addSpotgrav(Fgm)
  addSpotcollide(Fgm)
  
  Fgm.domoment={
   0:Fgm.nbodygrav
  ,1:Fgm.nbodygravelec
  ,2:Fgm.spots_grav
  ,3:Fgm.clump_grav
  ,4:Fgm.spots_grav2
  }[vplay.forces] 
  
  console.log("moment name:",Fgm.domoment.name)
  
  Fgm.doforce={ //moment for temper only
   0:Fgm.nbodygrav
  ,1:Fgm.nbodygravelec
  ,2:Fgm.nbodygrav
  ,3:Fgm.nbodygrav
  ,4:Fgm.nbodygrav
  }[vplay.forces]

  console.log("forcename:",Fgm.doforce.name)
  
  addTemper(Fgm)  //adds service function
      
  if(Vpr)    //i shouldnt have to recreate this ..
  { //console.log("aheyho")
    Vpr.removemouse()
  }
  
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
  vplay.iota = Fgs.jote.top
  //setfocusname(vplay.firstfocus)
  
  if(adash)adash.redrawDash()
  keysys.attachswipe(vplay)
}

/* - - - - - - - - - - - - - - - */

var adash= newDash(vplay)
setdash(adash,vplay)

vplay.dash=adash
vplay.maskedAction=adash.maskedAction
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
  
  vplay.iota = Fgs.jote.top
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
      if(bitstep){ Fgm.jotemovebyVT(bitstep,vplay.max_vel); }
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
      if(bitstep){ Fgm.jotemovebyVT(bitstep,vplay.max_vel) }
      vplay.model_clock+=bitstep
      if(vplay.gravity){ donature(); vplay.movperframe++ }
      movstep-=bitstep
      vplay.runcycle_trip+=vplay.model_pace
    }
  } 
  //~ console.log("movstep",movstep)
  if(movstep){ Fgm.jotemovebyVT(movstep,vplay.max_vel); Vpr.updatefocusxyz() }
  if(vplay.seespots==1){ Fgm.measure_spots() }
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
  
  Fgm.domoment()
    
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
  keysys.whenst ("m"    , focustoa  )
}

function focustoa(){ focustod("origin") }
function focustob(){ focustod(-1) }
function focustod(c){
  var jf
  if(c==="origin"){jf=0}else{
  c=c||1
  jf=Vpr.focus.je+c }
    
  Vpr.reFocusThree(jf)
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
  //~ console.log( Fgs.jote.x[0],Fgs.jote.y[0],Fgs.jote.z[0])
  
  var ex=Fgs.jote.x[3] - Fgs.jote.x[0] //earth pos - sun pos
     ,ey=Fgs.jote.y[3] - Fgs.jote.y[0]
     ,ez=Fgs.jote.z[3] - Fgs.jote.z[0]
      
  var mx=Fgs.jote.x[3]-Fgs.jote.x[4] //moon dists
     ,my=Fgs.jote.y[3]-Fgs.jote.y[4]
     ,mz=Fgs.jote.z[3]-Fgs.jote.z[4]
     
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
   Fgs.jote.vx[3]- (-2.978321979483584e+01) -Fgs.jote.vx[0]
  ,Fgs.jote.vy[3]- (-5.419948414057951e+00) -Fgs.jote.vy[0]
  ,Fgs.jote.vz[3]- (-4.395459903603349e-04) -Fgs.jote.vz[0]
  )

/*
2458119.500000000 = A.D. 2018-Jan-01 00:00:00.0000 TDB
-2.621254793799914E+07  1.447454142463674E+08 -5.684340452872217E+03
-2.978321979483584E+01 -5.419948414057951E+00 -4.395459903603349E-04
4.906719070077783E+02  1.470997370734093E+08 -2.595925284507031E-02

*/
}