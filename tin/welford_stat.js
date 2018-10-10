
welfordstat = function(Ai,st,ov){
  
  var minv=Ai[st] ,maxv=minv ,smnm=0, qvl=-0 
  var delt=-0 ,delt2=-0 ,mean=-0 ,me2=-0 
  
  for(var i=st; i<ov; i++) //need to max,min 
  { 
    qvl=Ai[i]||-0 
    
    if (qvl>=maxv)
    { maxv=qvl ; if(qvl === Infinity) continue } 
    else if (qvl<=minv)
    { minv=qvl ; if(qvl === -Infinity) continue }
        
    //calc variance.. welfords alg
    smnm++	
    delt  = qvl -mean
    mean += delt/smnm
    delt2 = qvl -mean
    me2  += delt*delt2	
    
  }
  
  var sdev= smnm>1? Math.sqrt( me2/(smnm-1) ) : 0

  return {minv:minv ,maxv:maxv ,sdev:sdev ,mean:mean } 
}
