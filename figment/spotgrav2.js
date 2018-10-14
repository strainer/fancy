// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// spotgrav2.js - a rewrite to be compared..

function addSpotgrav2(fig) { 
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

  
  function spots_grav2(){  //begin recursive gravitation 
    
    _tfac=vplay.model_pace, 
    _throt=4*abs(_tfac) //10 - 100
    tripper=0.5*_tfac  //higher tripper is more approx
    mingdis=16.0 
   
    
    //~ tell=tella=logtell=nullfunc
    logspot=0
    
    _klev=-1
    
    //~ spot.fchild[1]=0 //testing
    
    infollowspot(1)
    
    //~ logtell() /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///
  }


  function infollowspot(s){
    if(!spot.grm[s]) return
    var kn; 
    if(!(kn=_listkids(s))){ 
      intermateleaf(s); 
      return }
  
    for(var kids=_kcac[_klev], i=0 ; i<kn; i++ )
    { for(var j=i+1 ;j<kn; j++ )
      { 
        followspottospot(kids[i],kids[j]) 
      }
      infollowspot(kids[i]) 
    }
    _klev-- //kid list cache
  }
     
     
  function followspottospot( sa , sb ){
    
    var g; if(!(g=(spot.grm[sa]+spot.grm[sb]))) return
    
    var dx=spot.grx[sa]-spot.grx[sb]
       ,dy=spot.gry[sa]-spot.gry[sb]
       ,dz=spot.grz[sa]-spot.grz[sb]
       ,dd= dx*dx+dy*dy+dz*dz
    
    if (g*(g+spot.grd[sa]+spot.grd[sb]) > tripper*dd){ //too close..split..
    //~ if (g > tripper*dd){ //too close..split..
      if(spot.grd[sb]>spot.grd[sa]){ var s_=sa,sa=sb,sb=s_ } //sa is big
      if(spot.fchild[sa]){ 
        for(var kd=spot.fchild[sa]; kd; kd=nextkid(sa,kd) )
        { followspottospot(kd,sb) } 
        return
      }else{ //splitee is leaf
        for (var jd=spot.dln_anchor[sa], ej=jd+spot.dln_span[sa] ; jd<ej; jd++)
        { followjotetospot( dlns[jd],sb ) }
        return 
      }
    }else{ 
      var f=_tfac*g/(dd*Sqrt(dd) + 0.025*g/dd ); f=(f>1)?1:f 
      
      if(spot.grm[sa]&&spot.grm[sb]){ //both pull
        f=f/g
        var af= f*spot.grm[sb]; f=f*spot.grm[sa]
        spot.calcx[sa]-=dx*af, spot.calcy[sa]-=dy*af, spot.calcz[sa]-=dz*af
        spot.calcx[sb]+=dx* f, spot.calcy[sb]+=dy* f, spot.calcz[sb]+=dz* f
      }
      else if(spot.grm[sb]){
        spot.calcx[sa]-=dx*f, spot.calcy[sa]-=dy*f, spot.calcz[sa]-=dz*f
      }else{ 
        spot.calcx[sb]+=dx*f, spot.calcy[sb]+=dy*f, spot.calcz[sb]+=dz*f
      }
    }
  }


  function followjotetospot(ja,sb){
      
    var g; if(!(g=(jote.g[ja]+spot.grm[sb]))) return
    
    var dx=jote.x[ja]-spot.grx[sb]
       ,dy=jote.y[ja]-spot.gry[sb]
       ,dz=jote.z[ja]-spot.grz[sb]
       ,dd= dx*dx+dy*dy+dz*dz        //p
    
    if (g*(g+spot.grd[sb]*2) > tripper*dd){ //too close..split..
    //~ if (g > tripper*dd){ //too close..split..
      if(spot.fchild[sb]){
        for(var kd=spot.fchild[sb]; kd; kd=nextkid(sb,kd) )
        { followjotetospot(ja,kd) }
        return 
      }else{
        for (var j=spot.dln_anchor[sb],ej=j+spot.dln_span[sb] ; j<ej; j++)
        { //meetjotetojote( ja,dlns[jb] ) 
          var jb=dlns[j]
          if(g=jote.g[ja]+jote.g[jb])
          {
            dx=jote.x[ja]-jote.x[jb]
            dy=jote.y[ja]-jote.y[jb]
            dz=jote.z[ja]-jote.z[jb]
            dd= dx*dx+dy*dy+dz*dz
            
            var f=_tfac*g/(dd*Sqrt(dd)+ 0.025*g/dd ); f=(f>1)?1:f
            if(jote.g[jb]){ //both pull ~meh ja maybe zero
              f=f/g
              var af= f*jote.g[jb]; f=f*jote.g[ja]
              jote.qx[ja]-=dx*af,   jote.qy[ja]-=dy*af,   jote.qz[ja]-=dz*af
              jote.qx[jb]+=dx*f,    jote.qy[jb]+=dy*f,    jote.qz[jb]+=dz*f
            }else{
              jote.qx[jb]+=dx*f,    jote.qy[jb]+=dy*f,    jote.qz[jb]+=dz*f
            }
          }//had g
        }//met all jotes
        return 
      }
    }
     
    var f=_tfac*g/(dd*Sqrt(dd)+ 0.025*g/dd ); f=(f>1)?1:f 
    
    if(jote.g[ja]&&spot.grm[sb]){ //both pull
      f=f/g
      var af= f*spot.grm[sb]; f=f*jote.g[ja]
      jote.qx[ja]-=dx*af,    jote.qy[ja]-=dy*af,    jote.qz[ja]-=dz*af
      spot.calcx[sb]+=dx* f, spot.calcy[sb]+=dy* f, spot.calcz[sb]+=dz* f
    }
    else {if(jote.g[ja]){
      spot.calcx[sb]+=dx*f, spot.calcy[sb]+=dy*f, spot.calcz[sb]+=dz*f
    }else{
      jote.qx[ja]-=dx*f,    jote.qy[ja]-=dy*f,    jote.qz[ja]-=dz*f
    }}
  } 
    
  
  fig.spots_grav2 = spots_grav2
  
  return fig

}