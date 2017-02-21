-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

print()

function fm(v,x)
  x = x or 3
  
  local q = string.format("%."..x.."f", v)
  
  while 
    string.find(q,"%.") and
    string.sub(q, string.len(q))=="0"
    or string.sub(q, string.len(q))=="."
  do 
    q=string.sub(q,1,string.len(q)-1)
  end
  
  return q
end

function dotprod(a,b)
  return a[1]*b[1]+a[2]*b[2]+a[3]*b[3]
end

function addvec(a,b)
  return { a[1]+b[1],a[2]+b[2],a[3]+b[3] }
end

function multvec(a,b)
  return { a*b[1],a*b[2],a*b[3] }
end

function deltavec(b,a)
  return { (a[1]-b[1]), (a[2]-b[2]), (a[3]-b[3]) }
end

function lenvec(a)
  return math.sqrt(a[1]*a[1]+a[2]*a[2]+a[3]*a[3])
end

 -- V is delta velocities vector
 -- P is delta positions vector
 -- ctime = ( - V.P + sqrt( V.P.P + (d*d* V.V) - P.P.V.V ) ) / V.V

--[[
values f , g
states o: origin , d: destination
]]

p= 

{
{ { 0,0,0 }, { 10,10,10 } 
 ,{ 10,10,10}, { 0,0,0 } }
 
,{ { 0,0,0 }, { 0,0,10 } 
 ,{ 10,0,0}, { 0,0,0 } }
   
,{ { 0,0,0 }, { 0,0,10 } 
 ,{ 0,0,10}, { 0,0,0 } }

,{ { 5,5,5 }, { 10,10,10 } 
 ,{ 5,5,5}, { 0,0,0 } }



}

-- particle A, particle B
-- position p, position q
-- xyz 1 2 3

for i=1,#p do

  Ap=p[i][1]  Aq=p[i][2]  -- transfering co-ords of particle travel 
  Bp=p[i][3]  Bq=p[i][4]
  
  Apx=Ap[1]  Apy=Ap[2]  Apz=Ap[3]
  Aqx=Aq[1]  Aqy=Aq[2]  Aqz=Aq[3]
  
  Bpx=Bp[1]  Bpy=Bp[2]  Bpz=Bp[3]
  Bqx=Bq[1]  Bqy=Bq[2]  Bqz=Bq[3]
  
  --[A|B][p|q][x|y|z]
  --Particle A and B,  position p and q, dimensions x y z 
  
  d = 1 -- distance of contact

  P1 = Ap 
  P2 = Bp --old namescheme
  
  --~ 	V1 = deltavec(Ap,Aq)  -- delta of object co-ords
  --~   V2 = deltavec(Bp,Bq)  -- is 'velocity' vector
  
  --Vn is each particles velocity
  --V1 = { (Aq[1]-Ap[1]), (Aq[2]-Ap[2]), (Aq[3]-Ap[3]) } --old indexing
  --V2 = { (Bq[1]-Bp[1]), (Bq[2]-Bp[2]), (Bq[3]-Bp[3]) }
  
  V1 = { (Aqx-Apx), (Aqy-Apy), (Aqz-Apz) }
  V2 = { (Bqx-Bpx), (Bqy-Bpy), (Bqz-Bpz) }

  --print(V1[1],V1[2],V1[3],V2[2],V2[2],V2[3])
  
  Pa=P1	 Pb=P2
  
  Va=V1	 Vb=V2
  
--~ V1=Va V2=Vb
--~ V1 = Av --[A|B]v is array of {x,y,z} as velocities
--~ V2 = Bv
  
  -- position difference
  -- velocity difference
  -- P= { (P2[1]-P1[1]), (P2[2]-P1[2]), (P2[3]-P1[3]) }
  -- V= { (V2[1]-V1[1]), (V2[2]-V1[2]), (V2[3]-V1[3]) }
  
  -- P is vector based on the distance between two particles
  -- V is vector based on the velocitis of two particles
  
  -- P= { (P2[1]-P1[1]), (P2[2]-P1[2]), (P2[3]-P1[3]) }
  P= { (Bpx-Apx), (Bpy-Apy), (Bpz-Bpz) }
  -- V= { (V2[1]-V1[1]), (V2[2]-V1[2]), (V2[3]-V1[3]) }
  V= { ((Bqx-Bpx)-(Aqx-Apx)), ((Bqy-Bpy)-(Aqy-Apy)), ((Bqz-Bpz)-(Aqz-Apz)) }
