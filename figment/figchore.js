// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// figchore.js - wotevers here now

function addFigchore(fig) { 
  'use strict'
  
  var fgs=fig.state
     ,Tau=2*Math.PI ,Pi=Math.PI ,hPi=Pi/2 ,tPi=Pi/3
     ,abs=Math.abs ,floor=Math.floor ,Sqrt=Math.sqrt 
     
  var jote=fgs.jote ,jkind=fgs.jkind ,bkind=fgs.bkind 
     ,Drand=fgs.Drand ,Hrand=fgs.Hrand
     ,rndu=fgs.rndu ,rndh=fgs.rndh
   
  function takestate() //keys to local as required
  { 
    fgs=fig.state
    jote=fgs.jote ,jkind=fgs.jkind ,bkind=fgs.bkind 
    Drand=fgs.Drand ,Hrand=fgs.Hrand
    rndu=fgs.rndu, rndh=fgs.rndh
  } 
  
  fig.statefncs.push( takestate ) //add to list of state refreshers

  /// // // // // // // // // // // // / 
  
  function joteqclear()
  { for(var i=0; i<jote.top; i++)
    { jote.qx[i]=jote.qy[i]=jote.qz[i]=-0 }
  } 

  
  function jotemovebyVT(t,maxv)
  {
    //~ fuzzjotes(0.001)
    
    maxv=maxv||10000000
    var mav=maxv*maxv
    for(var i=0; i<jote.top; i++)
    { 
      //_topolar(jote.vz[i],jote.vz[i+1],jote.vz[i+2])
      //_rad += (1)*0.1
      //_tocarte(_rad,_the,_phi)
      //jote.vz[i]=_x;jote.vz[i+1]=_y;jote.vz[i+2]=_z
      var z=jote.vx[i]*jote.vx[i]+jote.vy[i]*jote.vy[i]
           +jote.vz[i]*jote.vz[i]
      
      if(z>mav){ //limit speed
        z=maxv/Math.sqrt(z)
        jote.vx[i]*=z
        jote.vy[i]*=z
        jote.vz[i]*=z
      }
      
      jote.x[i]=jote.x[i]+jote.vx[i]*t
      jote.y[i]=jote.y[i]+jote.vy[i]*t
      jote.z[i]=jote.z[i]+jote.vz[i]*t
    }
  }
    
  function joteqtovel(p)
  { 
    //~ var cllv=0,cllq=0  //dis stuff for debug determinizies
    p=p||1
    for(var i=0; i<jote.top; i++)
    { 
      //~ cllv+=jote.vx[i]+jote.vy[i]+jote.vz[i]
      //~ cllq+=jote.qx[i]+jote.qy[i]+jote.qz[i]
      
      jote.vx[i]+=jote.qx[i]*p
      jote.vy[i]+=jote.qy[i]*p
      jote.vz[i]+=jote.qz[i]*p
    }
    //~ console.log("clvq",cllv,cllq)
  }
        
  function joteclearulp(u){ //unused
    u=u||1024
    for(var i=0; i<jote.top; i++){
      jote.x[i]=Math.culp(jote.x[i],u)
      jote.y[i]=Math.culp(jote.y[i],u)
      jote.z[i]=Math.culp(jote.z[i],u)
      jote.vx[i]=Math.culp(jote.vx[i],u)
      jote.vy[i]=Math.culp(jote.vy[i],u)
      jote.vz[i]=Math.culp(jote.vz[i],u)
      jote.qx[i]=Math.culp(jote.qx[i],u)
      jote.qy[i]=Math.culp(jote.qy[i],u)
      jote.qz[i]=Math.culp(jote.qz[i],u)
      
    }
  }

  var _fuzz=[]
  
  function fuzzjotes(u){
    u=u||1
    
    for(var i=0;i<64;i++){
     _fuzz[i]=Drand.gnorm(-u,u) 
    }
    
    for(var i=0; i<jote.top; i++){
      //~ jote.x[i]+=rndu()
      //~ jote.y[i]+=rndu()
      //~ jote.z[i]+=rndu()
      if(jote.g[i]===0)
      {
        
        var c=(rndu()*64*64*64)>>0 
        var d=c&63, e=(c>>6)&63 ; c=(c>>12)&63
        
        jote.vx[i]+=_fuzz[c]
        jote.vy[i]+=_fuzz[d]
        jote.vz[i]+=_fuzz[e] 
      }
      //~ jote.qx[i]=Math.culp(jote.qx[i],u)
      //~ jote.qy[i]=Math.culp(jote.qy[i],u)
      //~ jote.qz[i]=Math.culp(jote.qz[i],u)
      
    }
  }
    
  fig.jotemovebyVT=jotemovebyVT
  fig.joteqclear=joteqclear
  fig.joteqtovel=joteqtovel 
  fig.joteclearulp=joteclearulp
  fig.fuzzjotes=fuzzjotes
  //~ fig.recycle=recycle

  return fig

}