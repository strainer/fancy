// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// tree data index, recursively linked nested spatial groups of jotes
 
function addSpotmap(fig,vplay) { 
  'use strict'
    
  var jote=fig.jote 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
  
  var epsila=Math.pow(0.5,51)
  var epsilb=Math.pow(0.5,43)


  //-------------
  
  var spot
 
  function setspotmax(maxsp){

    if(!spot){
      spot={}
      spot.deep = 0 
      spot.top  = 0 
      spot.dlntop = 0
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

  setspotmax(100)

  var _dsui=1    //due sui, 0 is not valid 

  var _divn=[ -1, -1, -1 ]  //grid division vector
  var	_divm=[ -1, -1, -1 ]  //grid div measure vector

  //25 to 45 working best
  var max_subspot = 40     //max subdivision of space per iteration
  //5 to 10 working best
  var endsize=7            //endspot must be smaller than this population
    
  // max_subspot=30,endsize=7 performing best 
  // making approx 35% many spots as jotes 

  
  var trunkn=7 , trunksi=makeshuffleix(trunkn)
  var ctrunk=0,_bmpspot=0
   
  function tendto_spotmap(){
        
    //~ var trunksi=[ 
     //~ ,0,-1,8,-1,0,-1,2,-1,0,-1,5,-1,0,-1,1,-1,0,-1,3,-1,0,-1,1,-1,0,-1,7,-1,0,-1,2,-1 
    //~ ] //0 is the hottest spot, -1 is magic for do spot 0 alone 
    
    //~ checkspots("beforebloom")
            
    if(spot.top===0){
      makeroot(jote.top) //makes spot 0 and 1
      
      ctrunk=0  //makes trunks 0 to 9 = spots 2 to 11
      
      rebudbyvelo( //wpar,akid,xkids,dkidn,dsui
        1       //wpar
       ,1       //akid
       ,0       //xkids
       ,trunkn  //dkidn
       ,2       //dsui
      )
      
      spot.fchild[1]=2
      _bmpspot=spot.top=_dsui
      //~ console.log("inibump",_dsui)
       
      var bui=_dsui
      for(var t=2; t<2+trunkn; t++){
        bloombyspace(t)
        if(t<(1+trunkn)){
          var trnx=Math.floor(1+(_dsui-bui)*0.125)
          
          shovespots(trnx)
          bui=_dsui+=trnx
        }
        //fchilds are by default written to _dsui
        //which could be fine here 
      }
      
      //after this ,cap the spot sequence
      spot.top=_dsui
      spot.parent[_dsui]=0 //parent of top zeroed
      
      //~ conlogspots(0,56)
      //~ console.log("-------------------------")
    }else{
      
      ctrunk=(++ctrunk)%(trunksi.length)
      var cspot=trunksi[ctrunk], extr=1

      if(cspot===-1){
        
        rebudbyvelo(
          1  //wpar
         ,2  //akid 
         ,0  //xkids
         ,1  //dkidn 
         ,2  //dsui 
        )

        _bmpspot = spot.fchild[3]||spot.top
        _dsui=spot.fchild[2]
        //~ conlogspot(2) 
        
        bloombyspace(2)
        for( ; _dsui<_bmpspot; _dsui++){ spot.parent[_dsui]=0 }

      }else{ 
      
        //~ console.log("redoing these:")
        //~ conlogspots([cspot,cspot+1])
        cspot+=2
        rebudbyvelo( 
          //2 spots onto 2spots
          // wpar is not par
          1        //wpar
         ,cspot    //akid
         ,1        //xkids
         ,2        //dkidn
         ,cspot    //this SETs _dsui (for budvelo) 
        )
        
        var cbran1= _bmpspot =spot.fchild[cspot+1]
        
        _dsui=spot.fchild[cspot]
        
        //~ console.log("bloom cspot",cspot,"bmp",_bmpspot,"dsu",_dsui)
        
        bloombyspace(cspot)
        
        for( ; _dsui<cbran1; _dsui++){ spot.parent[_dsui]=0 }
        spot.fchild[cspot+1]=_dsui //this may be automatic
        
        var cbran2=_bmpspot = (cspot+2<(trunkn+2))? spot.fchild[cspot+2] : spot.top
        
        //~ console.log("bloom 2spots:",cspot+1,"due:",_dsui,"bmp",_bmpspot,"top",spot.top)
        //~ if(spot.parent[6]!==0){ console.log("pazgood") } 
        
        //~ console.log("spot:",cspot,"dsui:",_dsui,"bmp:",_bmpspot)
        
        bloombyspace(cspot+1)
        
        //~ if(spot.parent[6]===0){ console.log("pazbad") } 
        
        for( ; _dsui<cbran2; _dsui++){ spot.parent[_dsui]=0 } 
        //invalidate the duff, or perhaps just the next
      }
      
    }
    
    //~ checkspots("afterbloom")
    
    startwatch('measure')
    measure_spots()
    stopwatch('measure')

    //~ checkspots("aftermeasure")
    //~ logmtrs()
    //~ meterspots() 
    return 
  }
    
  
  
  //surveys spot then loops through all subspots, 
  //calculating their jtpopuls
  //it recurses into oversized
  //it endcurses smallersized
  
  function bloombyspace( bsi ) 
  { 
    var bpop=spot.dln_span[ bsi ]
    
    if(spot.depth[bpop]>18){ endtoodeep(bpop); return }
    
    var subn_trgt= floor(2+(bpop/endsize)*Drand.range(0.5,1))
    if(subn_trgt>max_subspot) { subn_trgt=max_subspot-1; }
    
    budbyspace( bsi, subn_trgt ) //makes ~n spots, 'under' bsi 
    for(var si=spot.fchild[bsi]; spot.parent[si]===bsi; si++) 
    { 
      
      if(spot.dln_span[si]>endsize)
      { bloombyspace( si ) }
      else
      { 
        endspot( spot.dln_anchor[si], spot.dln_anchor[si]+spot.dln_span[si] )
        //~ mtlogcn('sngl_end')
      }
    }
  }
  
  function endtoodeep(bpop){
    //~ mtlogcn("cellsoverdeep")
  
    var ak=spot.dln_anchor[bpop],ek=ak+spot.dln_span[bpop]
    
    endspot( ak,ek,spot.depth[bpop] )
    
    var q=[]
    for(var i=ak;i<ek;i++ ){ 
      var j=dlns[i]
      q.push(","+jote.x[j]+" "+jote.y[j]+" "+jote.z[j]+" ") 
    } 
    //~ mtlogar('odeepjts',q)
    //~ mtlogar('odeepdets',surv_lev[bcl_lv])	
  }

  var _tfirst=true
    
  function makeroot(ej)
  { 
    _dsui=1  //sui 0 is null
    
    var i=0,en=0
    if(_tfirst){
      
      for( var i=0; i<ej; i++)
      { if(isFinite(jote.x[i]+jote.y[i]+jote.z[i])){ dlns[en++]=i } }

      var spotfac=0.7
      var spm=Math.floor( 50+(en)*spotfac )
      if( spot.max<spm*0.9 || spot.max>spm*2 ){
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
            
    //~ conlogspot(1) 
            
    _dsui++
            
    return spot.dlntop=en
  } 
  
  //
  
  
  //workspace of surveying function
  var sectppl = new Uint16Array(max_subspot) //records quantity of jotes in sects
  var secfill = new Uint16Array(max_subspot) //counts fill of sects while filling dlsline
  var sect_at_dlsi =[]  //contains sect of jote at [dlsi]
  var velo_at_dlsi =[]  //contains sect of jote at [dlsi]
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
    
    var celln=note_bestgrid(cellnb) //sets _divn and _divm
    var cel=0
     
    if(_dsui+celln+1 >= _bmpspot){
      //~ conlog("calc shove _dsui",_dsui,"celln",celln,"_bmpspot",_bmpspot)
      var shv=Math.floor((_dsui+celln-_bmpspot+3))
      //~ mtlogar('shoves',{top:spot.top,nxtsi:_dsui,mv:shv,clshi:_bmpspot,pari:psi} )
      shovespots(shv)
    }
          
    //configure loc_to_subcell function with curdets
    prep_loctosub()
     
    //~ if(celln>max_subspot) { mtlogcn('celln_err') }
       
    //reset all potential cellppls 
    for(var i=0; i<=celln; i++) { secfill[i]=0; sectppl[i]=0 }
    
    var ncheck=0
    
    //loop through stretch to make note of members sectors
    for(var dli=st; dli<ov; dli++) //dlnseq id (pos) 
    { cel=Math.abs(loctosubcell(
        jote.x[dlns[dli]], jote.y[dlns[dli]], jote.z[dlns[dli]]
      ))//%celln //seems unnecessary, Math.abs(cel)%celln or (cel+celln*celln)%celln
      
      if(!(cel>=0&&cel<=celln)) { 
        conlog("Bad Cellns!")
        var jj=dlns[dli]
        mtlogar("outsurvey", {
          'spot':psi,'cel':cel,'dli':dli,'joi':jj
          ,x:jote.x[jj] ,y:jote.y[jj], z:jote.z[jj]
          ,lx:_lw3[0] ,ly:_lw3[1] ,lz:_lw3[2] 
          ,hx:_hi3[0] ,hy:_hi3[1] ,hz:_hi3[2] } 
        ) 
        logmtrs(spot)
        conlogspot(psi) 
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
      note_true_bnds(jote.x, jote.y, jote.z, st,ov) //_lw3 and _hi3 is set
      for(var i=0; i<=cellnb; i++) { secfill[i]=0; sectppl[i]=0 }
      
      if( abs(_lw3[0]-_hi3[0])<epsilb 
      &&  abs(_lw3[1]-_hi3[1])<epsilb 
      &&  abs(_lw3[2]-_hi3[2])<epsilb )
      { //a singularity hehe 
        //split..  set divn and m too..
        mtlogcn('cellsingularity')
        celln=cellnb
        _divm[0]=_divm[1]=_divm[2]= 0
        _divn[0]=celln, _divn[1]=_divn[2]=1 
        
        for(var dli=st; dli<ov; dli++) 
        { cel=floor((cellnb*(dli-st))/sn)
          sect_at_dlsi[dli]= cel 
          sectppl[cel]++
        }
      }else{
        //~ mtlogcn('cellshrink')
        celln=note_bestgrid(cellnb) //sets _divn and _divm
        prep_loctosub()
        //celln=_divn[0]*_divn[1]*_divn[2]
        for(var dli=st; dli<ov; dli++) 
        { cel=Math.abs(loctosubcell(   //redoing subloc with new bounds
            jote.x[dlns[dli]], jote.y[dlns[dli]], jote.z[dlns[dli]]
          ))//%celln //seems unnecessary 
          //~ if(cel<0||cel>=celln) { 
            //~ mtlogar("Zoutsurvey", {'cel':cel,x:jote.x[dlns[dli]], 
              //~ y:jote.y[dlns[dli]], z:jote.z[dlns[dli]],low:_lw3,hi:_hi3} ) }
          sect_at_dlsi[dli]= cel  //the dwnsector of the jote in the line
          sectppl[cel]++          //population of cel
        }
      }
    }
      
    //~ if(celln!==_divn[0]*_divn[1]*_divn[2])
    //~ { mtlogar("divn_prob",{clevel:clv,det:surv_lev[clv]}) }
    
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
    spot.parent[_dsui]=0 //careful!  test hack fix
  }
  
  function shovespots(mv){  //shove _dsui-to-end by mv
    
    var clld=_bmpspot, btop=spot.top
    _bmpspot+=mv 
    
    if(spot.parent[spot.top-1] === undefined ){
      conlog("bad shovi`n fore")
    } 
        
    if(clld===spot.top){
      //~ conlog("shoving the end",spot.top,"by",mv)
      if(clld+mv>spot.max){ setspotmax(Math.floor((clld+mv)*1.25)) }
      for(var si=spot.top,se=si+mv; si<se; si++){ spot.parent[si]=spot.fchild[si]=0 }
      spot.top=clld+mv
      return
    }

    //~ conlog("Shoving non end",clld,"by",mv)
           
    var gaps=[], glast=-1
    
    for(var mvv=mv,si=clld+1; mvv!==0; si++){
      
      if(spot.parent[si]===0||si===spot.top){  //si is suit for overwrite
        if(si===glast+1){
          if(si===spot.top)                  //must extend top
          { spot.top+=mvv; mvv=0              //by remaining mvvs
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
    } 
    
    if(spot.top>=spot.max){ setspotmax(Math.floor(1+spot.top*1.1)) }
    
    //~ conlog("shove gaps are:",gaps)
        
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
    
    var mvto,mvb=mv,mvby=mv, gnxt=0
    while( mv>0 ){
      
      mvby=gaps[gnxt+1]-gaps[gnxt]+1
      mvto=gaps[gnxt+1]
      gnxt+=2 
      mv-=mvby
      
      for(var si=mvto-mvby; si>=clld ;si--){ 
        movespot( si, si+mvby) 
      } 
    }
            
    //then invalidate the gap, include section from duesui on?
    //that section must be invalidated after operation anyway
    //~ conlog("shove blanking:",clld,"to",clld+mvb)
    
    for(var si=clld,se=si+mvb; si<se; si++){ spot.parent[si]=0 }

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
  
                       //2   1    0    1   2  poor parameteriz
  function rebudbyvelo( wpar,akid,xkids,dkidn,dsui){
    //expand parent
    
    //~ console.log("rebud",akid,"and",akid+xkids,"kids",dkidn)

    while(xkids){ spot.dln_span[akid]+=spot.dln_span[akid+xkids--] }
  
    _dsui=dsui
    budbyvelo( akid,dkidn,wpar ) //kidns will be written to _dsui
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
      
      //activity score of jote, order is inverted by accident
      //abs sum should be as good as hypotenus
      velo_at_dlsi[i]=
        -Math.abs(jote.vx[j])-Math.abs(jote.vy[j])-Math.abs(jote.vz[j])
      
      if(isNaN(velo_at_dlsi[i])){
       conlog("bah! NANs!",i,jote.x[j],jote.y[j],jote.z[j])
      }
    }
    
    //uses:    velo_at_dlsi
    //updates: sect_at_dlsi and sectppl
    
    barsort({
      st:st  ,ov:ov 
     ,barnum: sectn 
     ,barfreq:sectppl
     ,keysbar:sect_at_dlsi
     ,scores: velo_at_dlsi 
     ,burnscore:1
    }) //,scores:,st:,ov:,keysbar:,barfreq:,burnscore:

    //developed in histosort.js
    
    //~ conlog2("histo",sectn,st,ov,sn)
    //~ checkspots("pre_veloshuf")
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
    //~ checkspots("aft_veloshuf")
  
    /// update resulting spots: 
    var firstc=1
    var clv=spot.depth[wpsi]+1
    if(clv>spot.deep) spot.deep=clv
    
    //~ var conl=""
    //~ for (var i=0;i<sectn;i++){ conl+=" "+sectppl[i] }
    //~ conlog2("velospotting",conl)
    
    for(var csec=0; csec<sectn; csec++)  //loop through sects to note spotdets
    { 
      if(sectppl[csec]) {
        spot.parent[_dsui]=wpsi
        
        spot.depth[_dsui]=clv
        spot.dln_anchor[_dsui]=sectanchor[csec]
        spot.dln_span[_dsui]=sectppl[csec]
        
        note_true_bnds( jote.x, jote.y, jote.z, 
          sectanchor[csec], sectanchor[csec]+sectppl[csec]
        )
        
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


  //st,ov define a contiguous range within keysbar and scores
  //which are parallel feilds arrays of the same key records
  //default is st=0, ov=length
  //this is so that a subrange of a longer list can be redivided.
  //keysbar and barfreq can be used to reorder a subrange of
  //keyrecs or whole set
  // 

  var cntofsub=[],destroom=[],destofsub=[]
  var wkcnt=0,wkcyc=100 //these count use of arrays

  function barsort(pr){ //barnum:,scores:,st:,ov:,keysbar:,barfreq:,burnscore:
    
    var barnm  = pr.barnum
       ,scores = pr.scores
       ,barndx = pr.keysbar||[]
       ,sectppl= pr.barfreq||[]
       ,st=pr.st||0 
       ,ov=pr.ov||scores.length
       ,resol=pr.resol||5  //over sample x5
       
    if(!pr.burnscore){
      scores=[]
      for(var i=st; i<ov; i++){
        scores[i]=pr.scores[i]
      }
    }
    
    var avg=-0 , val=-0 ,nb=ov-st
    
    var minv=scores[st],maxv=scores[st] 
    
    for(var i=st; i<ov; i++) //need to max,min 
    { 
      ///this is setup before histosort
      //~ var j=dlns[st]
      //~ val=Math.sqrt(
        //~ jote.x[j]*jote.x[j]+jote.y[j]*jote.y[j]+jote.z[j]*jote.z[j]
      //~ )
      if(isNaN(scores[i])) scores[i]=0
      val=scores[i]||0
      avg+=val
      if (val>maxv){ maxv=val }
      if (val<minv){ minv=val }
    }
     
    avg/=nb, avg-=minv, maxv-=minv

    var hiv=0,havg=-0
    
    for(var i=st; i<ov; i++) 
    { val=scores[i]-=minv 
      if(val>avg){ hiv++;havg+=val }
    }
   
    var qhi=2*havg/hiv  //prelim estimate of good maxv
    if(qhi>=maxv){ qhi=maxv*0.99999999 } //(not used)
                                         //maxv is used... 
    var subdvn=resol*barnm
    
    //~ console.log(subdvn)
    //recycle these temp arrays
    //var cntofsub=new Array(subdvn), destofsub=new Array(subdvn)
    
    if (cntofsub.length<subdvn 
     ||(wkcnt++>wkcyc&&cntofsub.length>subdvn)){
      cntofsub   = new Array(subdvn) 
      destofsub = new Array(subdvn)
      wkcnt=0
    }
    
    for(var ch=0; ch<subdvn; ch++){ cntofsub[ch]=0 }
    
    if (destroom.length<barnm){ destroom=new Array(barnm) }
    
    for(var ch=0; ch<barnm; ch++){ destroom[ch]=0 }
    
    for(var i=st; i<ov; i++){
      
      val=Math.floor(subdvn*scores[i]/maxv)
      val=(val<subdvn)?val:subdvn-1    //to opt this out increase maxv ?
                                     //no, maxv is set deliberately low
      cntofsub[scores[i]=val]++    //! scores is written here
      
    }
    
    var rlbar=(nb/barnm)
       ,fllbar=0,fldbar=0,spills=[]
       ,nxtcap=rlbar+0.5, fcap=Math.floor(nxtcap)
    
    //largest subdv is sometimes getting a key - fixit....
    
    //determining sub anchors to bar anchors  (anchor is first address)
    //~ console.log("subdvn:",subdvn,'barnm:',barnm)
    //~ 
    
    for(var sub=0; sub<subdvn; sub++){
      
      destofsub[sub]=fllbar            //cntofsub bar sub goes to dest[fllbar]
      destroom[fllbar]+=cntofsub[sub]  //destroom[fllbar] gets population of bar sub

      while(destroom[fllbar]>=fcap){
        destroom[fllbar+1]+=destroom[fllbar]-fcap
        destroom[fllbar]=fcap
        fllbar++
        nxtcap+=rlbar-fcap
        fcap=Math.floor(nxtcap)
        //~ if(fllbar-fldbar>1){ spills.push(fldbar); fldbar++ }
      }
      //~ fldbar=fllbar
    }
      
    //cntofsub[h] is the freq of sub 
    //destroom[fillit] is capacity of bars
    
    
    //destroom is parallel to sectppl
    //destroom must empty but sectppl wants returned
    //ceil of destroom is complicated here by dvrems fraction..
    for(var i=0;i<barnm;i++){ sectppl[i]=destroom[i] }
    
    for(var i=st; i<ov; i++){ 
      var hpotofi=scores[i]
      
      while(destroom[destofsub[hpotofi]]===0){ destofsub[hpotofi]++ }
      destroom[destofsub[hpotofi]]--
      barndx[i]=destofsub[hpotofi]
    }
    
  }

  function dln_end(sx){
    while( spot.parent[sx]!==spot.parent[sx+1])
    { sx=spot.parent[sx] }
    
    return sx?spot.dln_anchor[sx+1]:spot.dlntop 
  } 

  function measure_spots(){ //without vel for force
    
    var lwx,hix, lwy,hiy, lwz,hiz
    var cgx,cgy,cgz,cmass_tot

    var cnq=0 
    //could make a multidimension array for this of
    //spotat[lv][sui] and spotnat[lv] to stop redundant sweeps
    //(sparse js created arrays) 

    for(var sui=1,spd=spot.deep; spd>0; sui++){ /// or spd>0 ??
      
      if(sui===spot.top){ sui=1;spd-- } //1 redundant test when sui=1,spd=-1
      
      if(spot.parent[sui]!==0 && spot.depth[sui]===spd){
        
        cgx=-0, cgy=-0, cgz=-0, cmass_tot=-0
        
        if(spot.fchild[sui]===0) //its a leaf spot
        { //mtlogcn('totalleafs');
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
          
            if(jote.x[j]<lwx){ lwx=jote.x[j] } 
            else if(jote.x[j]>hix){ hix=jote.x[j] }
            if(jote.y[j]<lwy){ lwy=jote.y[j] } 
            else if(jote.y[j]>hiy){ hiy=jote.y[j] }
            if(jote.z[j]<lwz){ lwz=jote.z[j] } 
            else if(jote.z[j]>hiz){ hiz=jote.z[j] }	
              
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
        
        //~ cnq+=spot.grd[sui]
      } 
    }
    //~ console.log("measure_spots",cnq)
  }

  function bimeasure_spots(tms){ //space with vel for tight collision
    
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
        { //mtlogcn('totalleafs');
          var ja=spot.dln_anchor[sui], jb=ja+spot.dln_span[sui]
          
          //testing if leaf spots need end marker
         
          var j=dlns[ja] //jote at start of dln span
          
          lwx=hix=jote.x[j]+jote.vx[j]*tms
          lwy=hiy=jote.y[j]+jote.vy[j]*tms
          lwz=hiz=jote.z[j]+jote.vz[j]*tms
          
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
    //~ var zz,yy=(Isec/dvn[0])>>0	
    //~ zsec=(yy/dvn[1])>>0
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
  function prep_loctosub(){ //0.999999999999999
    _idvmx=1/_divm[0] //no splodge with this value 
   ,_idvmy=1/_divm[1] //%celln location still advisable 
   ,_idvmz=1/_divm[2]
    _dvsx=_divn[0],_dvsxy=_divn[0]*_divn[1]
  }
  

  function loctosubcell(x,y,z)
  { return (
      (((x- _lw3[0])*_idvmx)>>0)      //*1
    + (((y- _lw3[1])*_idvmy)>>0)*_dvsx   //*1*x 
    + (((z- _lw3[2])*_idvmz)>>0)*_dvsxy  //*1*x*y 
    ) 
  } 
  
  function loctosubcell_(x,y,z,lw,dvm,dvs) //unused. optimised above
  { return (
      floor((x-lw[0])/dvm[0])                    //*1
    + floor((y-lw[1])/dvm[1])*dvs[0]             //*1*x 
    + floor((z-lw[2])/dvm[2])*dvs[0]*dvs[1]      //*1*x*y 
    ) 
  } 

  /// note_bestgrid
  // determines best cuboid division to divide kids 
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
  { if(m[0]<m[1])        //ugly optimsation, in future ret {x:,y:,Z:}
    { if(m[1]<m[2]){ r[0]=0,r[1]=1,r[2]=2 ;return r } 
      if(m[0]<m[2]){ r[0]=0,r[1]=2,r[2]=1 ;return r } 
      r[0]=2,r[1]=0,r[2]=1 ;return r } 
    if(m[0]<m[2]){ r[0]=1,r[1]=0,r[2]=2 ;return r } 
    if(m[1]<m[2]){ r[0]=1,r[1]=2,r[2]=0 ;return r } 
    r[0]=2,r[1]=1,r[2]=0 ;return r
  }


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
    //~ mtlogar('leaflevs',lv)
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
    
    if(cx||cy||cz){ //no check maybe faster...
      
      if(!(kd=spot.fchild[par])){ precipjotes(par,cx,cy,cz);return  }
          
      for(var k=kd ; k ; k=nextkid(par,k) ){ 
        spot.calcx[k]+=cx
       ,spot.calcy[k]+=cy
       ,spot.calcz[k]+=cz 
      }
         
    }// else{ mtlogcn('precipskip'); }
    
    for(k=kd ; k ; k=nextkid(par,k) )
    { precipkids(k) }	
  }
  
  function precipjotes(s,cx,cy,cz){
     
    for(var c=spot.dln_anchor[s], e=c+spot.dln_span[s] ; c<e; c++ )
    { 
      if(isNaN(jote.qx[dlns[c]])||isNaN(jote.qy[dlns[c]])||isNaN(jote.qz[dlns[c]])){
        conlog("precip: NANs in LEAF=",s,jote.qx[dlns[c]],jote.qy[dlns[c]],jote.qz[dlns[c]] )
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
  
  function makeshuffleix(n){
    
    if(n==1){ return [-1] }
    
    var r=[0,-1]
    for(var i=n-2;i>0;i--){
      r.push(0,-1,i,-1)
      if(n%2) r.push(1,-1)
    }
    return r
  }
  
  //------------
  
  function postfit_spotmap(){ 
    //~ checkspots("beforedistrib")
    distrib_accel()
    acceltovel()
    //~ checkspots("afterdistrib")
  }
  
  //spot checking func...
  var dlnco=[] 
  function checkspots(h){
    var nowco=[]
    if(dlnco.length){
      for(var ji=0;ji<spot.dlntop;ji++){
        if((!(dlns[ji] in nowco)) ||!nowco[dlns[ji]]){ nowco[dlns[ji]]=1 }
        else{ nowco[dlns[ji]]++; }
      } 
      
      var nwco=""
      for(var ji=0;ji<spot.dlntop;ji++){
        if(nowco[dlns[ji]]!==dlnco[dlns[ji]]){
          nwco+=" di:"+ji+" ji:"+dlns[ji]+" nb:"+nowco[dlns[ji]]+" bn:"+dlnco[dlns[ji]]
        }
      } 
      if(nwco){ console.log(h,"dln problem! ",nwco) ; meterspots()}
    }else{
      for(var ji=0;ji<spot.dlntop;ji++){
        if((!(dlns[ji] in dlnco)) ||!dlnco[dlns[ji]]){ dlnco[dlns[ji]]=1 }
        else{ dlnco[dlns[ji]]++ ;if(dlns[dlns[ji]]>1) {console.log("h,dln iniproblem! ",ji)} } 
      } 
    }
    
    var cks=""
    for(var ji=0;ji<spot.dlntop;ji++)
    { if(isNaN(jote.vx[dlns[ji]])||isNaN(jote.vy[dlns[ji]])||isNaN(jote.vz[dlns[ji]])) cks+=" JoNaNVxyz:"+ji 
      if(isNaN(jote.qx[dlns[ji]])||isNaN(jote.qy[dlns[ji]])||isNaN(jote.qz[dlns[ji]])) cks+=" JoNaNQxyz:"+ji
    }
    
    for(var si=0;si<spot.top;si++){
      if(isNaN(spot.calcx[si])||isNaN(spot.calcy[si])||isNaN(spot.calcz[si])) cks+=" SpNaNCalcxyz:"+si
    }
    
    if(cks!=="") console.log("NaNz!!! HERE:",h,cks)
  }
  

  function conlogspots(a,e){
    if(a.length){
      for(var i=0, e=a.length; i<e;i++) conlogspot(a[i])
    }else{
      for(var i=a||0, ee=e||spot.top; i<ee;i++) conlogspot(i)
    }
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
    
    console.log(cl)
  }

  function zerotrunk(s){
    var tkids=trunkkids(s)
    console.log("Zeroing branches of",s,"from",tkids.ck,"to",tkids.ek)
    for(var si = tkids.ck; si<tkids.ek+1;si++) spot.parent[si]=0
    console.log("Aftertrunk:")
    conlogspot(tkids.ek+1)
  }

  function conlogtrunks(s,str){
    if(str){console.log(str, "Trunks:",s)}else {console.log("Trunkspot:",s)}
    
    conlogspot(s)
    
    var tkids=trunkkids(s)
    
    console.log("PreBranch of",s," is ",tkids.ck-1)
    conlogspot(tkids.ck-1)
    console.log("Branches of",s,"are",tkids.ck,"to <",tkids.ek)
    for(var si = tkids.ck; si<tkids.ek;si++) conlogspot(si)
    console.log("AftBranch:",tkids.ek)
    conlogspot(tkids.ek)
  }
  
  function conlogtrunk(s){
    var tkids=trunkkids(s)
    console.log("Trunks of",s,"are",tkids.ck,"to",tkids.ek-1,"inclusive")
    //~ for(var si = tkids.ck; si<tkids.ek+1;si++) conlogspot(si)
    conlogspot(tkids.ck)
    console.log("Aftertrunk:")
    conlogspot(tkids.ek) //ek is after
   
  }
  
  var conlog2=nullfunc//, conlog=nullfunc
    
  fig.tendto_spotmap  = tendto_spotmap
  fig.postfit_spotmap = postfit_spotmap
  //~ fig.bulk_load = bulk_load
  fig.measure_spots = measure_spots
  fig.bimeasure_spots = bimeasure_spots
  fig.distrib_accel = distrib_accel
  fig.acceltovel = acceltovel
  fig.spot = spot
  fig.dlns = dlns

  window.checkspots  = checkspots
  window.conlogspots = conlogspots
  window.conlogspot = conlogspot
  window.zerotrunk = zerotrunk
  window.conlogtrunk = conlogtrunk
  window.conlogtrunks = conlogtrunks
  
  return fig

}
