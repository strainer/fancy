// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// template.js - file module template

function addTemplate(fig){ 
  'use strict' 
   
  var fgs =fig.state
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
   
  var jote=fgs.jote ,jkind=fgs.jkind ,vplay=fgs.vplay 
     ,spot=fgs.spot ,dlns=fgs.dlns
     ,Drand=fgs.Drand ,Hrand=fgs.Hrand
     ,rndu=fgs.rndu, rndh=fgs.rndh
  
  function takestate() //keys to local as required
  { 
    fgs=fig.state
    
    jote=fgs.jote ,jkind=fgs.jkind ,vplay=fgs.vplay
    spot=fgs.spot ,dlns=fgs.dlns
    
    Drand=fgs.Drand ,Hrand=fgs.Hrand
    rndu=fgs.rndu, rndh=fgs.rndh
  } 
     
  fig.statefncs.push( takestate ) //add to list of state refreshers

  /// // // // // // // // // // // // / 

  function fun(){}
      
  fig.fun = fun

  return fig

}

