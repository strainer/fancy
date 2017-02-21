// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// a makeshift dashboard ui module -- warning this class is mess

function newDash(){ return (function(gu){
  
  var topel, winwidth, winheight
  var hazcss=0

  var clra="#62be16"  //entity    "#6e2", #dfcf78 pebbletan
     ,clrb="#bbbb8e"  //title     "#ee2", #ffcf59 orangemild
     ,clrc="#916151"  //border    "#676", #afaf78 pebbletanw #c25
     ,clrch="#c16151" //border hover    "#676", #afaf78 pebbletanw #c25
     ,clrd="#aeaece"  //reading   "#eee"
     ,clre="#141414"  //backg   "#eee"

  winwidth =window.innerWidth
  var fntw=Math.floor(0.5+winwidth*0.014)
  winheight =window.innerHeight
  
  seat=newEl('div',{
    zindex:10
   ,position:'absolute'
   ,top:0,left:0
   ,fontFamily: 'monospace'
   //~ ,left:  Math.floor(ewi*0.125)
   //~ ,height:(winheight*0.3)+'px'
   //~ ,width: '10%'
   ,color: clra
   //~ ,backgroundColor: "#181f20"
   //,border: "1px dashed #73AD21"
   ,padding: "2px"
   ,fontSize: fntw+'px'
   ,width:'98%'
  })
  document.body.appendChild(seat)
  onloadit(iniStyles)
          
  //mixof (in [,out=intype][,n=1][,in_start=0][,in_fin=len])
  //~ clra=Fdrandom.hot().mixof("23456789abcdef","#",3)
  //~ clrb=Fdrandom.hot().mixof("56789abcde","#",3)
  //~ clrc=Fdrandom.hot().mixof("256789ab","#",3)
  //~ clrd=Fdrandom.hot().mixof("56789abcdef","#",3)
  
  var dstyles={} 
  var watchList= {}
  var grplist={}
  
  var displayoff=0

  
  function togPane(tp){
    tp=tp||topel
    var st
    if(displayoff){ tp.style.display='block'; displayoff=0 }
    else{ tp.style.display='none'; displayoff=1 }
  }
      
  function redrawDash()
  { if(displayoff) return
    for( var scop in watchList )
    { 
      for( var vkey in watchList[scop] ){
        var scoo=watchList[scop][vkey].scp
        //~ console.log("::",vkey,watchList[scop][vkey].type,
        //~ watchList[scop][vkey].val, scoo[vkey])
      if( watchList[scop][vkey].val!==scoo[vkey])
      { elemupdate(watchList[scop][vkey],scoo[vkey]) }
      }
    }
    //refresh frame
  }

  //leftcon, 'text1','fps:','fps','def1'
  
  function styleclass(s,o) { dstyles[s]=o }
    
  function revealer(pm)
  {
    var sty=pm.style
    if(typeof(sty)==='string'){ sty=dstyles[sty] }
    
    var bttn=newEl('div',{},'button1')
    var rdng=newEl('div',pm.instyle)
    var dset=newEl('div',pm.upstyle)
    
    //dset.style.backgroundColor=clre
    bttn.textContent=pm.content
    
    //console.info(dset)
    dset.appendChild(bttn)
    dset.appendChild(rdng)
        
    ;((pm.seat).seat).appendChild(dset)
    
    bttn.addEventListener('click', clickedd.bind(null,rdng) , false);
    
    if(!pm.on){ rdng.style.display="none" }
    
    grplistadd(dset,(pm.group)||0)
    
    var r={seat:rdng
          ,click:clickedd.bind(null,rdng)}
    
    return r
  }

  function button(pm)
  {
    var sty=pm.style
    if(typeof(sty)==='string'){ sty=dstyles[sty] }
    
    var bttn=newEl('text',{},'button1')
    var dset=newEl('div',sty)
    
    dset.style.backgroundColor='#403000'
    bttn.textContent=pm.legend
    
    //console.info(dset)
    dset.appendChild(bttn)
        
    ;((pm.seat).seat).appendChild(dset)
    
    var clicker
    if(pm.closes){
      clicker=function(){ (pm.seat).click(); pm.callb(pm.param) } 
    }else{
      clicker=function(){ pm.callb(pm.param) } 
    }
   
    if(pm.flipper){
      var wat={ 
        'scp':pm.scoper //,scoper:vplay ,varkey:'paused'
        ,'key':pm.varkey
        ,'type':pm.type
        ,'val':pm.val
        ,'elem':bttn
        ,'dial':bttn
        ,'lege':""
        ,'grp':pm.group
        ,'func':pm.func
      }
      watcher(wat)
    }
   
    bttn.addEventListener('click', clicker ,false)

    if(!pm.on){ dset.style.display="none" }
    
    grplistadd(dset,(pm.group)||0)
    return {seat:dset}
  }
  
  function watcher(wat){ 
    if (!(wat.scp in watchList)){
      watchList[wat.scp]={}
      //~ console.log(watchList[pm.scoper])
    }
    watchList[wat.scp][wat.key]=wat
  } 


  function reading(pm)
  { var parent = pm.seat.seat
    var type = pm.type
    var sty=('style' in pm)?pm.style : {}
    if(typeof(sty)==='string'){ sty=dstyles[sty] }
    //~ parent,type,legend,varname,steez,clr
    
    var em= newEl('div',sty)
    var lg= newEl('text',{clear:'both'});lg.textContent=pm.legend+" "
    var di= newEl('text',{color:clrd} );di.textContent="-"
   
    em.appendChild(lg); em.appendChild(di)
    
    //~ console.log(pm.scoper.paused)
    var wat={ 
      'scp':pm.scoper 
     ,'key':pm.varkey
     ,'type':pm.type
     ,'val':0
     ,'elem':em
     ,'dial':di
     ,'lege':lg
     ,'grp':pm.group
     ,'func':pm.func
    }
    watcher(wat) 
    
    parent.appendChild(em)
    return{ seat:em }
  }
  
  function addHTML(parent,content,steez,grp)
  {
    if(typeof(steez||0)==='string'){ steez=dstyles[steez] }
    
    var em= newEl('div',steez)
    em.innerHTML=content
    ;(parent.seat).appendChild(em)
    grplistadd(em,grp||0)
    return {seat:em}
  } 

  function addDiv(pm)
  {
    var parent = pm.seat
    var sty = pm.style
    var grp = pm.group
    if( typeof(sty||0)==='string' ){ sty=dstyles[sty] }
    var em
    //~ em=Document.getElementById(pm.sdiv)
    if(!em) em=newEl('div',sty)
    
    //watchList[varname]={
    //  'type':'pane'
    //}
    ;(parent.seat).appendChild(em)
    grplistadd(em,grp||0)
    return {seat:em}
  }

  function delGroup(grp)
  { 
    for( var scop in watchList )
    { for( var vkey in watchList[scop] ){ 
        if( watchList[scop][vkey].grp===grp)
        { 
          var rc=watchList[scop][vkey]
          (rc.lege).outerHTML=''; delete (rc.lege);
          (rc.dial).outerHTML=''; delete (rc.dial);
          (rc.elem).outerHTML=''; delete (rc.elem);
          delete watchList[scop][vkey]
        }
      }
    }
    for(var s=grplist[grp],i=0,e=s.length;i<e;i++)
    { s[i].outerHTML=''; delete (s[i]) }
    delete grplist[grp]
    //refresh frame
  }
  
  function elemupdate(m,cv){
    
    if(m.type==='runav'){ 
      m.val=(((m.val)||0)*0.9) + (cv||0)*0.105
      if ((m.val==0)||(Math.abs(m.val-(m.bval||0))>0.1)){ 
        m.bval=m.val||0 
        m.dial.textContent=(m.val).toFixed(1);
      }
      return 
    }
    
    if('func' in m && typeof(m.func)==='function')
    { m.val=cv;cv=m.func(cv) }else{ m.val=cv;cv=cv.toFixed(3) }
    
    if(m.type==='text1')
    { if (m.dial.innerHTML!==cv){ m.dial.textContent=cv }
      return }
    
  }
  
  function grplistadd(em,grp){
    if(!(grp in grplist)) grplist.grp=[]
    grplist.grp.push(em)
  }
      
  function clickedd(c){
    if(c.style.display==="none"){
      c.style.display="block"
    }else{
      c.style.display="none"
    }
  }
  
  function newEl(eltype,dstyles,dclass){
    var d=document.createElement(eltype)
    for(var k in dstyles){
      d.style[k]=dstyles[k]	
    } 
    if(dclass) d.className=dclass
    return d
  }

  var actions={a:0,e:0}  //fifo queue for adding onclick actions to dash 
  
  function addAction(f){
    actions[actions.e]=f
    actions.e++
  }
  
  function pullAction(){
    if(actions.a===actions.e){ actions.a = actions.e = 0; return 0 }
    var f=actions[actions.a]; actions[actions.a++]=0 //clears reference
    return f
  } 
  
  
  function iniStyles(){
    if(hazcss++) return
    var stdef=heredoc(function(){/*
      
    .button1:hover {
     color:#fbbb8e;
     border-color:#c16151;
    }
    
    .button1{
     cursor:pointer; float:left; color:#bbbb8e;
     border-width: 2px; border-style:solid; border-color:#916151;
     padding:0px 3px 0px 3px; margin:1px;
    }
    
    */},' ')

    var s = document.createElement('style')
    s.type = 'text/css'; s.innerHTML=stdef
    document.getElementsByTagName("head")[0].appendChild(s)	
  }

  function onloadit(fn){
    if (window.addEventListener)
    { window.addEventListener('load', fn, false) }
    else{ if (window.attachEvent){
      window.attachEvent('onload', fn) }else{ fn() } }
  }

  function swapClass(el,add,rmv)
  {
    if(rmv){
      el.className = el.className.replace 
      ( new RegExp('(?:^|\\s)' + rmv + '(?!\\S)', 'g'),add )
    }else{
      object.className += " "+add;
    }
  }
  
  return{
    redrawDash : redrawDash
   ,addDiv     : addDiv
   ,reading  : reading
   ,seat: seat
   ,styleclass :styleclass
   ,togPane:togPane
   ,revealer:revealer
   ,addHTML:addHTML
   ,addAction:addAction
   ,pullAction:pullAction
   ,delGroup:delGroup
   ,button:button
  }
}(arguments))}

