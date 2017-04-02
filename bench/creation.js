// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */ 
/// figment creation scripts

function Tcreate(Talter,vplay) //Creation Function woooo!
{
var Drand=Talter.Drand.repot(vplay.seed)

if(vplay.world==0){ createC0() }
if(vplay.world==1){ createC1() }
if(vplay.world==2){ createC2() }
if(vplay.world==3){ createC3() }
if(vplay.world==4){ createC4() }
if(vplay.world==5){ createC5() }
if(vplay.world==6){ createC6() }
if(vplay.world==7){ createC7() }
if(vplay.world==8){ createC8() }
if(vplay.world==9){ createC9() }
if(vplay.world==10){ createC10() }
if(vplay.world==11){ createC11() }

Talter.settop()


function hourtime(a){ 
  var b=a%60,c=b<10?"0":""
  c+=b.toFixed(1)
  a=Math.floor(a-=b)/60, b=Math.floor(a%60) 
  c=(b<10?"0":"")+b.toFixed(0)+":"+c
  a=Math.floor(a-=b)/60, b=Math.floor(a%24) 
  c=(b<10?"0":"")+b.toFixed(0)+":"+c
  a=Math.floor(a-=b)/24, c="dy"+a.toFixed(0)+" "+c
  return c 
}




function createC0(){ //solar system jpl data
  //
  
  vplay.instaprops=
  {
    model_pace : 1080.0//315.36000 // (is seconds?)
   ,gravity : 6.67408e-8
   ,max_force :  10000000000000
   ,viewer2:true
   ,printtime:hourtime
   ,rendermode:1
   ,camRad:2057500000
   ,forces:2
   ,gravqual:0.10
  }

  var pld=planetdatas //file planetdat.js
  
  for(var p in pld){
    
    //var q=1/1000000
    //var qg=1/1000000000
    
    var d=pld[p] ,g=-0
    
    if(d.masskge){
      g=Math.pow( 10 , d.masskge-12 )*( d.massval||1 )
    }
    
    Talter.addjote(
     d.z  ,d.x  ,d.y  //yzx?
    ,g
    ,d.vz ,d.vx ,d.vy
    ,p
    ,d.radius||1
    )
    
    if(d.r){
      Talter.colorprev({ r:d.r,g:d.g,b:d.b,
        rfun:function(x){ return 2.5*x }
       ,bfun:function(x){ return 2.5*x }
       ,gfun:function(x){ return 2.5*x } 
      })	
    } else {
      Talter.colorprev({ r:1.6,g:1.6,b:1.6,
        rfun:function(x){ return Drand.gteat(0.7,1.25)*x }
       ,bfun:function(x){ return Drand.gteat(0.7,1.25)*x }
       ,gfun:function(x){ return Drand.gteat(0.7,2.25)*x } 
      })	
    }
  }
}




function createC1(){ //mock near earth orbitals
  
  vplay.gravity= 6.67408e-8
  vplay.instaprops=
  {
    pradius : 0.85//315.36000
   ,model_pace : 100.0//315.36000 // (is seconds?)
   ,runcycle_step:10
   ,gravity : 6.67408e-8
   ,camRad:575000
   ,camThet:4.92
   ,camPhi:1.62
   ,firstfocus:1
   ,printtime:hourtime
   //~ ,max_force :  10000000000000
   //~ ,viewer2:true
  }
  
  //earth
  //radius:6371.01
  //massval:5.97219
  //masskge:24
  
  var moo={
   radius:1737.4
  ,massval:734.9
  ,masskge:20//                      earth dats >
  ,x:-2.661019038176148e+07    -  -2.686981987561484e+07 
  ,z:1.443380125048558e+08     -  1.446304615108057e+08
  ,y:8.009907907694578e+03     -  -5.488342537105083e+03
  ,vx:-2.905520265120326e+01 -  -2.978172178935505e+01
  ,vz:-4.867011427095468e+00 -  -5.560030327342782e+00
  ,vy:-8.258682995469990e-02 -  1.372659284534006e-03
 }
  
  var earg=5.97219*Math.pow(10,(24-12))
  var moog=734.9*Math.pow(10,(20-12))
  var earrad =6371.01
  var geo=42164
  var nn=15000
  
  Talter.addjote(0 ,0 ,0 ,earg,0,0,0,"Earth Center" ) 
  Talter.addjote(moo.x ,moo.y ,moo.z ,moog, moo.vx,moo.vy,moo.vz,"Moon Center" )

  Talter.setaslast(0)	
  
  //construct functions are missing grav setting
  earg*=6.67408e-8
  moog*=6.67408e-8
  
  Talter.addspinball({
    num:nn*0.25, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 1,1.45 ) } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
  })
  
  Talter.addspinball({
    num:nn*0.15, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 1.1,1.9 ) } 
    ,velf:function(){ return Drand.gnorm( 0.8,1.2 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.7,1.2 ) } 
  }) 

  Talter.addspinball({
    num:nn*0.23, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ 
      var c=Drand.gteat( -0.9,1.1 )
      c=c<0?c*0.1:c
      c=Math.abs(c)*100
      return 1+ c 
    } 
    ,velf:function(){ return Drand.gnorm( 0.8,1.5 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.3 ) } 
  }) 
 
  
  Talter.addspinball({
    num:nn*0.05, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 3.0,200 ) } 
    ,velf:function(){ return Drand.gnorm( -20.1,20.3 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
  }) 

  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 0.7,2.2 ) }
   ,gfun:function(){ return Drand.gteat( 1.2,2.0 ) } 
   ,bfun:function(){ return Drand.gteat( 1.4,2.9 ) }
  })	
  
  /*
  Talter.addspinball({
    num:nn*0.3, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 1.0,20.5 ) } 
    ,velf:function(){ return Drand.gnorm( 0.8,1.4 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
  }) 
  
  Talter.addspinball({
    num:nn*0.1, rad:earrad , phi:0, pull:earg
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 1.2,80.5 ) } 
    ,velf:function(){ return Drand.gnorm( 0.5,2.4 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.7,1.3 ) } 
  }) */


  Talter.addspinring({
    num:nn*0.11, rad:geo, phi:0, pull:earg
    ,radf:function(){return Drand.gspire( 0.999999998,1.0000000002  ) } 
    ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
    //~ ,thkf:function(){return Drand.gspire( 0.998,1.002  ) } //this makes cool ring
    ,thkf:function(){return Drand.gspire( -0.00000001,0.00000001  ) }
    ,crdf:4
    ,seam:0
  }) 


  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 1.0,1.2 ) }
   ,bfun:function(){ return Drand.gteat( 0.5,2.9 ) }
   ,gfun:function(){ return Drand.gteat( 1.4,2.9 ) } 
  })	
  

  Talter.addspinring({
    num:nn*0.06, rad:geo, phi:0.41015, pull:earg
    ,radf:function(){return Drand.gspire( 0.999999995,1.0000000005  ) } 
    ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
    //~ ,thkf:function(){return Drand.gspire( 0.998,1.002  ) } //this makes cool ring
    ,thkf:function(){return Drand.gspire( -0.00000001,0.000000001  ) }
    ,crdf:3
    ,seam:0
  }) 
  
  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 1.5,2.2 ) }
   ,bfun:function(){ return Drand.gteat( 0.5,1.9 ) }
   ,gfun:function(){ return Drand.gteat( 1.4,2.2 ) } 
  })	
  
  Talter.setaslast(1) //moon
  
  Talter.addspinball({
    num:nn*0.1, rad:moo.radius, phi:0, pull:moog
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 1,1.15 ) } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1 ) } 
  }) 

  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 1.0,2.8 ) }
   ,bfun:function(){ return Drand.gteat( 0.5,2.9 ) }
   ,gfun:function(){ return Drand.gteat( 1.1,2.3 ) } 
  })	
 
}



