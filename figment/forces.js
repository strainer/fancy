// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// forces.js - processes: gravity, friction, etc

function addForces(fig,vplay) { 
  'use strict'
  
  var jote=fig.jote, spot=fig.spot 
     ,Tau=fig.Tau, Pi=fig.Pi, hPi=fig.hPi, tPi=fig.tPi 
     ,Sqrt=fig.Sqrt ,abs=fig.abs ,floor=fig.floor
     ,Drand=fig.Drand ,Hrand=fig.Hrand
     ,rndu=fig.rndu, rndh=fig.rndh
     ,dlns=fig.dlns 
               
               
  function nbodygrav(p)
  { 
    pace=p||vplay.model_pace; 
    throt=vplay.max_force/abs(pace) 
    //throt*=Sqrt(throt)
    
    for(var jg=0; jg<jote.top;jg++){
      if(jote.g[jg]){
        for(var j=jg+1; j<jote.top;j++)
        { _pnt_accel(
           jote.x[jg],jote.y[jg],jote.z[jg],jote.g[jg]
          ,jote.x[j],jote.y[j],jote.z[j],jote.g[j] )
          
          jote.vx[j] += _cqx; jote.vy[j] += _cqy; jote.vz[j] += _cqz
          jote.vx[jg]+= _cpx; jote.vy[jg]+= _cpy; jote.vz[jg]+= _cpz
        }
      }else{
        for(var j=jg+1; j<jote.topg;j++)
        { if(jote.g[j])
          { _pnt_accel(
             jote.x[jg],jote.y[jg],jote.z[jg],jote.g[jg]
            ,jote.x[j],jote.y[j],jote.z[j],jote.g[j] )
            
            jote.vx[jg]+=_cpx;jote.vy[jg]+=_cpy;jote.vz[jg]+=_cpz
          }
        }
      }
    }
  }
 
          
  function nbodygravelec(p)
  { 
    pace=p||vplay.model_pace; 
    throt=vplay.max_force/abs(pace) 
    //throt*=Sqrt(throt)
    
    for(var jg=0; jg<jote.top;jg++){
      if(jote.g[jg]){
        for(var j=jg+1; j<jote.top;j++)
        { _pnt_accelE(
           jote.x[jg],jote.y[jg],jote.z[jg],jote.g[jg],jote.c[jg]
          ,jote.x[j],jote.y[j],jote.z[j],jote.g[j],jote.c[j]
          ,jote.vx[jg],jote.vy[jg],jote.vz[jg]
          ,jote.vx[j] ,jote.vy[j] ,jote.vz[j] 
          )
          
          jote.vx[j] += _cqx; jote.vy[j] += _cqy; jote.vz[j] += _cqz
          jote.vx[jg]+= _cpx; jote.vy[jg]+= _cpy; jote.vz[jg]+= _cpz
        }
      }else{
        for(var j=jg+1; j<jote.topg;j++)
        { if(jote.g[j])
          { _pnt_accelE(
             jote.x[jg],jote.y[jg],jote.z[jg],jote.g[jg],jote.c[jg]
            ,jote.x[j],jote.y[j],jote.z[j],jote.g[j],jote.c[j]
            ,jote.vx[jg],jote.vy[jg],jote.vz[jg]
            ,jote.vx[j] ,jote.vy[j] ,jote.vz[j] 
            )
            
            jote.vx[jg]+=_cpx;jote.vy[jg]+=_cpy;jote.vz[jg]+=_cpz
          }
        }
      }
    }
  }
          
          
  var pace,throt,_cpx=-1,_cpy=-1,_cpz=-1,_cqx=-1,_cqy=-1,_cqz=-1
  
  function _pnt_accel(px,py,pz,pg,qx,qy,qz,qg)
  { 
    var dx=px-qx, dy=py-qy, dz=pz-qz
    var cf=(dx*dx + dy*dy + dz*dz)
    var hyp=Sqrt(cf)
    
    //proximity limit mechanism seems resposible
    //for difference in upscale gravity resolution... 
    //~ f=G*pace/(f*Sqrt(f)+ 0.025*G/f )
    //~ if(f<_throt*G){ f=Sqrt(_throt/f)*_throt }
    //~ if(f<_throt*Sqrt(G)){ f=_throt*_throt*G/f }
    //~ f=G*pace/(f*Sqrt(f)+ 0.025*G/f ) //d*d*d
    cf=vplay.gravity/cf 
    if(cf>throt){ cf= throt*(2-(0.6*(cf-throt)+cf)/cf)  }
    cf=cf*pace/hyp //note fa is no longer sqrt f
    
    if(qg){ //move p also
      var pf= -cf*qg, qf=cf*pg
      _cpx = dx*pf, _cpy = dy*pf, _cpz = dz*pf
      _cqx = dx*qf, _cqy = dy*qf, _cqz = dz*qf
    }else //move only q
    { cf*=pg, _cqx = dx*cf, _cqy = dy*cf, _cqz = dz*cf
      _cpx=_cpy=_cpz= -0 }
  }

  //~ var poo=0
  function _pnt_accelE(px,py,pz,pg,pe,qx,qy,qz,qg,qe,pvx,pvy,pvz,qvx,qvy,qvz)
  { 
    var dvx=pvx-qvx, dvy=pvy-qvy, dvz=pvz-qvz
    var dv= pvx*qvx-dvx*dvx
           +pvy*qvy-dvy*dvy
           +pvz*qvz-dvz*dvz 
       ,dv= dv<0? -Sqrt(Sqrt(-dv)):Sqrt(Sqrt(dv))
    
    var dx=px-qx, dy=py-qy, dz=pz-qz
    var cf=(dx*dx + dy*dy + dz*dz)
    //~ if(poo++<10000) console.log(dv)
    var af = vplay.gravity - 100*pe*qe*(1-dv*0.5)/(qg+pg)
   
    var hyp=af>0?Sqrt(cf):-Sqrt(cf) //stash sign in hyp
    cf=Math.abs(af/cf) //d*d*d
    
    if(cf>throt){ 
      cf= throt*(2-(0.6*(cf-throt)+cf)/cf) 
      //var over=cf-throt
      //cf= throt+throt-throt*(0.6*over+cf)/cf 
    }
    
    cf=cf*pace/hyp 
    
    if(qg){ //move p also
      var pf= -cf*qg; cf*=pg
      
      _cpx = dx*pf, _cpy = dy*pf, _cpz = dz*pf
      _cqx = dx*cf, _cqy = dy*cf, _cqz = dz*cf
    }else //move only q
    { cf*=pg, _cqx = dx*cf, _cqy = dy*cf, _cqz = dz*cf
      _cpx=_cpy=_cpz= -0 }
  }


  fig.nbodygrav = nbodygrav
  fig.nbodygravelec = nbodygravelec
  
  return fig

}