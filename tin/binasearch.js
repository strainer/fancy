
//----------------

function floorix(A,v,b){  //searchsorted
                          //small arrays floorex
                          //faster until around n>30
  var c=A.length-1

  if( b!==undefined && ( b==-1 || v>=A[b] ) && b<c && v<A[b+1] ){ return b }

  if( !(v>=A[0]) ){
    if(v<A[0]){ return -1 }
    //A[0] is nan
    if(c>30){ return floorixb(A,v,b) }
    while( !( v>=A[c]||c===-1 ) ){ c-- } //slow nan
    return c	
  }
  
  if(c>7){
    if( v<A[5]){ c=4 }
    else{
      if(c>27){
        if(c>58){ return floorixb(A,v,b) } 
        if( v<A[19]){ c=18 }
      }
    }
  }
  
  while( !(v>=A[c]) ){ c-- }
  
  return c
}


function floorixb(A,v,b){ //srtdsrch
  
  //A is sorted ascending 1,2,3...
  //return first elem in A with value less than or equal v
  //returns -1 if A[0] is more than v (no value less or equal)
  //skips undefs and nans, param b is optional hint
   
  var an=0, en=A.length-1, c=0 //anchor , end 
  
  if(b!==undefined){
    c=(en>>5)+1 
    var d = b-c
    if(d> 0){ if(A[d]<=v){ an=d }else{ if(A[d]>v){en=d-1} } }
    d=b+c
    if(d<en){ if(A[d]<=v){ an=d }else{ if(A[d]>v){en=d-1} } }
  }
    
  while( en-an>10 ){
    c=((an+en)>>1) 
    if(v<=A[c]){ en=c-1 }
    else{ 
      if(v>A[c]){ an=c }else{ break } //aborts for nan
    }
  }

  if( an===0 && !(A[0]<0||A[0]>=0) ){ //check for a non nan terminator
    while( !(v>=A[en] || en==-1) ){ en-- }
  }else{ 
    while( !(v>=A[en]) ){ en-- }
  }
  
  return en 
}
