// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// spotgrav.js - gravity with far spot approximation

function addSpotgrav(fig) { 
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

  
  var mingdis
  
  function spots_grav(p){  //begin recursive gravitation 
    
    squality=5000000*(vplay.gravqual||1)*(vplay.gravqual||1)
    pace=p||vplay.model_pace
     
    throt=vplay.max_force/abs(pace) 

    startwatch('tendspots') 
    fig.tendto_spotmap() 
    stopwatch('tendspots') 
    
    //~ mtlogcn=mtlogar=logtell=nullfunc
    //logspot=0 //dont dump the spotmap object
    mingdis=16.0
    _klev=-1;
    //~ conlog("ply")
    //~ spot.fchild[1]=0 //testing
    
    //~ checkspots("pre interply")
    startwatch('gply')
    fig.nbodygrav(p)
    //~ interplyspot(1)
    stopwatch('gply')
    //~ checkspots("aft interply")
    //logtell()
     
    startwatch('fitspots') 
    //~ fig.postfit_spotmap() 
    stopwatch('fitspots')

    //~ cologwatch( ['ALLgrav','ply','load','measure'],5 )
  }
  
  
  function clump_grav(p){  //begin recursive gravitation 
    
    squality=3000000*(vplay.gravqual||1)*(vplay.gravqual||1)
    pace=p||vplay.model_pace
     
    throt=vplay.max_force/abs(pace) 

    startwatch('tendspots') 
    fig.tendto_spotmap() 
    stopwatch('tendspots') 
    
    //~ mtlogcn=mtlogar=logtell=nullfunc
    //~ logspot=0 //dont dump the spotmap object
    
    mingdis=16.0
    _klev=-1;

    //~ spot.fchild[1]=0 //testing
    startwatch('nbody')
    //~ interplyspot(1)
    //~ if(vplay.model_clock>5.7)console.log("pregrav",Fgm.Drand.f48().toFixed(5))
    fig.nbodygrav(p)
    //~ if(vplay.model_clock>5.7)console.log("posgrav",Fgm.Drand.f48().toFixed(5))
    stopwatch('nbody')

    //~ startwatch('fitspots')
    //~ fig.postfit_spotmap() 
    //~ if(vplay.model_clock>5.7)console.log("preclum",Fgm.Drand.f48().toFixed(5))
    //~ stopwatch('fitspots')
    
    startwatch('press')
    //~ if(vplay.model_clock>5.7)console.log("preclum",Fgm.Drand.f48().toFixed(5))
    fig.spotclump()
    //~ if(vplay.model_clock>5.7)console.log("posclum",Fgm.Drand.f48().toFixed(5))
    //~ interplyspot(1)
    stopwatch('press')
    
    //logtell()
     
    //~ for(var j=0, je=jote.top ; j<je ; j++ ){
      //~ jote.vx[j]=jote.vy[j]=jote.vz[j]=jote.qx[j]=jote.qy[j]=jote.qz[j]=0
    //~ }	
     
    //~ conlog(spot.top)
    //~ cologwatch( ['tendspots','nbody','fitspots','press'],5 )
  }
  
  
  function interplyspot(par){ //inpit
    //mtlogar('assess','inmate spot'+par)
    var kn=_listkids(par)
    //for(var g=0;g<kn;g++) mtlogar('assess','inmt kid'+_kcac[_klev][g])
    if(!kn){ 
      //~ mtlogcn('inleafed')
      //mtlogar('assess','inmt leaf'+par); 
      intermateleaf(par) 
      return 
    }
    
    var kids=_kcac[_klev]
    for(var i=0 ; i<kn; i++ )
    { for(var j=i+1 ;j<kn; j++ )
      { 
        //mtlogcn('assess1'); 
        multiply_spots(kids[i],kids[j]) 
      }
      interplyspot(kids[i]) 
    }
    _klev-- //kid list cache
  }
  
  var squality=-1
  function multiply_spots(sa,sb){
    
    //mtlogar("assess","assessing spots "+sa+" "+sb)
    
    //~ var calibgrav=0.5, calibsplita=4, calibsplitb=2, calibratio=2
        
    var idiag=spot.grd[sa]+spot.grd[sb]+0.1
    var tm=spot.grm[sa]+spot.grm[sb]
    
    if(tm===0){ 
      //mtlogcn('matelf_spsp',leafsinspot(sa)*leafsinspot(sb))
      return 
    }
    
    var idist   =
     (spot.grx[sa]-spot.grx[sb])*(spot.grx[sa]-spot.grx[sb])
    +(spot.gry[sa]-spot.gry[sb])*(spot.gry[sa]-spot.gry[sb])
    +(spot.grz[sa]-spot.grz[sb])*(spot.grz[sa]-spot.grz[sb])
     //squality
    if( idist>squality*idiag*tm )
    { //mtlogcn('mate_spsp')
      //mtlogar("assess","a- pairing "+sa+"+"+sb); 
      //matespots(sa,sb)
      //mtlogcn('matelf_spsp',leafsinspot(sa)*leafsinspot(sb))
      return } //spot v spot 
    else 
    { //if has leaf node, or small node, or a bit far only split bigger
      var leaf=0,spt=0
      if(!spot.fchild[sa]){ leaf=sa,spt=sb }
      if(!spot.fchild[sb]){ //sb is leaf
        if(leaf){           //sa was leaf
          multimateleafs(sa,sb); 
          //mtlogar("assess","a- leafing "+sa+" "+sb); 
          //mtlogcn('matelf_lflf'); 
          return 
        }else leaf=sb,spt=sa //sb is leaf, sa wasnt
      }
   
      if(leaf) //there is a leaf
      { 
        //mtlogcn('split_lfsp');
        //leaf or small spot is sc
        //mtlogar("assess","a- split leaf "+leaf)
        for(var kd=spot.fchild[spt]; kd; kd=nextkid(spt,kd) )
        { //mtlogcn('assess2'); 
          // mtlogar("assess","a- split with "+kd) 
          multiply_spots(kd,leaf) }
        //mtlogar("assess","a- ret aft splt leaf")
        return
      }
                
      //mtlogcn('split_spsp');
      var kn=_listkids(sa),kids=_kcac[_klev]
      
      for(var kb=spot.fchild[sb]; kb; kb=nextkid(sb,kb) )
      { 
        for( var ka=0 ; ka<kn ; ka++  ) 
        { 
          //mtlogcn('assess3'); 
          //mtlogar("assess","a- split both "+kb+"&"+kids[ka]); 
          multiply_spots(kb,kids[ka]) 
        }
      }	
      _klev--
      //mtlogar("assess","a- ret aft splt bth")
      return
    }
  }
  
  
  function matespots(p,q){
    
    _pnt_accel(
     spot.grx[p],spot.gry[p],spot.grz[p],spot.grm[p]
    ,spot.grx[q],spot.gry[q],spot.grz[q],spot.grm[q]
    )
    //~ if(spot.grm[p]>0.01&&spot.grm[q]>0.01) console.log("ov:",p,q,spot.grm[p],spot.grm[q])
    spot.calcx[p]+=_cpx, spot.calcy[p]+=_cpy,spot.calcz[p]+=_cpz
    spot.calcx[q]+=_cqx, spot.calcy[q]+=_cqy,spot.calcz[q]+=_cqz
  }
    
  
  function jote_accel(cp,cq){
    
    var jp=dlns[cp],jq=dlns[cq]
    _pnt_accel(
     jote.x[jp],jote.y[jp],jote.z[jp],jote.g[jp]
    ,jote.x[jq],jote.y[jq],jote.z[jq],jote.g[jq]
    )
   
   //~ if(isNaN(_cpx)||isNaN(_cpy)||isNaN(_cpz)
    //~ ||isNaN(_cqx)||isNaN(_cqy)||isNaN(_cqz) ){
    
    //~ console.log("NaNHere: cp",cp,cq,"jp",jp,jq,"jop"
    //~ ,jote.x[jp],jote.y[jp],jote.z[jp],jote.g[jp],"joq"
    //~ ,jote.x[jq],jote.y[jq],jote.z[jq],jote.g[jq])
      
   //~ }
      
    jote.qx[jp]+=_cpx, jote.qy[jp]+=_cpy, jote.qz[jp]+=_cpz
   ,jote.qx[jq]+=_cqx, jote.qy[jq]+=_cqy, jote.qz[jq]+=_cqz
             
  }
  
  
  function multimateleafs(p,q){
    squareloop(
      spot.dln_anchor[p], spot.dln_anchor[p]+spot.dln_span[p]
     ,spot.dln_anchor[q], spot.dln_anchor[q]+spot.dln_span[q]
     ,jote_accel
    )
  }
    
  
  function intermateleaf(s){ 
    triangleloop(
      spot.dln_anchor[s], spot.dln_anchor[s]+spot.dln_span[s],jote_accel
    ) 
  }

  
  function triangleloop(p,e,fn){ //checked by making 1 spot leaf
    for( var q=p+1 ;q<e ;q=(++q<e)?q:(++p+1) )  //p(p-1)/2
    { fn(p,q) }	
  }
  
  
  function squareloop(ap,ep,aq,eq,fn){
    for(
      var cp=ap,cq=aq
     ;cp<ep ;cq=(++cq<eq)?cq :(cp++,aq) //(all q by all p)
    )
    { fn(cp,cq) }	
  }
          
  
  //dumb copy from forces.js
  
  var pace,throt,_cpx=-1,_cpy=-1,_cpz=-1,_cqx=-1,_cqy=-1,_cqz=-1
  
  function _pnt_accel(px,py,pz,pg,qx,qy,qz,qg)
  { 
    var dx=px-qx, dy=py-qy, dz=pz-qz
    var cf=(dx*dx + dy*dy + dz*dz)
    var hyp=Sqrt(cf)
    
    //proximity limit mechanism seems resposible
    //for difference in upscale gravity resolution... 
    cf=vplay.gravity/cf 
    if(cf>throt){ cf= throt*(2-(0.6*(cf-throt)+cf)/cf)  }
    cf=cf*pace/hyp //note fa is no longer sqrt f
    
    if(qg){ //move p also
      var pf= -cf*qg, qf=cf*pg
      _cpx = dx*pf, _cpy = dy*pf, _cpz = dz*pf
      _cqx = dx*qf, _cqy = dy*qf, _cqz = dz*qf
    }else //move only q
    { cf*=pg, _cqx = dx*cf, _cqy = dy*cf, _cqz = dz*cf
      _cpx=_cpy=_cpz= -0 }
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
    
  fig.spots_grav = spots_grav
  fig.clump_grav = clump_grav
  
  return fig

}