//
// - \\ - // - \\ - // - \\ - // - \\ - // - \\ - // - \\ -
//\\ - //\\ - //\\ - //\\ - //\\ - //\\ - //\\ - //\\ - 
//-\\\ - ///-\\ - //-\\\ - ///-\\ - //-\\\ - ///-\\ - //-\\\ - ///-\\ - 
// -///- // -///- // -///- // -///- // -///- // -///-
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
// - /-/ - // - /-/ - // - /-/ - // - /-/ - // - /-/ - // - /-/ -
//                          //          //               //          /
//
//
// blapanel - html dash providing object 
//
// add readoutbox, controlbox to display on page
// 
// dashelements
//  readouts
//  inputs
// 
// containers
//  nestable
//  modalable
//  stylable
// 
// dashmethods
//  destroy
//  pause
//
// -                    \\ -            // - \\ - // - \\ -
//\\ - /  /\\ -  - //\\ - //\\     \\ - //\\ - //\\ - 
//-\\\ - ///-\\ - //-\\\ - ///-\   \ - //-\\\ - ///-\\ - //-\\\ - ///-\\ - 
// -//  ||/- // -///- // -//|/- // -||///- // -///-    // -||///-
//-//-//-//-//     -//-//-//-//-  //-//-//-//-/||/-//-/|/-//-//-//
// - /-/  - // -| /-/ - //| - /-/ -    // - /-/ - // - /-/ - // - /-/ -
//                          //          //               //          /