function createC2(){ //trappist-1 data
  //
  
  vplay.instaprops=
  {
    model_pace : 900.0//315.36000 // (is seconds?)
   ,gravity : 6.67408e-8
   ,max_force :  10000000000000
   ,viewer2:true
   ,printtime:hourtime
   ,rendermode:1
   ,camRad:370500000
  }

  var solmas=Math.pow( 10 , 30-12 )*( 1.988544 ), sunrad=696300
     ,emass=Math.pow( 10 , 24-12 )*( 5.97219 ), erad=6371.01
  
  var trapmas=0.08*solmas, au=149597806.29777 //kilometer
  
  Talter.addjote(
   0  ,0  ,0  //yzx?
  ,trapmas
  ,0 ,0 ,0
  ,"TRAPPIST-1"
  ,0.114*sunrad
  )

  Talter.colorprev({ r:2.2,g:0.3,b:0.3,
    rfun:function(x){ return Drand.gteat(0.7,1.25)*x }
   ,bfun:function(x){ return Drand.gteat(0.7,1.25)*x }
   ,gfun:function(x){ return Drand.gteat(0.7,2.25)*x } 
  })	

    
  //earthmass,smajau,inclin,earthrad
  var smass=trapmas*6.67408e-8

  var trappdat=[
    ['exop-b' ,0.85 ,0.01111 ,89.65 ,1.086, 2.3 ,1.8 ,1.2, smass ]
   ,['exop-c' ,1.38 ,0.01522 ,89.67 ,1.056, 0.3 ,0.7 ,2.1, smass ]
   ,['exop-d' ,0.41 ,0.021   ,89.75 ,0.772, 1.8 ,1.5 ,1.0, smass ]
   ,['exop-e' ,0.62 ,0.028   ,89.86 ,0.918, 1.0 ,1.5 ,1.1, smass ]
   ,['exop-f' ,0.68 ,0.037   ,89.68 ,1.045, 0.5 ,1.5 ,0.8, smass ]
   ,['exop-g' ,1.34 ,0.045   ,89.71 ,1.127, 1.1 ,0.8 ,1.8, smass ]
   ,['exop-h' ,0.9  ,0.063   ,89.80 ,0.755, 1.3 ,1.0 ,0.7, smass ]
   ,['acomet'  ,0.1  ,0.123   ,26.80 ,0.255, 1.4 ,0.3 ,1.1, smass*0.08 ]
  ]
  
  
  for(var p=0; p<trappdat.length;p++){
    
    //var q=1/1000000
    //var qg=1/1000000000
    
    var rw=trappdat[p] 
    var nom=rw[0]  ,mss=rw[1]*emass  ,orb=rw[2] 
     ,inkle=(rw[3]-90)*Math.PI/180 ,rad=rw[4]*erad, smss=rw[8]
     
    Talter.addspinring({
       num:1, rad:au*orb, phi:inkle, pull:smss
      ,radf:function(){return Drand.gspire( 0.999999998,1.0000000002  ) } 
      ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
      ,thkf:function(){return Drand.gspire( -0.00000001,0.00000001  ) }
      ,inskip:function(){ return Drand.gskip() }
    }) 
    
    //jote: knd: rad: mass: charge:
    Talter.jsetlast({ knd:nom ,rad:rad ,mass:mss, r:rw[5],g:rw[6],b:rw[7] }) 
  }
  
  Talter.setaslast(2)
  
  Talter.addspinring({
     num:1, rad:au*0.00021, phi:(45-90)*Math.PI/180, pull:1.38*emass*6.67408e-8
    ,radf:function(){return Drand.gspire( 0.999999998,1.0000000002  ) } 
    ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
    ,thkf:function(){return Drand.gspire( -0.00000001,0.00000001  ) }
    ,inskip:function(){ return Drand.gskip() }
  }) 
  
  Talter.jsetlast(
   { knd:"Yazo-o" ,rad:0.1*erad ,mass:0.08*emass, r:1,g:1.5,b:0 }
  )
}



