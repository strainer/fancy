// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// miscellaneous helper functions, all global

conlog = console.log.bind( console )

conlogif = function(a,b){ if(a) conlog(b) }

// Multiline Function String - Nate Ferrero - P.D.
function heredoc (f,br) { 
  return (f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]).replace(/(?:\r\n|\r|\n)/g, br||'<br />')
};

(function(){
  if (!('window' in this)) window ={}
  if (!('performance' in this)) performance ={}
  if (typeof(window.performance) === 'undefined') 
  {  window.performance = {} 
  
    if (!window.performance.now){
      var nowOffset = Date.now()
      if (performance.timing && performance.timing.navigationStart)
      { nowOffset = performance.timing.navigationStart }
      
      window.performance.now = function now(){
        return Date.now() - nowOffset
      }
    }
  } 
})()

function perfnow(){ return window.performance.now() }

function emptyElement(elem) {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
}

//-------------

function mapfn(Ai,f){ //map
  var Ao=new Array(Ai.length)
  for(var j=0,e=Ai.length;j<e;j++)  Ao[j]=f(Ai[j]) 
  return Ao
}

function sumarray(Ai){
  var s=0
  for(var j=0,e=Ai.length;j<e;j++)  s+=Ai[j] 
  return s
}

function anarray(n,v){
  var Ao=new Array(n)
  if(v!==undefined) {
    if(typeof (v) ==='function')
      for(var i=0;i<n;i++) Ao[i]=v(i)
    else
      for(var i=0;i<n;i++) Ao[i]=v
    return Ao
  }
  for(var i=0;i<n;i++) Ao[i]=i
  return Ao
}
//-------------

function isNumber(obj) { return !isNaN(parseFloat(obj)) } //stacko, like isfinite

function nsqrt(c){ return c>0?Math.sqrt(c):-Math.sqrt(Math.abs(c)) }

function hypo3(x,y,z){ return Math.sqrt(x*x+y*y+z*z) }
function hypo2(x,y){ return Math.sqrt(x*x+y*y) }

function slinku(c){ //s-sine like transition through unit interval ,/'
  return (c-=0.5)<0? 0.5+c*(1+c)*2 : 0.5+c*(1-c)*2
}
function lerp(c, d, u ) { return  c+(d-c)*u } //c slides to d on u
function slerp(c, d, u ) { return  c+(d-c)*slinku(u) } //smoothed to flat
function zlerp(c, d, u, g ) { //c to d on u, more in 0.2>0.8
  if(u<0.2){ g=c }
  else if(u<0.8){ g = c+ (d-c)*(u-0.2)*1.6666666666667 }
  else { g=d }
  return ( ( c+(d-c)*u)+g )*0.5
}

function softlimit(v,d,e){
  if(Math.abs(v)<d) return v 
  var si=v<0 ? -1:1 ; v*=si
  return si*(e*v-d*d) /(v+e-2*d)
}

function ntain(a,b,c){ return a<b?b:c<a?c:a } //contain a by b and c
function modn(a,b){ return a-Math.round(a/b)*b } //creates neg
function modp(a,b){ return a-Math.floor(a/b)*b } //removes neg


function castUlp(c,u){ //powers 2 are most stable for ratios
  return c*(u+1)-c*u
}

function nearnuff(a,b,c){
  c = (a+b)*(c||10)   //when c=10  equal means diff is at least 16 eps
  return c + (a-b) === c   //and certainly more than 7 eps
}
