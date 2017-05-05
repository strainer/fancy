// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// viewport.js - viewport for figments

function newViewport(fig,vplay){ 
  
  var jote=fig.jote, jkind=fig.jkind 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
  //-------------------------------------------------------//
  
  var vport={},thrLc,thrCl  //three arrays
  
  function onMouseDown(e) {
    
    var dm=vplay.renderer.domElement  ,camera=vplay.camera
    
    var rex= (e.clientX-dm.clientLeft)/dm.clientWidth
      , rey= (e.clientY-dm.clientTop)/dm.clientHeight
    
    if(rex>1||rey>1) return

    var mpick = new THREE.Vector3(rex*2 - 1  , 1 - rey*2, 0.5)
    
    //fill of 'pickingray' for old three version here: 
    
    var tan = Math.tan( 0.5 * THREE.Math.degToRad( camera.fov ) )
    mpick.x *= tan * camera.aspect
    mpick.y *= tan 
    mpick.z = - 1
    mpick.transformDirection( camera.matrixWorld ) 
    //~ fudgeline( vplay.camera.position , mpick )
    
    fig.measure_spots()
    
    var jpick=fig.jotesonray( 
     { x:vplay.camera.position.x/focus.sc+focus.x 
      ,y:vplay.camera.position.y/focus.sc+focus.y
      ,z:vplay.camera.position.z/focus.sc+focus.z
     },{ 
       x:mpick.x
      ,y:mpick.y
      ,z:mpick.z 
     })
      
      
    if(jpick.n){ reFocusThree(jpick.ar[0]) }
    else{ reFocusThree(-1) }
    
  } 
  // 3pos = (jpos-focp)*focs
  // 3pos/focs+focp=jpos
  
  function initview(container) {
    if(!vplay.renderer.domElement){
      
      vplay.renderer = new THREE.WebGLRenderer( { 
        antialias: true
       ,logarithmicDepthBuffer: true 
      } )

      vplay.renderer.setClearColor( 0x000000, 0 )

      container.appendChild( vplay.renderer.domElement )
       
      vplay.renderer.setSize( 
        window.innerWidth-vplay.displaybugi   //set to container size
       ,window.innerHeight-vplay.displaybugi 
      )

      vplay.scene = new THREE.Scene()
      
    }

    vplay.camspan=18
    vplay.camera = new THREE.PerspectiveCamera( vplay.camspan
      ,( window.innerWidth-vplay.displaybugi) / (window.innerHeight-vplay.displaybugi)
      , 0.0000001, 400000000 )
    vport.camlook=new THREE.Vector3(-0,-0,-0)
    vport.camup=new THREE.Vector3(0,1,0)

    //clear scene 
    for(var kid=vplay.scene.children.length-1;kid>=0;kid--)
    { vplay.scene.remove(vplay.scene.children[kid]) } 
 
    document.addEventListener('mousedown', onMouseDown, false);
 
    focus.ring={ 
      x:ringbuff(5)
     ,y:ringbuff(5)
     ,z:ringbuff(5)
    }
          
    if(vplay.rendermode===0){
      vport.syncrender=syncrender
      
      vplay.geometry = new THREE.BufferGeometry()
      
      /* //proper way
      thrLc = new Float32Array( vplay.particles * 3 )
      vplay.geometry.addAttribute( 'position', new THREE.BufferAttribute( thrLc, 3 ) )
      */
      
      //~ thrLc=new Float32Array( vplay.particles * 3 )
      //~ vplay.geometry.addAttribute(
       //~ 'position',new THREE.BufferAttribute( thrLc, 3 )
      //~ )
      
      vplay.geometry.addAttribute('position',new Float32Array( vplay.particles * 3 ), 3 )
      vplay.geometry.addAttribute('color',   new Float32Array( vplay.particles * 3 ), 3 )

      //this may happen automatically
      vplay.geometry.computeBoundingSphere()

      var material = new THREE.ParticleSystemMaterial( 
      { size: vplay.pradius, vertexColors: true } )

      vplay.particleSystem = new THREE.ParticleSystem( vplay.geometry, material )
    
      vplay.scene.add( vplay.particleSystem )
      
      //~ vplay.particleSystem.rotation.x= vplay.camPhi
      //~ vplay.particleSystem.rotation.y= vplay.camThet
      //~ vplay.par`ticleSystem.rotation.z= 0
        
      thrLc=vplay.geometry.getAttribute( 'position' ).array
      thrCl=vplay.geometry.getAttribute( 'color' ).array 
      
      //set default particle location way off so it doesnt
      //bug a black dot in center of jorld
      for(var i=0,e=thrLc.length;i<e;i++)
      { thrLc[i]=3333 }
      
      velcolor(vplay.colorfac)
      velcolor(vplay.colorfac)
      velcolor(vplay.colorfac)
                             
    }else if(vplay.rendermode===1){
      
      var ambientLight = new THREE.AmbientLight(0xcccccc);
      vplay.scene.add(ambientLight); 

      //~ var sphereSize = 1;
      //~ var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
      //~ scene.add( pointLightHelper );
      
      //color, intensity, distance, decay 
      var pointLight = new THREE.PointLight(0xffffff,1,0,0.01)
      
      //light color for trappist
      if(vplay.world==2) pointLight = new THREE.PointLight(0xff1111,1,0,0.01)
      
      vplay.plight=pointLight
      vplay.plight.position.set(0,0,0)
      vplay.scene.add(pointLight) 
      
      //Adding a directional light source to see anything..
      //~ var directionalLight = new THREE.DirectionalLight(0xffffff);
      //~ directionalLight.position.set(0, 0, 0);
      //~ vplay.scene.add(directionalLight);
            
      vport.syncrender=syncrender2
      vport.visjote=[] //array of sphere geometrys
      /*
      var vis=[]  //16 lines for visguide
      
      var mat = new THREE.LineBasicMaterial({ color: 0x00aa00 })
      
      var ka=[ 1, 1,-1,-1, 2, 2,-2,-2 ]
         ,kb=[ 1,-1,-1, 1, 2,-2,-2, 2 ]
         ,kk=[1.5,1.5,1.5,1.5,3,3,3,3 ]
         ,vq
         
      for(var L=0,n=0;n<8;n++){
        vis[L] = new THREE.Line( new THREE.Geometry(), mat ) 
        vq=new THREE.Vector3( 0-kk[n],ka[n],kb[n] )
        vis[L].geometry.vertices.push( vq ) 
        vq=new THREE.Vector3( 0+kk[n],ka[n],kb[n] )
        vis[L].geometry.vertices.push( vq )
        vplay.scene.add(vis[L])
        L++
        vis[L] = new THREE.Line( new THREE.Geometry(), mat ) 
        vq=new THREE.Vector3( ka[n],0-kk[n],kb[n] )
        vis[L].geometry.vertices.push( vq ) 
        vq=new THREE.Vector3( ka[n],0+kk[n],kb[n] )
        vis[L].geometry.vertices.push( vq )
        vplay.scene.add(vis[L])
        L++
        vis[L] = new THREE.Line( new THREE.Geometry(), mat ) 
        vq=new THREE.Vector3( ka[n],kb[n],0-kk[n] )
        vis[L].geometry.vertices.push( vq ) 
        vq=new THREE.Vector3( ka[n],kb[n],0+kk[n] )
        vis[L].geometry.vertices.push( vq )
        vplay.scene.add(vis[L])
        L++
      }
      
      vport.vislines=vis
      */
    }
  }
  
  function ringbuff(sz){ return (function(sz){
    
    var buf=new Array(sz), ng=sz, nx=0 
    
    var reto={ add:addpre ,fir:firpre, reset:reset } 
    
    function reset(){
      reto.add=addpre, reto.fir=firpre, nx=0 
    }
    
    function addpre(x){
      buf[nx]=x
      nx=modp(nx+1,ng)
      if(nx===0){ reto.add=add,reto.fir=fir }
    }
      
    function add(x){
      buf[nx]=x
      nx=modp(nx+1,ng)
    }
    
    function firpre(){ return buf[modp(nx-1,ng)] }
    
    function fir(){ //0.29 +0.27 +0.21 +0.15 +0.08
      return buf[modp(nx-1,ng)]*0.29 
      + buf[modp(nx-2,ng)]*0.27 
      + buf[modp(nx-3,ng)]*0.21 
      + buf[modp(nx-4,ng)]*0.15 
      + buf[modp(nx-5,ng)]*0.08 
    }
    
    function modp(a,b){
      return a-Math.floor(a/b)*b //removes neg
    }
    
    return reto
  }(sz)) }
  
  
  function updatefocusxyz(){
  
    focus.ring.x.add(jote.x[focus.jc])
    focus.ring.y.add(jote.y[focus.jc])
    focus.ring.z.add(jote.z[focus.jc])
    
    if(!(focus.jd==-1 || focus.timer)){
      focus.x=focus.ring.x.fir()
      focus.y=focus.ring.y.fir()
      focus.z=focus.ring.z.fir()
    }
  }
  
  function syncrender(pace)
  { 
    velcolor(vplay.colorfac)
    
    if(focus.jd!=-1){
      if(focus.timer){ 
        changingfocus(pace) 
        focus.ring.x.reset()
        focus.ring.y.reset()
        focus.ring.z.reset()
      }
    }
    
    var sc=focus.sc
    for(var i=0,j=0;j<jote.top;j++)
    { thrLc[i++]=(jote.x[j]-focus.x)*sc 
     ,thrLc[i++]=(jote.y[j]-focus.y)*sc 
     ,thrLc[i++]=(jote.z[j]-focus.z)*sc }
   
    for(var i=0,ie=jote.top*3; i<ie; i++)
    { thrCl[i]=jote.ccolor[i] }
    
    if(vplay.seespots) { vboxspot() }
    
    vplay.geometry.attributes.color.needsUpdate = true
    vplay.geometry.attributes.position.needsUpdate = true	
  }

  var qcount=0
  function syncrender2(pace)
  { 
    //~ velcolor(vplay.colorfac)
    if(focus.jd!=-1){
      if(focus.timer){ 
        changingfocus(pace) 
        focus.ring.x.reset()
        focus.ring.y.reset()
        focus.ring.z.reset()
      }
    }
    
    var drawscale=focus.sc, resc=0
    
    if (focus.sc!==focus.bsc)
    { focus.bsc=focus.sc, resc=focus.sc}
    
    if(jote.top>(vport.jtop||0)){
      vis_spheres( (vport.jtop||0) , jote.top )
    }
    
    var mindot=(vplay.camRad)/(1000)
    
    //~ console.log("minoo",vplay.camRad,drawscale,mindot)
    
    vplay.plight.position.set(
      (jote.x[0]-focus.x)*drawscale
      ,(jote.y[0]-focus.y)*drawscale
      ,(jote.z[0]-focus.z)*drawscale
    )
    
    //~ if(qcount++%50==1){ console.log(vplay.plight) }
        
    for(var i=0,j=0;j<jote.top;j++)
    { 
      var vj=vport.visjote[j]
      if(resc){  //this is done in ctrlcam 
        var isc=drawscale*(jkind.rad[ jote.knd[j] ])
        if(isc<mindot){ isc=mindot }
        vj.scale.set( isc, isc, isc ) 
      }
      vj.position.set( 
        (jote.x[j]-focus.x)*drawscale
       ,(jote.y[j]-focus.y)*drawscale
       ,(jote.z[j]-focus.z)*drawscale
      )
      
      //~ vj.material.color.set(
        //~ jote.ccolor[i++]
       //~ ,jote.ccolor[i++]
       //~ ,jote.ccolor[i++]
      //~ )
      
      
      if(vplay.seespots) { vboxspot() }
    }
  }

  function vis_spheres(j,k){
    
    //~ var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 )
    
    var geometry = new THREE.SphereGeometry( 1, 36, 18 )
    //~ var geometry = new THREE.BufferGeometry().fromGeometry( sphereGeometry )
    
    //~ var geometry = new THREE.Geometry();

    //~ vplay.scene.add(vplay.dbline);

    for( ;j<k;j++){ 
      
      //~ var material = new THREE.MeshLambertMaterial( )
      
      var material = new THREE.MeshLambertMaterial( { overdraw: 0.5 } );
      //~ var material = new THREE.MeshNormalMaterial( {depthTest: false} )
      //~ console.log(vplay.scene)
      material.color.r=jote.bcolor[j*3]  *0.5
      material.ambient.r=jote.bcolor[j*3]  *0.5
      material.color.g=jote.bcolor[j*3+1]*0.5
      material.ambient.g=jote.bcolor[j*3+1]*0.5
      material.color.b=jote.bcolor[j*3+2]*0.5
      material.ambient.b=jote.bcolor[j*3+2]*0.5
      
      var sphere = new THREE.Mesh( geometry, material )
      
      //~ var material2 = new THREE.LineBasicMaterial({ color: 0xffffff });
      //~ geometry.vertices.push(new THREE.Vector3(0, 0, 0)); //line drawn
      //~ geometry.vertices.push(new THREE.Vector3(1, 1, 1));  //vector to vector
      //~ geometry.vertices.push(new THREE.Vector3(-1, -1, -1));  //vector to vector
      //~ geometry.computeBoundingSphere()
      //~ var sphere = new THREE.Line(geometry, material2);
      
      sphere.position.set( jote.x[j], jote.y[j], jote.z[j] ) 
      
      var ss=jkind.rad[jote.knd[j]]*focus.sc+Math.sqrt(focus.sc*10)
      sphere.scale.set( ss, ss, ss )
      //sphere.overdraw = true //overlaps edges slightly
      vplay.scene.add( sphere )
      //~ console.log("added")
      vport.visjote[j] = sphere
    } 
    vport.jtop=k
  }


  function fudgeline(a,b){
    if(!('vbex' in vport)){ vport.vbex=[] }
    
    var d=vport.vbex.length, mag=15000
    //~ var vtex =[ //trace a cuboid, 15 links over 12 edges
      //~ [0, 0, 0] 
     //~ ,[(b.x-a.x)*mag, (b.y-a.y)*mag, (b.z-a.z)*mag]
    //~ ]
    var vtex =[ //trace a cuboid, 15 links over 12 edges
      [a.x,a.y,a.z] 
     ,[a.x+b.x*mag, a.y+b.y*mag, a.z+b.z*mag] 
    ]
          
    vport.vbex[d] = new THREE.Line( 
      new THREE.Geometry()
     ,new THREE.LineBasicMaterial({ 
       color: 0xff5f5f, opacity: 1 ,transparent:false
     }) 
    )

    for(var c=0;c<vtex.length;c++){
      vport.vbex[d].geometry.vertices.push(
        new THREE.Vector3( vtex[c][0], vtex[c][1], vtex[c][2] )
      )
    }
    
    //whay nay?
    vport.vbex[d].geometry.computeBoundingSphere()
    vplay.scene.add( vport.vbex[d] )
    //vport.vbex[d].position.set( a.x,a.y,a.z )
    vport.vbex[d].scale.set(1,1,1)
    vport.vbex[d].visible=true

    console.log("tis",vtex[0],vtex[1])
  }

  function setupvbox(){
    vport.vbox=[]

    var n=-0.5 ,p=0.5	
    var vtex =[ //trace a cuboid, 15 links over 12 edges
      [n, n, n] 
     ,[n, n, p] ,[p, n, p] ,[p, n, n] ,[p, n, p] 
     ,[p, p, p] ,[n, p, p] ,[n, n, p] ,[n, p, p]
     ,[n, p, n] ,[p, p, n] ,[p, p, p] ,[p, p, n]
     ,[p, n, n] ,[n, n, n] ,[n, p, n]
    ]
          
    vport.vbox[0] = new THREE.Line( 
      new THREE.Geometry()
     ,new THREE.LineBasicMaterial({ 
       color: 0xffffff, opacity: 0.5 ,transparent:true
     }) 
    )

    for(var c=0;c<vtex.length;c++){
      vport.vbox[0].geometry.vertices.push(
        new THREE.Vector3( vtex[c][0], vtex[c][1], vtex[c][2] )
      )
    }
    
    //whay nay?
    vport.vbox[0].geometry.computeBoundingSphere()
    vplay.scene.add( vport.vbox[0] )
  }
  
  
  var ccc=0
  function vboxspot(turnoff){
    
    var spot =fig.spot
    if(!vport.hasOwnProperty('vbox')){ setupvbox() } //made a vbox

    //~ if('vbex' in vport && vport.vbex.length){
      //~ console.log("exists")
      //~ vplay.scene.add( vport.vbex[0] )
      //~ vport.vbex[0].visible=true
      //~ if(ccc++<10){ console.log(vport.vbex[0])} 
    //~ }
    
    if((turnoff||vplay.seespots==-1)){
      
      //~ if( vport.vbox[1].visible )
      for(var si=0; si<vport.vbox.length;si++)
      { vport.vbox[si].visible=false }
      
      return
    }
    
    //topup vboxlist
    if(vport.vbox.length<spot.top){
      for(var d=vport.vbox.length; d<spot.top;d++){
        vport.vbox[d]=vport.vbox[0].clone()
        vplay.scene.add( vport.vbox[d] )
      }
    }
    
    //pos and scale for every spot
    for(var si=0;si<spot.top;si++){
      
      if(spot.parent[si]){
          
        var px=(spot.lbx[si]+spot.hbx[si])*0.5
           ,sx=(spot.hbx[si]-spot.lbx[si])+0.03
           ,py=(spot.lby[si]+spot.hby[si])*0.5
           ,sy=(spot.hby[si]-spot.lby[si])+0.03
           ,pz=(spot.lbz[si]+spot.hbz[si])*0.5
           ,sz=(spot.hbz[si]-spot.lbz[si])+0.03
        
        vport.vbox[si].position.set( 
          (px-focus.x)*focus.sc
         ,(py-focus.y)*focus.sc
         ,(pz-focus.z)*focus.sc )
           
        vport.vbox[si].scale.set( 
          sx*focus.sc
         ,sy*focus.sc
         ,sz*focus.sc )
      
        vport.vbox[si].visible=true
      }else{vport.vbox[si].visible=false}
    }
    
    //disable the rest
    for(var si=spot.top; si<vport.vbox.length;si++)
    { vport.vbox[si].visible=false }
  }


  var focus={ 
    chng:0, wc:-1, distb:0, jc:0,jd:-1,je:0, sc:1,sd:1 ,cam:0, timer:0, x:0,y:0,z:0 
  }
  
  function reFocusThree(jd){
    
    //threefocuschange
    //transitioningfocus
    //
    //~ console.log("changin jd, fo..",jote.top,jd,focus.jc,focus.jd,focus.je)
     
    // whole scene rescaling is performed to...
    // translate features to a good float32 range
    // oversize is approx 1,000,000
    
    var notrack=false
    
    if((jd==-1)||(jd==jote.top)) //-1 means keep last origin/focus
    { jd=focus.je= focus.jd= focus.jc= -1 
      //~ console.log("booked",focus.je, focus.jd, focus.jc) 
      vplay.camdist=0
      vplay.camvel=0
      fdisplaynom(jd)
      notrack=true
      focus.jd = jd
      jd=0
    }else{ 
      if(jd==-2){ jd=jote.top-1 } 
      else { jd=(jote.top+jd)%jote.top }
      focus.jd = jd , focus.je = jd
      fdisplaynom(jd) 
    }

    focus.timer= 10, focus.chng=1
        
    var js = [ ] //js would be array of jotes to fit in view
    //~ if(jd!=0){ js.push(0) }
    
    //making array of neighbours
    //~ if(jd+1<jote.top){ js.push(jd+1)}else{ js.push(jd-2) }
    //~ if(jd+2<jote.top){ js.push(jd+2)}else{ js.push(jd-3) }
    //~ if(jd-1>-1){ js.push(jd-1)}else{ js.push(jd+2) }
    
    js.push(jote.top-1); js.push(0); js.push(Math.floor(jote.top/2))
    
    var neadist=0
    
    for(var j=0;j<js.length;j++){
      var jr=js[j]
      neadist+= Math.sqrt(
       (jote.x[jd]-jote.x[jr])*(jote.x[jd]-jote.x[jr])
      +(jote.y[jd]-jote.y[jr])*(jote.y[jd]-jote.y[jr])
      +(jote.z[jd]-jote.z[jr])*(jote.z[jd]-jote.z[jr])
      )
    } //toting distance of far neighbours
    
    neadist/=js.length

    if(focus.wc!==vplay.world){ //first go for figment
      focus.wc=vplay.world
      focus.sd=500/neadist
      vplay.pradius*=focus.sd
      focus.cam= vplay.camRad*0.1
      
    }else {
      focus.cam=0
      var radd=jkind.rad[ jote.knd[jd] ] * focus.sc
      if(radd*2>vplay.camRad){ focus.cam = radd*2 }
            
      if(vplay.camRad<neadist*focus.sc){
        focus.cam += vplay.camRad*neadist/focus.distb
      }
    }
        
    focus.distb=neadist
  }

  function fdisplaynom(jd){
    vplay.nowfocus="obj "+jd
    if(jd===-1)
    { vplay.nowfocus="free tracking" }
    else if(isFinite(Fgm.jote.knd[jd])&&Fgm.jkind.nom[Fgm.jote.knd[jd]])
    { vplay.nowfocus=jd+" "+Fgm.jkind.nom[Fgm.jote.knd[jd]] }
     
    if('dash' in vplay){ vplay.dash.redrawDash()} 
  }

  function changingfocus(pace){
    
    var jd=focus.jd, upddist=(focus.cam)||(focus.sc!=focus.sd) 
    pace=(pace||1)*vplay.paused
    //f = f -(f-j)/timer
    focus.timer=focus.timer*0.9-0.1
    if(focus.timer<0){ focus.timer=0 }	
    pace*=focus.timer*0.15
    if(jd>-1){
      focus.x-= (focus.x-jote.x[jd]-jote.vx[jd]*pace)/(focus.timer+1)
      focus.y-= (focus.y-jote.y[jd]-jote.vy[jd]*pace)/(focus.timer+1)
      focus.z-= (focus.z-jote.z[jd]-jote.vz[jd]*pace)/(focus.timer+1)
    }
    vplay.camRad/=focus.sc
    focus.cam/=focus.sc
    focus.sc-= (focus.sc-focus.sd)/(Math.sqrt(64+focus.timer)-7)
    vplay.camRad*=focus.sc
    focus.cam*=focus.sc
    
    if(focus.cam)
    { vplay.camRad
      =Math.abs(vplay.camRad-(vplay.camRad-focus.cam)/(Math.sqrt(9+focus.timer)-2)) 
    }
    
    if(upddist){ vplay.camdist=(vplay.camRad/focus.sc).toFixed(0)
      if(vplay.rendermode===1){ vplay.camdist+="km" }
    } 
    
    if(focus.timer===0){ 
      focus.je=focus.jc=focus.jd
      focus.chng=0, focus.cam=0
      fillfocusxyz(focus.jc) 
    }
    
    //~ vplay.nowfocus=focus.jd
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
  
  //ctrlcam should run before every fame, cam may be moved by other function
  //but must be applied here
  function ctrlcam() 
  { 
    vplay.keyLRd = (vplay.keyLR===0)?0:(vplay.keyLRd+(vplay.keyLR*0.0024))*0.98
    vplay.keyUDd = (vplay.keyUD===0)?0:(vplay.keyUDd+(vplay.keyUD*0.0024))*0.98
    vplay.keyRd  = (vplay.keyR===0)?0:(vplay.keyRd+(vplay.keyR*0.0024))*0.9
    vplay.keyCtrld = (vplay.keyCtrl==0||vplay.keyUD||vplay.keyLR)?0
     :(0.000045+vplay.keyCtrld)*0.995
    
    if(vplay.keyCtrl){ //autodrift and shift lookat
      
      //~ console.log("thet",vplay.camThet)
      //~ console.log("Phi",vplay.camPhi)

      //our plane is x,z  , y is updown
      
      _topolar( //direction in xy plane we are looking

       vplay.camera.position.x-vport.camlook.x //these will be phi
      ,vplay.camera.position.z-vport.camlook.z //these will be phi
      ,vplay.camera.position.y-vport.camlook.y 
       )
            
      //~ function _topolar(x,y,z) {
        //~ _rad = Math.sqrt(x*x+y*y+z*z+1.0e-40)
        //~ _the = Math.acos(z/_rad) 
        //~ _phi = Math.atan2(y,x) 
      //~ }
      
      //~ _the=(_the+Pi)%Pi
      //~ _phi=(_phi+2*Pi)%Pi
      //~ console.log("the",_the,"phi",_phi)
      //~ _tocarte(_rad,_the,_phi)  // center line in xz plane
                                //gives back _x as x  _y as z _z as _y
      //~ vport.camlook.x+=_x*vplay.keyUDd*0.00255+vplay.keyUDd*0.0175
      //~ 
      //~ _tocarte(vplay.camRad,vplay.camPhi,vplay.camThet)
      //~ gives coords of camera
      //~ this is all about moving in x z plane according to camThet

      _tocarte(_rad, Pi/2, vplay.camThet+Pi/2)  // plane right 
      
      vport.camlook.x-=_x*vplay.keyLRd*0.00355
      vport.camlook.z-=_y*vplay.keyLRd*0.00355

      _tocarte(_rad, Pi/2, vplay.camThet)  // plane away
      
      //~ console.log(_the)
      
      var dxx=_the>Pi/2?1:-1
      vport.camlook.x-=_x*vplay.keyUDd*0.00355*dxx
      vport.camlook.z-=_y*vplay.keyUDd*0.00355*dxx

      //tracks back to focus if only ctrl held
      if(vplay.keyCtrld>0.000145
          &&!(vplay.keyUDd||vplay.keyLRd||vplay.keyUD||vplay.keyLR)){
        var rud=vplay.camRad*vplay.keyCtrld
        vport.camlook.x*=(0.9999-vplay.keyCtrld*50)
        var rret=(vport.camlook.x>0)?1:-1
        if(abs(vport.camlook.x)<rud){ vport.camlook.x=0 }
        else{ vport.camlook.x-=rud*rret }
        
        vport.camlook.z*=(0.9999-vplay.keyCtrld*50)
        rret=(vport.camlook.z>0)?1:-1
        if(abs(vport.camlook.z)<rud){ vport.camlook.z=0 }
        else{ vport.camlook.z-=rud*rret }
      }
      
      //~ console.log(vplay.dbline)
      
      //~ vplay.dbline.geometry.vertices[0].x = focus.x
      //~ vplay.dbline.geometry.vertices[0].y = focus.y
      //~ vplay.dbline.geometry.vertices[0].z = focus.z
      //~ vplay.dbline.geometry.vertices[2].x = vport.camlook.x+_x
      //~ vplay.dbline.geometry.vertices[2].y = vport.camlook.y+_z
      //~ vplay.dbline.geometry.vertices[2].z = vport.camlook.z+_y
      //~ vplay.dbline.geometry.vertices[1].x = vport.camlook.x
      //~ vplay.dbline.geometry.vertices[1].y = vport.camlook.y
      //~ vplay.dbline.geometry.vertices[1].z = vport.camlook.z
      //~ vplay.dbline.geometry.verticesNeedUpdate=true
      //~ vplay.dbline.geometry.computeBoundingSphere()
      
      /*
      geometry = new THREE.Geometry();
      geometry.vertices = vertices;

      scene.remove( line );
      line = new THREE.Line( geometry, material )
      scene.add( line );
      
      */
      
      if(false){ //is drifting sea of forgotten teardrops
        if(vplay.driftCount<0.02){ vplay.driftCount+=vplay.camDrift}
        if(vplay.keyUDd||vplay.keyLRd||vplay.keyRd)
        { vplay.driftCount=0 }
        //~ vplay.driftCount=0.1
        var vva=0.007 ,vvb=0.004 ,vvc=0.006
        var dfa=Math.sin(vplay.playedframe_clock*vva)*0.8+Math.sin((vplay.playedframe_clock+300)*vva*0.7)
        var dfb=dfa+Math.sin((vplay.playedframe_clock+500)*vva*0.3)*0.7+Math.sin((vplay.playedframe_clock+200)*vva*0.6)
        var dfc=dfb+Math.sin((vplay.playedframe_clock+900)*vva)*0.7+Math.sin((vplay.playedframe_clock+200)*vva*0.6)
        
        vplay.camRad/=(1+(dfc+dfb*2)*vvb*vplay.driftCount)
        vplay.camThet-= dfb*vvc*vplay.driftCount*0.9
        vplay.camPhi -= (dfa+dfc*0.5)*vvc*vplay.driftCount
      } 
 
    }else{ //not pressed ctrl
      vplay.camRad  /= 1-vplay.keyRd*0.1
      
      vplay.camPhi  -= vplay.keyUDd*0.0325
      
      if(vplay.camPhi>Pi){ //flip hoz spin if past gimbal points
        vplay.camThet -= vplay.keyLRd*0.0325
      }else{
        vplay.camThet += vplay.keyLRd*0.0325
      }
      
      if(0&&vplay.rendermode==1&&vplay.camRad<vport.visjote[focus.jd].scale.x*1.1){
        vplay.camRad=vport.visjote[focus.jd].scale.x*1.1
      }
      
      if(vplay.rendermode==1&&vplay.camRad!==vplay.camRadold){
        
        
        vplay.camRadold=vplay.camRad
        
        mindot=(vplay.camRad)/(1000)
        
        for(var i=0,j=0;j<jote.top;j++)
        { 
          var vj=vport.visjote[j] 
          var isc=focus.sc*(jkind.rad[ jote.knd[j] ])
          if(isc<mindot){ isc=mindot }
          vj.scale.set( isc, isc, isc ) 
        }
      }
      
    }
    
    vplay.camPhi=(vplay.camPhi+Tau)%Tau
     
    _tocarte(vplay.camRad,vplay.camPhi,vplay.camThet)
    
    vplay.camera.position.set(
     _x+vport.camlook.x
    ,_z+vport.camlook.y
    ,_y+vport.camlook.z
    )
    
    
    //invert on Phi crossing 0 and PI
    var up=(vplay.camPhi>Pi)?1:-1
    vport.camup.set(0,up,0)
    vplay.camera.up = vport.camup;
    vplay.camera.lookAt(vport.camlook);
    vplay.camdist=(vplay.camRad/focus.sc).toFixed(0)
    if(vplay.rendermode===1){ vplay.camdist+="km"}
    
    if(focus.jc>-1){ 
      var cj=focus.jd
        , dq=jote.vx[cj]*jote.vx[cj]+jote.vy[cj]*jote.vy[cj]+jote.vz[cj]*jote.vz[cj]
    
      vplay.camvel=(Math.sqrt(dq)*1000).toFixed(2)
      if(vplay.rendermode===1){ vplay.camvel+="m/s" }
    }
        
    //~ if(vplay.rendermode===1) setvisguide()
  }
  
  var dumdum=0
  
  function setvisguide(){  //not yet working
    
    var vis=vport.vislines
    
    var x = vplay.camera.position.x
       ,y = vplay.camera.position.y
       ,z = vplay.camera.position.z
       ,s = 1//Math.floor(10000*vplay.camRad*focus.sc) 
    //~ console.log("its s",s) 
    
    for(var n=0;n<24;n++){
      vis[n].scale.set(s,s,s)
      vis[n].position.set(x,y+1,z)
      vis[n].rotation._x= vplay.camera.rotation._x
      vis[n].rotation._y= vplay.camera.rotation._y
      vis[n].rotation._z= vplay.camera.rotation._z
      
      //~ if((dumdum++%100)===0) console.log(vis[n])

    }
     
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
  
  vplay.focus        = focus 
  
  vport.spincam      = spincam 
  vport.ctrlcam      = ctrlcam 
  vport.focus        = focus 
  vport.initview     = initview
  vport.velcolor     = velcolor 
  vport.syncrender   = syncrender
  vport.updatefocusxyz = updatefocusxyz
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