function createC3(){ //1 + 4 gbody and disk
  
  vplay.instaprops=
  { 
   camRad:540,
   runcycle_step: 1.5 
   ,pradius:40
   //~ ,forces:2
   }

  var nn=7
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,1)
  //~ Talter.colorprev({r:6,g:1,b:0.5})
  
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
    
  Talter.addspinring({ 
    num:5, rad:2.2, phi:"rnd", pull:1.001
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.6,4.04)} 
    ,velf:function(){return Drand.gteat(-0.15,0.15)} 
    ,thkf:function(){return Drand.gteat(-0.25,0.25)}
    ,crdf:1.1 
  }) 
  Talter.colorprev({ r:2,g:2.9,b:4.5 })
  Talter.massallzeros(0.02)
  
  Talter.setaslast(1)
  purpball(100,0.02,0.2) 
  Talter.setaslast(2)
  purpball(100,0.02,0.2) 
  Talter.setaslast(3)
  purpball(100,0.02,0.2)
  Talter.setaslast(4)
  purpball(100,0.02,0.2) 
  
  Talter.setaslast(0)
  
  Talter.addspinring({
    num:(80*nn), rad:2.4, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.76,1.64)} 
    ,velf:function(){return Drand.gnorm(-0.09,0.09)} 
    ,thkf:function(){return Drand.gnorm(-0.24,0.24)} 
  }) 
  Talter.colorprev({ r:6,g:0.7,b:0.6,rfun:0,bfun:0,gfun:0 })

  Talter.addspinring({
    num:(130*nn), rad:2.9, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.76,1.64)} 
    ,velf:function(){return Drand.gnorm(-0.09,0.09)} 
    ,thkf:function(){return Drand.gnorm(-0.24,0.24)} 
  }) 
  Talter.colorprev({ r:4,g:1.1,b:0.9,rfun:0,bfun:0,gfun:0 })
  
  Talter.addspinring({
    num:(180*nn), rad:3.6, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gspire( 0.30,1.80)} 
    ,velf:function(){return Drand.gnorm(-0.01,0.01)} 
    ,thkf:function(){return Drand.gteat(-0.35,0.35)} 
  }) 
  Talter.colorprev({ r:1.9,g:3.9,b:1.5,rfun:0,bfun:0,gfun:0 })
     
  Talter.addspinring({
    num:(300*nn), rad:4.4, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.76,3.04)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.12,0.12)} 
  }) 
  Talter.colorprev({ r:1.1,g:1.8,b:4.5,rfun:0,bfun:0,gfun:0 })
     
  Talter.addspinring({
    num:(270*nn), rad:5.2, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.76,3.04)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.05,0.05)} 
  }) 
  Talter.colorprev({ r:0.1,g:0.8,b:3.5,rfun:0,bfun:0,gfun:0 })
          
  Talter.addspinring({
    num:(270*nn), rad:6.2, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.76,3.04)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.02,0.05)} 
  }) 
  Talter.colorprev({ r:0.0,g:0.2,b:3.1,rfun:0,bfun:0,gfun:0 })
     
  Talter.setaslast(0)
  purpball(1000,1,1.0,0.2)

}


