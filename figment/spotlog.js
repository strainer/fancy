// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// logging functions to global scope
 
function addSpotlog(fig,vplay) { 
  'use strict' 
   
  var fgs=fig.state
     ,jote=fgs.jote ,jkind=fgs.jkind ,vplay=fgs.vplay 
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
  
  // var jote =fig.jote, spot=fig.spot  //only these used
   
  function dmcheckspot(sui){
      
    var te=spot.dln_anchor[sui]+spot.dln_span[sui]

    if(te!==dln_end(sui))
    { conlog("wrong end! sui,alg,store",sui,te,dln_end(sui)) 
      var fchil=spot.fchild[sui]
      conlog("ds",_dsui,"fchild:",fchil,"sui:",sui
       ,"fam",list_kin(spot.dln_anchor[sui],te)) 
      conlog("parent n,n+1:",spot.parent[sui],spot.parent[sui])
    }

    for( var ts=spot.dln_anchor[sui];ts<te;ts++)
    {
      var j= dlns[ts],p=0
      if(jote.x[j]< spot.lbx[sui]) { p=1;conlog("low x",sui,te-ts,spot.dln_span[sui])}
      if(jote.y[j]< spot.lby[sui]) { p=1;conlog("low y",sui,te-ts,spot.dln_span[sui])}
      if(jote.z[j]< spot.lbz[sui]) { p=1;conlog("low z",sui,te-ts,spot.dln_span[sui])}
      if(jote.x[j]> spot.hbx[sui]) { p=1;conlog("hig x",sui,te-ts,spot.dln_span[sui])}
      if(jote.y[j]> spot.hby[sui]) { p=1;conlog("hig y",sui,te-ts,spot.dln_span[sui])}
      if(jote.z[j]> spot.hbz[sui]) { p=1;conlog("hig z",sui,te-ts,spot.dln_span[sui])}
      
      if(p){
        var fchil=spot.fchild[sui]
        conlog(
         "problemo ds",_dsui,"fchild:",fchil,"sui:",sui,"dlni",ts
        )
        conlog("family",list_kin(ts) )
      }
    }
  }
  
  var ffstop=0,metlogstp=200
  var meterspots = function(){ //log spotmaps first 60 jotes
    
    if(ffstop++>=metlogstp) return
    
    var fex="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ***************************************************************".split("")
    
    var logline=[],logmat=[], trunkj={}, tottrunkj=0
    var jotp=jote.top, jotp=jotp<75?jotp:75
    for(var j=0;j<jotp;j++){ logline[j]=" "} //empty line
    
    for(var sui=1,spd=spot.deep; spd>-1; sui++){ /// or spd>0 ??
      
      if(sui===spot.top){ 
     
        logmat.push(logline.join(""))
        sui=1;spd--
        for(var j=0;j<jote.top;j++){ logline[j]=" " } //clear line
      } 
      
      if(spot.depth[sui]===2){
        trunkj[sui]={
          sui:sui
         ,anc:spot.dln_anchor[sui]
         ,spa:spot.dln_span[sui]
        }
      }
      
      if(spot.depth[sui]===spd){
        for( var 
              j=spot.dln_anchor[sui]
             ,e=j+spot.dln_span[sui]
          ;j<e ;j++
        ){
          if(j>jotp) break
          logline[j]=fex[sui]
        }
      }
    }
    console.log("spotmap:")
    for(var j=logmat.length-1;j>=0;j--){ console.log(logmat[j]) }
  
    var stru="trunks:\n"
    for(var s=0;s<spot.top;s++){ 
      if(trunkj[s]){ 
        var t=trunkj[s]
        tottrunkj+=t.spa
        stru+="sui:"+t.sui+" anc "+t.anc+" spn "+t.spa+"\n";
      }
    }
    
    console.log("dlns:"+spot.dlntop+" trunkjs:"+tottrunkj)
    console.log(stru)
    console.log()
  }

  function spotswithkey(jd){
    var sp=[]
    for(var s=0;s<spot.top;s++){
      if( spot.parent[s]!==0 &&
          spot.dln_anchor[s]<=jd && 
          jd<=(spot.dln_anchor[s]+spot.dln_span[s])){ sp.push(s)	} 
    }
    return sp
  }
  
  window.spotswithkey = spotswithkey
  window.meterspots = meterspots
  window.dmcheckspot = dmcheckspot
}
