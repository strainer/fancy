// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// paranorm.js - miscellaneous fanciful processes 

function addParanorm(fig) { 
  'use strict' 
   
  var fgs=fig.state
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor

  var jote=fgs.jote 
     ,Drand=fgs.Drand ,Hrand=fgs.Hrand
     ,rndu=fgs.rndu ,rndh=fgs.rndh
  
  function takestate() //keys to local as required
  { 
    fgs=fig.state
    jote=fgs.jote
    
    Drand=fgs.Drand ,Hrand=fgs.Hrand
    rndu=fgs.rndu, rndh=fgs.rndh
  } 
     
  fig.statefncs.push( takestate ) //add to list of state refreshers

  /// // // // // // // // // // // // // 

  var i
    
  var shrinki=0;
  function pulsevel(t)
  {
    shrinki++;
    var shfc= (1+Math.sin(shrinki/100))*t
    for( i=0; i<jote.top; i++ )
    { 
      jote.vx[i]-=jote.x[i]*shfc
      jote.vy[i]-=jote.y[i]*shfc
      jote.vz[i]-=jote.z[i]*shfc
    }
  }

  var shrinki2=0;
  function pulsepos(f)
  {
    shrinki2++;
    var shfc= (Math.sin(shrinki2/88))*f
    for( i=0;i<jote.top;i++  )
    { 
      jote.x[i]=jote.x[i]*shfc
      jote.y[i]=jote.y[i]*shfc
      jote.z[i]=jote.z[i]*shfc
    }
  }

    //move all tacks by their velocity
    //have an elastic central tether, 
    //whose force increases by square of tack distance from center
    //this will arrest all tacks at points where force balances out
    //modulate the power of the elestic force to keep tacks in motion

  function rndmovep()
  {
    var scale=1;
    for ( var i = 0; i < jote.top; i ++ ) {
      // rawpos
      var vx = rndu()
      var vy = rndu()
      var vz = rndu()
      jote.vx[ i ] = vx
      jote.vy[ i ] = vy
      jote.vz[ i ] = vz
      jote.x[ i ] += (vx*scale-scale/2)|0
      jote.y[ i ] += (vy*scale-scale/2)|0
      jote.z[ i ] += (vz*scale-scale/2)|0
    }
    return
  }
  
  function invertMov()
  {
    for(var i=0;i<jote.top; i++)
    { 
      //_topolar(jote.vz[i],jote.vz[i+1],jote.vz[i+2])
      //_rad += (1)*0.1
      //_tocarte(_rad,_the,_phi)
      //jote.vz[i]=_x;jote.vz[i+1]=_y;jote.vz[i+2]=_z
      
      jote.vx[i]=-jote.vx[i]
      jote.vy[i]=-jote.vy[i]
      jote.vz[i]=-jote.vz[i]
    }
  }
    
  fig.invertMov  = invertMov
  fig.pulsevel   = pulsevel
  fig.pulsepos   = pulsepos
  fig.rndmovep   = rndmovep

  return fig

}