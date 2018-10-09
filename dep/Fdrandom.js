 // Fdrandom.js - Fast deterministic random methods
/** @author Andrew Strain
 ** This is free and unencumbered software released into the public domain 
 ** in homage to human ingenuity against greed and destruction.
 */

var newFdrandom = function(){ //factory
  
  var FdrHotPot    //a static instance for indeterminables

  return (function(sd){ 
  'use strict'
  
  var nml,va,vl,qr,rb,ga,gb,ua,ub,us,ju,U,sv,i
  plant(sd) 
  
  sv=getstate()
    
  function plant(sd) {   //constructor
    
    va=1000, vl=1, ga=-1, gb=0, nml=qr=ua=ub=-0, us=-0.1, rb=2.0e+15
    ju=1, U=[ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8 ]

    sow(sd)
    
    for( i=0;i<98;i++ ) f48()    //warms up state to hide seed
    va=irange(3206324,3259829)   //ishr2's seed
    
    // fillr constants coordinated for r2 ? check these ?
    ua=0.5+U[0]*0.75487766624669
    ub=0.5+U[0]*0.56984029099805
    ua=ua-(ua>>>0) ; ub=ub-(ub>>>0) 
    
    function sow(sd) {      //digests seed objects recursively
      var t=typeof(sd) , r 
      
      if(t === 'string'){
        t=sd.length; if(t>va*100){ t=va*100; va-- }
        for( r=0; r<t; r++ )
        {  U[0]=( U[0]+65537-sd.charCodeAt(r) )/6474.10101; f48() }
        return 
      }
      
      if(va<0){ return }    //va used to count limit the process
      
      if(t === 'object')
      { va--
        if(sd.constructor === Array)
        { U[0]*=0.95; for( r=0; r<sd.length; r++ ){ sow(sd[r]) } return }
        if(sd === null) { U[0]*=0.97; return }
        U[0]*=0.93;
        for(r in sd) if(sd.hasOwnProperty(r)){ sow(r);sow(sd[r]) } 
        return 
      }
      
      if(t === 'boolean') { U[0]*=0.93; if(sd){ f48() } return }

      if(isFinite(sd)){
        r= sd<=0? 1.234020348919-sd : sd 
        r= modp(r,15.034271450894242661)
        U[0]=U[0]*0.1 + r*0.8999999; f48() 
        return
      }
   
      if(t === 'function'){ U[0]*=0.91; sow(sd.name); return }
      if(t === 'symbol')  { U[0]*=0.89 }

      f48(); return 
    }
  }

  function checkfloat() 
  { var p=newFdrandom([3,2],2450,"~fez",{c:0.1})
    for( i=0;i<1000000;i++ ){ p.dbl() }
    return p.dbl() === 0.6630336428202791
  }

  function getstate() {
    return [ U[0],U[1],U[2],U[3],U[4],U[5],U[6],U[7] 
            ,ju, va, vl, qr, rb, ga, gb, ua, ub, us, nml ] 
  } 
  
  function setstate(s) {
    for( i=0;i<8;i++ ) U[i]=s[i]
    ju=s[8];  va=s[9];  vl=s[10]; qr=s[11]; rb=s[12]; 
    ga=s[13]; gb=s[14]; ua=s[15]; ub=s[16]; us=s[17];
    nml=s[18]; sv=s
  }

  function pot() { return newFdrandom(arguments) }
  
  function repot(s) { 
    if (s===undefined) { setstate(sv) } else { plant({"0":{"0":s}}) }
    return this 
  }
  
  function hotpot() {
    if(typeof(window)!=='undefined' 
     && (window.crypto||window.msCrypto)){ 
      var cO = window.crypto||window.msCrypto
      var ag=[cO.getRandomValues(new Uint32Array(8))] 
    }else{
      ag=[(new Date()).getTime()-1.332e+12, Math.random()] 
    }
    ag.push(arguments)
    return newFdrandom(ag)
  }

  function hot(){
    if(!FdrHotPot){ FdrHotPot=hotpot() }
    return FdrHotPot
  }
    
  ///A redesign of J.Baagoe's Alea; a float cast dual lcg prng
  function f48() { 
    var c= 0.12810301030196883 * U[0] +
           15.378612015061215 * (1.0000000000000037-(U[ju=(ju===7?1:ju+1)]))
    return U[ju]= c-( (U[0]=c) >>>0 )
  } //20 msb of the magic numbers were mined with scanrandom.js

  function dbl() { 
    return ( (( ((f48()*0x39b00000000)>>>4)* //saves 4bits of entropy
            0.06249999650753)+f48())*5.960464477540047e-08 )
  } 
  
  function f24() { return f48()*0.99999997019767 }

  function range(b,d)  { return ( f48()*(d-b) ) +b }
  
  function irange(b,d) { return Math.floor( (f48()*(d-b+1) )+b ) }
    
  function i32()  { return (f48()*0x1700000000)|0 }

  function ui32() { return (f48()*0x1700000000)>>>0 }
  
  function rbit() { 
    if( rb<2147483648 ) return (rb*=2)&1 
    return (rb= dbl() +0.5) &1 
  }

  function rpole() { 
    if( rb<2147483648 ) return ((rb*=2)&2)-1
    return ( (rb= dbl() +1.5) &2) -1
  } 
  
  function ilcg() ///flat lcg 
  { return vl = (vl*13229323)^3962102927  }

  function ishr2() ///flawed shift register
  { va^= (va<<7)+1498916339; return va^= va>>>8  }

  function ishp(){ ///the two combined for interest
    vl = (vl*13229323)^3962102927
    return vl^((vl<<7)+1498916339) 
  }

  function uigless()
  { return (( ui32()&ui32() )>>>0)  }
  function uigmore()
  { return (( ui32()|ui32() )>>>0)  }
  function igbrist()
  { return (( ui32()&ui32() )>>1) + (( ui32()|ui32() )>>1)  }
  function igmmode()
  { return (( ui32()&ui32() )>>1) - (( ui32()|ui32() )>>1)  }
  
  
  function zrange(b,d,c){ //a fluctuating combination of distributions 
                             
    var dists=[gbowl,range,gtrapez,gnorm,gcauchy,gspire]
        
    c= (c===undefined)?1:c; b= (b===undefined)?-1:b; d= (d===undefined)?1:d
   
    var e=f48() 
    
    if(us>1000){ //gb was strong, becomes ga
      us-=1000 ,ga=gb ,ua=ub
      if(ga>7){gb=irange(0,7)}else{gb=irange(0,9)}
      ub=f48()	
    }else{      //ga was strong
      if( us<0 ){
        if(ga<0){ ga=irange(0,8); ua=f48() }
        us+=1000 ,gb=ga ,ub=ua
        if(gb>7){ga=irange(0,7)}else{ga=irange(0,9)}
        ua=f48()
      }
    }

    var x=us*0.001 ,cf=Math.sqrt(c*0.002)  //us is 0>1000

    us+=(e-0.3333)*c
    
    ua+=(f48()-0.5)*cf
    ua=ua>1?1:ua<0?0:ua
    ub-=(f48()-0.5)*cf
    ub=ub>1?1:ub<0?0:ub

    if(ga<6){ var gaa=dists[ga](-1+ua,ua) }
    else{
      if(ga<8){ gaa=gskip(0,-1+ua,ua) }
      else{ gaa=lrange(ub*0.7,-1+ua*0.85,ua*0.85+0.15) }
    }
    
    if(gb<6){ var gbb=dists[gb](-1+ub,ub) }
    else{
      if(gb<8){ gbb=gskip(0,-1+ub,ub) }
      else{ gbb=lrange(ua*0.7,-1+ub*0.85,ub*0.85+0.15) }
    }
 
    return b+ (d-b)*((gbb*x -gaa*x + gaa)*0.5+0.5) 
  }
  
  function gbowl(b,d){ 
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d; var c=f48()
    return b+ (d-b)* (1.5+(1.5-c*(c+f48()))*rpole())*0.33333333333333 
  }
  function gspire(b,d){ 
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d; 
    return b+ (d-b)*(0.5+(0.5-f48())*f48()) 
  }
  function gthorn(b,d){ 
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    return b+ (d-b)* 0.5* (1+ (f48()-f48())*f48() ) 
  }
  function gwedge(b,d){ 
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    return b+ (d-b)* 0.5* 
    (1+ (Math.abs(f48()-f48())-Math.abs(f48()-f48()))) 
  }
  function gnorm(b,d){
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    return b+ (d-b)* 0.2* (f48()+f48()+f48()+f48()+f48())
  } 
  function gcauchy(b,d){
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    return b+ (d-b)*(0.5+((f48()+f48()+f48()-1.5)/(0.1+Math.abs(f48()+f48()+f48()-1.5)))*0.03333333333)
  } 
  function lrange(a,b,d){ //default -1 to 1
    a= (a===undefined)?0.5:a; b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    
    if(a>0.5){  //load middle of dist
      if (f48()>a*2-1) return f48()*(d-b) +b //return flat
    }else{      //load the ends
      if (f48()<a*2) return f48()*(d-b) +b   //return flat
    }
    var c=(f48()*1.333+f48()+f48()*0.66666)*0.3333333-0.5
    c= (a>0.5)?c: (c>0)?0.5-c:-0.5-c   //transform if load ends
    return b+ (d-b)* (c+0.5)
  }
  
  function gteat(b,d){
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d
    return b+ (d-b)* 0.5* (0.5 + (0.5-f48())*f48()+f48()) 
  }
  function gtrapez(b,d){
    b= (b===undefined)?-1:b; d= (d===undefined)?1:d 
    return b+ (d-b)* (0.5+ 0.333333* (0.5+f48()-f48()*2)) 
  }

  function gskip(c,b,d){
    qr+= ( c=c||f48()*0.666 )*0.5; qr+=(1-c)*f48() 
    d= (d===undefined)?1:d
    return (b||0)+(d-(b||0))*(qr-= qr>>>0) 
  }
 
  /// fill sequences of Martin Roberts. extremelearning.com.au
  function fillr1(b,d){
    ua+=0.61803398874989 ; ua-=ua>>>0
    
    b=(b===undefined)?-1:b; d=(d===undefined)?1:d; 
    return (ua*(d-b))+b 
  }
  
  function fillr2(b,d){
    ua+=0.75487766624669 ; ua-=ua>>>0
    ub+=0.56984029099805 ; ub-=ub>>>0
    
    b=(b===undefined)?-1:b; d=(d===undefined)?1:d;
    return [ (ua*(d-b))+b , (ub*(d-b))+b ]
  }

  function fillr3(b,d){
    if(us==-0.1){ //must init state for 3d
      
      ua=U[0]+U[1]*0.81917251339616
      ub=U[0]+U[1]*0.67104360670379
      us=U[0]+U[1]*0.54970047790197
      ua=ua-(ua>>>0) ; ub=ub-(ub>>>0) ; us=us-(us>>>0) 
    }
    
    ua+=0.81917251339616 ; ua-=ua>>>0
    ub+=0.67104360670379 ; ub-=ub>>>0
    us+=0.54970047790197 ; us-=us>>>0
    
    b=(b===undefined)?-1:b; d=(d===undefined)?1:d;
    return [ (ua*(d-b))+b, (ub*(d-b))+b, (us*(d-b))+b ]
  } 
  
  var psig,csig
  function usum(n,scale,mean) { 
    var sum= (((n=n||2)&1)==1)? 0.5 : 0
    for( var i=0;i<n;i++ ) sum=f48()-sum 
    
    if(scale === undefined) return sum
    if(scale !== psig) //cache csig value for scale 
    {  psig=scale; csig= scale*3.47/Math.sqrt(n) } //approx 1/100th accurate
    
    return (mean||0)+ sum*csig 
  }

  function gaus(scale,mean) { return nrml(f48,scale,mean) }
  
  function gausx(scale,mean){ return nrml(dbl,scale,mean) }
  
  function cauchy(scale,mean){ return (mean||0)+(scale||1)*nrml(f48)/nrml(f48) }
  
  function nrml(func,scale,mean) /// G Marsaglias box muller polar method
  { var p,q,w
  
    if(nml){ 
      q = nml ; nml=0
      if(scale) return q *scale +(mean||0)
      return q
    }else{
      do {
        p= 2*func()-1; q= 2*func()-1
        w= p*p + q*q
      } while( w>=1 )

      w = Math.sqrt(( -2.0*Math.log(w) ) /w)
      nml = p*w;
      
      if(scale) return q*w*scale+(mean||0)
      return q*w 
    }
  }

  function mixof(Ai,Ao,od,c,e) {
    var joinr=1,So="",ob=0
    if(typeof Ai ==='string'){ Ai=Ai.split("") } else { joinr=0 }
    
    if(typeof Ao !=='number'){ 
      if(Ao === undefined){ od=1; Ao=[] }
      else{
        ob=Ao.length
        if(typeof Ao ==='string'){ 
          So=Ao; ob=0; joinr=1 
        } else joinr=0
        if(ob===0) Ao=new Array(od||1) 
      }
    }else{ 
      e=c; c=od; od=Ao||1; Ao=new Array(od) 
    }
    
    od =(od||1)+ob
    c= c||0
    e= e||Ai.length-1 ; e++
    
    for( var i=ob;i<od;i++ ){
      Ao[i]= Ai[ c+( f48()*(e-c) )>>>0 ] 
    }
    
    return joinr? Ao=So+Ao.join("") : Ao
  }

  function mixup(Ai,Ao,c,e) {
    var joinr=0, So="", ob=0, i=0
    if(typeof Ai ==='string'){ Ai=Ai.split(""); joinr=1 }
    
    if(typeof Ao !=='string' && typeof Ao !=='object' ) 
    { e=1+(c||(Ai.length-1)) ; c=Ao||0; Ao=Ai }
    else
    { c= c||0 ; e= 1+(e||(Ai.length-1))
      if(typeof Ao ==='string'){
        So=Ao; joinr=1
        Ao=new Array(e-c); e-=c
        for( i=0;i<e;i++ ) Ao[i]= Ai[i+c]
        c=0; 
      }else{
        joinr=null
        ob=Ao.length

        if(ob===0) Ao=new Array(e-c)
        var jc=c-ob
        for( i=ob; i<ob+e-c; i++) Ao[i]= Ai[jc+i]
        c=ob; e=Ao.length
      }
    }

    var d,p,ep=e-1
    while( c<ep ){ 
      d= Math.floor( c+( f48()*(e-c) ) ) 
      p= Ao[c]; Ao[c++]=Ao[d]; Ao[d]=p
    }
  
    return joinr? Ao=So+Ao.join("") : Ao
  }
      
  function aindex(mx,Ai,sq,sep,lim,x){  //Sorry but its working....
    var Av,i
    if( typeof mx !=='boolean')
    { x=lim,lim=sep,sep=sq,sq=Ai,Ai=mx,mx=true }
    if( typeof Ai !=='object' || (isNaN(parseFloat(Ai[0])) || !isFinite(Ai[0]))
     ||(typeof sep ==='string' && sep==="pos")){ 
      Av= new Array((Ai>0)?Ai:Ai.length)
      if( typeof sq ==='undefined') sq=1
      if(sep ==="pos"){ sep=lim,lim=x }
      for( i=0;i<Av.length;i++ ) Av[i]=i
    }else{ Av=Ai,sq=sq||0 }
    
    var ne=Av.length, nc=ne>50?50:ne-1, nd=ne>350?350:ne-1

    var Ax= new Array(ne); for(var i=0;i<ne;i++) Ax[i]=i
        
    if(ne<1) return Ax   //handle diminutive arrays
    if(mx) mixup(Ax)
    if(ne==2){ 
      if ((sq<0)^(Av[Ax[1]]>Av[Ax[0]]))
      { return [Ax[1],Ax[0]] }else{ return Ax } 
    }
         
    var autosep=false, bsep=(sep===0)?"zero":sep, csep=sep*0.5
    if( typeof sep ==='undefined' || sep==="auto" ){ 
      var kd=0, np=(ne*0.33)|0, nq=1+(ne*0.66)|0 
      for( i=0;i<nd;i++){
        kd+=Math.abs(Av[i]-Av[(np+i)%ne])
          + Math.abs(Av[(np+i)%ne]-Av[(nq+i)%ne])
          + Math.abs(Av[(ne+nq-i)%ne]-Av[(ne-i)%ne]) 
      } 
      autosep=true, sep=bsep=kd/(nd*10), csep=sep*0.5
    }
    if(ne<10) autosep=false
    if(!lim){ lim=(ne+500000)*0.001 }
    var ti=lim*8000, te=ti*0.3 
    
    var t=0, j=0, jr=0, jm=0, c=irange(1,ne-1), ch=ne+3, jm=0, lw=false
    
    while( ch>0 && ti>0 ) { 
      
      var ib=modp((c=c<0?c+ne:c),ne), ic=ib+1, id=ib+2, ie=ib+3
      if(ie>=ne){ ie=ie-ne,id=modp(id,ne),ic=modp(ic,ne) }
      
      var stick=0 ,d=1 
      
      if(autosep){ sep=bsep*range(0.83333,1.2),csep=sep*0.5 }

      if(Math.abs(Av[Ax[ic]]-Av[Ax[id]]+sq)<sep){  //1-away collision 
        jm=irange(2,nd)+ic, jr=jm+nc, stick=1, d=-2, lw=ti<te
        while ( stick && jm<jr ){ 
          j=modp(jm,ne) 
          if( Math.abs(Av[Ax[id]]-Av[Ax[j]]+sq)>=sep 
           && Math.abs(Av[Ax[(j+1)%ne]]-Av[Ax[ic]]+sq)>=sep
           && (lw || Math.abs(Av[Ax[ie]]-Av[Ax[j]]+sq)>=csep) 
          ){ 
            stick=0, t=Ax[ic], Ax[ic]=Ax[j], Ax[j]=t 
            if(jm-ic+2>ch){ ch=jm-ic+2 }
          }
          jm++;
        } 
        var f=(jm-jr+nc)*0.5; ti-=f
        if(stick){ t=Ax[ib], Ax[ib]=Ax[ic], Ax[ic]=t }
        if(autosep) { bsep*= (66-((f-2)/nc))*0.0151466 } 
        
      }else{ //1-away good, check 2-away
        if( ti>te && Math.abs(Av[Ax[ic]]-Av[Ax[ie]]+sq)<csep ) 
        { stick=1, jm=irange(2,nd)+ic, jr=jm+nc 
          while ( stick && jm<jr ){ 
            j=modp(jm,ne)
            if(Math.abs(Av[Ax[id]]-Av[Ax[j]]+sq)>=sep
             &&Math.abs(Av[Ax[(j+1)%ne]]-Av[Ax[ie]]+sq)>=sep
             &&Math.abs(Av[Ax[ic]]-Av[Ax[j]]+sq)>=csep)
            { 
              stick=0,t=Ax[ie], Ax[ie]=Ax[j], Ax[j]=t
              if(jm-ic+2>ch){ ch=jm-ic+2 }
            }
            jm++
          }
          ti-=(jm-jr+nc)*0.5
        }
      }
      c=c+d, ch=ch-d, ti-- 
    }
    
    if(autosep){ us=(ti>te)?bsep*0.81:(ti<1)?0:-bsep*0.8 }
    else{ us=(ti>te)?bsep:(ti<1)?0:-bsep }
    
    return Ax
  }
  
  function aresult(A,Av,sq){ 
    if(!A) { return us }
    var c, n=A.length, df=Infinity
    if( typeof Av !=='object' ){
      for(i=0;i<n;i++)
      { c=Math.abs(A[i]-A[(i+1)%n]+(Av||0)); if(c<df)df=c }
    }else{
      for(i=0;i<n;i++)
      { c=Math.abs(Av[A[i]]-Av[A[(i+1)%n]]+(sq||0)); if(c<df)df=c }
    }
    return (us>0||us==="zero")?df:-df 
  }

  function antisort(mx,Ai,A,sq,sep,lim,x){
    if( typeof mx !=='boolean')
    { x=lim,lim=sep,sep=sq,sq=A,A=Ai,Ai=mx,mx=true }
    var c=0, e=Ai.length, Ao=[], K
    if( typeof A !=='object' )
    { x=lim,lim=sep,sep=sq,sq=A,Ao= new Array(e) }
    else{ Ao=A, c=A.length }
    
    K=aindex(mx,Ai,sq,sep,lim,x)
   
    for(i=0;i<e;i++) Ao[c+i]=Ai[K[i]]
    if( typeof A !=='object' ){ for(i=0;i<e;i++) Ai[i]=Ao[c+i] }
    return Ao
  }
    
  function modp(a,b){ return a-Math.floor(a/b)*b }
  
  function bulk(A,f,b,c,d){
    if( typeof A !=='object' ){ A=new Array( parseInt(A)||1 )  }
    var i=0,n=A.length; f=f||f48 
    while( i<n ) A[i++]=f(b,c,d);
    return A
  }

  function within(a,e,fn,n){
    var r; n=n||5
    while(n--){
      r =fn()
      if(r>=a&&r<=e){ return r }
    }
    return range(a,e)
  }
  
  return{
     pot: pot   ,hot: hot  ,hotpot: hotpot
    ,repot: repot          ,reset: repot
    ,getstate: getstate    ,setstate: setstate 
    ,checkfloat: checkfloat	
   
    ,next: f48  ,f48: f48  ,dbl: dbl
    ,f24: f24   ,fxs: dbl 
    ,i32: i32   ,ui32: ui32
    
    ,rbit: rbit ,rpole: rpole
    ,range: range  ,irange: irange 
    ,lrange:lrange ,zrange: zrange
    
    ,cauchy:cauchy  ,gaus: gaus  ,gausx: gausx  ,usum: usum
    
    ,uigless: uigless  ,uigmore: uigmore 
    ,igbrist: igbrist  ,igmmode: igmmode 
    ,ilcg: ilcg      ,ishr2: ishr2    ,ishp: ishp
        
    ,gbowl: gbowl    ,gspire: gspire  ,gthorn: gthorn 
    ,gwedge: gwedge  ,gnorm: gnorm    ,gcauchy: gcauchy 
    ,gskip: gskip    ,gteat: gteat    ,gtrapez: gtrapez 
        
    ,mixup: mixup    ,mixof: mixof
    ,aindex: aindex  ,aresult: aresult  ,antisort: antisort 
    ,fillr1: fillr1  ,fillr2: fillr2    ,fillr3: fillr3

    ,bulk:bulk  ,within:within
    ,version: function(){ return "v2.8.0" } 
  }
}(arguments))}
  
if(typeof module!=='undefined' && module.exports) module.exports = newFdrandom()
else if(typeof window!=='undefined') window.Fdrandom = newFdrandom()
else console.log("Fdrandom.js did not import")