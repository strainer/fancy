// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */
                                                   
/// keyboard input organiser

//keysys.whenst(key,fnc,args)  //key fires fnc on hit
//keysys.whilst(key,fnc,args) //key fires fnc whilst held
//keysys.after(key,fnc,args)  //key fires fnc on release
//keysys.dokeyed()               //fire fncs
//keysys.pause() .resume()       // 
//keysys.clearkeyed              //
//keysys2=keysys.newKeySet()     //

var keysys = newKeySet_glbl()

function newKeySet_glbl(){ return (function(){
    
  if(typeof document !=='undefined'){ 
    document.addEventListener("keydown" , notekeyon, false)	
    document.addEventListener("keyup" , notekeyoff, false)	
    window.addEventListener("blur", notealloff, true )
  }
    
  function touchlog(e){ console.log("ss",e) }

  var bt0x,bt0y,bt1x,bt1y ,ct0x,ct0y,ct1x,ct1y
  function touchmove(e){
    var t0 = e.changedTouches[0] 
    var t1 = e.changedTouches[1] 
    
    ct0x=parseInt(t0.clientX)
    ct0y=parseInt(t0.clientY)

    if(!(isFinite(ct0x)&isFinite(ct0y))){
      ct0x=ct0y=bt0x=bt0y=ct1x=ct1y=bt1x=bt1y=0
      return
    }
    
    if(t1){                        //is pinching
      ct1x=parseInt(t1.clientX)||0
      ct1y=parseInt(t1.clientY)||0
      if(bt1x||bt1y){
        var bx= bt0x-bt1x ,cx= ct0x-ct1x
           ,by= bt0y-bt1y ,cx= ct0y-ct1y
        
        pinchaction(
          Math.sqrt(bx*bx+by*by),Math.sqrt(cx*cx+cy*cy)
        ) 
        e.preventDefault()
      }
    }else{                         //is swiping
      ct1x=ct1y=0
      if(bt0x||bt1y){
        swipeaction(ct0x-bt0x , ct0y-bt0y)
        e.preventDefault()
      }
    }
    
    bt0x=ct0x,bt0y=ct0y,
    bt1x=ct1x,bt1y=ct1y
    //~ e.preventDefault()
  }
  
  function pinchaction(b,c){
    vplay.keyR=(100*(b-c))/b
  }

  function swipeaction(x,y){
    vplay.keyLR=x*0.3
    vplay.keyUD=y*0.3
  }
  
  var keycodes = {
    "backspace":8,"tab":9,"clear":12,"enter":13,"shift":16,
    "ctrl":17,"alt":18,"pause":19,"escape":27,"space":32,
    "pageup":33,"pagedown":34,"end":35,"home":36,
    "left":37,"up":38,"right":39,"down":40,
    "select":41,"print":42,"insert":45,"delete":46,
    "0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,
    "a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,
    "j":74,"k":75,"l":76,"m":77,"n":78,"o":79,"p":80,"q":81,"r":82,
    "s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,
    "f1":112,"f2":113,"f3":114,"f4":115,"f5":116,
    "f6":117,"f7":118,"f8":119,"f9":120,"f10":121,
    ",":188,".":190,"/":191,"[":219,"]":221,"\\":220
  }

  var onhit={}, onhold={}, onrelease={}
  var active=1, atime=0, delay=500
  var kbtimeon={},kbtimeoff={} 
  var c, i
  
  function pause()      { active=false }
  function resume()     { active=true }
  function clear()      { onhit={} ; onhold={} ; onrelease={} }
  function clearkeyed() 
  { for(var k in kbtimeon){ kbtimeon[k]=kbtimeoff[k]=false }  }
  
  function setrepeat(ms) { delay=ms }
  
  function whenst(key,fnc,arg)
  { onhit[keycodes[key]]  = {"fnc":fnc, "arg":arg, btime:0} }
  
  function whenup(key,fnc,arg)
  { onrelease[keycodes[key]]  = {"fnc":fnc, "arg":arg} }
  
  function whilst(key,fnc,arg,x) {
    if (isFinite(key)){ x=key; key=fnc; fnc=arg; arg=x }
    else{ x=delay }
    onhold[keycodes[key]] = {"fnc":fnc,"arg":arg,"dly":x, btime:0} 
  }
  
  var dbb=0
  
  function notekeyon(event) { kbtimeon[event.keyCode]=perfnow() }
    
  function notekeyoff(event) { kbtimeoff[event.keyCode]=perfnow() }
  function notealloff() 
  { var ct=perfnow(); for(var k in kbtimeon){ kbtimeoff[k]=ct } }
  
  var ctime=perfnow()
  
  function dokeys() {
    
    if(!active) return
    var didk=0
    var ntime=perfnow()
    
    //key possibilitie  hittime,  uptime,  blurtime
    
    var kyti
    for ( var c in kbtimeon ) {
      if (kyti=kbtimeon[c]) {
        
        if((c in onhit) && onhit[c].btime!=kyti) {
          onhit[c].btime=kyti
          didk++ ;(onhit[c].fnc)(onhit[c].arg)
        }
        
        if(kbtimeoff[c]>=kyti) { //key was released
          kbtimeon[c]=false ; kbtimeoff[c]=false
          if(c in onhold){ onhold[c].btime=0 }  //clear hold repeat time	
          if(c in onrelease) 
          { didk++ ;(onrelease[c].fnc)(onrelease[c].arg) }
        }else{
          if(c in onhold) { 
            didk++
            var held=0
            if(onhold[c].btime)
            { held=kyti-onhold[c].btime; 
              //~ console.log(held)
              held=(held<2)?50:held
              held=(held<1300)?held:1300 }
            ;(onhold[c].fnc)(onhold[c].arg,held)
            onhold[c].btime=ntime	
          }
        }
      }
    }
    
    //~ if(bt0x||bt0y)
    //~ { if(
    //~ ,bt0y,bt1x,bt1y
    //~ wdrag,wpinch
    
    return didk
  }
  
  function newkeyset() { return newKeySet_glbl }
  
  var swipel, vplay
  function attachswipe(vp){
    vplay=vp 
    if(swipel){
      swipel.removeEventListener('touchstart', touchmove )
      swipel.removeEventListener('touchmove' , touchmove )
      swipel.removeEventListener('touchend'  , touchmove ) 
    }
    swipel=vp.renderer.domElement
    //~ console.log(swipel)
    
    swipel.addEventListener('touchstart', touchmove, true )
    swipel.addEventListener('touchmove' , touchmove, true )
    swipel.addEventListener('touchend'  , touchmove, true ) 
    //~ swipel.addEventListener('mousedown'  , touchlog, true ) 
           
  }
    
  return {
    pause:pause, resume:resume, clear:clear, clearkeyed:clearkeyed,
    setrepeat:setrepeat,
    whenst:whenst, whenup:whenup, 
    whilst:whilst,
    newkeyset:newkeyset,
    dokeys:dokeys,
    attachswipe:attachswipe
  }
  
})()}

