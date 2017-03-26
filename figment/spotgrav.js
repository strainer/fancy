// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// spotgrav.js - 

function addSpotgrav(fig,vplay) { 
  'use strict'
    
  var jote=fig.jote, spot=fig.spot, dlns=fig.dlns 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
     
  var epsila=Math.pow(0.5,52)
  var epsilb=Math.pow(0.5,43)
  
  
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
  
  function grav_spots(p){  //begin recursive gravitation 
    
    squality=1000000*(vplay.gravqual||1)*(vplay.gravqual||1)
    pace=p||vplay.model_pace
     
    throt=vplay.max_force/abs(pace) 

    startwatch('ALLgrav') 
    fig.prefit_spotmap() 
    
    //~ tell=tella=logtell=nullfunc
    logspot=0 //dont dump the spotmap object
    mingdis=16.0
    _klev=-1;

    //~ spot.fchild[1]=0 //testing
    startwatch('ply')
    interplyspot(1)
    stopwatch('ply')
    
    //logtell()
     
    fig.postfit_spotmap() 

    stopwatch('ALLgrav')

    //~ cologwatch( ['ALLgrav','ply','load','measure'],5 )

  }
  
  function interplyspot(par){ //inpit
    //tella('assess','inmate spot'+par)
    var kn=_listkids(par)
    //for(var g=0;g<kn;g++) tella('assess','inmt kid'+_kcac[_klev][g])
    if(!kn){ 
      tell('inleafed')
      //tella('assess','inmt leaf'+par); 
      intermateleaf(par) 
      return 
    }
    
    var kids=_kcac[_klev]
    for(var i=0 ; i<kn; i++ )
    { for(var j=i+1 ;j<kn; j++ )
      { 
        //tell('assess1'); 
        multiply_spots(kids[i],kids[j]) 
      }
      interplyspot(kids[i]) 
    }
    _klev-- //kid list cache
  }
  
  var squality=-1
  function multiply_spots(sa,sb){
    
    //tella("assess","assessing spots "+sa+" "+sb)
    
    //~ var calibgrav=0.5, calibsplita=4, calibsplitb=2, calibratio=2
        
    var idiag=spot.grd[sa]+spot.grd[sb]+0.1
    var tm=spot.grm[sa]+spot.grm[sb]
    
    if(tm===0){ 
      //tell('matelf_spsp',leafsinspot(sa)*leafsinspot(sb))
      return 
    }
    
    var idist   =
     (spot.grx[sa]-spot.grx[sb])*(spot.grx[sa]-spot.grx[sb])
    +(spot.gry[sa]-spot.gry[sb])*(spot.gry[sa]-spot.gry[sb])
    +(spot.grz[sa]-spot.grz[sb])*(spot.grz[sa]-spot.grz[sb])
     //squality
    if( idist>squality*idiag*tm )
    { tell('mate_spsp')
      //tella("assess","a- pairing "+sa+"+"+sb); 
      matespots(sa,sb)
      //tell('matelf_spsp',leafsinspot(sa)*leafsinspot(sb))
      return } //spot v spot 
    else 
    { //if has leaf node, or small node, or a bit far only split bigger
      var leaf=0,spt=0
      if(!spot.fchild[sa]){ leaf=sa,spt=sb }
      if(!spot.fchild[sb]){ //sb is leaf
        if(leaf){           //sa was leaf
          multimateleafs(sa,sb); 
          //tella("assess","a- leafing "+sa+" "+sb); 
          tell('matelf_lflf'); 
          return 
        }else leaf=sb,spt=sa //sb is leaf, sa wasnt
      }
   
      if(leaf) //there is a leaf
      { 
        tell('split_lfsp');
        //leaf or small spot is sc
        //tella("assess","a- split leaf "+leaf)
        for(var kd=spot.fchild[spt]; kd; kd=nextkid(spt,kd) )
        { //tell('assess2'); 
          // tella("assess","a- split with "+kd) 
          multiply_spots(kd,leaf) }
        //tella("assess","a- ret aft splt leaf")
        return
      }
                
      tell('split_spsp');
      var kn=_listkids(sa),kids=_kcac[_klev]
      
      for(var kb=spot.fchild[sb]; kb; kb=nextkid(sb,kb) )
      { 
        for( var ka=0 ; ka<kn ; ka++  ) 
        { //tell('assess3'); 
          //tella("assess","a- split both "+kb+"&"+kids[ka]); 
          multiply_spots(kb,kids[ka]) }
      }	
      _klev--
      //tella("assess","a- ret aft splt bth")
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

  var logtell = function(){ ////////////////////////////////////////////////////
    var lg="",sr=[],_dsui =spot.top
    
    var sr=[],mr=[
      'split_lfsp' ,'split_spsp'
      ,'matelf_lflf','matelf_spsp'
      ,'mate_spsp'
    ]
    
    for(var p=0;p<mr.length;p++ ){ 
      if(!tll[mr[p]]){ tll[mr[p]]=0 }
    }
    
    for(var p in tll){ if(isFinite(tll[p])) sr.push(p) }
    
    sr.sort()
    var lefs=leafsinspot(0)
    ,lefp=(lefs*(lefs-1))*0.5
    var ter=(_dsui*(_dsui-1))*0.5
    console.log()
    console.log("Number spots:",_dsui," spotmuls:",ter)
    console.log("Nb leafs:",lefs," leafmuls:",lefp)
    console.log("check lflf+spsp:",tll['matelf_lflf'],"+",tll['matelf_spsp'],"=",lefp)

    for(var i=0;i<sr.length;i++)
    { lg=lg+sr[i]+":"+tll[sr[i]]+" ";tll[sr[i]]=0 }

    console.log(lg)
    for(p in tll){ //printing telled arrays
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
    
  fig.grav_spots = grav_spots
  
  return fig

}