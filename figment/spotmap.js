// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// tree data index, recursively linked nested spatial groups of jotes
 
function addSpotmap(fig,vplay) { 
  'use strict'
  
  // // // debug logging functions // // //
  var nullfunc=function(){}
  
  var metrec={} ,metlogged=0 ,metlogstp=50
  
  var metlistspots = 1 //a dumb raw listing of spots,parent,child 
  
  var metinc = function(p,v){
    if(p in metrec){metrec[p]+=v||1}
    else{metrec[p]=1}
  }

  var metary = function(p,v){
    if(p==="assess"){v=levstr()+v}
    
    if(p in metrec){ metrec[p].push(v) }
    else{ 
      metrec[p]=[] 
      metrec[p].push(v) 
      }
  }

  var logmeters = function(){
    
    var mrecs="",numkeys=[]
    for(var p in metrec){ 
      if(typeof(metrec[p])==='number'){ numkeys.push(p) }
    }
    numkeys.sort()
    var lefs=metrec['totalleafs'],lefp=(lefs*(lefs-1))*0.5

    for(var i=0;i<numkeys.length;i++)
    { mrecs=mrecs+numkeys[i]+":"+metrec[numkeys[i]]+" ";metrec[numkeys[i]]=0
      //~ console.log("zeroing:",numkeys[i])
      }
    
    var tria=(spot.top*(spot.top-1))*0.5
    console.log("Telling of spots:",spot.top,"sppairs:",tria,"leafs:",lefs,"lfpairs:",lefp)
    console.log(mrecs)
    
    for(p in metrec){
      if((metrec[p].length)) { console.info(":"+p,metrec[p]); metrec[p]=[] }
    } 
        
    //~ console.log("heavy spots",list_kin(spot0))
    if(metlistspots)for(var s=0;s<spot.top;s++){
      console.log(
       "ui:",s,"lvl:",spot.depth[s],"par:",spot.parent[s]
       ,"chld:",spot.fchild[s],"anc:",spot.dln_anchor[s]
       ,"pst:",spot.dln_anchor[s]+spot.dln_span[s],"g:",spot.grm[s].toFixed(7)
      ) 
    }
    
    if(metlogged++>metlogstp){ metinc=logmeters=nullfunc }
  }
   
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
  
  var ffstop=0
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
    
    console.log("dlns:"+_jtlen+" trunkjs:"+tottrunkj)
    console.log(stru)
    console.log()
  }

  //~ metinc=metary=logmeters=meterspots=nullfunc
  //~ metinc=metary=logmeters=meterspots=nullfunc
 
