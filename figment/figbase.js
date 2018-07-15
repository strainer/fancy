// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// common.js - create instance of figment
// stores fgstate object to own export
// and copies fgs keys to own export 
// and to local scope as locally required 
// and exports some common static keys

function newFigbase(fgs) { 
  'use strict'
  
  // common static
  var Tau=2*Math.PI ,Pi=Math.PI ,hPi=Pi/2 ,tPi=Pi/3
  var abs=Math.abs ,floor=Math.floor ,Sqrt=Math.sqrt 

  // fgs to local 
  var jote=fgs.jote ,jkind=fgs.jkind ,bkind=fgs.bkind 
     ,Drand=fgs.Drand ,Hrand=fgs.Hrand
     ,rndu=fgs.rndu ,rndh=fgs.rndh
  
  function takestate(st) //keys to local as required
  { 
    fig.state=st 
    jote=st.jote ,jkind=st.jkind ,bkind=st.bkind 
    Drand=st.Drand ,Hrand=st.Hrand
    rndu=st.rndu, rndh=st.rndh
  } 
  
  var statefncs = [takestate] //start array of state refreshers
  
  function infusestate(fgs){
    statefncs[0](fgs)
    for(var i=1; i<statefncs.length; i++)
    { statefncs[i]() }
  }
  
  function namedknd(nm){
    if(jkind.nom[bkind]===nm){ return bkind }
    for( bkind=jknd.nom.length;bkind>0;bkind--){
      if(jkind.nom[bkind]===nm){ return bkind } 
    }
    return bkind
  }
  
  function recycle(){ //some future gc function ?
    //store on a stack of empties to ressurrect later
  }

  var fig = { //exports of proto fig object
    
    Tau:Tau ,Pi:Pi ,hPi:hPi ,tPi:tPi
   ,abs:abs ,floor:floor ,Sqrt:Sqrt

   ,statefncs : statefncs
   ,infusestate : infusestate
   ,recycle : recycle

   ,namedknd : namedknd //?
   
   ,state:fgs
   
  }
  
  return fig
}