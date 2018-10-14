//     ~         trigfills - trig function pollyfills        ~      + 
/*           Copyright 2017 by Andrew Strain. No warranty           * 
 *  This program can be redistributed and modified under the terms  * 
 *  of the Apache License Version 2.0 - see LICENSE for details     * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/ 

// www.mathonweb.com/help_ebook/html/algorithms.htm
// web.mit.edu/kenta/www/three/taylor.html

var trigfillfactory = function(){ return (function(){ 
  'use strict'

  var tau=Math.PI*2   ,pi=Math.PI 
     ,hpi=Math.PI*0.5 ,qpi=Math.PI*0.25 ,epi=Math.PI*0.125 
     ,f3=1/3 ,sq3=1.7320508075688772 //sqrt(3)

  function version(){ return "0.9.2" } 
      
  function modp(a,b){
    return a-Math.floor(a/b)*b //removes neg
  }

  function modn(a,b){
    return a-Math.floor(a/b + 0.5 )*b //creates neg (math.round is slow)
  }
                                     
                                                                               
  var f24=100000/2399999,f720=100000/71998376,f40k=1000/40578583 
  function costay(x){
    var x2=x*x,x4=x2*x2
    return 1- x2*0.5 + x4*f24 - x2*x4*f720 + x4*x4*f40k 
  }

  var fh6=100000000/600000005,f120=1/120,f5k=1000/5039680,f362k=10/3628880
  function sintay(x){ //fudged taylor series
    var c=x*x*x
    return x-(c*fh6)+(c*x*x*f120)-(c*c*x*f5k)+(c*c*c*f362k) 
  }

  function cos(x){ return sin(hpi-x) }

  function sin(x){
    
    x=(x-Math.floor(x/tau)*tau)
    
    if(x<pi){
      if(x>=hpi){ x=pi-x }
      if(x>qpi){ return costay(hpi-x) }
      return sintay(x)
    }else{
      x-=pi
      if(x>=hpi){ x=pi-x }
      if(x>qpi){ return -0-costay(hpi-x) }
      return -0-sintay(x)
    }	
  }
  
  
  var ff3 =100000000000/299999999177
     ,ff5 =10000000/50000082
     ,ff7 =100000/700011 ,ff9 =10000/90019 ,ff11=1000/11768
  function atan(x){
    
    var pos=1, mut=0, mut2=0
    
    if(x<0){ pos=0,x=0-x }
    if(x>1){ x=1/x , mut=1  }
    if(x>0.26794919){
      x=(sq3*x-1)/(sq3+x) 
      mut2=1;
    }

    var x2=x*x ,x4=x2*x2 ,x8=x4*x4
    x=x- x*x2*ff3 +x4*x*ff5 -x4*x2*x*ff7 +x8*x*ff9 -x8*x2*x*ff11

    if(mut2){ x+= hpi*f3  }
    if(mut) {x = hpi-x }
    if(pos) return x
    return -x
  }
                                
                                
  var fg3=1000000000/2999999887,f15=200000000/1500000678
     ,f315=170000/3150457,f2k=6200/282874,f155k=1382/146286
  function tan(x){

    var pos=1 ,mut=0 ,mut2=0
    x=modp(x,pi)*0.99999999999999993

    if(x>hpi){ pos=0 ,x=pi-x }
    if(x>qpi){ mut=1 ,x=hpi-x }
    if(x>epi){ mut2=2, x=x*0.5 } 
    
    var c=x*x*x, cc=c*c 
    x= x +c*fg3 +c*x*x*f15 +cc*x*f315 +cc*c*f2k +cc*c*x*x*f155k
      
    if(mut2){ x= 2*x/(1-x*x) }
    if(mut) { x=1/x          }
    if(x===Infinity) x=16331239353195370
    if(pos) return x 
    return -x
  }

  function acos(x){
   if(x==-1) return Math.PI
   return modp(atan( Math.sqrt(1-x*x)/x),Math.PI )
  }

  function asin(x){ return atan( x/Math.sqrt(1-x*x) ) }

  function setmaths(){
    Math.sin=sin, Math.cos=cos, Math.tan=tan 
   ,Math.acos=acos ,Math.asin=asin ,Math.atan=atan 
   ,Math.hasTrigfills=version()
  }
  
  
  return{
    sin:sin     ,cos:cos    ,tan:tan 
   ,acos:acos  ,asin:asin  ,atan:atan
   ,modp:modp  ,modn:modn
   ,setmaths:setmaths
   ,version:version
  }
}())}
 
if(typeof module!=='undefined' && module.exports) module.exports = trigfillfactory()
else if(typeof window!=='undefined') window.trigfills = trigfillfactory()
else console.log("trigfills.js did not import")