// fencache.js : memoize functions with a limited size cache  + 
/*        Copyright 2018 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *   terms of the MIT License - see License.txt for details   * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */

var fencache = function(fn,rn,hs){ return (function(fn,rn,hs){
  
  'use strict' //ES5
  
  var key, val, kid
  var id = function(k){return k}
  var h = typeof(hs)
  
  if(h==='function') id=hs 
  else
  if( (rn<1 && h!=='string') || h==='object' ){ 
    if(h==='number') id=function(k){ return ""+k }
    else id=function(k){ 
      if(typeof(k)==='number') return ""+k
      if(typeof(k)==='string') return k 
      return JSON.stringify(k)
    }
  }
  
  function bypass(k ,p1,p2,p3,p4){
    return fn(k ,p1,p2,p3,p4)
  }
  
  //mode: native object
  if(rn<1){
    var stow={}, fill=0, fills=function(){}
    
    if(rn<0){ //limit stow size
      rn=0-rn
      fills=function(){
        if(fill++>rn){
          var hlfng=rn>>>1
          for(var prop in stow) if(stow.hasOwnProperty(prop)){
            delete stow[prop]
            if(--fill<hlfng) break
          }
    } } }
     
    //spammed params much quicker than .call(this,args \:o/
    function nat(k ,p1,p2,p3,p4){
      kid=id(k ,p1,p2,p3,p4)
      if(stow[kid]) return stow[kid] 
      fills()
      return stow[kid]=fn(k ,p1,p2,p3,p4)
    } 
     
    nat.state=function(){ return stow }
    nat.reset=function(s){ 
      stow=s||{}, fill=0 
      for (ky in stow) if(obj.hasOwnProperty(ky)) fill++
    }
    nat.put=function(v ,k ,p1,p2,p3,p4){ 
      var bv=stow[kid=id(k ,p1,p2,p3,p4)] 
      stow[kid]=v
      if(bv===undefined) fills() 
      return bv }
    nat.val=function(k){ return stow[id(k)] }
    nat.bypass=bypass
    
    return nat
  }
  
  //mode: rem last value only
  if(rn===1) { 
    function last(kid){
      if(key===kid){ return val }
      else{ 
        key=kid
        return val=fn(kid) 
      }
    }
    
    last.reset=function(s){ 
      if(s){ key=s.key ; val=s.val }else{ key=val=undefined } }
    last.state=function() { return {key:key,val:val} }
    last.put  =function(v,k ,p1,p2,p3,p4){ 
      var bv=val ; val=v,key=id(k ,p1,p2,p3,p4) 
      return bv }
    last.val  =function(k ,p1,p2,p3,p4)  { 
      if(key===id(k ,p1,p2,p3,p4)) return val }
    last.bypass=bypass
    
    return last
  } 

  //mode: queue vals in nose-ring buffer
  key= new Array(rn), val= new Array(rn) 

  var kid, rc=-1, rex=rn-1, re=1 // ring currentx, ring end max, ring end
  var ra=sizenose(rn)            // ring anchor

  function sizenose(n){
    if(n<7) return n-2  // !n<2
    if(n<20) return (n*0.67) >>>0 
    return 5+(n*0.37) >>>0
    // 2:0  3:1  5:3  6:4  8:5 9:6 11 12 14 15 17 18:12,22:13 ...
  }
  
  //fills array with type of first seen throughput
  var ainit = function(k ,p1,p2,p3,p4){
    kid=id(k ,p1,p2,p3,p4)
    var v=fn(k ,p1,p2,p3,p4)
    for(var i=0;i<key.length;i++) key[i]=kid,val[i]=v
    
    init=function(){}
  }
  
  var init=ainit
    
  //nose-ring buffer has a sorting nose with a ring at tail
  function nsrng(k ,p1,p2,p3,p4){

    init(k ,p1,p2,p3,p4) 
    kid=id(k ,p1,p2,p3,p4)

    if(key[0]===kid) return val[0] 
    
    for(var i=1; i<=re; i++) if(key[i]===kid) {
      
      var v=val[i] ,j
      if(i<=ra){ j=i-1 }else{ j=ra }
       
      key[i]=key[j] ,val[i]=val[j]  //move element down
      key[j]=kid    ,val[j]=v       //swap found upward
      return v 
    }
    //not found, so write to fill
    if(rc===re) if(rc===rex){ rc=ra }else{ re++ } 
    key[++rc]=kid
    return val[rc]=fn(k ,p1,p2,p3,p4) //put result in ring
  } 
  
  function put(v,k ,p1,p2,p3,p4){
    init(k ,p1,p2,p3,p4)
    kid=id(k ,p1,p2,p3,p4)
    for(var i=0; i<=re; i++) if(key[i]===kid) 
    { var bv=val[i] ; val[i]=v ; return bv }
    //missed, so write to fill
    if(rc===re) if(rc===rex){ rc=ra }else{ re++ }
    key[++rc]=kid
    return val[rc]=v //put result in ring
  }

  function val(k ,p1,p2,p3,p4){
    kid=id(k ,p1,p2,p3,p4)
    for(var i=0; i<=re; i++) if(key[i]===kid) return val[i]
  } 

  nsrng.reset=function(s){ 
    if(s){ key=s.key, val=s.val, ra=s.ra, rc=s.rc, re=s.re, rex=s.rex }
    else{
      ra=sizenose(rn), rc=-1, re=1, rex=rn-1 
      key=new Array(rn), val=new Array(rn), init=ainit
    } 
  }
  nsrng.state=function(){ return {key:key,val:val,rc:rc,ra:ra,re:re,rex:rex} }
  nsrng.val=val
  nsrng.put=put
  nsrng.bypass=bypass
  nsrng.init=init

  return nsrng
    
}(fn,rn,hs)) }
  
if(typeof module!=='undefined' && module.exports) module.exports = fencache
else if(typeof window!=='undefined') window.fencache = fencache
else console.log("fencache.js did not import")
