// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// a makeshift dashboard ui module -- warning this class is mess

function newDash(){ return (function(gu){
  
  var hazcss=0

  var winwidth, winheight
  
  var www  = window, ddd  = www.document, dde = ddd.documentElement,
  ddb = ddd.body || ddd.getElementsByTagName('body')[0],
  winwidth  = www.innerWidth || dde.clientWidth || ddb.clientWidth,
  winheight = www.innerHeight|| dde.clientHeight|| ddb.clientHeight;
  
  var mez=(2+winwidth/70)
  
  onloadit(iniStyles)
  
  function iniStyles(){
    if(hazcss++) return
    var stdef=heredoc(function(){/*
      
    .button1:hover {
     color:#feeb8e;
     border-color:#f16151;
    }
    
    .button1{
     cursor:pointer; float:left; color:#ebcb8e;
     border-width: 2px; border-style:solid; border-color:#b16151;
     padding:1px 6px 0px 6px; margin:2px 3px 2px 3px ;
     background-color:#222;
    }
    
    */},' ')

    var s = document.createElement('style')
    s.type = 'text/css'; s.innerHTML=stdef
    document.getElementsByTagName("head")[0].appendChild(s)	
  }
          
  //mixof (in [,out=intype][,n=1][,in_start=0][,in_fin=len])
  //~ clra=Fdrandom.hot().mixof("23456789abcdef","#",3)
  //~ clrb=Fdrandom.hot().mixof("56789abcde","#",3)
  //~ clrc=Fdrandom.hot().mixof("256789ab","#",3)
  //~ clrd=Fdrandom.hot().mixof("56789abcdef","#",3)
  
  var dstyles={} 
  var watchList= {}
  var grplist={}
  
  var displayoff=0

  var clra,clrb,clrc,clrch,clrd,clre

  var seat=newEl('div',{})
  document.body.appendChild(seat)	
  
  function setseat(sty){
    styleEl(seat,sty)
  }
  
  function setcolors(cols){
    clra =cols.clra ,clrb =cols.clrb ,clrc =cols.clrc
    clrch=cols.clrch,clrd =cols.clrd ,clre =cols.clre
  }
  
  function togPane(tp){
    tp=tp||seat
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
    
    var bttn=newEl('div',pm.upstyle,'button1')
    var rdng=newEl('div',pm.instyle)
    var dset=newEl('div',{})
    
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
    
    dset.style.backgroundColor='#101010'
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
    var lg= newEl('text',{padding:'1px 2px',clear:'both',backgroundColor:'rgba(0, 0, 0, 0.55)'})
    lg.textContent=pm.legend+" "
    var di= newEl('text',{padding:'1px 2px',color:clrd,backgroundColor:'rgba(0, 0, 0, 0.55)'} )
    di.textContent="-"
   
    em.appendChild(lg); em.appendChild(di)
    
    //~ console.log(pm.scoper.paused)
    var wat={ 
      'scp':pm.scoper 
     ,'key':pm.varkey
     ,'type':pm.type
     ,'val':0
     ,'vala':[0,0,0,0,0]
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
      m.vala[0]=(m.vala[0]%4)+1
      m.vala[m.vala[0]]=cv
      m.val=(m.vala[1]+m.vala[2]+m.vala[3]+m.vala[4])/4
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

  function styleEl(el,sty){
    for(var k in sty){ el.style[k]=sty[k]	} 
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
   ,mez:mez
   ,seat: seat
   ,setseat: setseat
   ,setcolors:setcolors
   ,styleclass :styleclass
   ,togPane:togPane
   ,revealer:revealer
   ,addHTML:addHTML
   ,addAction:addAction
   ,pullAction:pullAction
   ,delGroup:delGroup
   ,button:button
   ,winwidth:winwidth
  }
}(arguments))}