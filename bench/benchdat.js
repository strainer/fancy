// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * *  * * * * * * * * * * * * * * */ 
/// benchdat.js - hanging together 

function benchdat(){
return{
 
  worlds:{
    0:{name:"Solar System",desc:""}
   ,1:{name:"Near Earths",desc:""}
   ,2:{name:"TRAPPIST-1",desc:""}
   ,3:{name:"Blue Disk",desc:""}
   ,4:{name:"3Planets",desc:""}
   ,5:{name:"MassRing",desc:""}
   //~ ,6:{name:"Cymball",desc:""}
   //~ ,7:{name:"QuasiMags",desc:""}
   ,8:{name:"Pattern",desc:""}
   ,9:{name:"4MassRing",desc:""}
   //~ ,10:{name:"47 Tuc X9",desc:""}
   //~ ,11:{name:"Point Cloud",desc:""}
   ,12:{name:"Bloop",desc:""}
   //~ ,13:{name:"XXX",desc:""}
  }
    
  ,seed:0 ,world:3, seespots:-1
  ,geometry:{}, camera:{}, scene:{} ,focus:{}
  ,renderer:{}, displaybugi:20 //avoiding scrollbar
  
  ,instaprops:{}
  
  ,defaults:{  //these are copied into vplay

    //framing , choreography
     paused:1, explode:0, pausetime:0, gravityoff:0

    ,allframe_clock:0
    ,goframe_clock:0
    ,skipframe_step:1   // units of allframes
    ,skipframe_trip:0   // units of allframes
    ,lastframe:10000
    ,playedframe_clock:0 //units of played animframes
    ,runcycle_step: 1   // units of model_pace 
    ,runcycle_trip: 0   // units of model_clock
    ,rendermark:0        //time of last renderscope
    ,movperframe:0

    //fig passage
    ,model_clock:0     // units of innate
    ,model_pace: 0.2    //(12hr) 0.15 // units of model_clock

    //fig naturals
    ,gravity:1 
    ,gravqual:0.005

    ,max_force:  5      // units of model_clock
    ,max_vel: 0
    ,nature: 0          //del
    ,forces: 0          //forces function
    
    ,particles:32000    // max particles 
    ,iota:0             // cur particles

    //rendering
    ,rendermode:0
    ,colorfac:0.5
    ,pradius:2
    ,driftCount:0, camDrift:0.03, camRad:250, camRadd:0
    ,camThet:0, camPhi:Math.PI/1.5, spincam:0, firstfocus:0  //phi 
    ,nowfocus:0 
    
    //uicontrols
    ,keyUD:0, keyLR:0, keyR:0 ,keyUDd:0, keyLRd:0, keyRd:0, keyCtrl:0 
    
    //display
    ,printtime:function(a){ return (a).toFixed(2) }
    ,fps:0
  
    //lint
    ,Gtweak:1
  }
}

}