// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// tree data index, recursively linked nested spatial groups of jotes
 
function addSpotmap(fig,vplay) { 
  'use strict'
  
  //debug logging stuff
  var nullfunc=function(){}
  var conlog=console.log.bind( console )
  var biglog=nullfunc,biglogcnt=0
  
  var tll={},told=0,tellend=5
  
  var tell = function(p,v){
    if(p in tll){tll[p]+=v||1}
    else{tll[p]=1}
  }

  var tella = function(p,v){
    if(p==="assess"){v=levstr()+v}
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
  
  //~ tell=tella=logtell=nullfunc
 
 
  /////////////////
    
  function logtest(sui){
      
    //~ var te=dln_end(sui)
    var te=spot.dln_anchor[sui]+spot.dln_span[sui]

    if(te!==dln_end(sui))
    { biglog("wrong end! sui,alg,store",sui,te,dln_end(sui)) 
      var fchil=spot.fchild[sui]
      biglog("ds",_dsui,"fchild:",fchil,"sui:",sui
       ,"fam",list_kin(spot.dln_anchor[sui],te)) 
      biglog("parent n,n+1:",spot.parent[sui],spot.parent[sui])
    }

    for( var ts=spot.dln_anchor[sui];ts<te;ts++)
    {
      var j= dlns[ts],p=0
      if(jote.x[j]< spot.lbx[sui]) { p=1;biglog("low x",sui,te-ts,spot.dln_span[sui])}
      if(jote.y[j]< spot.lby[sui]) { p=1;biglog("low y",sui,te-ts,spot.dln_span[sui])}
      if(jote.z[j]< spot.lbz[sui]) { p=1;biglog("low z",sui,te-ts,spot.dln_span[sui])}
      if(jote.x[j]> spot.hbx[sui]) { p=1;biglog("hig x",sui,te-ts,spot.dln_span[sui])}
      if(jote.y[j]> spot.hby[sui]) { p=1;biglog("hig y",sui,te-ts,spot.dln_span[sui])}
      if(jote.z[j]> spot.hbz[sui]) { p=1;biglog("hig z",sui,te-ts,spot.dln_span[sui])}
      
      if(p){
        var fchil=spot.fchild[sui]
        biglog("ds",_dsui,"fchild:",fchil,"sui:",sui,"dlni",ts,"fam",list_kin(ts))
        
        var nx=fchil
        //~ while(nx){ 
        //~ }
      }
    }
  }
 
 ///////////////////////////
 
  var jote=fig.jote 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
  
  var epsila=Math.pow(0.5,52)
  var epsilb=Math.pow(0.5,43)

  var _dsui=1    //due sui, 0 is not valid 
  
  function spotsize(maxsp){
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

  var cell_at_dlsi = new Uint16Array (jote.x.length) 
  //contains dvoxs of jts in dsline section
  //Uint8 would fit max of 256 subvoxs but not larger 
  //and may involve a cast from addresses by voxid
  
  var spot = {}
  spotsize(100)
  var jcach_dlsq = new Uint16Array(jote.x.length)//contains jote who is at dsline.pos
  var dlns       = new Uint16Array(jote.x.length)//jotes in a vox delineation seq

  var _divn=[ -1, -1, -1 ]  //grid division vector
  var	_divm=[ -1, -1, -1 ]  //grid div measure vector

  //25 to 45 working best
  var max_subcell = 30     //max subdivision of space per iteration
  //5 to 10 working best
  var endsize=7            //endcell must be smaller than this population
    
  ///Cell recursion detail object:Crdo notes per level*sbvox
  // caches the recursively used details of cells
  // approx maxlevel * celln in bulk ~= 256*10 2500
  // could just use a lev*maxcelln array
  // but this structure is much less sparse (it minimises levels max celln)
  
  var Crdo = function() 
  { return { 
      
      cellanchor:new Uint16Array(max_subcell+1),//dlseq anchorofeach possible subcell
      sui:       new Uint16Array(max_subcell+1),//sui of each possible subcell
      cellqty: 0,                              //number of cells
      divn: new Float64Array(3),             //divisions (each axis)
      divm: new Float64Array(3),           //division measure
      lopos: new Float64Array(3)         //low bound
      //high bnd is lopos+divm*divn
    }
  }
    
  var curdet=[]; //level:cell detail array 
 
  function bulk_load(ej)
  { 
    var spotfac=0.7
    var spm=Math.floor( (jote.x.length)*spotfac )
    if( spot.max<spm*0.9 || spot.max>spm*1.2 ){
      spotsize(spm) 
    }
    
    ej=ej||jote.top
    ej=topcell(ej)
        
    if(ej < endsize)
    { endcell( curdet[0].cellanchor[0], curdet[0].cellanchor[1] ) }
    else
    { digest_cell( 0, 0 )	}  // (lvlnum,cellnum)
    
    //~ logtell()
  }
  
  //surveys vox then loops through all subvoxs, calculating their jtpopuls
  //from their sDls stored in recursivedet.cellanchor[svxi]
  //it recurses into oversized
  //it endcurses smallersized
  
  function digest_cell( bcl_lv, bcelli ) //b-level b-sector b-tacksnum
  { 
    //bcl_lv and bcelli determine the cell to digest
    //digestion involves surveying the cell and then
    //looping through the child cells to see if they need surveyed or ended
    // 
    var bpop=curdet[bcl_lv].cellanchor[bcelli+1]-curdet[bcl_lv].cellanchor[bcelli]
    
    //biglog("bcl_lv",bcl_lv,"i",bcelli,"cellsize",bpop)
    
    if(bcl_lv>18){ enddeep(bcl_lv, bcelli,bpop); return }
    
    var celln_trgt= floor(2+(bpop/endsize)*Drand.range(0.5,1))
    if(celln_trgt>max_subcell) { celln_trgt=max_subcell-1; }
    
    survey_cell( bcl_lv, bcelli, celln_trgt ) 
    
    var lv=bcl_lv+1
    
    for(var ci=0; ci<curdet[lv].cellqty; ci++) //loop through fresh celln 
    {
      //~ while(curdet[lv].cellanchor[ci] === (ci<curdet[lv].cellqty)?curdet[lv].cellanchor[ci=ci+1]:-2){}
      //~ if(ci>curdet[lv].cellqty){ continue }	
      //~ var cpop=curdet[lv].cellanchor[ci] - curdet[lv].cellanchor[--ci] //popl of ci

      var cpop=curdet[lv].cellanchor[ci+1] - curdet[lv].cellanchor[ci] //popl of ci
      if(cpop==0){ continue }	
      
      if(cpop>endsize)
      { digest_cell( lv, ci) }
      else
      { 
        if( 
            ( (curdet[lv].cellanchor[ci+2] - curdet[lv].cellanchor[ci]) < endsize )
          &&((ci+1)%curdet[lv].divn[0]!=0)  //next is not in new xline
          &&((ci+1)<curdet[lv].cellqty)     //possibly implied by prev
             
        ) { 
          endcell( curdet[lv].cellanchor[ci], curdet[lv].cellanchor[ci+2],lv )
          ci++ 
          tell.dbl_end+=2
        } else { 
          endcell( curdet[lv].cellanchor[ci], curdet[lv].cellanchor[ci+1],lv )
          tell.sngl_end++ 
        }
      }
    }
    //subsurveyed
  }
  
  function enddeep(bcl_lv, bcelli,bpop){
    tell("cellsoverdeep")
    endcell( 
      curdet[bcl_lv].cellanchor[bcelli]
     ,curdet[bcl_lv].cellanchor[bcelli+1] 
     ,bcl_lv 
    )
    
    var q=[]
    for(
      var i=curdet[bcl_lv].cellanchor[bcelli]
      ;i<curdet[bcl_lv].cellanchor[bcelli+1]
      ;i++ 
    ){ 
      var j=dlns[i]
      q.push(","+jote.x[j]+" "+jote.y[j]+" "+jote.z[j]+" ") 
    } 
    tella('odeepjts',q)
    tella('odeepdets',curdet[bcl_lv])	
  }

  function topcell(ej)
  { 
    curdet[0]=Crdo()
    
    curdet[0].sui[0]= _dsui=1 //0 index is null
    curdet[0].cellqty=1
    
    var i=0,cn=0
    for( i=0; i<ej; i++)
    { if(isFinite(jote.x[i]+jote.y[i]+jote.z[i])){ dlns[cn++]=i } }

    curdet[0].cellanchor[0]=0    //first jote i
    curdet[0].cellanchor[1]=cn   //after jote i
    curdet[0].cellanchor[2]=cn   //after jote i

    spot.depth[_dsui]=0
    spot.dln_anchor[_dsui]=0
    spot.dln_span[_dsui]=cn
    spot.parent[_dsui]=0
    
    i=dlns[0]
    var lwx=jote.x[i], lwy=jote.y[i], lwz=jote.z[i]
    var hix=jote.x[i], hiy=jote.y[i], hiz=jote.z[i] 
    
    for(var j=1; j<cn; j++)
    { 
      i=dlns[j]
      
      if(jote.x[i]<lwx)      { lwx=jote.x[i] }
      else if(jote.x[i]>hix) { hix=jote.x[i] }
      if(jote.y[i]<lwy)      { lwy=jote.y[i] }
      else if(jote.y[i]>hiy) { hiy=jote.y[i] }
      if(jote.z[i]<lwz)      { lwz=jote.z[i] }
      else if(jote.z[i]>hiz) { hiz=jote.z[i] }
      
      //~ if(!(isFinite(jote.z[I])&&isFinite(jote.z[I-1])&&isFinite(jote.z[I-2]))){
          //~ biglog("ziigled! ")
          //~ biglog(Math.floor(I/3),jote.z[I],jote.z[I-1],jote.z[I-2])
          //~ debugger
      //~ }
    }
    
    curdet[0].lopos[0]=lwx ; curdet[0].lopos[1]=lwy	; curdet[0].lopos[2]=lwz	
    curdet[0].divn[0]=1    ; curdet[0].divn[1]=1    ; curdet[0].divn[2]=1
    
    var hig =[hix,hiy,hiz]
    
    for(var i=0;i<3;i++){ //each axis
    
      // preincrease dither to blur repeat-grid alignment
      // this is somewhat neutralised by subcell resizing
      curdet[0].divm[i]=(hig[i]-curdet[0].lopos[i])*1.01 
      var p=rndu()*curdet[0].divm[i]/4
      var q=rndu()*curdet[0].divm[i]/4
      curdet[0].lopos[i]-=Math.abs(p)
      curdet[0].divm[i]+=Math.abs(q)+Math.abs(p)
    }
        
    _dsui++
    return _jtlen=cn
  } 
  
  var _jtlen=0
  
  var dlns   //The full delineation sequence
             //jotes arranged into vox lines,
             //which have st, end pos, properties
             //recorded in spot

  //workspace of subspoting function
  var jtcdlsa = new Uint16Array(jote.top) //avails start index of jotes cell in a dlsline
  var cellppl = new Uint16Array(max_subcell) //records quantity of jotes in cells
  var cellppl2 = [] //records quantity of jotes in cells
  var celfill = new Uint16Array(max_subcell) //counts fill of cells while filling dlsline
  var cell_at_dlsi  //contains cell of jote at [dlsi]
  var jcach_dlsq   //contains direct index of jote at [dlsi]

  function survey_cell( bcl_lv, bcelli, cellnb ) //b cellanchor level, 
  {                                              //b cellanchor index number
    var st = curdet[bcl_lv].cellanchor[bcelli] 
    var ov = curdet[bcl_lv].cellanchor[bcelli+1] 
    
    var clv=bcl_lv+1
    
    if(curdet[clv]===undefined){ curdet[clv]=Crdo() }
          
    note_implied_bnds(
      bcelli, curdet[bcl_lv].divn, curdet[bcl_lv].divm, curdet[bcl_lv].lopos
    ) //set _lw3 and _hi3
    
    //best grid for implied dets:
    var celln=note_bestgrid(cellnb) //sets _divn and _divm
    var cel , sn=ov-st
          
    //configure loc_to_subcell function with curdets
    note_loctosubs()
     
    if(celln>max_subcell) { tell.gp_sz_err++ }
       
    //reset all potential cellppls 
    for(var i=0; i<=celln; i++) { celfill[i]=0; cellppl[i]=0 }
    
    var ncheck=0

    //loop through stretch to make note of members sectors
    for(var uri=st; uri<ov; uri++) 
    { cel=Math.abs(loctosubcell(
        jote.x[dlns[uri]], jote.y[dlns[uri]], jote.z[dlns[uri]]
      ))//%celln //seems unnecessary, Math.abs(cel)%celln or (cel+celln*celln)%celln
      
      if(!(cel>=0&&cel<=celln)) { tella("celleryman", {'cel':cel,x:jote.x[dlns[uri]]
          ,y:jote.y[dlns[uri]], z:jote.z[dlns[uri]],low:_lw3,hi:_hi3} ) }
    
      jcach_dlsq[uri]= dlns[uri] //cache the section of dlns
      cell_at_dlsi[uri]= cel    //the dwnsector of the jote in the line
      cellppl[cel]++           //population of cel
      cellppl2[cel]=1
      
    }
    
    var chk=0
    for(var tt=0;tt<cellppl.length;tt++) { chk+=cellppl[tt] }
    
    //test if only one cell filled, if true scan bounds and rescan before continue
    //make sure curdet bounds are set correctly
    
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
        tell('cellsingularity')
        celln=cellnb
        _divm[0]=_divm[1]=_divm[2]= 0
        _divn[0]=celln, _divn[1]=_divn[2]=1 
        
        for(var uri=st; uri<ov; uri++) 
        { cel=floor((cellnb*(uri-st))/sn)
          cell_at_dlsi[uri]= cel 
          cellppl[cel]++
        }
      }else{
        //~ tell('cellshrink')
        celln=note_bestgrid(cellnb) //sets _divn and _divm
        note_loctosubs()
        //celln=_divn[0]*_divn[1]*_divn[2]
        for(var uri=st; uri<ov; uri++) 
        { cel=Math.abs(loctosubcell(   //redoing subloc with new bounds
            jote.x[dlns[uri]], jote.y[dlns[uri]], jote.z[dlns[uri]]
          ))//%celln //seems unnecessary 
          if(cel<0||cel>=celln) { 
            tella("cellerymum", {'cel':cel,x:jote.x[dlns[uri]], 
              y:jote.y[dlns[uri]], z:jote.z[dlns[uri]],low:_lw3,hi:_hi3} ) }
          cell_at_dlsi[uri]= cel  //the dwnsector of the jote in the line
          cellppl[cel]++          //population of cel
        }
      }
    }
      
    curdet[clv].divm[0]=_divm[0] //*1.0001 
    curdet[clv].divm[1]=_divm[1] //*1.0001 
    curdet[clv].divm[2]=_divm[2] //*1.0001

    curdet[clv].lopos[0]=_lw3[0]
    curdet[clv].lopos[1]=_lw3[1]
    curdet[clv].lopos[2]=_lw3[2]

    curdet[clv].divn[0]=_divn[0]
    curdet[clv].divn[1]=_divn[1]
    curdet[clv].divn[2]=_divn[2]
    
    curdet[clv].cellqty=celln
    
    if(celln!==_divn[0]*_divn[1]*_divn[2]){ tella("nansspotted",{clevel:clv,det:curdet[clv]}) }
    // each of st to ov in dlns, 
    // sector is noted in cell_at_dlsi, 
    // tacki is note in jcach_dlsq
    
    var uca=st                            //upcell anchor position in dlns
    for(var ccel=0; ccel<=celln; ccel++)  //loop through cells to note dls anchors
    { curdet[clv].cellanchor[ccel]=uca; uca+=cellppl[ccel]; }
    
    for( uca=st; uca<ov; uca++)           //loop through jotes to slot after anchors
    { cel=cell_at_dlsi[uca] 
      dlns[ curdet[clv].cellanchor[cel] + (celfill[cel]++) ]
        =jcach_dlsq[uca] 
    }
    
    //curdets note cells lvl, size and expected size of children, children may redefine
    //their own sizes and expected sizes of their children
    //spot sizes are not calculated until level up
    //cells are only concerned with comprehensively covering instantaneous position of
    //jotas
  
    var bvx=curdet[bcl_lv].sui[bcelli]
    for(var ccel=0; ccel<celln; ccel++)  //loop through cells to note spotdets
    { if(cellppl[ccel]){
        curdet[clv].sui[ccel]=_dsui 
        
        spot.depth[_dsui]=clv
        spot.dln_anchor[_dsui]=curdet[clv].cellanchor[ccel]
        spot.dln_span[_dsui]=cellppl[ccel]
        spot.parent[_dsui]=bvx
        _dsui++
      }
    }
  }

  function dln_end(sx){
    while( spot.parent[sx]!==spot.parent[sx+1])
    { sx=spot.parent[sx] }
    
    return sx?spot.dln_anchor[sx+1]:_jtlen 
  } 

  function apre_load(){
    spot.top=_dsui
    spot.deep=0
        
    for(var sui=1;sui<spot.top;sui++){
      spot.fchild[ sui ]=0
      if(spot.depth[sui]>spot.deep){ spot.deep=spot.depth[sui] }
    }
    spot.parent[spot.top]=0; //clean after end spot
    
    for(var sui=1;sui<spot.top;sui++){
      
      if(spot.fchild[ spot.parent[sui] ]===0){
        spot.fchild[ spot.parent[sui] ]=sui
      } //sui 0 is null
    }
        
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
        { tell('totalleafs');
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
        
        logtest(sui)
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
        { tell('totalleafs');
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
        
        logtest(sui)
      } 
    }
  }


  var _lw3=[-1,-1,-1], _hi3=[-1,-1,-1]
  
  //returns sector bounds of bcelli with 
  //div and divm and lowp details from parents curdets 
  function note_implied_bnds(Isec,dvn,dvm,low) //checked
  { var xsec,ysec,zsec
    
    //this works
    var R=Isec/dvn[0] , U=Math.floor(R)	
    ysec=U%dvn[1]
    xsec=Isec-U*dvn[0]
    zsec=(U-ysec)/dvn[1]

    //this works too
    //~ zsec=Math.floor(Isec/(dvn[0]*dvn[1]))
    //~ Isec-=zsec*dvn[0]*dvn[1]
    //~ ysec=Math.floor(Isec/dvn[0])
    //~ xsec=Isec-ysec*dvn[0]
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
  function note_bestgrid(submx,cm){
    cm=cm||[_hi3[0]-_lw3[0],_hi3[1]-_lw3[1],_hi3[2]-_lw3[2]]
    
    _divm[0]=cm[0],_divm[1]=cm[1],_divm[2]=cm[2] 
    
    cm[0]*=1.2 //increase x division for assist double-cell-termination
    var r=sorti012(cm)
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
  
  function sorti012(m) 
  { if(m[0]<m[1]) 
    { if(m[1]<m[2]) return [0,1,2] 
      if(m[0]<m[2]) return [0,2,1] 
      return [2,0,1]  } 
    if(m[0]<m[2]) return [1,0,2] 
    if(m[1]<m[2]) return [1,2,0]
    return [2,1,0] 
  }


  function nextkid(pr,k){
    return (spot.parent[++k]===pr)?k:0
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

  function endcell(rst,rov,lv) //stub to test bulk_load
  { 
    //~ tella('leaflevs',lv)
  }
    

  function distrib_accel(){ 
    precipkids(1) 
  }
  
  function precipkids(par){
    
    var kd,cx=spot.calcx[par],cy=spot.calcy[par],cz=spot.calcz[par]
    spot.calcx[par]= spot.calcy[par]= spot.calcz[par]= 0

    //if(cx||cy||cz){ //no check maybe faster...
      if(!(kd=spot.fchild[par])){ precipjotes(par,cx,cy,cz);return  }
          
      for(var k=kd ; k ; k=nextkid(par,k) )
      { 
        spot.calcx[k]+=cx
       ,spot.calcy[k]+=cy
       ,spot.calcz[k]+=cz }
    //}else{ tell('precipskip'); }
    
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
    }
    startwatch('measure')
    measure_spots()
    stopwatch('measure')
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
