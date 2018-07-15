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
  state for figment object
  jote is a particle or other model datum ( as jot,iota )
**/ 

function newFigstate(vplay){
  //'us strict'

  var size = vplay.particles
  
  var jote={
     'len' : size                    //max size
    ,'top' : 0                       //next empty 
    ,'topg': 0                       //top gravitator
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
    ,'grp'  : new Uint32Array(size)   //group 
    ,'knd'   : new Uint32Array(size)  //jkind
    ,'bcolor' : new Float32Array(size*3) //basecol should be in knd
    ,'ccolor' : new Float32Array(size*3) //crntcol should be in renderer
  }
  
  var jgroup = {        //0 group is ? , encode info in groupname?
    roll: new Uint32Array(size)
   ,anch:[]            //jotei=jg.roll[jg.anch[grp]..to+jg.span[grp]]
   ,span:[]
   ,nom:[]             //le nom
   ,nat:[]             //nature of group...
  }

  var jkind  = { 
    nom:[] ,rad:[] 
   ,flags:[]         //is grouped?
  } 
  
  var bkind =-1
  
  var Drand=Fdrandom.pot("hm"), Hrand=Fdrandom.hot()
     ,rndu=Drand.f48, rndh=Hrand.f48 
    
  return { 
     jote:jote ,vplay:vplay
    ,jkind:jkind ,bkind:bkind ,jgroup:jgroup
    ,Drand:Drand ,Hrand:Hrand ,rndu:rndu, rndh:rndh
  }
}