//   //   //   //   //   //   //   //   //   //   //   //   //   //   // 
  //   //   //   //   //   //   //   //   //   //   //   //   //   //   // 
  
  var jote=fig.jote 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
  
  var epsila=Math.pow(0.5,52)
  var epsilb=Math.pow(0.5,43)

  var _dsui=1    //due sui, 0 is not valid 
  
  function setspotmax(maxsp){
    conlog("spotmaxxxxxxxxxxxxxxxxxxxxxxxx")
    if(!spot){
      spot={}
      spot.deep = 0 
      spot.top  = 0 
    }
    spot.max  = maxsp
    
    var
     depth       = new Uint8Array(maxsp)
    ,dln_anchor  = new Uint16Array(maxsp)
    ,dln_span    = new Uint16Array(maxsp)
    ,parent = new Uint16Array(maxsp)
    ,fchild = new Uint16Array(maxsp) //defered runtime calculation
    // first child writes this to parent when level sweeping 
     
    ,lbx = new Float64Array(maxsp)  //low bound x
    ,lby = new Float64Array(maxsp)
    ,lbz = new Float64Array(maxsp)
    
    ,hbx = new Float64Array(maxsp)  //high bound x
    ,hby = new Float64Array(maxsp)
    ,hbz = new Float64Array(maxsp)
    ,grd = new Float64Array(maxsp)  //spot diagonal
    
    ,grm = new Float64Array(maxsp)  //gravity mass
    ,grx = new Float64Array(maxsp)  //center gravity x
    ,gry = new Float64Array(maxsp)
    ,grz = new Float64Array(maxsp)
    
    ,calcx = new Float64Array(maxsp) //spot calculation registers
    ,calcy = new Float64Array(maxsp)
    ,calcz = new Float64Array(maxsp)
    
    for(var si=0;si<spot.top;si++){
      depth[si]=spot.depth[si] 
      
      dln_anchor[si] =spot.dln_anchor[si] 
      dln_span[si]   =spot.dln_span[si]
      
      parent[si] =spot.parent[si] ,fchild[si] =spot.fchild[si]
       
      lbx[si]=spot.lbx[si] ,lby[si]=spot.lby[si] ,lbz[si]=spot.lbz[si]
      hbx[si]=spot.hbx[si] ,hby[si]=spot.hby[si] ,hbz[si]=spot.hbz[si]
      /*
      grd[si]=spot.grd[si] ,grm[si]=spot.grm[si] ,grx[si]=spot.grx[si]
      gry[si]=spot.gry[si] ,grz[si]=spot.grz[si]
             
      calcx[si]=spot.calcx[si] ,calcy[si]=spot.calcy[si]
      calcz[si]=spot.calcz[si]
      */
    }
    
    spot.depth=depth
    spot.dln_anchor=dln_anchor 
    spot.dln_span=dln_span
    spot.parent=parent
    spot.fchild=fchild
     
    spot.lbx =lbx ,spot.lby =lby  ,spot.lbz =lbz
    spot.hbx =hbx ,spot.hby =hby  ,spot.hbz =hbz
    
    spot.grd =grd ,spot.grm =grm  ,spot.grx =grx
    spot.gry =gry ,spot.grz =grz 
           
    spot.calcx=calcx ,spot.calcy =calcy
    spot.calcz=calcx
    
  }

  var spot
  setspotmax(100)

  var _divn=[ -1, -1, -1 ]  //grid division vector
  var	_divm=[ -1, -1, -1 ]  //grid div measure vector

  //25 to 45 working best
  var max_subsect = 30     //max subdivision of space per iteration
  //5 to 10 working best
  var endsize=7            //endspot must be smaller than this population
    
  // max_subsect=30,endsize=7 performing best 
  // making approx 35% many spots as jotes
  
  ///sect recursion detail object:Survo notes per level*sbvox
  // caches the recursively used details of sects
  // approx maxlevel * celln in bulk ~= 256*10 2500
  // could just use a lev*maxcelln array
  // but this structure is much less sparse (it minimises levels max celln)
  
  function bulk_load(ej)
  { 
    var spotfac=0.7
    var spm=Math.floor( (jote.x.length)*spotfac )
    if( spot.max<spm*0.9 || spot.max>spm*1.2 ){
      setspotmax(spm) 
    }
    
    ej=ej||jote.top
    ej=makeroot(ej)
        
    if(ej < endsize)
    { endspot( spot.dln_anchor[1], spot.dln_anchor[1]+spot.dln_span[1] ) }
    else
    { bloombyspace( 1 )	}  // (lvlnum,cellnum)

    spot.top=_dsui 
  }
  
  //surveys vox then loops through all subvoxs, calculating their jtpopuls
  //from their sDls stored in recursivedet.sectanchor[svxi]
  //it recurses into oversized
  //it endcurses smallersized
  
  function bloombyspace( bsid ) 
  { 
    var bpop=spot.dln_span[ bsid ]
    //conlog("bcl_lv",bcl_lv,"i",bcelli,"cellsize",bpop)
    
    if(spot.depth[bpop]>18){ enddeep(bpop); return }
    
    var celln_trgt= floor(2+(bpop/endsize)*Drand.range(0.5,1))
    if(celln_trgt>max_subsect) { celln_trgt=max_subsect-1; }
    
    budbyspace( bsid, celln_trgt ) //makes ~n spots, 'under' bsid 
    for(var si=spot.fchild[bsid]; spot.parent[si]===bsid; si++) 
    { 
      
      if(spot.dln_span[si]>endsize)
      { bloombyspace( si ) }
      else
      { 
        endspot( spot.dln_anchor[si], spot.dln_anchor[si]+spot.dln_span[si] )
        metinc('sngl_end')
        //nothing happenign here since the transmog 
      }
    }
  }
  
  
  
  function enddeep(bpop){
    metinc("cellsoverdeep")
    var ak=spot.dln_anchor[bpop],ek=ak+spot.dln_span[bpop]
    
    endspot( ak,ek,spot.depth[bpop] )
    
    var q=[]
    for(var i=ak;i<ek;i++ ){ 
      var j=dlns[i]
      q.push(","+jote.x[j]+" "+jote.y[j]+" "+jote.z[j]+" ") 
    } 
    metary('odeepjts',q)
    //~ metary('odeepdets',surv_lev[bcl_lv])	
  }

  var _tfirst=true
  function makeroot(ej)
  { 
    //~ sect_at_dlsi = new Uint16Array(ej) //warning may need enlarged on increase 
    //~ cach_dlns    = new Uint16Array(ej)
    //~ dlns         = new Uint16Array(ej)

    _dsui=1  //sui 0 is null
    
    var i=0,en=0
    if(_tfirst){
      for( i=0; i<ej; i++)
      { if(isFinite(jote.x[i]+jote.y[i]+jote.z[i])){ dlns[en++]=i } }

      var spotfac=0.7
      var spm=Math.floor( (en)*spotfac )
      if( spot.max<spm*0.9 || spot.max>spm*1.2 ){
        setspotmax(spm) 
      }

      spot.depth[0]=0
      spot.depth[_dsui]=1
      spot.dln_anchor[_dsui]=0
      spot.dln_span[_dsui]=en
    
      spot.parent[_dsui]=0 
      spot.fchild[_dsui]=2
      _tfirst=0 
    }else{ en=spot.dln_span[_dsui] } //keep order of previous dlns
    
    i=dlns[0]
    _lw3[0]=jote.x[i], _lw3[1]=jote.y[i], _lw3[2]=jote.z[i]
    _hi3[0]=_lw3[0]  , _hi3[1]=_lw3[1]  , _hi3[2]=_lw3[2] 
    
    for(var j=1; j<en; j++)
    { 
      i=dlns[j]
      
           if(jote.x[i]<_lw3[0]) { _lw3[0]=jote.x[i] }
      else if(jote.x[i]>_hi3[0]) { _hi3[0]=jote.x[i] }
           if(jote.y[i]<_lw3[1]) { _lw3[1]=jote.y[i] }
      else if(jote.y[i]>_hi3[1]) { _hi3[1]=jote.y[i] }
           if(jote.z[i]<_lw3[2]) { _lw3[2]=jote.z[i] }
      else if(jote.z[i]>_hi3[2]) { _hi3[2]=jote.z[i] }
    }
    
    nudge_hi3()
    
    //~ for(var i=0;i<0;i++){ //each axis
    
      //~ // preincrease dither to blur repeat-grid alignment
      //~ // this is somewhat neutralised by subcell resizing
      //~ _divm[i]=(hig[i]-lopos[i])*1.01 
      //~ var p=rndu()*_divm[i]/4
      //~ var q=rndu()*_divm[i]/4
      //~ lopos[i]-=Math.abs(p)
      //~ _divm[i]+=Math.abs(q)+Math.abs(p)
    //~ }
    
    spot.lbx[1] = _lw3[0]
    spot.lby[1] = _lw3[1]
    spot.lbz[1] = _lw3[2]
     
    spot.hbx[1] = _hi3[0]//lopos[0]+_divm[0]
    spot.hby[1] = _hi3[1]//lopos[1]+_divm[1]
    spot.hbz[1] = _hi3[2]//lopos[2]+_divm[2]
            
    _dsui++
            
    return _jtlen=en
  } 
  
  var _jtlen=0
  
  //workspace of surveying function
  var sectppl = new Uint16Array(max_subsect) //records quantity of jotes in sects
  var secfill = new Uint16Array(max_subsect) //counts fill of sects while filling dlsline
  var sect_at_dlsi =[]  //contains sect of jote at [dlsi]
  var valq_at_dlsi =[]  //contains sect of jote at [dlsi]
  var cach_dlns =[]    //contains direct index of jote at [dlsi]
  var dlns =[]  //The full delineation sequence jotes arranged into spot lines,
             //which have st, end pos, properties recorded in spot

  function budbyspace( psi, cellnb ) // 
  { 
    var st = spot.dln_anchor[psi] 
    var sn = spot.dln_span[psi] 
    var ov = st+sn 
     
    _lw3[0] = spot.lbx[psi] ,_lw3[1] = spot.lby[psi] ,_lw3[2] = spot.lbz[psi]
    _hi3[0] = spot.hbx[psi] ,_hi3[1] = spot.hby[psi] ,_hi3[2] = spot.hbz[psi]
    
    //nudge_hi3() - it was nudged when discerned
    //~ if((_lw3[0]!=spot.lbx[psi])||
       //~ (_hi3[0]!=spot.hbx[psi])||
       //~ (_lw3[1]!=spot.lby[psi])||
       //~ (_hi3[1]!=spot.hby[psi])||
       //~ (_lw3[2]!=spot.lbz[psi])||
       //~ (_hi3[2]!=spot.hbz[psi]) ){
         
      //~ console.log("ze fail spot:",psi)
      //~ console.log(_lw3,[spot.lbx[psi],spot.lby[psi],spot.lbz[psi]])
      //~ console.log(_hi3,[spot.hbx[psi],spot.hby[psi],spot.hbz[psi]])
      
    //~ }else{ console.log("ze matched!!!!!!!!!!") }
    
    var celln=note_bestgrid(cellnb) //sets _divn and _divm
    var cel=0

    if(_dsui+celln+1 >= _bmpspot){
      conlog("calc shove _dsui",_dsui,"celln",celln,"_bmpspot",_bmpspot)
      var shv=Math.floor((_dsui+celln-_bmpspot+3))
      metary('shoves',{top:spot.top,nxtsi:_dsui,mv:shv,clshi:_bmpspot,pari:psi} )
      shovespots(shv)
    }
          
    //configure loc_to_subcell function with curdets
    note_loctosubs()
     
    if(celln>max_subsect) { metinc('celln_err')}
       
    //reset all potential cellppls 
    for(var i=0; i<=celln; i++) { secfill[i]=0; sectppl[i]=0 }
    
    var ncheck=0
    
    //loop through stretch to make note of members sectors
    for(var dli=st; dli<ov; dli++) //dlnseq id (pos) 
    { cel=Math.abs(loctosubcell(
        jote.x[dlns[dli]], jote.y[dlns[dli]], jote.z[dlns[dli]]
      ))//%celln //seems unnecessary, Math.abs(cel)%celln or (cel+celln*celln)%celln
      
      if(!(cel>=0&&cel<=celln)) { 
        conlog("zeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        
        metary("outsurvey", {
          'spot':psi,'cel':cel,'dli':dli,'joi':dlns[dli],x:jote.x[dlns[dli]]
          ,y:jote.y[dlns[dli]], z:jote.z[dlns[dli]],lowx:_lw3[0],hix:_hi3[0]} ) 
        logmeters() 
      }
        
      cach_dlns[dli]= dlns[dli] //cache the line of dlns
      sect_at_dlsi[dli]= cel    //the sector of the jote in the line
      sectppl[cel]++           //population of sector
      
    }
    
    //effectively sets cach, sect_at and sectppl up properly...
    
    var chk=0
    for(var tt=0;tt<sectppl.length;tt++) { chk+=sectppl[tt] }
    
    //test if only one sect filled, if true scan bounds and rescan before continue
    //make sure surv_lev bounds are set correctly
    
    var fulls=0
    for(var c=0; fulls<2 && c<celln; c++) { if(sectppl[c]!==0){ fulls++ } }
    
    if(fulls<2)
    { 
      //~ conlog("zoooooooooooooooooooooooooo")
      note_true_bnds(jote.x, jote.y, jote.z, st,ov) //_lw3 and _hi3 is set
      for(var i=0; i<=cellnb; i++) { secfill[i]=0; sectppl[i]=0 }
      
      if( abs(_lw3[0]-_hi3[0])<epsilb 
      &&  abs(_lw3[1]-_hi3[1])<epsilb 
      &&  abs(_lw3[2]-_hi3[2])<epsilb )
      { //a singularity hehe 
        //split..  set divn and m too..
        metinc('cellsingularity')
        celln=cellnb
        _divm[0]=_divm[1]=_divm[2]= 0
        _divn[0]=celln, _divn[1]=_divn[2]=1 
        
        for(var dli=st; dli<ov; dli++) 
        { cel=floor((cellnb*(dli-st))/sn)
          sect_at_dlsi[dli]= cel 
          sectppl[cel]++
        }
      }else{
        //~ metinc('cellshrink')
        celln=note_bestgrid(cellnb) //sets _divn and _divm
        note_loctosubs()
        //celln=_divn[0]*_divn[1]*_divn[2]
        for(var dli=st; dli<ov; dli++) 
        { cel=Math.abs(loctosubcell(   //redoing subloc with new bounds
            jote.x[dlns[dli]], jote.y[dlns[dli]], jote.z[dlns[dli]]
          ))//%celln //seems unnecessary 
          if(cel<0||cel>=celln) { 
            metary("Zoutsurvey", {'cel':cel,x:jote.x[dlns[dli]], 
              y:jote.y[dlns[dli]], z:jote.z[dlns[dli]],low:_lw3,hi:_hi3} ) }
          sect_at_dlsi[dli]= cel  //the dwnsector of the jote in the line
          sectppl[cel]++          //population of cel
        }
      }
    }
      
    if(celln!==_divn[0]*_divn[1]*_divn[2])
    { metary("divn_prob",{clevel:clv,det:surv_lev[clv]}) }
    // each of st to ov in dlns, 
    // sector is noted in sect_at_dlsi, 
    // tacki is note in cach_dlns
    
    var sectanchor=[]
    var uca=st                            //upcell anchor position in dlns
    for(var ccel=0; ccel<=celln; ccel++)  //loop through sects to note dls anchors
    { sectanchor[ccel]=uca; uca+=sectppl[ccel]; }
    
    for( uca=st; uca<ov; uca++)           //loop through jotes to slot after anchors
    { cel=sect_at_dlsi[uca] 
      dlns[ sectanchor[cel] + (secfill[cel]++) ]
        =cach_dlns[uca] 
    }
    
    //curdets note sects lvl, size and expected size of children, children may redefine
    //their own sizes and expected sizes of their children
    //spot sizes are not calculated until level up
    //sects are only concerned with comprehensively covering instantaneous position of
    //jotas
  
    var bw3=[_lw3[0],_lw3[1],_lw3[2]], firstc=1
    var clv=spot.depth[psi]+1
    if(clv>spot.deep) spot.deep=clv
    
    for(var ccel=0; ccel<celln; ccel++)  //loop through sects to note spotdets
    { if(sectppl[ccel]){
        
        //~ surv_lev[clv].sui[ccel]=_dsui 
        
        if(firstc){ spot.fchild[psi]=_dsui ; firstc=0 }
        spot.parent[_dsui]=psi
        spot.fchild[_dsui]=0 
        
        spot.depth[_dsui]=clv
        spot.dln_anchor[_dsui]=sectanchor[ccel]
        spot.dln_span[_dsui]=sectppl[ccel]
        
        note_implied_bnds( ccel, _divn, _divm, bw3 )

        spot.lbx[_dsui] = _lw3[0]
        spot.lby[_dsui] = _lw3[1]
        spot.lbz[_dsui] = _lw3[2]
         
        spot.hbx[_dsui] = _hi3[0]
        spot.hby[_dsui] = _hi3[1]
        spot.hbz[_dsui] = _hi3[2]
        
        //~ console.log("spot:",_dsui, "par:",psi, "deep:",spot.depth[_dsui])
        _dsui++
      }
    }
    if(_dsui>spot.top) conlog("tops ERROR",_dsui)
    spot.parent[_dsui]=0 //careful!  test hack fix
  }
  
  
  function shovespots(mv){  //shove _dsui-to-end by mv
    
    var clld=_bmpspot, btop=spot.top
    _bmpspot+=mv
    
    //it has been calculated bloom may go past top 

    //~ var deboo = ( clld==29 && mv==3 )

    //~ if(deboo){ conlogspots() }
    
    conlog("Shoving",clld,mv)
    
    if(clld===spot.top){
      conlog("shoving the end",spot.top,"to",clld+mv)
      if(clld+mv>spot.max){ setspotmax(Math.floor((clld+mv)*1.25)) }
      for(var si=spot.top,se=si+mv; si<se; si++){ spot.parent[si]=spot.fchild[si]=0 }
      spot.top=clld+mv
      return
    }
    
    conlog2("ashvsp10",spot.fchild[10])
    
    var gaps=[], glast=-1
    
    for(var mvv=mv,si=clld+1; mvv!==0; si++){
      
      if(spot.parent[si]===0){  //si is suit for overwrite
        if(si===glast+1){
          if(si===spot.top)       //must extend top
          { spot.top+=mvv; mvv=0  //by remaining mvvs
            gaps[gaps.length-1]=spot.top-1 }  //overwrite to newtop-1
          else{ gaps[gaps.length-1]=++glast; mvv-- } 
        }else{
          if(si===spot.top){
            spot.top+=mvv; mvv=0  //new gapcouple oltop to nwtop-1
            gaps.push(si); gaps.push(spot.top-1);
          }else{
            gaps.push(si); gaps.push(si); glast=si; mvv--
          }
        }
      }
    } //read checked +
        
    var cgap=gaps.length+1
    
    var gapa,gmv=0 ,cg=0,eg=gaps.length
    
    while(cg<eg){

      gapa=gaps[cg] //gap anchor
      gmv=gaps[cg+1]-gaps[cg]+1
      cg+=2
      
      for(var si=2; si<btop; si++){  //maybe do this faster later...
                                     //prepare si > shift.si map calcs
        if(spot.fchild[si]<gapa&&spot.fchild[si]>=clld) spot.fchild[si]+=gmv
        if(spot.parent[si]<gapa&&spot.parent[si]>=clld) spot.parent[si]+=gmv
      }
    }

    
    var mvto,mvby=mv, gnxt=0
    while( mv>0 ){
      
      mvby=gaps[gnxt+1]-gaps[gnxt]+1
      mvto=gaps[gnxt+1]
      gnxt+=2 
      mv-=mvby
      
      for(var si=mvto-mvby; si>=clld ;si--){
        movespot(si,si+mvby) 
      }
      
    }
    
    //then invalidate the gap, include section from duesui on?
    //that section must be invalidated after operation anyway
    
    for(var si=clld,se=si+mv; si<se; si++){ spot.parent[si]=0 }

    //~ if(deboo){ conlogspots(); debugger }
    //~ conlog2("cshvsp10",spot.fchild[10])
  }
  
  function movespot(a,d){
    spot.parent[d]=spot.parent[a]
    spot.fchild[d]=spot.fchild[a]
    
    spot.depth[d]     =spot.depth[a]
    spot.dln_anchor[d]=spot.dln_anchor[a]
    spot.dln_span[d]  =spot.dln_span[a]
    
    spot.lbx[d] = spot.lbx[a]
    spot.lby[d] = spot.lby[a]
    spot.lbz[d] = spot.lbz[a]
                              
    spot.hbx[d] = spot.hbx[a]
    spot.hby[d] = spot.hby[a]
    spot.hbz[d] = spot.hbz[a]
  }
  
                       //2   1    0    1   2
  function rebudbyvelo( par,wpar,pex,kidn,stk){
    //expand parent
    while(pex){ spot.dln_span[par]+=spot.dln_span[par+pex--] }
  
    _dsui=stk
    budbyvelo( par,kidn,wpar ) //kidns will be written to _dsui
                               //writen parent can be not real parent
  }

  
  function budbyvelo( psi, sectn ,wpsi) // 
  { 
    var st = spot.dln_anchor[psi] 
       ,sn = spot.dln_span[psi] 
       ,ov = st+sn 
       
    //reset all potential cellppls, sectppl[i]=0 happens in histosort
    for(var i=0; i<=sectn; i++) { secfill[i]=0 } 
    
    ///this is setup before histosort
    for(var i=st; i<ov; i++){
      var j=dlns[i]; 
      cach_dlns[i]= j
      valq_at_dlsi[i]=Math.sqrt(
        jote.x[j]*jote.x[j]+jote.y[j]*jote.y[j]+jote.z[j]*jote.z[j]
      )
      if(isNaN(valq_at_dlsi[i])){
       conlog("NAN!",i,jote.x[j],jote.y[j],jote.z[j])
      }
    }
    
    //uses:    valq_at_dlsi
    //updates: sect_at_dlsi and sectppl
    histosort(sectn  ,st,ov) //developed in histosort.js
    conlog2("histo",sectn,st,ov,sn)
    checks("pre_veloshuf")
    /// reshuffles dlns according to sect_at_dlsi 
    var sec=0, sectanchor=[]
    var uca=st                            //upcell anchor position in dlns
    for(var csec=0; csec<=sectn; csec++)  //loop through sects to note dls anchors
    { sectanchor[csec]=uca; uca+=sectppl[csec]; }
    
    for( uca=st; uca<ov; uca++)   //loop through jotes to slot after anchors
    { sec=sect_at_dlsi[uca] 
      dlns[ sectanchor[sec] + (secfill[sec]++) ]
        =cach_dlns[uca] 
    }
    /// finished that shuffle
    checks("aft_veloshuf")
  
    /// update resulting spots: 
    var firstc=1
    var clv=spot.depth[wpsi]+1
    if(clv>spot.deep) spot.deep=clv
    
    var conl=""
    for (var i=0;i<sectn;i++){ conl+=" "+sectppl[i] }
    conlog2("velospotting",conl)
    
    for(var csec=0; csec<sectn; csec++)  //loop through sects to note spotdets
    { 
      if(sectppl[csec]) {
        conlog2("writespot",_dsui)
        //~ if(firstc&&(psi===wpsi)){ spot.fchild[psi]=_dsui ; firstc=0 }
        spot.parent[_dsui]=wpsi
        //spot.fchild[_dsui]=0 //this may need set after
        
        spot.depth[_dsui]=clv
        spot.dln_anchor[_dsui]=sectanchor[csec]
        spot.dln_span[_dsui]=sectppl[csec]
        
        note_true_bnds( jote.x, jote.y, jote.z, 
          sectanchor[csec], sectanchor[csec]+sectppl[csec]
        )
        //rather should rescan these ^ 
        //but this should work?
        spot.lbx[_dsui] = _lw3[0]
        spot.lby[_dsui] = _lw3[1]
        spot.lbz[_dsui] = _lw3[2]
                                  
        spot.hbx[_dsui] = _hi3[0]
        spot.hby[_dsui] = _hi3[1]
        spot.hbz[_dsui] = _hi3[2]
        
        _dsui++
      }
    }
  }


  function histosort(dv,st,ov){
    
    var avg=-0 , val=-0 ,nb=ov-st, secti=sect_at_dlsi
    
    var Ar = valq_at_dlsi ,minv=Ar[st],maxv=Ar[st] 
    
    for(var i=st; i<ov; i++) //need to max,min 
    { 
      ///this is setup before histosort
      //~ var j=dlns[st]
      //~ val=Math.sqrt(
        //~ jote.x[j]*jote.x[j]+jote.y[j]*jote.y[j]+jote.z[j]*jote.z[j]
      //~ )
      if(isNaN(Ar[i])) Ar[i]=0
      val=Ar[i]||0
      avg+=val
      if (val>maxv){ maxv=val }
      if (val<minv){ minv=val }
    }
     
    avg/=nb, avg-=minv, maxv-=minv

    var hiv=0,havg=-0
    
    for(var i=st; i<ov; i++) 
    { val=Ar[i]-=minv 
      if (val>avg){ hiv++;havg+=val }
    }
   
    var qhi=2*havg/hiv  //prelim estimate of good maxv
    if(qhi>=maxv){ qhi=maxv*0.99999999 }
    
    var hfac=5  //over sample x5
    
    var hdiv=hfac*dv, hdi=hdiv-1
    
    //todo recycle these temp arrays
    var uphistn=new Array(hdiv), destofup=new Array(hdiv)
    for(var ch=0; ch<hdiv; ch++){ uphistn[ch]=0 }
    
    var destn=[]//sectppl
    for(var ch=0; ch<dv; ch++){ destn[ch]=0 }
    
    for(var i=st; i<ov; i++){
      //~ Ar[i]/maxv is not morethan 1, hdiv is max pot id
      //gets floored so if v > hpot[dv] and v < hpot[dv+1] its counted
      
      val=Math.floor(hdiv*Ar[i]/maxv)
      val=(val>hdi)?hdi:val
      uphistn[valq_at_dlsi[i]=val]++
    }
    
    var dvn=nb/dv ,dvnfl=Math.floor(dvn), dvrem=(dvn-dvnfl)*1.0000000001
    var drem=-0, xx=(drem+dvrem)%1
    var fillit=0, dvn=Math.floor(dvn) //err??
    
    for(var h=0; h<hdiv; h++){
      
      destofup[h]=fillit        //uphistn bar h goes to dest[fillit]
      destn[fillit]+=uphistn[h]  //destn[fillit] gets population of bar h
      while(destn[fillit]>=(dvnfl+xx)){ //if dest[f] is full, fill then carry 
        destn[fillit+1]+=(destn[fillit]-dvnfl-xx)  //to next 
        destn[fillit]=dvnfl+xx                     //that fillit is full
        fillit++                                   //and will fill no more 
        drem=drem+dvrem
        if(drem<1){ xx=0 }else{ drem-=1,xx=1}
      } 
    }
    
    for(var i=0;i<dv;i++){ sectppl[i]=destn[i]=Math.ceil(destn[i]) }
    
    for(var i=st; i<ov; i++){ 
      var hpotofi=valq_at_dlsi[i]
      
      while(destn[destofup[hpotofi]]===0){ destofup[hpotofi]++ }
      destn[destofup[hpotofi]]--
      secti[i]=destofup[hpotofi]
    }
    
    ///////////////////
    /*
    for(var cn=0,ck=0;ck<dv;ck++){
      if(sectppl[ck]){cn++}
    }
    if(!cn){ 
      var oo="",jo="", jj=""
      for(var ck=0;ck<dv;ck++){ oo+=" "+sectppl[ck] }
      
      conlog("sectpll",oo); oo=""
      for(var i=st; i<ov; i++){ 
        oo+=" "+secti[i]; 
        jo+=" "+valq_at_dlsi[i] 
        jj+=" "+dlns[i]
      } 
      conlog("josecs",oo); 
      conlog("jovals",jo); 
      conlog("jojois",jj); 
    }
    */
    ///////////////////
  }
  
  function dln_end(sx){
    while( spot.parent[sx]!==spot.parent[sx+1])
    { sx=spot.parent[sx] }
    
    return sx?spot.dln_anchor[sx+1]:_jtlen 
  } 

  function measure_spots(){ //without vel for force
    
    var lwx,hix, lwy,hiy, lwz,hiz
    var cgx,cgy,cgz,cmass_tot
   
    //could make a multidimension array for this of
    //spotat[lv][sui] and spotnat[lv] to stop redundant sweeps
    //(sparse js created arrays) 

    for(var sui=1,spd=spot.deep; spd>0; sui++){ /// or spd>0 ??
      
      if(sui===spot.top){ sui=1;spd-- } //1 redundant test when sui=1,spd=-1
      
      if(spot.parent[sui]!==0 && spot.depth[sui]===spd){
        
        cgx=-0, cgy=-0, cgz=-0, cmass_tot=-0
        
        if(spot.fchild[sui]===0) //its a leaf spot
        { metinc('totalleafs');
          var ja=spot.dln_anchor[sui], jb=ja+spot.dln_span[sui]
          
          //testing if leaf spots need end marker
         
          var j=dlns[ja] //jote ate start of dln span
          
          lwx=hix=jote.x[j], lwy=hiy=jote.y[j], lwz=hiz=jote.z[j]
          cgx=jote.x[j]*jote.g[j] //center grav tally
          cgy=jote.y[j]*jote.g[j]
          cgz=jote.z[j]*jote.g[j]
          cmass_tot=jote.g[j]
          
          for(var di=ja+1;di<jb;di++){
            j=dlns[di]
          
            if(jote.x[j]<lwx){ lwx=jote.x[j] } else if(jote.x[j]>hix){ hix=jote.x[j] }
            if(jote.y[j]<lwy){ lwy=jote.y[j] } else if(jote.y[j]>hiy){ hiy=jote.y[j] }
            if(jote.z[j]<lwz){ lwz=jote.z[j] } else if(jote.z[j]>hiz){ hiz=jote.z[j] }	
              
            cgx+=jote.x[j]*jote.g[j] //center grav tally
            cgy+=jote.y[j]*jote.g[j]
            cgz+=jote.z[j]*jote.g[j]
            cmass_tot+=jote.g[j] 
          }	
          
        }else{ //its an internal node
       
          var c=spot.fchild[sui]
          lwx=spot.lbx[c],lwy=spot.lby[c],lwz=spot.lbz[c]
          hix=spot.hbx[c],hiy=spot.hby[c],hiz=spot.hbz[c]
          cgx=spot.grx[c]*spot.grm[c]
          cgy=spot.gry[c]*spot.grm[c]
          cgz=spot.grz[c]*spot.grm[c]
          cmass_tot=spot.grm[c]
          
          while(spot.parent[++c]===sui)
          {
            if(spot.lbx[c]<lwx){ lwx=spot.lbx[c] } 
            if(spot.lby[c]<lwy){ lwy=spot.lby[c] } 
            if(spot.lbz[c]<lwz){ lwz=spot.lbz[c] } 
            if(spot.hbx[c]>hix){ hix=spot.hbx[c] }
            if(spot.hby[c]>hiy){ hiy=spot.hby[c] }	
            if(spot.hbz[c]>hiz){ hiz=spot.hbz[c] }
            
            cgx+=spot.grx[c]*spot.grm[c]
            cgy+=spot.gry[c]*spot.grm[c]
            cgz+=spot.grz[c]*spot.grm[c]
            cmass_tot+=spot.grm[c]
          } 
        }
    
        spot.grm[sui]=cmass_tot 
        if(cmass_tot)
        { cmass_tot=1/cmass_tot 
          spot.grx[sui]=cgx*cmass_tot	
          spot.gry[sui]=cgy*cmass_tot	
          spot.grz[sui]=cgz*cmass_tot
        }else{
          spot.grx[sui]=(lwx+hix)*0.5	
          spot.gry[sui]=(lwy+hiy)*0.5	
          spot.grz[sui]=(lwz+hiz)*0.5
        }	
        
        spot.lbx[sui]=lwx	,spot.lby[sui]=lwy	,spot.lbz[sui]=lwz	
        spot.hbx[sui]=hix	,spot.hby[sui]=hiy	,spot.hbz[sui]=hiz	
        
        spot.grd[sui]=(hix-lwx)*(hix-lwx)+(hiy-lwy)*(hiy-lwy)+(hiz-lwz)*(hiz-lwz)	
        
        //~ dmcheckspot(sui)
      } 
    }
  }

  function bimeasure_spots(tms){ //space with vel for collision
    
    var lwx,hix, lwy,hiy, lwz,hiz
    var cgx,cgy,cgz,cmass_tot
   
    //could make a multidimension array for this of
    //spotat[lv][sui] and spotnat[lv] to stop redundant sweeps
    //(sparse js created arrays) 

    for(var sui=1,spd=spot.deep; spd>-1; sui++){ /// or spd>0 ??
      if(sui===_dsui){ sui=1;spd-- } //1 redundant test when sui=1,spd=-1
      
      if(spot.depth[sui]===spd){

        cgx=-0, cgy=-0, cgz=-0, cmass_tot=-0
        
        if(spot.fchild[sui]===0) //its a leaf spot
        { metinc('totalleafs');
          var ja=spot.dln_anchor[sui], jb=ja+spot.dln_span[sui]
          
          //testing if leaf spots need end marker
         
          var j=dlns[ja] //jote at start of dln span
          
          lwx=hix=jote.x[j]+jote.vx[j]*tms
         ,lwy=hiy=jote.y[j]+jote.vy[j]*tms
         ,lwz=hiz=jote.z[j]+jote.vz[j]*tms
          
          for(var di=ja+1;di<jb;di++){
            j=dlns[di]
          
            var c=jote.x[j]+jote.vx[j]*tms
            if(c<lwx){ lwx=c } else if(c>hix){ hix=c }
            c=jote.y[j]+jote.vy[j]*tms
            if(c<lwx){ lwx=c } else if(c>hix){ hix=c }
            c=jote.z[j]+jote.vz[j]*tms
            if(c<lwx){ lwx=c } else if(c>hix){ hix=c } 
          }	
        }
        else // its an internal node
        { 
          var c=spot.fchild[sui]
          lwx=spot.lbx[c],lwy=spot.lby[c],lwz=spot.lbz[c]
          hix=spot.hbx[c],hiy=spot.hby[c],hiz=spot.hbz[c]
          
          while(spot.parent[++c]===sui)
          {
            if(spot.lbx[c]<lwx){ lwx=spot.lbx[c] } 
            if(spot.lby[c]<lwy){ lwy=spot.lby[c] } 
            if(spot.lbz[c]<lwz){ lwz=spot.lbz[c] } 
            if(spot.hbx[c]>hix){ hix=spot.hbx[c] }
            if(spot.hby[c]>hiy){ hiy=spot.hby[c] }	
            if(spot.hbz[c]>hiz){ hiz=spot.hbz[c] }
          } 
        }
        
        spot.lbx[sui]=lwx ,spot.lby[sui]=lwy ,spot.lbz[sui]=lwz	
        
        spot.hbx[sui]=hix	,spot.hby[sui]=hiy ,spot.hbz[sui]=hiz	
        
        //spot.grd[sui]=(hix-lwx)*(hix-lwx)+(hiy-lwy)*(hiy-lwy)+(hiz-lwz)*(hiz-lwz)	
        
        dmcheckspot(sui)
      } 
    }
  }


  var _lw3=[-1,-1,-1], _hi3=[-1,-1,-1]
  
  //returns sector bounds of bcelli with 
  //div and divm and lowp details from parents curdets 
  function note_implied_bnds(Isec,dvn,dvm,low) //checked
  { var xsec,ysec,zsec
    
    //this works
    var zz,yy=Math.floor(Isec/dvn[0])	
    zsec=Math.floor(yy/dvn[1])
    ysec=yy-(zz=zsec*dvn[1])
    xsec=Isec-(zz+ysec)*dvn[0]

    //return [low[0]+xsec*dvm[0],low[1]+ysec*dvm[1],low[2]+zsec*dvm[2]]
    
    _lw3[0]= low[0] + xsec*dvm[0] 
    _lw3[1]= low[1] + ysec*dvm[1]
    _lw3[2]= low[2] + zsec*dvm[2]
    
    _hi3[0]= low[0] + (xsec+1)*dvm[0]
    _hi3[1]= low[1] + (ysec+1)*dvm[1]
    _hi3[2]= low[2] + (zsec+1)*dvm[2]
        
    //hi-bounds are nudged prior to employment in loctosubs
    nudge_hi3()
    //~ if (_hi3[0]!==_lw3[0]+dvm[0]) { blog(_hi3[0],_lw3[0],dvm[0],_lw3[0]+dvm[0]) }
    //~ if (_hi3[1]!==_lw3[1]+dvm[1]) { blog(_hi3[0],_lw3[0],dvm[0],_lw3[0]+dvm[0]) }
    //~ if (_hi3[2]!==_lw3[2]+dvm[2]) { blog(_hi3[0],_lw3[0],dvm[0],_lw3[0]+dvm[0]) }
    
  }
  
  
  function note_true_bnds(Ax,Ay,Az,a,e){
    
    var i= dlns[a]
    var lwx=Ax[i], lwy=Ay[i], lwz=Az[i]
    var hix=Ax[i], hiy=Ay[i], hiz=Az[i] 

    for(var j=a+1; j<e; j++) // a+1? confirm safe
    { i= dlns[j]
      if(Ax[i]<lwx){ lwx=Ax[i] } else if(Ax[i]>hix) { hix=Ax[i] }
      if(Ay[i]<lwy){ lwy=Ay[i] } else if(Ay[i]>hiy) { hiy=Ay[i] }
      if(Az[i]<lwz){ lwz=Az[i] } else if(Az[i]>hiz) { hiz=Az[i] }	
    }
    
    _lw3[0]=lwx, _lw3[1]=lwy, _lw3[2]=lwz
    _hi3[0]=hix, _hi3[1]=hiy, _hi3[2]=hiz
    nudge_hi3()
    return
  }
   
   
  function nudge_hi3(){ //epsilb may be redunt
    _hi3[0]+=(Math.abs(_hi3[0])+_hi3[0]-_lw3[0])*epsila+epsilb
    _hi3[1]+=(Math.abs(_hi3[1])+_hi3[1]-_lw3[1])*epsila+epsilb
    _hi3[2]+=(Math.abs(_hi3[2])+_hi3[2]-_lw3[2])*epsila+epsilb	
  }
  
  var _lwx,_lwy,_lwz,_idvmx,_idvmy,_idvmz,_dvsx,_dvsxy
  ///
  function note_loctosubs(){ //0.999999999999999
    _idvmx=1/_divm[0] //no splodge with this value 
   ,_idvmy=1/_divm[1] //%celln location still advisable 
   ,_idvmz=1/_divm[2]
    _dvsx=_divn[0],_dvsxy=_divn[0]*_divn[1]
  }
  
  function loctosubcell(x,y,z)
  { return (
      floor((x- _lw3[0])*_idvmx)         //*1
    + floor((y- _lw3[1])*_idvmy)*_dvsx   //*1*x 
    + floor((z- _lw3[2])*_idvmz)*_dvsxy  //*1*x*y 
    ) 
  } 
  
  function loctosubcell_(x,y,z,lw,dvm,dvs) //unused optimised above
  { return (
      floor((x-lw[0])/dvm[0])                    //*1
    + floor((y-lw[1])/dvm[1])*dvs[0]             //*1*x 
    + floor((z-lw[2])/dvm[2])*dvs[0]*dvs[1]      //*1*x*y 
    ) 
  } 

  /// note_bestgrid
  ///
  // determines best cuboid division into submx childer 
  // prefering cubic childer. 
  // Calculates amount and lengths of resulting cuboids.
  var _bgridr=[0,0,0]
  function note_bestgrid(submx,cm){
    cm=cm||[_hi3[0]-_lw3[0],_hi3[1]-_lw3[1],_hi3[2]-_lw3[2]]
    
    _divm[0]=cm[0],_divm[1]=cm[1],_divm[2]=cm[2] 
    
    cm[0]*=1.2 //increase x division for assist double-sect-termination
    var r=sorti012(cm,_bgridr)
    cm[r[1]]/=cm[r[0]], cm[r[2]]/=cm[r[0]]
    
    var m=Math.pow((submx+0.15)/(cm[r[1]]*cm[r[2]]),0.33333333333333)
    cm[r[1]]*=m, cm[r[2]]*=m, cm[r[0]]=m
    
    var ic=(cm[r[0]]+0.5)|0; ic=ic<1?1:ic
    m=Math.sqrt(cm[r[0]]/ic)
    cm[r[2]]*=m,cm[r[1]]*=m,cm[r[0]]=ic
        
    ic=(cm[r[1]]+0.5)|0
    ic=ic<cm[r[0]]?cm[r[0]]:ic
    
    m=cm[r[1]]/ic
    cm[r[2]]=((cm[r[2]])*m)|0 , cm[r[1]]=ic
    
    if(cm[r[2]]<cm[r[1]]){ 
      cm[r[1]]=cm[r[2]],cm[r[2]]=ic
      if(cm[r[1]]==0){ cm[r[1]]=1 }
    }
    
    if(cm[r[2]]>submx){ cm[r[2]]=submx }
     
    _divn[0]=cm[0],_divn[1]=cm[1],_divn[2]=cm[2]
    _divm[0]/=_divn[0]
    _divm[1]/=_divn[1]
    _divm[2]/=_divn[2]
    
    return _divn[0]*_divn[1]*_divn[2]
  }
  
  function sorti012(m,r) //ret least<most 
  { if(m[0]<m[1])        //ugly optimsation
    { if(m[1]<m[2]){ r[0]=0,r[1]=1,r[2]=2 ;return r } 
      if(m[0]<m[2]){ r[0]=0,r[1]=2,r[2]=1 ;return r } 
      r[0]=2,r[1]=0,r[2]=1 ;return r } 
    if(m[0]<m[2]){ r[0]=1,r[1]=0,r[2]=2 ;return r } 
    if(m[1]<m[2]){ r[0]=1,r[1]=2,r[2]=0 ;return r } 
    r[0]=2,r[1]=1,r[2]=0 ;return r
  }

  ///helpers

  function nextkid(pr,k){
    return (spot.parent[++k]===pr)?k:0
  }

  function trunkkids(trunk){
    //simple could be fastest and usento cross check other
    var fc=spot.fchild[trunk] ,di=fc
    while( spot.parent[di]===0||spot.parent[di]===trunk||spot.parent[di]>=fc ){ di++ } 
    if(di>spot.fchild[trunk+1]) di=spot.fchild[trunk+1]
    return {ck:fc , ek:di} //ek is one beyond
  }

  function trunkkids_ii(trunk){
    var fc=spot.fchild[trunk] ,di=fc+1

    while( spot.parent[di]>=trunk ){
      while( spot.fchild[++di] ){ di=spot.fchild[di] }
    }
    
    return {ck:fc , ek:di} //ek is still one beyond
  }

  function firstnonzeroafter(spk){
    while((++spk)<spot.top&&spot.parent[spk]===0) {}
    return spk
  }
    
  function list_kin(dlni,ie){
    ie=ie||dlni
    var su=new Array()
    for(var s=1;s<_dsui;s++){
      var anc=spot.dln_anchor[s],en=spot.dln_span[s]+spot.dln_anchor[s]
      
      if(anc<=dlni&&en>=ie)
      { su.push(s) }
    }
    return su
  }


  var avgLc =[0.0, 0.0, 0.0]
  var avgVl =[0.0, 0.0, 0.0]
  var dfLc, gsz

  function endcellx(rst,rov,lv) //stub to test bilk_load
  { 
    var rr= Drand.gskip(0,0,1)
    var gg= Drand.gskip(0,0,1)
    var bb= Drand.gskip(0,0,1)
    
    for(var ri=rst; ri<rov; ri++)  //ds avg loc and avg vl
    { 
      var ii=dlns[ri]*3
      jote.bcolor[ii]=rr
      jote.bcolor[++ii]=gg
      jote.bcolor[++ii]=bb
    }	
  }

  function endspot(rst,rov,lv) //stub to test bulk_load
  { 
    //~ metary('leaflevs',lv)
  }
    

  function distrib_accel(){ 
    precipkids(1) 
  }
  
  function precipkids(par){ //
    
    if(par===0) { conlog("err 1231"); return }
    
    var kd,cx=spot.calcx[par],cy=spot.calcy[par],cz=spot.calcz[par]
    spot.calcx[par]= spot.calcy[par]= spot.calcz[par]= 0

    if(isNaN(cx)||isNaN(cy)||isNaN(cz)){
      conlogtrunks(par,"precip NANANA par=")
    }
    
    //if(cx||cy||cz){ //no check maybe faster...
      if(!(kd=spot.fchild[par])){ precipjotes(par,cx,cy,cz);return  }
          
      for(var k=kd ; k ; k=nextkid(par,k) )
      { 
        spot.calcx[k]+=cx
       ,spot.calcy[k]+=cy
       ,spot.calcz[k]+=cz }
    //}else{ metinc('precipskip'); }
    
    for(k=kd ; k ; k=nextkid(par,k) )
    { precipkids(k) }	
  }

  function conlogspots(a,e){
    for(var i=a||0, ee=e||spot.top; i<ee;i++) conlogspot(i)
  }
  
  function conlogspot(s){
    
    var cl="Spot:"+s
    cl+=" deep:"+spot.depth[s] 
    cl+=" anch:"+spot.dln_anchor[s]
    cl+=" span:"+spot.dln_span[s] 
    cl+=" pare:"+spot.parent[s] 
    cl+=" fchi:"+spot.fchild[s]+"\n" 
    if (spot.lbx[s]) {cl+=" lx:"+spot.lbx[s].toFixed(9)} else {cl+=" lx:undef"}
    if (spot.lby[s]) {cl+=" ly:"+spot.lby[s].toFixed(9)} else {cl+=" ly:undef"}
    if (spot.lbz[s]) {cl+=" lz:"+spot.lbz[s].toFixed(9)} else {cl+=" lz:undef"}
    if (spot.hbx[s]) {cl+=" hx:"+spot.hbx[s].toFixed(9)} else {cl+=" hx:undef"}
    if (spot.hby[s]) {cl+=" hy:"+spot.hby[s].toFixed(9)} else {cl+=" hy:undef"}
    if (spot.hbz[s]) {cl+=" hz:"+spot.hbz[s].toFixed(9)} else {cl+=" hz:undef"}
    
    conlog(cl)
  }

  function zerotrunk(s){
    var tkids=trunkkids(s)
    conlog("Zeroing branches of",s,"from",tkids.ck,"to",tkids.ek)
    for(var si = tkids.ck; si<tkids.ek+1;si++) spot.parent[si]=0
    conlog("Aftertrunk:")
    conlogspot(tkids.ek+1)
  }

  function conlogtrunks(s,str){
    if(str){conlog(str, "Trunks:",s)}else {conlog("Trunkspot:",s)}
    
    conlogspot(s)
    
    var tkids=trunkkids(s)
    
    conlog("PreBranch of",s," is ",tkids.ck-1)
    conlogspot(tkids.ck-1)
    conlog("Branches of",s,"are",tkids.ck,"to <",tkids.ek)
    for(var si = tkids.ck; si<tkids.ek;si++) conlogspot(si)
    conlog("AftBranch:",tkids.ek)
    conlogspot(tkids.ek)
  }
  
  function conlogtrunk(s){
    var tkids=trunkkids(s)
    conlog("Trunks of",s,"are",tkids.ck,"to",tkids.ek-1,"inclusive")
    //~ for(var si = tkids.ck; si<tkids.ek+1;si++) conlogspot(si)
    conlogspot(tkids.ck)
    conlog("Aftertrunk:")
    conlogspot(tkids.ek) //ek is after
   
  }
  
  function precipjotes(s,cx,cy,cz){
     
    for(var c=spot.dln_anchor[s], e=c+spot.dln_span[s] ; c<e; c++ )
    { 
      if(isNaN(jote.qx[dlns[c]])||isNaN(jote.qy[dlns[c]])||isNaN(jote.qz[dlns[c]])){
        conlog("precip NANANA LEAF=",s,jote.qx[dlns[c]],jote.qy[dlns[c]],jote.qz[dlns[c]] )
        conlogspot(s)
      }
      jote.qx[dlns[c]]+=cx
      jote.qy[dlns[c]]+=cy
      jote.qz[dlns[c]]+=cz
    }
  }
  
  function acceltovel(){
    for(var j=0, je=jote.top ; j<je ; j++ )
    { 
      //~ see no momentum...its wacky
      //~ jote.vx[j]=jote.qx[j], jote.qx[j]=0
      //~ jote.vy[j]=jote.qy[j], jote.qy[j]=0
      //~ jote.vz[j]=jote.qz[j], jote.qz[j]=0

      //note that accel is preadjusted to timestamp 
      //bad? a few xtra multis in the force funs
      jote.vx[j]+=jote.qx[j]; jote.qx[j]=0
      jote.vy[j]+=jote.qy[j]; jote.qy[j]=0
      jote.vz[j]+=jote.qz[j]; jote.qz[j]=0
    }
  }
  
  var ctrunk=0,_bmpspot=0

  function tendto_spotmap(){
        
    //~ var trunksi=[ 
      //~ 0,8,0,1,0,3,0,4 ,0,2,0,6,0,1,0,3
     //~ ,0,8,0,2,0,5,0,1 ,0,3,0,1,0,7,0,2 
    //~ ] //9 is actually hottest, so tsi = 8-these
    var trunksi=[ 
      0,-1,8,-1,0,-1,1,-1,0,-1,3,-1,0,-1,4,-1 ,0,-1,2,-1,0,-1,6,-1,0,-1,1,-1,0,-1,3,-1
     ,0,-1,8,-1,0,-1,2,-1,0,-1,5,-1,0,-1,1,-1,0,-1,3,-1,0,-1,1,-1,0,-1,7,-1,0,-1,2,-1 
    ] //9 is actually hottest, so tsi = 8-these
      
    var pad=0.15, trunkn=10       //pad factor for spot ids
    
    checks("beforebloom")
        
    if(spot.top===0){
      makeroot(jote.top) //makes spot 0 and 1
      
      //init trunk vals
      ctrunk=5  //makes trunks 0 to 9 = spots 2 to 11
      
      rebudbyvelo(
        //10 buds, from si1 fchild2 par= writepar
        //wpar is par 
        1       //parspot   source
       ,1       //wparspot  foster
       ,0       //extrapars extrasrc
       ,trunkn  //kidn
       ,2       //startkid _dsui
      )
      
      spot.fchild[1]=2
      _bmpspot=spot.top=_dsui 
      
      for(var t=2; t<2+trunkn; t++){
        conlog("bmpa",_bmpspot)
        bloombyspace(t)
        //~ conlogspot(t) 
        conlog("bmpb",_bmpspot)
        //fchilds are by default written to _dsui
        //which could be fine here 
      }
      conlog("donethat")
      
      //after this ,cap the spot sequence
      spot.top=_dsui
      spot.parent[_dsui]=0 //parent of top zeroed
      
      //reduce maxcelldiv slightly
      
    }else{
      //~ return
      //~ 
      
      ctrunk=(++ctrunk)%(trunksi.length)
      var cspot=trunksi[ctrunk]+2, extr=1

      if(cspot===1){
        //~ conlog("doing 2 _ds ds",_dsui,spot.fchild[2],spot.fchild[3])
        if(false){}else{
        
        rebudbyvelo(
          2  //parspot   source
         ,1  //wparspot  foster
         ,0  //extrapars extrasrc
         ,1  //kidn
         ,2  //dsui for budvelo 
        )
        
        _bmpspot = spot.fchild[3]
        _dsui=spot.fchild[2]
        //~ conlogspot(2) 
        
        bloombyspace(2)
        for( ; _dsui<_bmpspot; _dsui++){ spot.parent[_dsui]=0 }
      
        }//disabled
        
      }else{ 
      
      //~ conlogspot(cspot) 
      //~ conlogspot(cspot+1) 
      //~ conlogspot(cspot+2) 
            
      rebudbyvelo( //this fucks fchilds - yes somehow?
        //2 spots onto 2spots
        // wpar is not par
        cspot  //parspot   source
       ,1      //wparspot  foster
       ,1      //extrapars extrasrc
       ,2      //kidn
       ,cspot  //this SETs _dsui (for budvelo) 
      )

      var cbran1=spot.fchild[cspot+1]
      _bmpspot = cbran1

      conlog("veloed:")
      //~ conlogspot(cspot) 
      //~ conlogspot(cspot+1) 
      //~ conlogspot(cspot+2) 


      var cbran2
      
      
      conlog("bloom 2spots:",cspot,"due:",_dsui,"bmp:",_bmpspot,"top:",spot.top)
      _dsui=spot.fchild[cspot]
      
      bloombyspace(cspot)
      
      conlog("bloomed:")
      //~ conlogspot(cspot) 
      //~ conlogspot(cspot+1) 
      //~ conlogspot(cspot+2) 

      for( ; _dsui<cbran1; _dsui++){ spot.parent[_dsui]=0 }
      spot.fchild[cspot+1]=_dsui //this may be automatic
      
      cbran2=_bmpspot = (cspot<10)? spot.fchild[cspot+2] : spot.top
      
      conlog("bloom 2spots:",cspot+1,"due:",_dsui,"bmp",_bmpspot,"top",spot.top)
      bloombyspace(cspot+1)
      
      for( ; _dsui<cbran2; _dsui++){ spot.parent[_dsui]=0 } 
      //invalidate the duff, or perhaps just the next
      }
      
    }
    
    checks("afterbloom")
    
    startwatch('measure')
    measure_spots()
    stopwatch('measure')

    //~ checks("aftermeasure")
    //~ logmeters()
    //~ meterspots() 
    return 
  }

  function postfit_spotmap(){ 
    checks("beforedistrib")
    distrib_accel()
    acceltovel()
    checks("afterdistrib")
  }
  
  var dlnco=[] 
  function checks(h){
    return
    var nowco=[]
    if(dlnco.length){
      for(var ji=0;ji<_jtlen;ji++){
        if((!(dlns[ji] in nowco)) ||!nowco[dlns[ji]]){ nowco[dlns[ji]]=1 }
        else{ nowco[dlns[ji]]++; }
      } 
      
      var nwco=""
      for(var ji=0;ji<_jtlen;ji++){
        if(nowco[dlns[ji]]!==dlnco[dlns[ji]]){
          nwco+=" di:"+ji+" ji:"+dlns[ji]+" nb:"+nowco[dlns[ji]]+" bn:"+dlnco[dlns[ji]]
        }
      } 
      if(nwco){ conlog(h,"dln problem! ",nwco) ; meterspots()}
    }else{
      for(var ji=0;ji<_jtlen;ji++){
        if((!(dlns[ji] in dlnco)) ||!dlnco[dlns[ji]]){ dlnco[dlns[ji]]=1 }
        else{ dlnco[dlns[ji]]++ ;if(dlns[dlns[ji]]>1) {conlog("h,dln iniproblem! ",ji)} } 
      } 
    }
    
    var cks=""
    for(var ji=0;ji<_jtlen;ji++)
    { if(isNaN(jote.vx[dlns[ji]])||isNaN(jote.vy[dlns[ji]])||isNaN(jote.vz[dlns[ji]])) cks+=" JoNaNVxyz:"+ji 
      if(isNaN(jote.qx[dlns[ji]])||isNaN(jote.qy[dlns[ji]])||isNaN(jote.qz[dlns[ji]])) cks+=" JoNaNQxyz:"+ji
    }
    
    for(var si=0;si<spot.top;si++){
      if(isNaN(spot.calcx[si])||isNaN(spot.calcy[si])||isNaN(spot.calcz[si])) cks+=" SpNaNCalcxyz:"+si
    }
    
    if(cks!=="") conlog("NaNz!!! HERE:",h,cks)
  }
    
  var conlog2=nullfunc
  conlog=nullfunc
    
  fig.checks  = checks
  fig.tendto_spotmap  = tendto_spotmap
  fig.postfit_spotmap = postfit_spotmap
  fig.bulk_load = bulk_load
  fig.measure_spots = measure_spots
  fig.bimeasure_spots = bimeasure_spots
  fig.distrib_accel = distrib_accel
  fig.acceltovel = acceltovel
  fig.spot = spot
  fig.dlns = dlns
  
  window.conlogspots = conlogspots
  window.conlogspot = conlogspot
  window.zerotrunk = zerotrunk
  window.conlogtrunk = conlogtrunk
  window.conlogtrunks = conlogtrunks
  
  return fig

}