function createC4(){ 
  
  //1 + 3 gbody sys
  //play with unbalancing 3s orbit
  
  vplay.instaprops = { 
    runcycle_step: 2.0 
   ,pradius:20
   ,camRad:300
  }

  var nh=550
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,1)
  Talter.colorprev({r:0,g:0,b:0.1})
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
  
  //the three planets: 
  Talter.addspinring({
    num:3, rad:5.2, phi:0, pull:1.1
    ,crvf:function(){ return Drand.range( 0.1,2.3) }
    //,radf:0, crvf:0, velf:0
  }) 
  Talter.colorprev({ r:0,g:0.1,b:0.5,rfun:0,bfun:0,gfun:0 })
  Talter.massallzeros(0.1) 
  
  Talter.setaslast(0)
    
  Talter.addspinball({
    num:nh, rad:0.39, phi:0, pull:1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 0.9,1.9)   } 
    ,velf:function(){ return Drand.gnorm( 1,1) } 
    ,thkf:function(){ return Drand.gnorm( 1,1) } 
  }) 
  Talter.colorprev({ r:1.7,g:1.7,b:1.7,
    rfun:function(x){return Drand.range(0.1,1.25)*x}
   ,bfun:function(x){return Drand.range(0.1,1.25)*x}
   ,gfun:function(x){return Drand.range(0.1,1.25)*x} 
   })

  addconstellations(1000,30) 

  Talter.setaslast(1)
  
  Talter.addspinball({
    num:nh*0.9, rad:0.35, phi:0, pull:0.1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 1,1)   } 
    ,velf:function(){ return Drand.gnorm( 1,1) } 
    ,thkf:function(){ return Drand.gnorm( 1,1) } 
  }) 
  

  Talter.colorprev({ r:2.7,g:0.8,b:0.1,
    rfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gnorm(0.7,2.25)*x} 
   })
   
  Talter.addspinring({
    num:nh*0.2, rad:0.5, phi:1.66, pull:0.1
    ,radf:function(){return Drand.gspire( 0.99999998,1.000000002  ) } 
    ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
    //this makes cool ring
    ,thkf:function(){return Drand.gspire(  0.00000001,0.00000001  ) }
    ,crdf:3
    ,seam:0
  }) 

  Talter.colorprev({ r:2.5,g:1.1,b:0.1,
    rfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gnorm(0.7,2.25)*x} 
   })
   
  Talter.addspinring({
    num:nh*0.3, rad:0.7, phi:3.14, pull:0.1
    ,radf:function(){return Drand.gspire( 0.99999998,1.000000002  ) } 
    ,velf:function(){return Drand.gspire( -0.00000001,0.00000001 ) } 
    //this makes cool ring
    ,thkf:function(){return Drand.gspire(  0.00000001,0.00000001  ) }
    ,crdf:3
    ,seam:0
  }) 

  Talter.colorprev({ r:2.5,g:0.4,b:0.4,
    rfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gnorm(0.7,2.25)*x} 
   })

  Talter.setaslast(2)
  Talter.addspinball({
    num:nh*2, rad:0.85, phi:0, pull:0.1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 1,1)   } 
    ,velf:function(){ return Drand.gnorm( 1,1) } 
    ,thkf:function(){ return Drand.gnorm( 1,1) } 
  }) 
  Talter.colorprev({ r:0.5,g:0.8,b:3.5,
    rfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gnorm(0.7,2.25)*x} 
   })

  Talter.setaslast(3)
  Talter.addspinball({
    num:nh, rad:0.55, phi:0, pull:0.1
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.6,1.5)   } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  }) 
  Talter.colorprev({ r:3.5,g:0.1,b:3.5,
    rfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gnorm(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gnorm(0.7,2.25)*x} 
   })

  //~ Talter.addspoke({ //{num:,ja:,jb:, fuz: }
    //~ num:nh*0.3, ja:1,jb:2,fuz:0
  //~ })
  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 3.0,4.8 ) }
   ,bfun:function(){ return Drand.gteat( 3.0,3.0 ) }
   ,gfun:function(){ return Drand.gteat( 0,0 ) } 
  })	

  //~ Talter.addspoke({ //{num:,ja:,jb:, fuz: }
    //~ num:nh*0.3, ja:2,jb:3,fuz:0
  //~ })
  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 3.0,4.8 ) }
   ,bfun:function(){ return Drand.gteat( 3.0,3.0 ) }
   ,gfun:function(){ return Drand.gteat( 0,0 ) } 
  })	

  Talter.addspoke({ //{num:,ja:,jb:, fuz: }
    num:nh*0.3, ja:0,jb:3,fuz:0
  })
  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 3.0,4.8 ) }
   ,bfun:function(){ return Drand.gteat( 3.0,3.0 ) }
   ,gfun:function(){ return Drand.gteat( 0,0 ) } 
  })	

}



