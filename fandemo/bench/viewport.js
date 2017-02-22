// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// viewport.js - viewport for figments

function newViewport(fig,vplay){ 
  
  var jote=fig.jote 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
  //-------------------------------------------------------//
  
  var vport={},thrLc,thrCl  //three arrays

  function initview(container) {
      
    if(vplay.geometry.addAttribute){
      //~ vplay.renderer.domElement=null 
      // Stop the animation
      //cancelAnimationFrame(this.id);
      //remove listener to render
      //this.renderer.domElement.addEventListener('dblclick', null, false); 
      vplay.scene = null
      vplay.projector = null
      vplay.camera = null
      emptyElement(container)
    }

    vplay.camera = new THREE.PerspectiveCamera( 18
      ,( window.innerWidth-vplay.displaybugi) / (window.innerHeight-vplay.displaybugi)
      , 0.01, 40000 )

    vplay.scene = new THREE.Scene()
    //vplay.scene.fog = new THREE.Fog( 0x000000, 500, 4500 )

    vplay.geometry = new THREE.BufferGeometry()

    vplay.geometry.addAttribute('position',new Float32Array( vplay.particles * 3 ), 3 )
    vplay.geometry.addAttribute('color',   new Float32Array( vplay.particles * 3 ), 3 )

    vplay.geometry.computeBoundingSphere()

    var material = new THREE.ParticleSystemMaterial( { size: vplay.pradius, vertexColors: true } )

    vplay.particleSystem = new THREE.ParticleSystem( vplay.geometry, material )
    vplay.scene.add( vplay.particleSystem )

    vplay.camera.position.z = vplay.camRad
    
    vplay.particleSystem.rotation.x= vplay.camPhi
    vplay.particleSystem.rotation.y= vplay.camThet
    vplay.particleSystem.rotation.z= 0

    vplay.renderer = new THREE.WebGLRenderer( { antialias: true } )
    vplay.renderer.setClearColor( 0x000000, 0 )

    vplay.renderer.setSize( 
      window.innerWidth-vplay.displaybugi   //set to container size
     ,window.innerHeight-vplay.displaybugi 
    )

    container.appendChild( vplay.renderer.domElement ) 
    
    thrLc=vplay.geometry.getAttribute( 'position' ).array
    thrCl=vplay.geometry.getAttribute( 'color' ).array 
    //set default particle location way off so it doesnt
    //bug a black dot in center of jorld
    for(var i=0,e=thrLc.length;i<e;i++)
    { thrLc[i]=3333 }
    
    velcolor(vplay.colorfac)
    velcolor(vplay.colorfac)
    velcolor(vplay.colorfac)
  }
  
  var focus={ chng:0, jc:0,jd:-1,je:0, sc:1,sd:1 ,timer:0, x:0,y:0,z:0 }
  
  function reFocusThree(jd,js){
    if(jd==-1){ focus.jd=-1; return } 
    jd=(jote.top+jd)%jote.top
    js = js || [ ]
    //~ if(jd!=0){ js.push(0) }
    if(jd+1<jote.top){ js.push(jd+1)}else{ js.push(jd-2) }
    if(jd-1>0){ js.push(jd-1)}else{ js.push(jd+2) }
    
    var ss=0
    for(var j=0;j<js.length;j++){
      var jr=js[j]
      ss+= Math.sqrt(
       (jote.x[jd]-jote.x[jr])*(jote.x[jd]-jote.x[jr])
      +(jote.y[jd]-jote.y[jr])*(jote.y[jd]-jote.y[jr])
      +(jote.z[jd]-jote.z[jr])*(jote.z[jd]-jote.z[jr])
      )
    }
    focus.sd= 1/((Math.sqrt(ss))/js.length)
    console.log("jd",jd) 
    console.log("focus",focus.sd) 
   ,focus.jd= jd
   ,focus.timer= 10
   
   focus.chng=1
   focus.je=jd
   //~ console.log(jote.foc)
  }
  
  function syncrender(pace)
  { 
    velcolor(vplay.colorfac)
    
    if(focus.timer)
    { 
      var jd=focus.jd
      pace=pace||1
      //f = f -(f-j)/timer
      focus.timer=focus.timer*0.9-0.1
      if(focus.timer<0){ focus.timer=0 }	
      pace*=focus.timer*0.15
      focus.x-= (focus.x-jote.x[jd]-jote.vx[jd]*pace)/(focus.timer+1)
      focus.y-= (focus.y-jote.y[jd]-jote.vy[jd]*pace)/(focus.timer+1)
      focus.z-= (focus.z-jote.z[jd]-jote.vz[jd]*pace)/(focus.timer+1)
      focus.sc-= (focus.sc-focus.sd)/(focus.timer+1)
    
      if(focus.timer===0){ 
        focus.je=focus.jc=focus.jd
        focus.chng=0 
      }
      
      //~ console.log(focus.timer,focus.x,focus.sc)
    }else{
      if(focus.jd!=-1){
        focus.x=jote.x[focus.jc]
       ,focus.y=jote.y[focus.jc]
       ,focus.z=jote.z[focus.jc]
     }
    }
    
    var sc=focus.sc
    for(var i=0,j=0;j<jote.top;j++)
    { thrLc[i++]=(jote.x[j]-focus.x)*sc 
     ,thrLc[i++]=(jote.y[j]-focus.y)*sc 
     ,thrLc[i++]=(jote.z[j]-focus.z)*sc }
   
    for(var i=0,ie=jote.top*3; i<ie; i++)
    { thrCl[i]=jote.ccolor[i] }
  
  }

  function velcolor(f)
  { 
    for(var i=0,j=-1; i<jote.top; i++)
    { var k=(rndh()+0.5)*0.15*f
      
      jote.ccolor[++j] = 
        0.4*(jote.ccolor[j]+ jote.bcolor[j]*0.6 
        + (k))
      jote.ccolor[++j] = 
        0.4*(jote.ccolor[j]+ jote.bcolor[j]*0.6 
        + (k))
      jote.ccolor[++j] = 
        0.4*(jote.ccolor[j]+ jote.bcolor[j]*0.6 
        + (k))
    }
  }
  
  function ctrlcam() //primitive camera movement
  {
    vplay.geometry.attributes.color.needsUpdate = true
    vplay.geometry.attributes.position.needsUpdate = true

    vplay.keyXd = (vplay.keyX===0)?0:(vplay.keyXd+(vplay.keyX*0.0028))*0.985
    vplay.keyYd = (vplay.keyY===0)?0:(vplay.keyYd+(vplay.keyY*0.0028))*0.985
    vplay.keyZd = (vplay.keyZ===0)?0:(vplay.keyZd+(vplay.keyZ*0.0025))*0.91

    if(vplay.keyCtrl){
      vplay.camera.position.x-= Math.abs(vplay.camera.position.z)*vplay.keyXd*0.00255+vplay.keyXd*0.0175
      vplay.camera.position.y+= Math.abs(vplay.camera.position.z)*vplay.keyYd*0.00255+vplay.keyYd*0.0175 
      
       if(true){ //drifting sea of forgotten teardrops
        if(vplay.driftCount<0.02){ vplay.driftCount+=vplay.camDrift}
        if(vplay.keyYd||vplay.keyXd||vplay.keyZd)
        { vplay.driftCount=0 }
        //~ vplay.driftCount=0.1
        var vva=0.007 ,vvb=0.004 ,vvc=0.006
        var dfa=Math.sin(vplay.playedframe_clock*vva)*0.8+Math.sin((vplay.playedframe_clock+300)*vva*0.7)
        var dfb=dfa+Math.sin((vplay.playedframe_clock+500)*vva*0.3)*0.7+Math.sin((vplay.playedframe_clock+200)*vva*0.6)
        var dfc=dfb+Math.sin((vplay.playedframe_clock+900)*vva)*0.7+Math.sin((vplay.playedframe_clock+200)*vva*0.6)
        
        vplay.camRad/=(1+(dfc+dfb*2)*vvb*vplay.driftCount)
        vplay.camThet -= dfb*vvc*vplay.driftCount*0.9
        vplay.camPhi -= (dfa+dfc*0.5)*vvc*vplay.driftCount
      } 
      
    }else{
      vplay.camRad  /= 1-vplay.keyZd*0.1
      vplay.camThet -= vplay.keyXd*0.0325
      vplay.camPhi  -= vplay.keyYd*0.0325
      
      if(vplay.keyXd||vplay.keyYd||vplay.keyZd)
      { vplay.camera.position.x*=0.994
        vplay.camera.position.y*=0.994 }
    }
    
    //~ var camo=Fgm.tocarte(vplay.camRad,vplay.camThet,vplay.camPhi)
    //~ vplay.camera.position.x=camo[0]
    //~ vplay.camera.position.y=camo[1]
    //~ vplay.camera.position.z=camo[2]
    vplay.camera.position.z=vplay.camRad
    
    vplay.particleSystem.rotation.x= vplay.camPhi
    vplay.particleSystem.rotation.y= vplay.camThet
    vplay.particleSystem.rotation.z= 0

    //vplay.camera.lookAt(origin3)
    
    //~ vplay.camera.position.z = vplay.camera.position.z + vplay.keyZ*5
    //~ vplay.camera.position.x = vplay.camera.position.x - vplay.keyX/2 
    //~ vplay.camera.position.y = vplay.camera.position.y - vplay.keyY/2 
    //~ vplay.particleSystem.rotation.y = vplay.particleSystem.rotation.y +vplay.keyX/20
    //~ vplay.particleSystem.rotation.x = vplay.particleSystem.rotation.x -vplay.keyY/20
    
  }
  
  function spincam()
  {
    vplay.geometry.attributes.color.needsUpdate = true
    vplay.geometry.attributes.position.needsUpdate = true
    
    var cammv=Math.sin(vplay.playedframe_clock/280)
    var cammv2=Math.sin(vplay.playedframe_clock/(280*6))

    vplay.camera.position.z+=         Math.abs(cammv)*cammv*2.0 -cammv2/22
    vplay.particleSystem.rotation.y+= Math.pow(Math.sin(vplay.playedframe_clock/400),25)/30
    vplay.particleSystem.rotation.x+= Math.pow(Math.sin(vplay.playedframe_clock/1600),45)/15
    
  }

  window.addEventListener( 'resize', onWindowResize, false )

  function onWindowResize() {

    vplay.camera.aspect = 
      (window.innerWidth-vplay.displaybugi) / (window.innerHeight-vplay.displaybugi)
    vplay.camera.updateProjectionMatrix()
    vplay.renderer.setSize( 
      window.innerWidth-vplay.displaybugi, window.innerHeight-vplay.displaybugi )
  }
  
  vport.spincam      = spincam 
  vport.ctrlcam      = ctrlcam 
  vport.focus        = focus 
  vport.initview     = initview
  vport.velcolor     = velcolor 
  vport.syncrender   = syncrender
  vport.reFocusThree = reFocusThree
  
  return vport
}












/*

var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-10, 0, 0)); //line drawn
geometry.vertices.push(new THREE.Vector3(0, 10, 0));  //vector to vector
geometry.vertices.push(new THREE.Vector3(10, 0, 0));
var line = new THREE.Line(geometry, material);
scene.add(line);


var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
var material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );

sphere.position.set( x, y, z ); 
sphere.scale.set( 1, 1, 1 );
sphere.overdraw = true;

// add the sphere to the scene

scene.add( sphere );

*/