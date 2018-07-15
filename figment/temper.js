// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/**
  tempering sets movement values to their effective average 
  over the given time interval for figment progression. 
  This is related to 'verlet integration'
**/ 

function addTemper(fig){ 
  
  var Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,aforce=fig.doforce

  var fgs=fig.state
     ,jote=fgs.jote 
     ,Drand=fgs.Drand ,Hrand=fgs.Hrand
     ,rndu=fgs.rndu, rndh=fgs.rndh
  
  function takestate() //keys to local as required
  { 
    fgs=fig.state
    jote=fgs.jote
    
    Drand=fgs.Drand ,Hrand=fgs.Hrand
    rndu=fgs.rndu, rndh=fgs.rndh
  } 
     
  fig.statefncs.push( takestate ) //add to list of state refreshers

  /// // // // // // // // // // // // / 

  function gtemperall(cvfac,dvfac)  //current temp, due temp
  {
    cvfac=cvfac||0
    
    for(var i=0; i < jote.top; i++) 
    { jote.tx[i]=jote.vx[i]  //stash velocity values
      jote.ty[i]=jote.vy[i]
      jote.tz[i]=jote.vz[i]
    }
        
    var r=-0
    
    if(cvfac!=0)  //set back as instantaneous
    { 
      aforce(cvfac*0.5)
      var toAnalog
      
      for(i=0; i<jote.top; i++)
      { r=2*Math.acos(
          (jote.tx[i]*jote.vx[i] +jote.ty[i]*jote.vy[i] +jote.tz[i]*jote.vz[i])
          /Sqrt(
           (jote.tx[i]*jote.tx[i] +jote.ty[i]*jote.ty[i] +jote.tz[i]*jote.tz[i])
           *(jote.vx[i]*jote.vx[i] +jote.vy[i]*jote.vy[i] +jote.vz[i]*jote.vz[i])
          )
        )
        //vel/mov = r/sin r ,, curve the hypotenus 
        toAnalog= r? r/Math.sin(r) : 1
        
        jote.vx[i]=jote.tx[i]= jote.vx[i]*toAnalog
        jote.vy[i]=jote.ty[i]= jote.vy[i]*toAnalog
        jote.vz[i]=jote.tz[i]= jote.vz[i]*toAnalog
        
      }
    }
    
    if(dvfac!=0) //set for due time factor
    { 
      //mov vec from t0 to t-0.5
      aforce(dvfac*-0.5)
      var toQuants=1.0
      
      for(i=0; i<jote.top; i++)
      { r=2*Math.acos(
          (jote.tx[i]*jote.vx[i] +jote.ty[i]*jote.vy[i] +jote.tz[i]*jote.vz[i])
          /Sqrt(
           (jote.tx[i]*jote.tx[i] +jote.ty[i]*jote.ty[i] +jote.tz[i]*jote.tz[i])
           *(jote.vx[i]*jote.vx[i] +jote.vy[i]*jote.vy[i] +jote.vz[i]*jote.vz[i])
          )
        )
        
        toQuants= r? Math.sin(r)/r : 1  //cuts the curve
        //~ console.log("r",r,"q",toQuants)
        jote.vx[i] *= toQuants
        jote.vy[i] *= toQuants
        jote.vz[i] *= toQuants
      
      }
    }
    
    //reset qs
    for(i=0; i<jote.top; i++){ jote.tx[i] = jote.ty[i] = jote.tz[i] = -0 }	
  }	


  //cvfac is current  temper gap
  //dvfac is due (target temper gap)

  //given cvfac, travel vectors are at t-=0.5*cvfac
  //alg orders grav adjust for 0.5cvfac to get t+=0 travecs
  //alg orders grav adjust of -0.5dvfac to temper to t-=0.5dvface
  //it is essential grav adjust can do negative time.. 
  
/*
  finetemper attempts refined tempering by doing small reverse run
  of n sub-time-sliced integrations
*/ 
  
  function finetemperall(dvfac,n){
    var rig=[]  //original values stash
    n=n||5
    var ts=dvfac/n
    gtemperall(0,ts) // tv set to +0.5
    for(var i=0;i<jote.top;i++)
    { rig.push(jote.x[i]) 
      rig.push(jote.y[i])
      rig.push(jote.z[i]) }
    
    for(var i=0;i<n;i++)
    { fig.jotemovebyVT(-ts)
      aforce(-ts)
    }
    
    var dv=1/dvfac
    for(var j=0,i=0;i<jote.top;i++){
      jote.vx[i]=(rig[j]-jote.x[i])*dv; jote.x[i]=rig[j++]
      jote.vy[i]=(rig[j]-jote.y[i])*dv; jote.y[i]=rig[j++]
      jote.vz[i]=(rig[j]-jote.z[i])*dv; jote.z[i]=rig[j++]
    }
    rig=0
  }

  fig.gtemperall = gtemperall
  fig.finetemperall = finetemperall
  
  return fig

}