function createC5(){
  
  //a ring of rnd mass particles
  
  vplay.instaprops=
  { pradius:60
   ,forces:2
   ,gravqual:0.65
  }
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,1)
  //~ Talter.colorprev({r:6,g:1,b:0.5})
  
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
    
  Talter.addspinring({
    num:250, rad:3.5, phi:0, pull:1, seam:1
    //~ ,radf:function(){return Drand.gnorm( 0.999999998,1.000000002)} 
    //~ ,velf:function(){return Drand.gnorm(-0.01,0.01)} 
    //~ ,thkf:function(){return Drand.gnorm(-0.000000001,0.000000001)} 
  }) 
  Talter.colorprev({ r:5,g:4,b:0.9,rfun:0,bfun:0,gfun:0 })
  
  //~ Talter.massallzeros(1,function(){return Drand.gbowl(0,0.3)})
  Talter.massallzeros(0.000051,function(){return 1})
}



function createC6(){ //undulating spiral
  
  vplay.instaprops=
  { pradius:6.5
   ,runcycle_step:1
   ,model_pace:0.1
  }
  
  var nn=5200
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,1)
  //~ Talter.colorprev({r:6,g:1,b:0.5})
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
   /* 
  for(var rng=1,rad=0.4;rng<10;rng++,rad=rad+rad/3){
    Talter.addspinring({
      num:(Math.sqrt(rad*nn))|0, rad:(rad), phi:0, pull:1 
    }) 
    Talter.colorprev({ 
      r:Drand.range( 0,4)
     ,g:Drand.gskip( 0,3)
     ,b:Drand.gskip( 0,3)
     ,rfun:0,bfun:0,gfun:0 
    })
  }
 */
  var zool=1,zee=0.001, zaa=0.0000001, zar=0.52
  
  Talter.addspinring({
    num:nn, rad:zar, phi:0, pull:1   ,seam:-25
   ,off:{x:0.00003}
   ,radf:function(){ zee+=zaa; zool+=zee; return zool } 
   ,thkf:function(){ return -(zool-1)/21 } //hehehe... 
  }) 
  
  var zod =2.8
  
  Talter.colorprev({ 
    //~ rfun:function(){ return Drand.range(0.5,2.5)+(zee+=0.0010) }
    rfun:function(){ return (Drand.gskip(0.6,1.5)
      +(Math.sin((zaa+=0.0015)+1.0))*0.7-zee*zee*0.02)*1.5   }
    //~ bfun:function(){ return 1+Math.sin((zaa+=0.001)*0.6+1.0)+Drand.gskip()   }
   //~ ,gfun:function(){ return 2.4+Drand.range(0,0.2)-(zee+=0.0010)*0.4+zaa/10 }
   ,gfun:function(){ return ((Drand.gskip(0.05,1.0)
     +Math.abs(1.5-zee*0.08)*0.1)-zee*(zee-1)*0.06+0.5)*1.3 }
   //~ ,rfun:function(){ return 1+Math.cos((zaa*0.666)+2.0)+Drand.gskip() }
   //~ ,gfun:function(){ return 1+Math.cos((zaa*0.75)+1.0)+Drand.gskip() }
   ,bfun:function(){ return (Drand.gskip(0.0,1.0)-(zee+=0.001)*0.095)*1.3 }
   ,r:0,b:0,g:0 
  })

  //~ Talter.massallzeros(1,function(){return Drand.gbowl(0,0.3)})
  //~ Talter.massallzeros(0.0000000/nn,function(){return 1})
  
  Talter.addspinball({
    num:nn*0.03, rad:40, phi:0, pull:1.5
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 0.8,2.15 ) } 
    ,velf:function(){ return Drand.gnorm( 0,1 ) } 
    ,thkf:function(){ return Drand.gnorm( 1,1 ) } 
  }) 

  
  Talter.colorprev({ r:0,g:0,b:0,
    rfun:function(){ return Drand.gteat( 1.0,2.8 ) }
   ,bfun:function(){ return Drand.gteat( 1.5,2.9 ) }
   ,gfun:function(){ return Drand.gteat( 1.1,2.3 ) } 
  })	
 
}