/*

window.addEventListener('load', function(){
 
    var box1 = document.getElementById('box1')
    var statusdiv = document.getElementById('statusdiv')
    var startx = 0
    var dist = 0
 
    box1.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
        startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
        statusdiv.innerHTML = 'Status: touchstart<br> ClientX: ' + startx + 'px'
        e.preventDefault()
    }, false)
 
    box1.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        var dist = parseInt(touchobj.clientX) - startx
        statusdiv.innerHTML = 'Status: touchmove<br> Horizontal distance traveled: ' + dist + 'px'
        e.preventDefault()
    }, false)
 
    box1.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        statusdiv.innerHTML = 'Status: touchend<br> Resting x coordinate: ' + touchobj.clientX + 'px'
        e.preventDefault()
    }, false)
 
}, false)
 
*/

/*
window.addEventListener('load', function(){

  var box2 = document.getElementById('box2'),
      detecttouch = !!('ontouchstart' in window) || !!('ontouchstart' in document.documentElement) || !!window.ontouchstart || !!window.Touch || !!window.onmsgesturechange || (window.DocumentTouch && window.document instanceof window.DocumentTouch),
      boxleft, // left position of moving box
      startx, // starting x coordinate of touch point
      dist = 0, // distance traveled by touch point
      touchobj = null, // Touch object holder
      ismousedown = false
  
  box2.addEventListener('touchstart', function(e){
    touchobj = e.changedTouches[0] // reference first touch point
    boxleft = parseInt(box2.style.left) // get left position of box
    startx = parseInt(touchobj.clientX) // get x coord of touch point
    e.preventDefault() // prevent default click behavior
  }, false)
  
  box2.addEventListener('touchmove', function(e){
    touchobj = e.changedTouches[0] // reference first touch point for this event
    var dist = parseInt(touchobj.clientX) - startx // calculate dist traveled by touch point
    // move box according to starting pos plus dist, with lower limit 0 and upper limit 380 so it doesn't move outside track
    box2.style.left = ( (boxleft + dist > 380)? 380 : (boxleft + dist < 0)? 0 : boxleft + dist ) + 'px'
    e.preventDefault()
  }, false)
  
  if (!detecttouch){
    document.body.addEventListener('mousedown', function(e){
      if ( isContained(box2, e) ){
        touchobj = e // reference first touch point
        boxleft = parseInt(box2.style.left) // get left position of box
        startx = parseInt(touchobj.clientX) // get x coord of touch point
        ismousedown = true
        e.preventDefault() // prevent default click behavior
      }
    }, false)
    
    document.body.addEventListener('mousemove', function(e){
      if (ismousedown){
        touchobj = e // reference first touch point for this event
        var dist = parseInt(touchobj.clientX) - startx // calculate dist traveled by touch point
        // move box according to starting pos plus dist, with lower limit 0 and upper limit 380 so it doesn't move outside track
        box2.style.left = ( (boxleft + dist > 380)? 380 : (boxleft + dist < 0)? 0 : boxleft + dist ) + 'px'
        e.preventDefault()
      }
    }, false)
    
    document.body.addEventListener('mouseup', function(e){
      if (ismousedown){
        touchobj = e // reference first touch point
        boxleft = parseInt(box2.style.left) // get left position of box
        startx = parseInt(touchobj.clientX) // get x coord of touch point
        ismousedown = false
        e.preventDefault() // prevent default click behavior
      }
    }, false)
  }

}, false)
*/