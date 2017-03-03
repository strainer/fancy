// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// 

function setdash(cdash,vplay){
  
  var mez =Math.floor(cdash.mez)
  var winwidth =Math.floor(cdash.winwidth)
  var fez =Math.floor(mez+3)
  document.body.style.fontSize = fez+'px'	

  cdash.styleclass('global',{})
  cdash.styleclass('readings',{margin:'0 0 0 3px'})

  cdash.setcolors({
    clra: "#62be16" // entity    "#6e2", #dfcf78 pebbletan
   ,clrb: "#bbbb8e" // title     "#ee2", #ffcf59 orangemild
   ,clrc: "#916151" // border    "#676", #afaf78 pebbletanw #c25
   ,clrch:"#c16151" // border hover    "#676", #afaf78 pebbletanw #c25
   ,clrd: "#aebefe" // reading   "#eee"
   ,clre: "#141414" // backg   "#eee"
  })
  
  cdash.setseat({ //this is a div in 'threediv'
    zIndex:10
   ,position:'absolute'
   ,top:0,left:0
   ,fontFamily: 'monospace'
   //~ ,left:  Math.floor(ewi*0.125)
   //~ ,height:(winheight*0.3)+'px'
   //~ ,width: '10%'
   //~ ,backgroundColor: "#181f20"
   //,border: "1px dashed #73AD21"
   ,padding: "0px"
   ,fontSize: fez+'px'
   ,width:'100%'
  })
  
  //addtodash(parent,type,legend,varname,steez)

  //~ var leftcon = cdash.addpane(cdash.topel,{width:"50%",float:"left"})
  //~ var rightcon= cdash.addpane(cdash.topel,{width:"50%",float:"right"})
  var brd=1.2
  
  var fig_sel_div=cdash.addDiv({
    seat:cdash
   ,style:{
     position:'absolute'
    ,top:mez*3.5+'px',left:mez*brd+"px",width:fez*18+"px"
    }
    ,group:'dtop'	
    }) 

  var fig_display_div=cdash.addDiv({
    seat:cdash
   ,style:{
     position:'absolute'
    ,top:mez*5.5+'px',left:mez*brd+"px",width:fez*18+"px"
    }
    ,group:'dtop'	
    }) 

  var reading_div=cdash.addDiv({
    seat:cdash
   ,style:{
     position:'absolute'
    ,top:mez*8.5+'px',left:mez*brd+"px" ,width:fez*18+"px"
    }
   ,group:'dleft'	
    })

  var control_div=cdash.addDiv({
    seat:cdash
   ,style:{
     position:'absolute'
    ,top:mez*20+'px',left:mez*brd+"px",width:fez*18+"px"
    }
    ,group:'dtop'	
   })

  var keys_div=cdash.addDiv({
    seat:cdash
    ,style:{
     position:'absolute'
    ,top:mez+'px' ,right:mez*brd+"px" ,width:fez*15+"px"
    }
   ,group:'dright'	
    })
    
  // boards of can...
   
  var figwid=fez*16
 
  var dsselect= cdash.revealer({
    seat:fig_sel_div
   ,content:"Select Figment"
   ,upstyle:{ }
   ,instyle:{
     width:fez*16+'px'
    ,textAlign:'center'
    ,marginLeft:((winwidth-figwid)/2)+'px'
    ,backgroundColor:"#ffffff88",border:"9px",clear:'both',padding:"3px"}
   ,on:false
  })
  var dsreadings= cdash.revealer({
    seat:reading_div
   ,content:"Readings"
   ,upstyle:{ clear:'both',backgroundColor:"#ffffff88"}
   ,instyle:{ clear:'both',backgroundColor:"#ffffff88"}
   ,on:true
  })
  
  var keyrevealer= cdash.revealer({
    seat:keys_div
   ,content:"keys"
   ,upstyle:{float:'right'}
   ,instyle:{clear:'both',float:'right'}
   ,on:false
  })

  keysys.whenst("k"    , keyrevealer.click )
  
  // Multiline Function String - Nate Ferrero 
  var keystext=heredoc(function(){/*
  View
  &nbsp;&nbsp;&nbsp;&nbsp;<_> : track
  &nbsp;&nbsp;&nbsp;&nbsp;a_z : in out
  &nbsp;cursor : rotate
  crsr+ctrl: slide
  
  Time
  &nbsp;&nbsp; c : pause
  &nbsp;i_o : throttle
  &nbsp;&nbsp; u : reverse 
  
  Misc
  &nbsp;g : toggle grav
  &nbsp;x : expansion
  &nbsp;k : keys

  <br>
  */})

  cdash.addHTML(keyrevealer, keystext, {margin:'0 4px 0 0px'}   )

  cdash.reading({
    seat:fig_display_div
   ,type:'text1'
   ,legend:'>'
   ,scoper:vplay ,varkey:'world'
   ,style:'readings'
   ,group:'fu'
   ,func:function(a){ return vplay.worlds[a].name } 
  })
  
  cdash.reading({
    seat:dsreadings
   ,type:'text1'
   ,legend:'interlace:'
   ,scoper:vplay ,varkey:'runcycle_step'
   ,style:'readings'
   ,group:'fu' 
  }) 
  cdash.reading({
    seat:dsreadings
   ,type:'text1'
   ,legend:'freezefrm:'
   ,scoper:vplay ,varkey:'skipframe_step'
   ,style:'readings' 
   ,group:'fu'
  }) 
  cdash.reading({
    seat:dsreadings
   ,type:'runav'
   ,legend:'movsprfrm:'
   ,scoper:vplay ,varkey:'movperframe'
   ,style:'readings' 
   ,group:'fu' 
  })
  cdash.reading({
    seat:dsreadings
   ,type:'text1'
   ,legend:'figtime:'
   ,scoper:vplay ,varkey:'model_clock'
   ,style:'readings' 
   ,group:'fu'
   //~ ,func:function(a){ return a.toFixed(2) } 
  })
  cdash.reading({
    seat:dsreadings ,type:'text1' ,legend:'iota:'
   ,scoper:vplay ,varkey:'iota'
   ,style:'readings'
   ,group:'fu'
   ,func:function(a){ return (a-1).toFixed(0) } 
  })

  cdash.styleclass('mbutts',{display:'inline-block', padding:'0 0.1em' })
  
  for( var fi in vplay.worlds )
  { if(!isFinite(fi)){ continue }
    var leg=vplay.worlds[fi].name
    cdash.button({
      legend:leg ,param:fi ,callb:setupfigview ,closes:true
     ,seat:dsselect,style:'mbutts',group:'fu',type:'text1',on:true
    })
  }
    
  cdash.button({
    seat:control_div
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