function growdash(cdash,vplay){
  
  cdash.styleclass('global',{})
  cdash.styleclass('def1',{})
  cdash.styleclass('def2',{margin:'0 0 0 3px'})

  //addtodash(parent,type,legend,varname,steez)

  //~ var leftcon = cdash.addpane(cdash.topel,{width:"50%",float:"left"})
  //~ var rightcon= cdash.addpane(cdash.topel,{width:"50%",float:"right"})
  var dsleft=cdash.addDiv({
    seat:cdash
   ,style:{float:'left'}
   ,group:'dleft'	
    })

  var dsright=cdash.addDiv({
    seat:cdash
   ,style:{float:'right'}
   ,group:'dright'	
    })

  var dstop=cdash.addDiv({
    seat:cdash
   ,style:{marginLeft:'auto',marginRight:'auto',width:'50%',textAlign:'center'}
   ,group:'dtop'	
    })

  // boards of can...
   
  var dsselect= cdash.revealer({
    seat:dstop
   ,content:"Figments"
   ,upstyle:{ marginLeft:'auto',marginRight:'auto',width:'50%',textAlign:'center' }
   ,instyle:{
     textAlign:'center'
    ,backgroundColor:"#ffffff88",border:"9px",clear:'both',padding:"3px"}
   ,on:false
  })
  var dsreadings= cdash.revealer({
    seat:dsleft
   ,content:"Readings"
   ,upstyle:{ clear:'both',backgroundColor:"#ffffff88"}
   ,instyle:{ clear:'both',backgroundColor:"#ffffff88"}
   ,on:true
  })
  var dsright= cdash.revealer({
    seat:dsright
   ,content:"keys"
   ,upstyle:{clear:'both',float:'right'}
   ,instyle:{clear:'both'}
   ,on:false
  })

  // Multiline Function String - Nate Ferrero - Public Domain

  var keystext=heredoc(function(){/*
  &nbsp;s- toggle stats
  &nbsp;d- toggle pane
  &nbsp;g- tog gravity
  &nbsp;x- explode
  &nbsp;c- pause
  zoom
  &nbsp;a- in, z- out
  &nbsp;pan- cursors
  &nbsp;crawl- ctrlcursor
  time
  &nbsp;i- - throttle
  &nbsp;o- + throttle 
  &nbsp;q- - interlace 
  &nbsp;w- + interlace
  &nbsp;l- backwrdmove
  &nbsp;k- backwrdtime 
  <br>
  */})

  cdash.addHTML(dsright, keystext, {margin:'0 0 0 3px'}   )


  cdash.reading({
    seat:dsreadings
   ,type:'text1'
   ,legend:'interlace:'
   ,scoper:vplay ,varkey:'runcycle_step'
   ,style:'def2'
   ,group:'fu' 
  })
  cdash.reading({
    seat:dsreadings
   ,type:'text1'
   ,legend:'freezefrm:'
   ,scoper:vplay ,varkey:'skipframe_step'
   ,style:'def2' 
   ,group:'fu'
  })
  cdash.reading({
    seat:dsreadings
   ,type:'runav'
   ,legend:'movsprfrm:'
   ,scoper:vplay ,varkey:'movperframe'
   ,style:'def2' 
   ,group:'fu' 
  })
  cdash.reading({
    seat:dsreadings ,type:'text1' ,legend:'iota:'
   ,scoper:vplay ,varkey:'iota'
   ,style:'def2'
   ,group:'fu'
   ,func:function(a){ return (a-1).toFixed(0) } 
  })

  cdash.styleclass('mbutts',{display:'inline-block', padding:'0 0.1em' })


  cdash.button({
    legend:'ring' ,param:0 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'Spiral' ,param:1 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'4 ring' ,param:2 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'Blue disk' ,param:3 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'3 planetz' ,param:4 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'Electrostatic' ,param:5 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'Near Earthly' ,param:6 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })
  cdash.button({
    legend:'Solar Simulum' ,param:7 ,callb:setupfigview ,closes:true
   ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
  })

  cdash.button({
    seat:dsreadings
   ,type:'text1'
   ,flipper:true
   ,legend:'start'
   ,legend2:'pause'
   ,scoper:vplay ,varkey:'paused'
   ,style:'mbutts'
   ,group:'fu'
   ,callb:togglePause
   ,on:true
   ,val:1
   ,func:function(a){ return a?"resume":"pause" } 
  })

}