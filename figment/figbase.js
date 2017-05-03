// ~ -:- Fancy -:- foresight physics engine for futuroids -:- ~ 
/*  Copyright 2017 by Andrew Strain <andrewinput@protonmail.com>
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version. 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 *  Affero General Public License for more details. 
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/** 
  basis of figment object
  jote is a particle or other model datum ( as jot,iota )
**/ 

function newFigment(size){ return (function(size){
  //'us strict'

  var jote={
     'len' : size                    //max size
    ,'top' : 0                       //next empty 
    ,'topg': 0                       //top gravitator
    //~ ,'topdxx': 0                     //removed
    ,'x'   : new Float64Array(size)  //pos
    ,'y'   : new Float64Array(size)
    ,'z'   : new Float64Array(size)
    ,'vx'  : new Float64Array(size)  //mov
    ,'vy'  : new Float64Array(size)
    ,'vz'  : new Float64Array(size)
    ,'qx'  : new Float64Array(size)  //copies
    ,'qy'  : new Float64Array(size)
    ,'qz'  : new Float64Array(size)
    ,'tx'  : new Float64Array(size)  //copies for tempering
    ,'ty'  : new Float64Array(size)
    ,'tz'  : new Float64Array(size)
    ,'g'   : new Float64Array(size)   //weight   - roll into knd
    ,'c'   : new Float64Array(size)   //charge   - toll into knd
    ,'grp'  : new Uint32Array(size)  //group 
    ,'knd'   : new Uint32Array(size)  //jkind
    ,'bcolor' : new Float32Array(size*3) //basecol should be in knd
    ,'ccolor' : new Float32Array(size*3) //crntcol should be in renderer
  }
  
  var jkind  = { 
    nom:[] ,rad:[] 
   ,flags:[]         //is grouped?
  }
  
  var jgroup = {        //0 group is ? , encode info in groupname?
    roll: new Uint32Array(size)
   ,anch:[]            //jotei=jg.roll[jg.anch[grp]..to+jg.span[grp]]
   ,span:[]
   ,nom:[]             //le nom
   ,nat:[]             //nature of group...
  }

  var abs=Math.abs, floor=Math.floor, Sqrt =Math.sqrt 
  var Tau=2*Math.PI ,Pi=Math.PI, hPi=Pi/2, tPi=Pi/3

  var Drand=Fdrandom.pot("hm"), Hrand=Fdrandom.hot()
     ,rndu=Drand.f48, rndh=Hrand.f48 
        
  
  var _lastknd
  function namedknd(nm){
    if(jkind.nom[_lastknd]===nm){ return _lastknd }
    for( _lastknd=jknd.nom.length;_lastknd>0;_lastknd--){
      if(jkind.nom[_lastknd]===nm){ return _lastknd } 
    }
    return _lastknd
  }
  
  function velmove(t,maxv)
  {
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
  
  function joteqclear()
  { for(var i=0; i<jote.top; i++)
    { jote.qx[i]=jote.qy[i]=jote.qz[i]=-0 }
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
        
  function spongeAll(u){
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
  
  function recycle(){
    //store on a stack of empties to ressurrect later
  }
  
  return {
     velmove:velmove
    ,joteqclear:joteqclear
    ,joteqtovel:joteqtovel 
    //~ ,spongeAll:spongeAll
    ,recycle:recycle
    ,jote:jote
    ,jkind:jkind
    ,jgroup:jgroup
    ,Tau:Tau ,Pi:Pi, hPi:hPi, tPi:tPi
    ,abs:abs ,floor:floor ,Sqrt:Sqrt
    ,Drand:Drand, Hrand:Hrand, rndu:rndu, rndh:rndh 
  }

}(size))}