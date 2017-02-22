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
    ,'topg': 0
    ,'topd': 0
    ,'x'   : new Float64Array(size)  //pos
    ,'y'   : new Float64Array(size)
    ,'z'   : new Float64Array(size)
    ,'vx'  : new Float64Array(size)  //mov
    ,'vy'  : new Float64Array(size)
    ,'vz'  : new Float64Array(size)
    ,'qx'  : new Float64Array(size)  //copy
    ,'qy'  : new Float64Array(size)
    ,'qz'  : new Float64Array(size)
    ,'g'  : new Float64Array(size)   //weight
    ,'c'  : new Float64Array(size)   //charge
    ,'grp'  : new Uint32Array(size)  //group 
    ,'knd'  : new Uint32Array(size)  //kind
    ,'bcolor' : new Float32Array(size*3)
    ,'ccolor' : new Float32Array(size*3)
  }

  var abs=Math.abs, floor=Math.floor, Sqrt =Math.sqrt 
  var Tau=2*Math.PI ,Pi=Math.PI, hPi=Pi/2, tPi=Pi/3

  var Drand=Fdrandom.pot("hm"), Hrand=Fdrandom.hot()
     ,rndu=Drand.f48, rndh=Hrand.f48 
        
  function velmove(t)
  {
    for(var i=0; i<jote.top; i++)
    { 
      //_topolar(jote.vz[i],jote.vz[i+1],jote.vz[i+2])
      //_rad += (1)*0.1
      //_tocarte(_rad,_the,_phi)
      //jote.vz[i]=_x;jote.vz[i+1]=_y;jote.vz[i+2]=_z
      
      jote.x[i]=jote.x[i]+jote.vx[i]*t
      jote.y[i]=jote.y[i]+jote.vy[i]*t
      jote.z[i]=jote.z[i]+jote.vz[i]*t
    }
  }
        
  function recycle(){
    //store on a stack of empties to ressurrect later
  }
  
  return {
     velmove:velmove 
    ,recycle:recycle
    ,jote:jote
    ,Tau:Tau ,Pi:Pi, hPi:hPi, tPi:tPi
    ,abs:abs ,floor:floor ,Sqrt:Sqrt
    ,Drand:Drand, Hrand:Hrand, rndu:rndu, rndh:rndh 
  }

}(size))}