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
    functions: 
     interquestspot   - persue every matching spot in spot
     interleaf        - persue every matching jote in leaf
     crossquestspots  - persue every matching spot between spots
     crossleafs       - persue every matching jote between leafs 
     
     spotmatch
      spothit  - for collision
      spotnear - for pressure and drag 
      
     jotematch
      jotehit  - for collision
      jotenear - pressure and drag
      
     spotcollide - find and list all collisions in pace 
     spotclump   - find and calc all near forces in pace
  */
   
  var spotmatch= function(){}
  var jotematch= function(){}
  var mtlogcn=nullfunc
  
  var _timea=-0,_timeb=-0

  function spotcollide(){  //begin recursive gravitation 
    
    //bimeasure spots
    
    _timeb=vplay.model_pace
    _klev=-1;
        
    spotmatch = spothit
    jotematch = jotehit
    
    //update measure spots for collision
    interquestspot(1) //begin process
  }


  var midst,_prx 
  function spotclump(){  //begin recursive gravitation 
    
    //remeasure spots
    
    spotmatch = spotnear  //qualifier function
    jotematch = jotenear  //action function

    fig.joteqclear()  //clear joteq (acceleration buffer)

    _prx=Drand.range(0,1.2)            //set proximity distance 
    midst=_prx*0.5    //set proximity distance 
    //~ vplay.dragfac=0.1   //set drag factor
    //~ vplay.pressfac=0.003  //set pressure factor
    
    _klev=-1          //init kidcache level
    
    interquestspot(1) //enter recursve process

    fig.joteqtovel(vplay.model_pace)   //apply acceleration buffer
    fig.joteqclear()                   //clear it

    //~ logmtrs()
    //~ conlog(spot.top)
  } 
    
  function interquestspot(par){ 
    var kn=_listkids(par)
    if(!kn){               //is leaf
      interleaf(par) 
      return 
    }
    var kids=_kcac[_klev]
    for(var i=0 ; i<kn; i++ )
    { for(var j=i+1 ;j<kn; j++ )
      { 
        if(spotmatch(kids[i],kids[j])) 
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
        { if(spotmatch(kd,sa)) { crossquestspots(sa,kd) }   } //keeps split
        return
      }
      else
      { crossleafs(sa,sb); return }
    } 
    
    for(var kd=spot.fchild[sa]; kd; kd=nextkid(sa,kd) )
    { if(spotmatch(kd,sb)) { crossquestspots(sb,kd) }   } //swaps spot split

    return
  } 
 
  function crossleafs(p,q){
    mtlogcn('crossl')
    squareloop(
      spot.dln_anchor[p], spot.dln_anchor[p]+spot.dln_span[p]
     ,spot.dln_anchor[q], spot.dln_anchor[q]+spot.dln_span[q]
     ,jotematch
     //~ ,function(){}
    )
  }
    
  function interleaf(p){ 
    mtlogcn('interl')
    triangleloop(
      spot.dln_anchor[p], spot.dln_anchor[p]+spot.dln_span[p], jotematch
    ) 
  }

  function triangleloop(p,e,fn){ //checked by making 1 spot leaf
    for( var q=p+1 ;q<e ;q=(++q<e)?q:(++p+1) )  //p(p-1)/2
    { fn(p,q) }	
  }
  
  function squareloop(ap,ep,aq,eq,fn){ //(all q by all p)
    for( var cp=ap,cq=aq ;cp<ep ;cq=(++cq<eq)?cq :(cp++,aq) )
    { fn(cp,cq) }	
  }
  
  
  function jotenear(a,b){
    
    a=dlns[a],b=dlns[b]
    
    var ag=jote.g[a] , bg=jote.g[b] //maybe swap these
    
    var dx = jote.x[a]-jote.x[b]
      , dy = jote.y[a]-jote.y[b]
      , dz = jote.z[a]-jote.z[b]
    
    var dvx = jote.vx[a]-jote.vx[b]
      , dvy = jote.vy[a]-jote.vy[b]
      , dvz = jote.vz[a]-jote.vz[b]
    
    var cf = (dx*dx + dy*dy + dz*dz)
    var hyp=Sqrt(cf)
    
    var close=_prx - hyp
    
    if(close<-1){ mtlogcn('b_more1'); return  }
    if(close<0){ mtlogcn('b_more0'); return }   //max close = _nearf
                       //close is 0 to _nearf
    mtlogcn('a_less0')
    
    //2 effects: 
    // center highest velocity drag  at close =nearf
    // edge lowest velocity drag at close=0
    // 
    vplay.dragfac=0.0008//0.1   //set drag factor
    vplay.pressfac=0.002  //set pressure factor
    
    var veldragpwr = vplay.dragfac*(midst-Math.abs(midst-hyp))/midst
    
    //dp is highest in the middle
    //
    
    /// push/pull toward spacing

    //~ var pressforce= vplay.gravity / cf
    var fast=1+veldragpwr*11,pressforce=(midst-hyp)/midst
    //~ pressforce=pressforce<0?-Math.sqrt(Math.abs(pressforce)):Math.sqrt(pressforce)
    
    if(pressforce<0){ //dist is beyond midpt
      pressforce=pressforce>-0.5?pressforce:-1.0-pressforce
    }else{  //dist is less than midpoint
      //~ pressforce=((pressforce))
    }
    
    var cf=(vplay.pressfac*pressforce)/hyp
    //~ var gravforce= vplay.gravity / cf
    //~ gravforce=gravforce*pace/hyp

    if(!(ag||bg)){ ag=bg=1 }
    
    if(ag>bg){ bg/=ag,ag=1 }else{ ag/=bg,bg=1 }
    
    var pf= -cf*ag, qf=cf*bg
                                   //a-b
    jote.qx[a] = jote.qx[a]*fast + dx*qf - veldragpwr*dvx*bg
    jote.qy[a] = jote.qy[a]*fast + dy*qf - veldragpwr*dvy*bg
    jote.qz[a] = jote.qz[a]*fast + dz*qf - veldragpwr*dvz*bg
    jote.qx[b] = jote.qx[b]*fast + dx*pf + veldragpwr*dvx*ag
    jote.qy[b] = jote.qy[b]*fast + dy*pf + veldragpwr*dvy*ag
    jote.qz[b] = jote.qz[b]*fast + dz*pf + veldragpwr*dvz*ag
    
  }
   

/* Contact formula solved with help from Joshua de Bellis: 
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
  
  
  function spotmatch(a,b){
    
    if(spot.lbx[a]>=spot.hbx[b]
     ||spot.hbx[a]<=spot.lbx[b]
     ||spot.lby[a]>=spot.hby[b]
     ||spot.hby[a]<=spot.lby[b]
     ||spot.lbz[a]>=spot.hbz[b]
     ||spot.hbz[a]<=spot.lbz[b]
    ){ return false }
    return true
  }
  
  function spotnear(a,b){
    
    //if a highbnd is lower than lwbnd   h<L  L-h >0
    
    if( (spot.lbx[a]-spot.hbx[b] > _prx)
     || (spot.lbx[b]-spot.hbx[a] > _prx)
     || (spot.lby[a]-spot.hby[b] > _prx)
     || (spot.lby[b]-spot.hby[a] > _prx)
     || (spot.lbz[a]-spot.hbz[b] > _prx)
     || (spot.lbz[b]-spot.hbz[a] > _prx)
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
           
  fig.spotcollide = spotcollide
  fig.spotclump   = spotclump
  
  return fig

}