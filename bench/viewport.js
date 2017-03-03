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
    vport.camlook=new THREE.Vector3(-0,-0,-0)
    vport.camup=new THREE.Vector3(0,1,0)

    vplay.scene = new THREE.Scene()
    //vplay.scene.fog = new THREE.Fog( 0x000000, 500, 4500 )

    //this is an object to be rendered in a scene
    // of particles, with position and color attributes
       
    if(vplay.rendermode===0){
      vplay.geometry = new THREE.BufferGeometry()
      vplay.geometry.addAttribute('position',new Float32Array( vplay.particles * 3 ), 3 )
      vplay.geometry.addAttribute('color',   new Float32Array( vplay.particles * 3 ), 3 )

      //this may happen automatically
      vplay.geometry.computeBoundingSphere()

      var material = new THREE.ParticleSystemMaterial( { size: vplay.pradius, vertexColors: true } )

      vplay.particleSystem = new THREE.ParticleSystem( vplay.geometry, material )
    
      vplay.scene.add( vplay.particleSystem )

      vplay.camera.position.z = vplay.camRad
      
      vplay.particleSystem.rotation.x= vplay.camPhi
      vplay.particleSystem.rotation.y= vplay.camThet
      vplay.particleSystem.rotation.z= 0
    
    }
    
    _x=0,_y=0,_z=0
    
    var material2 = new THREE.LineBasicMaterial({ color: 0xffffff });
    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(0, 0, 0)); //line drawn
    geometry2.vertices.push(new THREE.Vector3(_x, _y, _z));  //vector to vector
    geometry2.computeBoundingSphere()
    var dbline = new THREE.Line(geometry2, material2);
    vplay.geo2=geometry2
    vplay.dbline=dbline
    vplay.scene.add(vplay.dbline);
       
    
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
    
    if(focus.timer){ changingfocus(pace) }
    else if(focus.jd!=-1){
      focus.x=jote.x[focus.jc]
     ,focus.y=jote.y[focus.jc]
     ,focus.z=jote.z[focus.jc]
    }
    
    var sc=focus.sc
    for(var i=0,j=0;j<jote.top;j++)
    { thrLc[i++]=(jote.x[j]-focus.x)*sc 
     ,thrLc[i++]=(jote.y[j]-focus.y)*sc 
     ,thrLc[i++]=(jote.z[j]-focus.z)*sc }
   
    for(var i=0,ie=jote.top*3; i<ie; i++)
    { thrCl[i]=jote.ccolor[i] }
  
  }

  function syncrender2(pace)
  { 
    velcolor(vplay.colorfac)
    
    if(focus.timer){ changingfocus(pace) }
    else if(focus.jd!=-1){
      focus.x=jote.x[focus.jc]
     ,focus.y=jote.y[focus.jc]
     ,focus.z=jote.z[focus.jc]
    }
    
    if (focus.sc!=focus.bsc)
    { var sc=focus.sc, isc=1/sc 
      focus.bsc=focus.sc }
    
    for(var i=0,j=0;j<jote.top;j++)
    { 
      var vj=vport.visjote[i]
      if(sc){ vj.scale.set( isc, isc, isc ) }
      vj.position.set( 
        (jote.x[j]-focus.x)*sc
        (jote.y[j]-focus.y)*sc
        (jote.z[j]-focus.z)*sc
      )
      
      vj.material.color.set(
        jote.ccolor[i++]
       ,jote.ccolor[i++]
       ,jote.ccolor[i++]
      )
    }
  }

  function changingfocus(pace){
  
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

    if(vplay.keyCtrl){ //autodrift and shift lookat
      
      _topolar( //direction in xy plane we are looking

       vport.camlook.x-vplay.camera.position.x 
      ,0//vport.camlook.y-vplay.camera.position.y //our y is up down 
      ,vport.camlook.z-vplay.camera.position.z 
       )

      _tocarte(_rad,_the,_phi)  // center line in xz plane 
      vport.camlook.x+=_x*vplay.keyYd*0.00255+vplay.keyYd*0.0175
      vport.camlook.z+=_z*vplay.keyYd*0.00255+vplay.keyYd*0.0175

      _tocarte(_rad,_the+Pi/2,_phi)  // false right 
      
      vport.camlook.x+=_x*vplay.keyXd*0.00255+vplay.keyXd*0.0175
      vport.camlook.y+=_y*vplay.keyXd*0.00255+vplay.keyXd*0.0175


      //~ console.log(vplay.dbline)
      
      vplay.dbline.geometry.vertices[1].x=_x
      vplay.dbline.geometry.vertices[1].y=_y
      vplay.dbline.geometry.vertices[1].z=_z
      vplay.dbline.geometry.verticesNeedUpdate=true
      vplay.dbline.geometry.computeBoundingSphere()
      
      /*
      geometry = new THREE.Geometry();
      geometry.vertices = vertices;

      scene.remove( line );
      line = new THREE.Line( geometry, material )
      scene.add( line );
      
      */
      
      
      
      if(true){ //is drifting sea of forgotten teardrops
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
 
    }else{ //not pressed ctrl
      vplay.camRad  /= 1-vplay.keyZd*0.1
      vplay.camPhi  -= vplay.keyYd*0.0325
      
      if(vplay.camPhi>Pi){ //flip hoz spin if past gimbal points
        vplay.camThet -= vplay.keyXd*0.0325
      }else{
        vplay.camThet += vplay.keyXd*0.0325
      }
      
      if(vplay.keyXd||vplay.keyYd||vplay.keyZd)
      { //return focus to center while rotating
        vport.camlook.set(
          vport.camlook.x*0.994
         ,vport.camlook.y*0.994
         ,vport.camlook.z)
      }
    }
    
    //~ var camo=Fgm.tocarte(vplay.camRad,vplay.camThet,vplay.camPhi)
    //~ vplay.camera.position.x=camo[0]
    //~ vplay.camera.position.y=camo[1]
    //~ vplay.camera.position.z=camo[2]
    
    vplay.camPhi=(vplay.camPhi+Tau)%Tau
     
    _tocarte(vplay.camRad,vplay.camPhi,vplay.camThet)
    //~ console.log(vplay.camPhi,vplay.camThet)
    // Place camera on x axis
    //~ vplay.camera.position.set(_x,_y,_z);
    //~ vplay.camera.position.set(_z,_x,_y); //warp
    //~ vplay.camera.position.set(_y,_z,_x); //opposite, gimlocks
    //~ vplay.camera.position.set(_y,_x,_z); //semi oppo
    //~ vplay.camera.position.set(_z,_y,_x); //closest
    vplay.camera.position.set(_x,_z,_y);
    
    //invert on Phi crossing 0 and PI
    var up=(vplay.camPhi>Pi)?1:-1
    vport.camup.set(0,up,0)
    vplay.camera.up = vport.camup;
    vplay.camera.lookAt(vport.camlook);

    //~ vplay.camera.position.z=_z
    //~ vplay.camera.position.y=_y
    //~ vplay.camera.position.x=_x
    
    //~ vplay.camera.lookAt(0,0,0)
    
    //~ vplay.particleSystem.rotation.x= vplay.camPhi
    //~ vplay.particleSystem.rotation.y= vplay.camThet
    //~ vplay.particleSystem.rotation.z= 0

    //vplay.camera.lookAt(origin3)
    
    //~ vplay.camera.position.z = vplay.camera.position.z + vplay.keyZ*5
    //~ vplay.camera.position.x = vplay.camera.position.x - vplay.keyX/2 
    //~ vplay.camera.position.y = vplay.camera.position.y - vplay.keyY/2 
    //~ vplay.particleSystem.rotation.y = vplay.particleSystem.rotation.y +vplay.keyX/20
    //~ vplay.particleSystem.rotation.x = vplay.particleSystem.rotation.x -vplay.keyY/20
    
  }
  
  var _x,_y,_z
  function _tocarte(r,t,p) {
    _x=r*Math.sin(t)*Math.cos(p)
    _y=r*Math.sin(t)*Math.sin(p)
    _z=r*Math.cos(t)
  }
  var _the,_phi,_rad
  function _topolar(x,y,z) {
    _rad = Math.sqrt(x*x+y*y+z*z+1.0e-40)
    _the = Math.acos(z/_rad) 
    _phi = Math.atan2(y,x) 
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

sphere.overdraw = true; //overlaps edges slightly

// add the sphere to the scene

scene.add( sphere );

*/