function createC7(){ //electrostatic cloud
  
  vplay.instaprops=
  {  forces:1
    ,max_force:  2
    ,pradius:60.0
    ,firstfocus:-1
    ,runcycle_step : 2.5
    ,camRad:600
  }

  var nh=15
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,0.00001)
  Talter.colorprev({r:0,g:6,b:6.5})
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
    
  //~ Talter.addspinring({
    //~ num:3, rad:3.2, phi:0, pull:1.1
    //~ //,radf:0, crvf:0, velf:0
  //~ }) 
  //~ Talter.colorprev({ r:3,g:3.9,b:4.5,rfun:0,bfun:0,gfun:0 })
  //~ Talter.massallzeros(0.1) 
  var pl=1.2
  var spc=1
  Talter.setaslast()
 
  Talter.addspinball({
    num:nh*25, rad:spc*3, phi:0, pull:pl
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.7,1.2) } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  }) 
 
  //Talter.massuncolored(0.0)
 
  Talter.massuncolored(
    function(){ return Drand.gteat( 0.015,0.025 ) }
  ) 
  Talter.chargeuncolored(
    function(){ return Drand.gteat( 0.01,0.025 ) }
  )
  
  Talter.colorprev({ r:4.5,g:1.1,b:0.1,
    rfun:function(x){return Drand.gteat(0.3,1.25)*x}
   ,bfun:function(x){return Drand.gteat(0.3,1.25)*x}
   ,gfun:function(x){return Drand.gteat(0.3,2.25)*x} 
   })

  Talter.addspinball({
    num:nh*4, rad:spc*7, phi:0, pull:pl*10
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.6,1.5)   } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  })
    
  //Talter.massuncolored(0.0)
 
  Talter.massuncolored(
    function(){ return Drand.gteat( 0.025,0.035 ) }
  ) 
  Talter.chargeuncolored(
    function(){ return Drand.gteat( -0.1,-0.2 ) }
  )
  
  Talter.colorprev({ r:0.1,g:2.2,b:4.9
   ,rfun:function(x){return Drand.gteat(0.3,1.25)*x}
   ,bfun:function(x){return Drand.gteat(0.3,1.25)*x}
   ,gfun:function(x){return Drand.gteat(0.3,1.25)*x} 
  })
      
}



function createC8(){ //pattern


  vplay.instaprops=
  { pradius:50
   ,runcycle_step:1
   ,model_pace:0.1
  }
  
  var nn=6000
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,1)
  //~ Talter.colorprev({r:6,g:1,b:0.5})
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
   /* 
  for(var rng=1,rad=0.4;rng<10;rng++,rad=rad+rad/3){
    Talter.addspinring({
      num:(Math.sqrt(rad*nn))|0, rad:(rad), phi:0, pull:1 
    }) 
    Talter.colorprev({ 
      r:Drand.range( 0,4)
     ,g:Drand.gskip( 0,3)
     ,b:Drand.gskip( 0,3)
     ,rfun:0,bfun:0,gfun:0 
    })
  }
 */
  var zool=1,zee=0.002, zaa=0.000001
    , zar=3
  
  //~ Talter.addspinring({
    //~ num:nn, rad:zar*1.2, phi:0, pull:1   ,seam:0
   //~ //,radf:function(){ zee+=zaa; zool+=zee; return zool } 
   //~ //,thkf:function(){ return (zool-1)/60 } //hehehe... 
  //~ }) 
  
  Talter.addspinring({
    num:nn, rad:zar, phi:0, pull:0.9   ,seam:0
    //~ ,off:{x:0.33}
    ,axs:0.7
   //,radf:function(){ zee+=zaa; zool+=zee; return zool } 
   //,thkf:function(){ return (zool-1)/60 } //hehehe... 
  }) 
  
  Talter.colorprev({ 
    rfun:function(){ return Drand.range(0.5,2.5)+(zee+=0.0010) }
   ,gfun:function(){ return 2.4+Drand.range(0,0.2)-zee*0.4 }
   ,bfun:function(){ return 0.8+Drand.range(0,0.5)-zee*0.1 }
   ,r:0,b:0,g:0 
  })

  
}


