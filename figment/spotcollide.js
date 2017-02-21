// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */ 

/// spotcollsion.js - spotmap-accelerated collision processing

//the spotmap's spot bounds are calculated to span jotes pos at t and t+step 
//the spotmap is recursively checked like this;
// kidspots are interchecked for overlapping bounds,
//  overlapping kidspots have their kids crosschecked for overlapping bounds
//  until overlapping leafs are arrived at,
//   jotes in overlapping leafs are then crosscalculated to determine hit times
//every spot is interchecked, recursively down to leafspots,
// and then jotes in individual leafs are intercalculated to determine hit times
//
//hit reaction depends on jote kind eg.
// 'gust' jote approximating wind/fluid movement,
// simple ball jote approximating spheric cow
// complex object jote contains shaped, breakable, spinning object
//hits may be queued for reaction sequencing
// important jotes may go into a higher confidence queue
// which does follow-on checking and re-queuing
//  follow-on checking can be less optimised and if overloaded trigger
//  a subinterval update of spotmap and rerun full proc for remaining interval

//the basis of this design is implemented:

function addSpotcollide(fig,vplay) { 
  'use strict'
   
  var jote=fig.jote, spot=fig.spot 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
     ,dlns=fig.dlns
     
  var epsila=Math.pow(0.5,52)
  var epsilb=Math.pow(0.5,43)
    
  /* 
    main functions: 
     interquestspot
     interquestleaf
     crossquestspotspot
     crossquestspotleaf ?
     crossquestleafleaf

    interquest function(spot)
     interquests each sibling
     or each jote
     and 
     checks each sibling-to-sibling: crossquesting collisions 
    
    crossquest function(spot,spot)
     checks 
      kidsbykids
      or
      leafbykids if 1 spot doesnt have kids
       crossquests collisions or leafmates if both leafs
     
     leafmate(spot,spot)
      checks jotesbyjotes
       collides collisions
  */
   
  var _timea=0,_timeb

  function spotcollide(){  //begin recursive gravitation 
    
    _timeb=vplay.model_pace
    
    //spot prepare bounds
    
    tell=tella=logtell=nullfunc //disable logging functions
    
    logspot=0
    _klev=-1;
    //~ spot.fchild[1]=0 //set root as leaf for testing
    
    interquestspot(1) //begin process
    
    //~ logtell()
  }
    
    
  function interquestspot(par){ 
    //tella('assess','inmate spot'+par)
    var kn=_listkids(par)
    //for(var g=0;g<kn;g++) tella('assess','inmt kid'+_kcac[_klev][g])
    if(!kn){ //is leaf
      tell('inleafed');
      //tella('assess','inmt leaf'+par); 
      interleaf(par); 
      return 
    }
    var kids=_kcac[_klev]
    for(var i=0 ; i<kn; i++ )
    { for(var j=i+1 ;j<kn; j++ )
      { 
        //tell('assess1');
        if(spothit(kids[i],kids[j])) 
        { crossquestspots(kids[i],kids[j]) } 
      }
      interquestspot(kids[i]) 
    }
    _klev-- //finished with this level of kid list cache
  }
   
   
  function crossquestspots(sa,sb){
    //sa and sb collide, either may be leaf
    if(!spot.fchild[sa]){
      if(spot.fchild[sb])
      { for(var kd=spot.fchild[sb]; kd; kd=nextkid(sb,kd) )
        { if(spothit(kd,sa)) { crossquestspots(kd,sa) }   } //keeps split
      }
      else
      { crossleafs(sa,sb); return }
    } 
    
    for(var kd=spot.fchild[sa]; kd; kd=nextkid(sa,kd) )
    { if(spothit(kd,sb)) { crossquestspots(sb,kd) }   } //swaps spot split

    return
  } 
 
 
  function crossleafs(p,q){
    squareloop(
      spot.dln_anchor[p], spot.dln_anchor[p]+spot.dln_span[p]
     ,spot.dln_anchor[q], spot.dln_anchor[q]+spot.dln_span[q]
     ,jotehit
    )
  }
    
  function interleaf(p){ 
    triangleloop(
      spot.dln_anchor[p], spot.dln_anchor[p]+spot.dln_span[p], jotehit
    ) 
  }


  function triangleloop(p,e,fn){ //checked by making 1 spot leaf
    for( var q=p+1 ;q<e ;q=(++q<e)?q:(++p+1) )  //p(p-1)/2
    { fn(p,q) }	
  }
  
  function squareloop(ap,ep,aq,eq,fn){ //(all q by all p)
    for( 
      var cp=ap,cq=aq ;cp<ep ;cq=(++cq<eq)?cq :(cp++,aq) 
    )
    { fn(cp,cq) }	
  }
  
  
/* Mr Joshua de Bellis vectorised some unsolveable equations which 
 * I had been asking mathematicians about, solving them himself and
 * producing this wonderfuly efficient formula:
 * 
 *  times = ( +/-Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感 ) / V慎
 */
  function jotehit(a,b){ //tb=0, td= timestep
  
    a=dlns[a],b=dlns[b]
    
    //crunched way of calcing VV PP and VP 
    var v=(jote.vx[a]-jote.vx[b]), p=(jote.x[a]-jote.x[b])
    var VV = v*v, PP = p*p, VP = v*p
    
        v=(jote.vy[a]-jote.vy[b]), p=(jote.y[a]-jote.y[b])
        VV+= v*v, PP+= p*p, VP+= v*p
        
        v=(jote.vz[a]-jote.vz[b]), p=(jote.z[a]-jote.z[b])
        VV+= v*v, PP+= p*p, VP+= v*p
  
    //~ var d=jote.r[a]+jote.r[b]
    var d=0.2 //a test value
    
    var hit= (d*d-PP)*VV + VP*VP
  
    if (hit<0) return //never hits
  
    var sqh=math.sqrt( hit )
    //first contact
    _fcT= (-sqh-VP ) / VV
    
    if(_fcT>_timeb) return  //check _fct===ti is really a miss
    //second contact
    _scT= ( sqh-VP ) / VV
  
    if (_scT<_timea) return 
    
    //store to list
    hitja[t]=a, hitjb[t]=b
    hittf[t]=_fcT
    hitts[t++]=_scT
    
    return
  } 
  
  
  function spothit(a,b){
    
    if(spot.lbx[a]>=spot.hbx[b]
     ||spot.hbx[a]<=spot.lbx[b]
     ||spot.lby[a]>=spot.hby[b]
     ||spot.hby[a]<=spot.lby[b]
     ||spot.lbz[a]>=spot.hbz[b]
     ||spot.hbz[a]<=spot.lbz[b]
    ){ return false }
    return true
  }
   

  //next kid spotindex get and cache functions 
  var _klev=-1,_kcac=[[],[],[],[],[]] //kid lev cache, kid cache
  _kcac[0]=new Array(200),_kcac[1]=new Array(150),_kcac[2]=new Array(100)
  
  function nextkid(pr,k){
    return (spot.parent[++k]===pr)?k:0
  }

  function _listkids(sb){
    
    var sd=spot.fchild[sb]; if(!sd){ return 0 }
    var ki=0 
    
    if(++_klev===_kcac.length){ _kcac[_klev] = [0,0,0,0,0,0,0] }
       
    while(spot.parent[sd]===sb)
    { _kcac[_klev][ki++]=sd++ }

    return ki
  } 
    
 
  // - - - begin logger mess
  
  var nullfunc=function(){}
  var conlog=console.log.bind( console )
  var biglog=nullfunc,biglogcnt=0
  
  var tll={},told=0,tellend=5
  
  var tell = function(p,v){    //tally property count (+v)
    if(p in tll){tll[p]+=v||1}
    else{tll[p]=1}
  }

  var tella = function(p,v){ //log prop: val w/_klev
    var tellz="^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ "
    if(p==="assess"){v=tellz.substr(0,_klev*2)+v}
    if(p in tll){(tll[p]).push(v)}
    else{tll[p]=[v]}
  }
  
  var logspot = 1 
  var logtell = function(){
    var lg="",sr=[]
    for(var p in tll){ 
      if(isFinite(tll[p])){ sr.push(p) }
    }
    sr.sort()
    var lefs=tll['totalleafs'],lefp=(lefs*(lefs-1))*0.5

    for(var i=0;i<sr.length;i++)
    { lg=lg+sr[i]+":"+tll[sr[i]]+" ";tll[sr[i]]=0 }
    
    var ter=(_dsui*(_dsui-1))*0.5
    console.log("Telling of spots:",_dsui,"sprs:",ter,"leafs:",lefs,"lprs:",lefp)
    console.log(lg)
    for(p in tll){
      if(((tll[p]).length)) { console.info(p,tll[p]); tll[p]=[] }
    } 
    if(told++>tellend){ tell=logtell=nullfunc }
    
    //~ console.log("heavy spots",list_kin(spot0))
    if(logspot)for(var s=0;s<_dsui;s++){
      console.log(
       "ui:",s,"lv:",spot.depth[s],"pa:",spot.parent[s]
       ,"ch:",spot.fchild[s],"gm:",spot.grm[s],spot.calcx[s]
      ) 
    }
  }
     
  var _leafcnt=0 
  function leafsinspot(s){ 
    function leafmine(s){ //mine all leafs inside a spot and kids
      var k
      if(!(k= spot.fchild[s])){ _leafcnt++; return }
      for(; k; k=nextkid(s,k) )
      { leafmine(k) }
    } 
    _leafcnt=0; leafmine(s)
    return _leafcnt
  }
   
  // - - - end logger mess
 
           
  fig.spotcollide = spotcollide
  
  return fig

}