--~ 	P= deltavec(P1,P2)   V= deltavec(V1,V2) 

  VV=dotprod(V,V)    PP=dotprod(P,P)    VP=dotprod(V,P)
  
--~ 	VV=V[1]*V[1]+V[2]*V[2]+V[3]*V[3]
--~ 	PP=P[1]*P[1]+P[2]*P[2]+P[3]*P[3]
--~ 	VP=V[1]*P[1]+V[2]*P[2]+V[3]*P[3]
   
  --v diff in particles velocities
  --p diff in particles start position
  
  --fcT= ( -VP - math.sqrt( VP*VP -PP*VV + d*d*VV )) / VV
  
  --vp is velocity and position dotted
  --v and p are calculated themselves from 
  
  -- ctime = ( - V.P + sqrt( (V.P)(V.P) + (d*d* V.V) - P.P.V.V ) ) / V.V

  -- formula of first contact
--~ 	print( "frm "..VP*VP + d*d *VV -PP*VV)
  
  --algebraicaly layered products: vp,vv,pp
  --as v is 3d velocity 
  
  --fcT= ( VP - math.sqrt( VP*VP + d*d *VV -PP*VV)) / VV
  
  VV=(Vb[1]-Va[1])*(Vb[1]-Va[1])+(Vb[2]-Va[2])*(Vb[2]-Va[2])+(Vb[3]-Va[3])*(Vb[3]-Va[3])
  --Vb1,Vb1+Va1,Va1-Va1,Vb1
  PP=(Pb[1]-Pa[1])*(Pb[1]-Pa[1])+(Pb[2]-Pa[2])*(Pb[2]-Pa[2])+(Pb[3]-Pa[3])*(Pb[3]-Pa[3])
  VP=(Vb[1]-Va[1])*(Pb[1]-Pa[1])+(Vb[2]-Va[2])*(Pb[2]-Pa[2])+(Vb[3]-Va[3])*(Pb[3]-Pa[3])
  
  --first contact
  fcT= ( - math.sqrt( VP*VP + (d*d-PP)*VV ) - VP) / VV
  --second contact
  scT= ( math.sqrt( VP*VP + (d*d-PP)*VV  ) - VP ) / VV
  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  
  Pat = addvec( Pa,multvec(fcT,Va)  )
  Pbt = addvec( Pb,multvec(fcT,Vb)  )
  dist= lenvec( deltavec(Pat,Pbt) )

  sPat = addvec( Pa,multvec(scT,Va)  )
  sPbt = addvec( Pb,multvec(scT,Vb)  )
  sdist= lenvec( deltavec(sPat,sPbt) )

  print("-Test "..i)
  print("Object a: "..fm(Ap[1])..","..fm(Ap[2])..","..fm(Ap[3]).." -> "
        ..fm(Aq[1])..","..fm(Aq[2])..","..fm(Aq[3])
        .."  ( v= "..fm(Va[1])..","..fm(Va[2])..","..fm(Va[3]).." )"
        )
  print(" Object b: "..fm(Bp[1])..","..fm(Bp[2])..","..fm(Bp[3]).." -> "
        ..fm(Bq[1])..","..fm(Bq[2])..","..fm(Bq[3])
        .."  ( v= "..fm(Vb[1])..","..fm(Vb[2])..","..fm(Vb[3]).." )"
        )

  if fcT<0 then print("Negative T means leaving contact") end
  print("Contact Distance at "..fm(fcT).."t is "..fm(dist))
  print(" Contact a: "..fm(Pat[1])..","..fm(Pat[2])..","..fm(Pat[3]))
  print("Contact Distance at "..fm(scT).."t is "..fm(dist))
  print(" Contact b: "..fm(Pbt[1])..","..fm(Pbt[2])..","..fm(Pbt[3]))
  print("(V.P*V.P-P.P*V.V+d*d*V.V) is "..fm(VP*VP -PP*VV + d*d*VV,6))
  
  print()

end

--[[

on collision discernment and resolution in multiple dimensions

situation rests on this formula:
  VP*VP -PP*VV + d*d*VV

PP*VV - d*d*VV - VP*VP

pos diff * mov diff
gap * 

VP is where velocity and position product squared

PP is position and position product squared

VV is velocity and velocity product squared

]]
