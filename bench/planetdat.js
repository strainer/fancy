// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 

/// solar system data from NASA JPL

planetdatas = {
  "SUN":{
    radius:696300
   ,massval:1.988544
   ,masskge:30
   ,x:0,y:0,z:0 ,vx:0,vy:0,vz:0 ,r:1,g:1,b:0.7
   }
  ,"mercury":{
    radius:2440
    ,massval:3.302
    ,masskge:23
    ,x:-2.144813780875203e+07
    ,y:4.244231787830339e+07
    ,z:5.435744265998827e+06
    ,vx:-5.327430963933052e+01
    ,vy:-2.012564679152630e+01
    ,vz:3.242968136038893e+00
    ,r:0.8,g:0.8,b:0.9
  }
  //~ ,"101 helena":{
    //~ x:-1.032063540699363e+00
    //~ ,y:2.239635670191403e+00
    //~ ,z:1.404764312824129e+00
    //~ ,vx:-9.328864549257562e-03
    //~ ,vy:-1.909750104607422e-03
    //~ ,vz:-1.813449339163258e-03
    //~ ,radius:32.92
    //~ ,G:.350
  //~ }
  ,"venus":{
    radius:6051.8
    ,massval:48.685
    ,masskge:23
    ,x:6.991073513483752e+07
    ,y:8.240196718660071e+07
    ,z:-2.904393749885380e+06
    ,vx:-2.681207244298414e+01
    ,vy:2.250638674290204e+01
    ,vz:1.855831643492386e+00
    ,r:0.4,g:1.0,b:1.5
  }
  //~ ,"201 penelope":{
    //~ x:2.000000161878070e+00
    //~ ,y:-8.253457583916176e-01
    //~ ,z:-3.521726451102251e-01
    //~ ,vx:5.090390311188411e-03
    //~ ,vy:1.104401954638700e-02
    //~ ,vz:3.406428467195318e-03
    //~ ,radius:42.9385
    //~ ,G:.240
  //~ }
  //~ ,"202 chryseis":{
    //~ x:-2.825461970343489e+00
    //~ ,y:-5.055639042295712e-02
    //~ ,z:2.950433109123382e-01
    //~ ,vx:-7.577408711656906e-04
    //~ ,vy:-1.012211975514202e-02
    //~ ,vz:-3.000945014449398e-03
    //~ ,radius:43.075
    //~ ,G:.150
  //~ }
  ,"earth":{
    radius:6371.01
    ,massval:5.97219
    ,masskge:24
    ,x:-2.686981987561484e+07 
    ,y:1.446304615108057e+08
    ,z:-5.488342537105083e+03
    ,vx:-2.978172178935505e+01
    ,vy:-5.560030327342782e+00
    ,vz:1.372659284534006e-03
    ,r:0.2,g:0.5,b:2.5
  }
  ,"moon(earth)":{
    radius:1737.4
    ,massval:734.9
    ,masskge:20
    ,x:-2.661019038176148e+07
    ,y:1.443380125048558e+08
    ,z:8.009907907694578e+03
    ,vx:-2.905520265120326e+01
    ,vy:-4.867011427095468e+00
    ,vz:-8.258682995469990e-02
    ,r:0.7,g:0.7,b:0.7
  }
  ,"mars":{
    radius:3389.9
    ,massval:6.4185
    ,masskge:23
    ,x:2.026606647967910e+08
    ,y:5.787566171988636e+07
    ,z:-3.760905019654889e+06
    ,vx:-5.725979134658776e+00
    ,vy:2.537138540297251e+01
    ,vz:6.722010395376810e-01
    ,r:1.2,g:0.7,b:0.1
  }
  ,"phobos(mars)":{
    radius:13.1
    ,massval:1.08
    ,masskge:20
    ,x:2.026589607163199e+08
    ,y:5.786658603917168e+07
    ,z:-3.760778827305075e+06
    ,vx:-3.834136488957758e+00
    ,vy:2.499697578536809e+01
    ,vz:-3.226292688974333e-01
  }
  ,"deimos(mars)":{
    radius:7.8
    ,massval:1.80
    ,masskge:20
    ,x:2.026396139443671e+08
    ,y:5.787797841887365e+07
    ,z:-3.750807086313620e+06
    ,vx:-5.895912849582495e+00
    ,vy:2.403190546841809e+01
    ,vz:6.257568953694683e-01
  }
  ,"jupiter":{
    massval:1898.13
    ,masskge:24
    ,radius:69911
    ,x:-8.018047377705213e+08
    ,y:-1.514934328321026e+08
    ,z:1.857047412697010e+07
    ,vx:2.271156931334361e+00
    ,vy:-1.223322415760412e+01
    ,vz:-2.812169411114951e-06
    ,r:2.0,g:0.4,b:0.0
  }
  ,"io  / (jupiter)":{
    radius:1821.3
    ,massval:893.3
    ,masskge:20
    ,x:-8.014006929623615e+08
    ,y:-1.516196141131013e+08
    ,z:1.857180910941429e+07
    ,vx:7.384155249811582e+00
    ,vy:4.253875592707614e+00
    ,vz:6.576720080854224e-01
  }
  ,"europa / (jupiter)":{
    radius:1565
    ,massval:479.7
    ,masskge:20
    ,x:-8.014706646112132e+08
    ,y:-1.509106238283202e+08
    ,z:1.860168161961560e+07
    ,vx:-9.562662510708016e+00
    ,vy:-5.304463321179665e+00
    ,vz:9.944750832125915e-02
  }
  ,"ganymede / (jupiter)":{
    radius:2634
    ,massval:1482
    ,masskge:20
    ,x:-8.028679485317385e+08
    ,y:-1.516252602346037e+08
    ,z:1.855146700510868e+07
    ,vx:3.624189412089718e+00
    ,vy:-2.300949434337871e+01
    ,vz:-3.895587997088317e-01
  }
  ,"callisto / (jupiter)":{
    radius:2403
    ,massval:1076
    ,masskge:20
    ,x:-8.023119364726412e+08
    ,y:-1.496782946771325e+08
    ,z:1.862131530223258e+07
    ,vx:-5.634341520347626e+00
    ,vy:-1.437639957896428e+01
    ,vz:-1.736852740195598e-01
  }
  ,"amalthea / (jupiter)":{
    radius:131
    ,massval:0.06
    ,masskge:20
    ,x:-8.019807299432520e+08
    ,y:-1.515348683919042e+08
    ,z:1.856608606394865e+07
    ,vx:8.420528499268862e+00
    ,vy:-3.805184686373426e+01
    ,vz:-6.663987230304276e-01
  }
  ,"himalia  / (jupiter)":{
    radius:85
    ,massval:0.03
    ,masskge:20
    ,x:-7.924949365707713e+08
    ,y:-1.481952512611022e+08
    ,z:1.609082459143259e+07
    ,vx:1.273293090480343e+00
    ,vy:-9.068404481612784e+00
    ,vz:1.682622447207338e+00
  }
  ,"elara (507":{
    x:-8.121674996543375e+08
    ,y:-1.515224846855784e+08
    ,z:2.437708835385501e+07
    ,vx:2.786659481085358e+00
    ,vy:-1.543570952292999e+01
    ,vz:-1.844975981223902e-01
  }
  ,"pasiphae / (jupiter)":{
    radius:18
    ,masskge:20
    ,x:-7.918741047189821e+08
    ,y:-1.395456420387951e+08
    ,z:1.454537708806795e+07
    ,vx:5.323795266363478e+00
    ,vy:-1.287310437428524e+01
    ,vz:8.054915829474405e-01
  }
  ,"sinope / (jupiter)":{
    radius:14
    ,masskge:20
    ,x:-8.083519966161939e+08
    ,y:-1.238033056099779e+08
    ,z:7.911060759365670e+06
    ,vx:3.931708994328747e+00
    ,vy:-1.210262257246637e+01
    ,vz:3.103432339451029e-02
  }
  ,"lysithea / (jupiter)":{
    radius:12
    ,masskge:20
    ,x:-7.906443049032259e+08
    ,y:-1.523262342248654e+08
    ,z:1.942351787645375e+07
    ,vx:1.983049676114238e+00
    ,vy:-9.160911999422636e+00
    ,vz:1.506230734502942e+00
  }
  ,"carme  / (jupiter)":{
    radius:15
    ,masskge:20
    ,x:-7.840411229428982e+08
    ,y:-1.452423350965695e+08
    ,z:1.908064022014600e+07
    ,vx:3.817919368430443e+00
    ,vy:-1.453432222185940e+01
    ,vz:-6.322455861848750e-01
  }
  ,"ananke / (jupiter)":{
    radius:10
    ,masskge:20
    ,x:-8.031441992951825e+08
    ,y:-1.265838932886611e+08
    ,z:1.509496313292467e+07
    ,vx:3.922446832454327e+00
    ,vy:-1.234362703661476e+01
    ,vz:1.085364797903904e+00
  }
  ,"saturn":{
    massval:5.68319
    ,masskge:26
    ,radius:58232
    ,x:-2.795230050067841e+08
    ,y:-1.476486784761045e+09
    ,z:3.678963184199864e+07
    ,vx:8.964987072497195e+00
    ,vy:-1.836831238589299e+00
    ,vz:-3.247253093171359e-01
    ,r:2.0,g:2.0,b:0.4
  }
  ,"mimas / (saturn)":{
    radius:198.8
    ,massval:3.75
    ,masskge:22
    ,x:-2.796810161233714e+08
    ,y:-1.476571632546523e+09
    ,z:3.684891152257061e+07
    ,vx:1.669613815103063e+01
    ,vy:-1.236504120539470e+01
    ,vz:4.878712672712957e+00
  }
  ,"enceladus / (saturn)":{
    radius:252.3
    ,massval:10.805
    ,masskge:22
    ,x:-2.796853621476473e+08
    ,y:-1.476632673707948e+09
    ,z:3.688179582170004e+07
    ,vx:1.815416894889164e+01
    ,vy:-9.926390979117796e+00
    ,vz:3.022640476747731e+00
  }
  ,"tethys  / (saturn)":{
    radius:536.3
    ,massval:61.76
    ,masskge:22
    ,x:-2.793734982883965e+08
    ,y:-1.476267947258312e+09
    ,z:3.666078628543657e+07
    ,vx:-7.854394309839480e-01
    ,vy:3.568698989724249e+00
    ,vz:-2.457277821261145e+00
  }
  ,"dione  / (saturn)":{
    radius:562.5
    ,massval:109.572
    ,masskge:22
    ,x:-2.797435973977974e+08
    ,y:-1.476748717786571e+09
    ,z:3.694811242972475e+07
    ,vx:1.704597672868571e+01
    ,vy:-7.384374043373539e+00
    ,vz:1.802820397909195e+00
  }
  ,"rhea  / (saturn)":{
    radius:764.5
    ,massval:230.9
    ,masskge:22
    ,x:-2.790245630292989e+08
    ,y:-1.476358554221900e+09
    ,z:3.667738910149163e+07
    ,vx:6.310103976833058e+00
    ,vy:5.418971370161930e+00
    ,vz:-3.842197433442538e+00
  }
  ,"titan / (saturn)":{
    radius:2575.5
    ,massval:13455.3
    ,masskge:22
    ,x:-2.791663067995350e+08
    ,y:-1.477520833416463e+09
    ,z:3.728723681613404e+07
    ,vx:1.431116384608048e+01
    ,vy:-4.402300242143939e-01
    ,vz:-1.574896818360035e+00
  }
  ,"hyperion / (saturn)":{
    radius:133
    ,massval:1.08
    ,masskge:22
    ,x:-2.781856459327838e+08
    ,y:-1.476633618959415e+09
    ,z:3.673360672141278e+07
    ,vx:9.026217531911016e+00
    ,vy:3.113206052125803e+00
    ,vz:-2.807130874599398e+00
  }
  ,"iapetus / (saturn)":{
    radius:734.5
    ,massval:180.59
    ,masskge:22
    ,x:-2.771196001197029e+08
    ,y:-1.479036606999167e+09
    ,z:3.689484917399764e+07
    ,vx:1.123979415225208e+01
    ,vy:3.729131005472898e-01
    ,vz:-1.295474949948895e+00
  }
  ,"phoebe / (saturn)":{
    radius:106.6
    ,massval:0.8289
    ,masskge:22
    ,x:-2.824801098425139e+08
    ,y:-1.462113321182670e+09
    ,z:3.719744767460597e+07
    ,vx:1.040088764001025e+01
    ,vy:-1.442112035721935e+00
    ,vz:-4.968405272295517e-01
  }
  ,"janus  / (saturn)":{
    radius:97
    ,massval:0.0198
    ,masskge:20
    ,x:-2.793732603182598e+08
    ,y:-1.476477106191759e+09
    ,z:3.677003434696048e+07
    ,vx:7.009579315018375e+00
    ,vy:1.216822445029681e+01
    ,vz:-7.525382561341684e+00
  }
  ,"epimetheus / (saturn)":{
    radius:69
    ,massval:0.0055
    ,masskge:20
    ,x:-2.795550110644425e+08
    ,y:-1.476354552161323e+09
    ,z:3.672253321529514e+07
    ,vx:-6.425354700455416e+00
    ,vy:-4.340667820498979e+00
    ,vz:2.422917633108891e+00
  }
  ,"helene  / (saturn)":{
    radius:16
    ,massval:0.002547
    ,masskge:22
    ,x:-2.794451682976141e+08
    ,y:-1.476818535169966e+09
    ,z:3.695662911951894e+07
    ,vx:1.869818632947646e+01
    ,vy:-4.668009149179712e-01
    ,vz:-2.022151908207430e+00
  }
  ,"uranus":{
    massval:86.8103
    ,masskge:24
    ,radius:25362
    ,x:2.743510980845031e+09
    ,y:1.170785218608810e+09
    ,z:-3.117542296091282e+07
    ,vx:-2.719167004520275e+00
    ,vy:5.934139669852269e+00
    ,vz:5.703136132881292e-02
    ,r:0.5,g:2.0,b:1.4
  }
  ,"ariel  / (uranus)":{
    radius:581.1
    ,massval:13.53
    ,masskge:20
    ,x:2.743535324378109e+09
    ,y:1.170805953956007e+09
    ,z:-3.098728947011310e+07
    ,vx:2.620637048938398e+00
    ,vy:4.687020184174417e+00
    ,vz:-5.000924999075038e-01
  }
  ,"umbriel / (uranus)":{
    radius:584.7
    ,massval:11.72
    ,masskge:20
    ,x:2.743267896887315e+09
    ,y:1.170849767260912e+09
    ,z:-3.109240684741801e+07
    ,vx:-1.140542695455900e+00
    ,vy:6.199037650902332e+00
    ,vz:4.462726751452502e+00
  }
  ,"titania / (uranus)":{
    radius:788.9
    ,massval:35.27
    ,masskge:20
    ,x:2.743090473945600e+09
    ,y:1.170886339627688e+09
    ,z:-3.111229948242420e+07
    ,vx:-2.102788068408896e+00
    ,vy:6.298157919393112e+00
    ,vz:3.623581174904538e+00
  }
  ,"oberon  / (uranus)":{
    radius:761.4
    ,massval:30.14
    ,masskge:20
    ,x:2.743296780670317e+09
    ,y:1.170907006244137e+09
    ,z:-3.064651020104378e+07
    ,vx:1.369736544595218e-01
    ,vy:5.491532224826056e+00
    ,vz:1.313807159134603e+00
  }
  ,"miranda / (uranus)":{
    radius:240
    ,massval:0.659
    ,masskge:20
    ,x:2.743385095080678e+09
    ,y:1.170800372200866e+09
    ,z:-3.120369203154469e+07
    ,vx:-4.073751281066527e+00
    ,vy:6.828727386274970e+00
    ,vz:6.534178608672678e+00
  }
  ,"cordelia / (uranus)":{
    radius:13
    ,massval:0.07
    ,masskge:20
    ,x:2.743549773785465e+09
    ,y:1.170772460312904e+09
    ,z:-3.120534271509057e+07
    ,vx:-9.142248880757029e+00
    ,vy:6.125921662469263e+00
    ,vz:-8.625006958556940e+00
  }
  ,"ophelia  / (uranus)":{
    radius:16
    ,massval:0.07
    ,masskge:20
    ,x:2.743529164669939e+09
    ,y:1.170774182838202e+09
    ,z:-3.122607454792970e+07
    ,vx:-1.221994538099614e+01
    ,vy:7.481927579309067e+00
    ,vz:-3.837624398167592e+00
  }
  ,"bianca  / (uranus)":{
    radius:22
    ,massval:0.07
    ,masskge:20
    ,x:2.743489518923785e+09
    ,y:1.170797021238728e+09
    ,z:-3.112282915109551e+07
    ,vx:6.245905761366057e+00
    ,vy:4.495425340624509e+00
    ,vz:4.007705527489026e+00
  }
  ,"cressida / (uranus)":{
    radius:33
    ,massval:0.07
    ,masskge:20
    ,x:2.743490774360062e+09
    ,y:1.170781354741464e+09
    ,z:-3.123471748786181e+07
    ,vx:-1.163091187621095e+01
    ,vy:8.299606848558623e+00
    ,vz:3.035378397258687e+00
  }
  ,"neptune":{
    massval:102.41
    ,masskge:24
    ,radius:24624
    ,x:4.239017555140744e+09
    ,y:-1.450114775337559e+09
    ,z:-6.783048741487205e+07
    ,vx:1.727579590698030e+00
    ,vy:5.163992633060530e+00
    ,vz:-1.466592796005441e-01
    ,radius:605
    ,r:0.0,g:0.5,b:3.4
  }
  ,"triton / (neptune)":{
    radius:1352.6
    ,massval:214.7
    ,masskge:20
    ,x:4.239034324185537e+09
    ,y:-1.450367900995966e+09
    ,z:-6.807848210311949e+07
    ,vx:-2.070412102664828e+00
    ,vy:3.500132112426739e+00
    ,vz:1.294821604307415e+00
  }
  ,"nereid / (neptune)":{
    radius:170
    ,massval:0.2
    ,masskge:20
    ,x:4.236644417393757e+09
    ,y:-1.444472883241793e+09
    ,z:-6.758767086565644e+07
    ,vx:1.397801430179437e+00
    ,vy:4.226948738657213e+00
    ,vz:-2.282398469091473e-01
  }
  ,"naiad / (neptune)":{
    radius:29
    ,massval:0.06
    ,masskge:20
    ,x:4.238983144059733e+09
    ,y:-1.450148506691070e+09
    ,z:-6.782875849456179e+07
    ,vx:9.236067192914867e+00
    ,vy:-2.746336736591254e+00
    ,vz:-4.945537266692685e+00
  }
  ,"thalassa / (neptune)":{
    radius:40
    ,massval:0.06
    ,masskge:20
    ,x:4.239063325083187e+09
    ,y:-1.450099536403082e+09
    ,z:-6.784389275303197e+07
    ,vx:-4.276200123708823e-01
    ,vy:1.569011895505660e+01
    ,vz:4.464876389511708e+00
  }
  ,"despina / (neptune)":{
    radius:74
    ,massval:0.06
    ,masskge:20
    ,x:4.239002525371741e+09
    ,y:-1.450069635338871e+09
    ,z:-6.780820497417599e+07
    ,vx:-8.397606759024619e+00
    ,vy:5.451069871623013e-01
    ,vz:2.379330733605414e+00
  }
  ,"pluto (999":{
    x:1.445128055592441e+09
    ,y:-4.757599207635206e+09
    ,z:9.088943588821673e+07
    ,vx:5.317781371275380e+00
    ,vy:4.271598819806695e-01
    ,vz:-1.605887333567373e+00
    ,radius:32.92
    ,G:.350
    ,massval:1.307
    ,masskge:22
  }
  ,"charon":{
    x:1.445113655384660e+09
    ,y:-4.757610219021723e+09
    ,z:9.089688772976637e+07
    ,vx:5.321911380486121e+00
    ,vy:5.484524295836731e-01
    ,vz:-1.418698089412360e+00
  }
  ,"nix":{
    x:1.445094180074576e+09
    ,y:-4.757614376425429e+09
    ,z:9.092415570257807e+07
    ,vx:5.362676272475914e+00
    ,vy:5.428292497798428e-01
    ,vz:-1.498709407212933e+00
  }
  ,"hydra(pluto)":{
    x:1.445105184899789e+09
    ,y:-4.757586215687016e+09
    ,z:9.094971197608852e+07
    ,vx:5.398670859738495e+00
    ,vy:5.335017781316611e-01
    ,vz:-1.577837245864487e+00
  }
  ,"kerberos / (pluto)":{
    x:1.445123874266209e+09
    ,y:-4.757633465080873e+09
    ,z:9.084289616516447e+07
    ,vx:5.222301375712231e+00
    ,vy:3.704392722153053e-01
    ,vz:-1.530829388084083e+00

  }

}