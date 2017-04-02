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
  
  var metlistspots = 0 //a dumb raw listing of spots,parent,child 
  
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
    
    var tria=(_dsui*(_dsui-1))*0.5
    console.log("Telling of spots:",_dsui,"sppairs:",tria,"leafs:",lefs,"lfpairs:",lefp)
    console.log(mrecs)
    
    for(p in metrec){
      if((metrec[p].length)) { console.info(":"+p,metrec[p]); metrec[p]=[] }
    } 
        
    //~ console.log("heavy spots",list_kin(spot0))
    if(metlistspots)for(var s=0;s<_dsui;s++){
      console.log(
       "ui:",s,"lvl:",spot.depth[s],"par:",spot.parent[s]
       ,"chld:",spot.fchild[s],"g:",spot.grm[s]
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
    
    var logline=[],logmat=[]
    var jotp=jote.top, jotp=jotp<75?jotp:75
    for(var j=0;j<jotp;j++){ logline[j]=" "} //empty line
    
    for(var sui=1,spd=spot.deep; spd>-1; sui++){ /// or spd>0 ??
      
      if(sui===spot.top){ 
     
        logmat.push(logline.join(""))
        sui=1;spd--
        for(var j=0;j<jote.top;j++){ logline[j]=" " } //clear line
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
    console.log("spotstuff:")
    for(var j=logmat.length-1;j>=0;--j){ console.log(logmat[j]) }
  }

  metinc=metary=logmeters=meterspots=nullfunc
 
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
     spot.deep= 0 
     spot.top= 0 
     spot.max= maxsp
     spot.depth         = new Uint8Array(maxsp)
     spot.dln_anchor    = new Uint16Array(maxsp)
     spot.dln_span      = new Uint16Array(maxsp)
     spot.parent = new Uint16Array(maxsp)
     spot.fchild = new Uint16Array(maxsp) //defered runtime calculation
     // first child writes this to parent when level sweeping 
      
     spot.lbx = new Float64Array(maxsp)  //low bound x
     spot.lby = new Float64Array(maxsp)
     spot.lbz = new Float64Array(maxsp)
     
     spot.hbx = new Float64Array(maxsp)  //high bound x
     spot.hby = new Float64Array(maxsp)
     spot.hbz = new Float64Array(maxsp)
     
     spot.grd = new Float64Array(maxsp)  //spot diagonal
     
     spot.grm = new Float64Array(maxsp)  //gravity mass
     spot.grx = new Float64Array(maxsp)  //center gravity x
     spot.gry = new Float64Array(maxsp)
     spot.grz = new Float64Array(maxsp)
     
     spot.calcx = new Float64Array(maxsp) //spot calculation registers
     spot.calcy = new Float64Array(maxsp)
     spot.calcz = new Float64Array(maxsp)
    
  }

  var spot = {}
  setspotmax(100)

  var cell_at_dlsi = new Uint16Array (jote.x.length) 
  //contains dvoxs of jts in dsline section
  //Uint8 would fit max of 256 subvoxs but not larger 
  //and may involve a cast from addresses by voxid
  
  var jcach_dlsq = new Uint16Array(jote.x.length)//contains jote who is at dsline.pos
  var dlns       = new Uint16Array(jote.x.length)//jotes in a vox delineation seq

  var _divn=[ -1, -1, -1 ]  //grid division vector
  var	_divm=[ -1, -1, -1 ]  //grid div measure vector

  //25 to 45 working best
  var max_subcell = 30     //max subdivision of space per iteration
  //5 to 10 working best
  var endsize=7            //endspot must be smaller than this population
    
  // max_subcell=30,endsize=7 performing best 
  // making approx 35% many spots as jotes
  
  ///Cell recursion detail object:Survo notes per level*sbvox
  // caches the recursively used details of cells
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
    ej=topcell(ej)
        
    if(ej < endsize)
    { endspot( spot.dln_anchor[1], spot.dln_anchor[1]+spot.dln_span[1] ) }
    else
    { digest_spot( 1 )	}  // (lvlnum,cellnum)
    
  }
  
  //surveys vox then loops through all subvoxs, calculating their jtpopuls
  //from their sDls stored in recursivedet.cellanchor[svxi]
  //it recurses into oversized
  //it endcurses smallersized
  
  function digest_spot( bsid ) 
  { 
    var bpop=spot.dln_span[ bsid ]
    //conlog("bcl_lv",bcl_lv,"i",bcelli,"cellsize",bpop)
    
    if(spot.depth[bpop]>18){ enddeep(bpop); return }
    
    var celln_trgt= floor(2+(bpop/endsize)*Drand.range(0.5,1))
    if(celln_trgt>max_subcell) { celln_trgt=max_subcell-1; }
    
    survey_spot( bsid, celln_trgt ) //makes ~n spots, 'under' bsid 
    for(var si=spot.fchild[bsid]; spot.parent[si]===bsid; si++) 
    { 
      
      if(spot.dln_span[si]>endsize)
      { digest_spot( si ) }
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

  function topcell(ej)
  { 
    _dsui=1  //sui 0 is null
    
    var i=0,en=0
    for( i=0; i<ej; i++)
    { if(isFinite(jote.x[i]+jote.y[i]+jote.z[i])){ dlns[en++]=i } }

    spot.depth[0]=0
    spot.depth[_dsui]=1
    spot.dln_anchor[_dsui]=0
    spot.dln_span[_dsui]=en
    spot.parent[_dsui]=0 
    spot.fchild[_dsui]=1 
    
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
  
  var dlns   //The full delineation sequence jotes arranged into spot lines,
             //which have st, end pos, properties recorded in spot

  //workspace of surveying function
  var jtcdlsa = new Uint16Array(jote.top) //avails start index of jotes cell in a dlsline
  var cellppl = new Uint16Array(max_subcell) //records quantity of jotes in cells
  var cellppl2 = [] //records quantity of jotes in cells
  var celfill = new Uint16Array(max_subcell) //counts fill of cells while filling dlsline
  var cell_at_dlsi  //contains cell of jote at [dlsi]
  var jcach_dlsq    //contains direct index of jote at [dlsi]

  function survey_spot( psi, cellnb ) // 
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
    var cel , sn=ov-st
          
    //configure loc_to_subcell function with curdets
    note_loctosubs()
     
    if(celln>max_subcell) { metinc('celln_err')}
       
    //reset all potential cellppls 
    for(var i=0; i<=celln; i++) { celfill[i]=0; cellppl[i]=0 }
    
    var ncheck=0

    //loop through stretch to make note of members sectors
    for(var uri=st; uri<ov; uri++) 
    { cel=Math.abs(loctosubcell(
        jote.x[dlns[uri]], jote.y[dlns[uri]], jote.z[dlns[uri]]
      ))//%celln //seems unnecessary, Math.abs(cel)%celln or (cel+celln*celln)%celln
      
      if(!(cel>=0&&cel<=celln)) { 
        metary("outsurvey", {'spot':psi,'cel':cel,'uri':uri,x:jote.x[dlns[uri]]
          ,y:jote.y[dlns[uri]], z:jote.z[dlns[uri]],low:_lw3,hi:_hi3} ) }
    
      jcach_dlsq[uri]= dlns[uri] //cache the section of dlns
      cell_at_dlsi[uri]= cel    //the dwnsector of the jote in the line
      cellppl[cel]++           //population of cel
      cellppl2[cel]=1
      
    }
    
    var chk=0
    for(var tt=0;tt<cellppl.length;tt++) { chk+=cellppl[tt] }
    
    //test if only one cell filled, if true scan bounds and rescan before continue
    //make sure surv_lev bounds are set correctly
    
    var fulls=0
    for(var c=0; fulls<2 && c<celln; c++) { if(cellppl[c]!==0){ fulls++ } }
    if(fulls<2)
    { 
      note_true_bnds(jote.x, jote.y, jote.z, st,ov) //_lw3 and _hi3 is set
      for(var i=0; i<=cellnb; i++) { celfill[i]=0; cellppl[i]=0 }
      
      if( abs(_lw3[0]-_hi3[0])<epsilb 
      &&  abs(_lw3[1]-_hi3[1])<epsilb 
      &&  abs(_lw3[2]-_hi3[2])<epsilb )
      { //a singularity hehe 
        //split..  set divn and m too..
        metinc('cellsingularity')
        celln=cellnb
        _divm[0]=_divm[1]=_divm[2]= 0
        _divn[0]=celln, _divn[1]=_divn[2]=1 
        
        for(var uri=st; uri<ov; uri++) 
        { cel=floor((cellnb*(uri-st))/sn)
          cell_at_dlsi[uri]= cel 
          cellppl[cel]++
        }
      }else{
        //~ metinc('cellshrink')
        celln=note_bestgrid(cellnb) //sets _divn and _divm
        note_loctosubs()
        //celln=_divn[0]*_divn[1]*_divn[2]
        for(var uri=st; uri<ov; uri++) 
        { cel=Math.abs(loctosubcell(   //redoing subloc with new bounds
            jote.x[dlns[uri]], jote.y[dlns[uri]], jote.z[dlns[uri]]
          ))//%celln //seems unnecessary 
          if(cel<0||cel>=celln) { 
            metary("Zoutsurvey", {'cel':cel,x:jote.x[dlns[uri]], 
              y:jote.y[dlns[uri]], z:jote.z[dlns[uri]],low:_lw3,hi:_hi3} ) }
          cell_at_dlsi[uri]= cel  //the dwnsector of the jote in the line
          cellppl[cel]++          //population of cel
        }
      }
    }
      
    if(celln!==_divn[0]*_divn[1]*_divn[2])
    { metary("divn_prob",{clevel:clv,det:surv_lev[clv]}) }
    // each of st to ov in dlns, 
    // sector is noted in cell_at_dlsi, 
    // tacki is note in jcach_dlsq
    
    var cellanchor=[]
    var uca=st                            //upcell anchor position in dlns
    for(var ccel=0; ccel<=celln; ccel++)  //loop through cells to note dls anchors
    { cellanchor[ccel]=uca; uca+=cellppl[ccel]; }
    
    for( uca=st; uca<ov; uca++)           //loop through jotes to slot after anchors
    { cel=cell_at_dlsi[uca] 
      dlns[ cellanchor[cel] + (celfill[cel]++) ]
        =jcach_dlsq[uca] 
    }
    
    //curdets note cells lvl, size and expected size of children, children may redefine
    //their own sizes and expected sizes of their children
    //spot sizes are not calculated until level up
    //cells are only concerned with comprehensively covering instantaneous position of
    //jotas
  
    var bw3=[_lw3[0],_lw3[1],_lw3[2]], firstc=1
    var clv=spot.depth[psi]+1
    
    for(var ccel=0; ccel<celln; ccel++)  //loop through cells to note spotdets
    { if(cellppl[ccel]){
        
        //~ surv_lev[clv].sui[ccel]=_dsui 
        
        if(firstc){ spot.fchild[psi]=_dsui ; firstc=0 }
        spot.parent[_dsui]=psi
        spot.fchild[_dsui]=0
        
        spot.depth[_dsui]=clv
        spot.dln_anchor[_dsui]=cellanchor[ccel]
        spot.dln_span[_dsui]=cellppl[ccel]
        
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
    spot.parent[_dsui]=256*128 //test hack fix
  
  }
  

  function dln_end(sx){
    while( spot.parent[sx]!==spot.parent[sx+1])
    { sx=spot.parent[sx] }
    
    return sx?spot.dln_anchor[sx+1]:_jtlen 
  } 

  function apre_load(){ //just notes spot deep now
    spot.top=_dsui
    spot.deep=0
        
    for(var sui=1;sui<spot.top;sui++){
      //~ spot.fchild[ sui ]=0
      if(spot.depth[sui]>spot.deep){ 
        spot.deep=spot.depth[sui] 
      }
    }
    spot.parent[spot.top]=0; //clean after end spot
    
    //~ for(var sui=1;sui<spot.top;sui++){
      
      //~ if(spot.fchild[ spot.parent[sui] ]===0){
        //~ spot.fchild[ spot.parent[sui] ]=sui
      //~ } //sui 0 is null
    //~ }
        
  }
  
  function measure_spots(){ //without vel for force
    
    var lwx,hix, lwy,hiy, lwz,hiz
    var cgx,cgy,cgz,cmass_tot
   
    //could make a multidimension array for this of
    //spotat[lv][sui] and spotnat[lv] to stop redundant sweeps
    //(sparse js created arrays) 

    for(var sui=1,spd=spot.deep; spd>-1; sui++){ /// or spd>0 ??
      
      if(sui===spot.top){ sui=1;spd-- } //1 redundant test when sui=1,spd=-1
      
      if(spot.depth[sui]===spd){
        
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
        //~ spot.grx[sui]=(lwx+hix)/2	
        //~ spot.gry[sui]=(lwy+hiy)/2	
        //~ spot.grz[sui]=(lwz+hiz)/2	
        
        spot.lbx[sui]=lwx	,spot.lby[sui]=lwy	,spot.lbz[sui]=lwz	
        spot.hbx[sui]=hix	,spot.hby[sui]=hiy	,spot.hbz[sui]=hiz	
        
        spot.grd[sui]=(hix-lwx)*(hix-lwx)+(hiy-lwy)*(hiy-lwy)+(hiz-lwz)*(hiz-lwz)	
        
        //~ dmcheckspot(sui)
      } 
    }
  }

  function bimeasure_spots(tms){ //with vel for collision
    
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
    
    cm[0]*=1.2 //increase x division for assist double-cell-termination
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

  function trunkkids_x(trunk){
    //simple could be fastest and usento cross check other
    var fc=spot.fchild[trunk] ,di=fc
    while( spot.parent[di]>=fc ){ di++ } 
    
    return {ck:fc , ek:di}
  }

  function trunkkids(trunk){
    var fc=spot.fchild[trunk] ,di=fc+1

    while( spot.parent[di]>=fc ){
      while( spot.fchild[++di] ){ di=spot.fchild[di]+1 }
    }
    
    return {ck:fc , ek:di}
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

  function endcellx(rst,rov,lv) //stub to test bulk_load
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
    
    var kd,cx=spot.calcx[par],cy=spot.calcy[par],cz=spot.calcz[par]
    spot.calcx[par]= spot.calcy[par]= spot.calcz[par]= 0

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

  function precipjotes(s,cx,cy,cz){
     
    for(var c=spot.dln_anchor[s], e=c+spot.dln_span[s] ; c<e; c++ )
    { jote.qx[dlns[c]]+=cx
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
  
  var _runs=0

  function prefit_spotmap(){
    if(_runs++%5===0){
      startwatch('load') 
      bulk_load()
      apre_load()
      stopwatch('load')
      meterspots() 
    }
    startwatch('measure')
    measure_spots()
    stopwatch('measure')
    
    logmeters()

  }

  function postfit_spotmap(){ 
    distrib_accel()
    acceltovel()
  }
  
  fig.prefit_spotmap  = prefit_spotmap
  fig.postfit_spotmap = postfit_spotmap
  fig.bulk_load = bulk_load
  fig.measure_spots = measure_spots
  fig.bimeasure_spots = bimeasure_spots
  fig.distrib_accel = distrib_accel
  fig.acceltovel = acceltovel
  fig.spot = spot
  fig.dlns = dlns
  
  return fig

}