function createC9(){ //4 rough rings of rnd mass particles
  
  vplay.instaprops=
  { pradius:70.8
   ,runcycle_step:1.5
   ,forces:2
   ,gravqual:0.10
  }

  var nn=2
  
  Talter.setpos(0,0,0)
  Talter.setvel(0,0,0)
  Talter.setmass(0)
  Talter.setseam(1)
  Talter.setgroup(0)
  Talter.setbasecol(0)
  
  Talter.addjote(0,0,0,0.95)
  //~ Talter.colorprev({r:6,g:1,b:0.5})
  
  //~ Talter.addspherea({num:200,rad:2,hot:0.9})
    
  Talter.addspinring({
    num:(80*nn), rad:1.6, phi:0, pull:0.95
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.96,1.04)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.05,0.05)} 
  }) 
  Talter.colorprev({ r:2,g:0.9,b:4.5,rfun:0,bfun:0,gfun:0 })
 
  Talter.addspinring({
    num:(120*nn), rad:2.4, phi:0.1, pull:0.97
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.96,1.04)} 
    ,velf:function(){return Drand.gnorm(-0.09,0.09)} 
    ,thkf:function(){return Drand.gnorm(-0.09,0.09)} 
  }) 
  Talter.colorprev({ r:6,g:0.9,b:0.9,rfun:0,bfun:0,gfun:0 })
  
  Talter.addspinring({
    num:(180*nn), rad:3.6, phi:0.2, pull:0.985
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.90,1.10)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.05,0.05)} 
  }) 
  Talter.colorprev({ r:1.9,g:3.9,b:1.5,rfun:0,bfun:0,gfun:0 })
     
  Talter.addspinring({
    num:(270*nn), rad:5.4, phi:0.5, pull:0.98
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){return Drand.gnorm( 0.96,1.04)} 
    ,velf:function(){return Drand.gnorm(-0.05,0.05)} 
    ,thkf:function(){return Drand.gnorm(-0.05,0.05)} 
  }) 
  Talter.colorprev({ r:1.1,g:1.8,b:4.5,rfun:0,bfun:0,gfun:0 })
     
  //~ Talter.massallzeros(1,function(){return Drand.gbowl(0,0.3)})
  Talter.massallzeros(0.0002/nn,function(){return 1})
}


function createC10(){ //47 Tuc X9
  
  vplay.instaprops=
  {
    model_pace : 60.0 //300 works
   ,gravity : 6.67408e-8
   //~ ,max_force :  0.000000000000000001 // this almost works with 60s
   ,max_force :  0.0000000000000001
   ,viewer2:true
   ,printtime:hourtime
   ,rendermode:1
   ,camRad:370500000
  }

  var solmas=1.988544e+18  //(*1e+12) 
     ,sunrad=696300
     ,bhmass=60*solmas
     ,bigG=6.67408e-8
     
  Talter.addjote(
   0  ,0  ,0  //xyz
  ,bhmass     //mass
  ,0 ,0 ,0    //vxyz
  ,"Black hole" //nom
  ,sunrad       //size
  )

  Talter.colorprev({ r:0.5,g:2.1,b:0.5,
    rfun:function(x){ return Drand.gteat(0.7,1.25)*x }
   ,bfun:function(x){ return Drand.gteat(0.7,1.25)*x }
   ,gfun:function(x){ return Drand.gteat(0.7,2.25)*x } 
  })	
  
  var orbitals=[
  { nom:'star', cmass:solmas, cradius:sunrad, tiltx:180.65
   ,axel:0, axis:2.5*3.84402e+05
   ,r:1.8, g:1.8, b:1.8
  },
  
  { nom:'ext-a', cmass:solmas/2, cradius:sunrad/5, tiltx:-20.65
   ,axel:0, axis:5.14402e+06
  }, 
  
  { nom:'ext-b', cmass:solmas/5, cradius:sunrad/14, tiltx:32.65
   ,axel:2, axis:0.89402e+06
  },
  
  { nom:'ext-c', cmass:solmas/9, cradius:sunrad/19, tiltx:114.65
   ,axel:3, axis:1.64402e+05
  }

  //~ ,{ nom:'star', cmass:solmas, amass:bhmass, axis:2.5*3.84402e+05, 
    //~ tiltx:89.65, cradius:sunrad    , r:1.8, g:1.8, b:1.8
  //~ }
  ]
  
  for(
    var orb=orbitals[0] ,p=0 ; 
    p<orbitals.length ; 
    orb=orbitals[++p]
  ){
    Talter.setaslast(orb.axel)
    var omass=Talter.jote.g[orb.axel]*bigG*(orb.amass||1)
    
    Talter.addspinring({
       num:1, rad:orb.axis, phi: orb.tiltx *Math.PI/180, 
       pull:omass
      ,radf:function(){return Drand.gnorm( 0.999999998,1.0000000002  ) } 
      ,velf:function(){return Drand.gnorm( -0.00000001,0.00000001 ) } 
      ,thkf:function(){return Drand.gnorm( -0.00000001,0.00000001  ) }
      ,inskip:orb.theta||function(){ return Drand.gskip() }
    }) 
    
    //jote: knd: rad: mass: charge:
    Talter.jsetlast({ 
      knd:orb.nom ,rad:orb.cradius ,mass:orb.cmass
     ,r:(orb.r)||Drand.gskip()*3+0.4 
     ,g:(orb.g)||Drand.gskip()*3+0.4
     ,b:(orb.b)||Drand.gskip()*3+0.4
     }) 
    
    }
  
  //~ Talter.setaslast(2)
}

function createC11(){ //cloud
  
  vplay.instaprops=
  {  forces:2
    ,max_force:  2
    ,pradius:40.0
    ,firstfocus:-1
    ,runcycle_step : 1.5
    ,camRad:600
  }

  var nh=30 ,spc=2
  
  //~ Talter.setpos(0,0,0)
  //~ Talter.setvel(0,0,0)
  //~ Talter.setmass(0)
  //~ Talter.setseam(1)
  //~ Talter.setgroup(0)
  //~ Talter.setbasecol(0)
  
  Talter.addspinball({
    num:25*nh, rad:spc*5, phi:0, pull:0.0085
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gteat( 0.0,1.0) } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.0,0.0) } 
  }) 
 
  //Talter.massuncolored(0.0)
 
  Talter.masschargcol_prev({ //{ ar:,ag:,ab:,mb:,cb:,mfun:,cfun:,m:,c: }
    
    ar:0.2 ,ag:0.2 ,ab:0.2
   ,mr:2.2 ,mg:2.2 ,mb:2.2
   ,cr:0.4 ,cg:0.4 ,cb:0.4
    
   ,mfun:function(){ return Drand.gteat(0.1,1) } ,m:0.0001
   ,cfun:function(){ return Drand.gteat(0.1,1) } ,c:0 
  })
   
  //~ addconstellations(100,100) 
}




function purpball(nh,pul,rad,grn){ //calib ball
  
  Talter.addspinball({
    num:nh, rad:rad, phi:0, pull:pul
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.6,1.5)   } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  }) 
 
  //Talter.massuncolored(0.0)
  Talter.colorprev({ r:3.5,g:0.1+grn/2,b:2.5,
    rfun:function(x){return Drand.range(0.1,1.25)*x}
   ,bfun:function(x){return Drand.range(0.1,1.25)*x}
   ,gfun:function(x){return Drand.gteat(0.7,2.25)*x} 
   })


  Talter.addspinball({
    num:nh, rad:rad*0.8, phi:0, pull:pul
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.6,1.5)   } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  }) 
 
  //Talter.massuncolored(0.0)
  Talter.colorprev({ r:0.5,g:0.7+grn/2,b:2.5,
    rfun:function(x){return Drand.range(0.1,1.25)*x}
   ,bfun:function(x){return Drand.gteat(0.1,1.25)*x}
   ,gfun:function(x){return Drand.range(0.2,2.25)*x} 
   })

  Talter.addspinball({
    num:nh, rad:rad*0.6, phi:0, pull:pul
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.gnorm( 0.6,1.5)   } 
    ,velf:function(){ return Drand.gnorm( 0.9,1.1) } 
    ,thkf:function(){ return Drand.gnorm( 0.9,1.1) } 
  })
    
  //Talter.massuncolored(0.0)
  Talter.colorprev({ r:0.1,g:0.2+grn/2,b:0.9
   ,rfun:function(x){return Drand.range(0.2,1.25)*x}
   ,bfun:function(x){return Drand.range(0.4,1.05)*x}
   ,gfun:function(x){return Drand.range(0.7,2.25)*x} 
  })
      
}


function addconstellations(n,d){
  
  Talter.addspinball({
    num:n, rad:d, phi:0, pull:1.0
    //~ ,radf:0, crvf:0, velf:0
    ,radf:function(){ return Drand.range( 0.1,1.9 )   } 
    ,velf:function(){ return Drand.gnorm( 0.1,1.9 ) } 
    ,thkf:function(){ return Drand.gnorm( 0.1,1.9 ) } 
  }) 
  Talter.colorprev({ r:1.5,g:1.5,b:1.5,
    rfun:function(x){return Drand.range(0.1,1.25)*x}
   ,bfun:function(x){return Drand.range(0.1,1.25)*x}
   ,gfun:function(x){return Drand.range(0.1,1.25)*x} 
   })
  
}


//------------------------------

function stb(){ return 0 } //for calibring lint
}