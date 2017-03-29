##Design and developement
The project has been developed as a private hobby, in a 'from the ground up' manner without researching the common art of physics simulation. 

The codes style and standard is currently chaotic, but as the project is released to open source view I will be trying to improve on this.

`bench/creation.js` is where the figments are being built. They mostly use a couple of 
unruly functions in figment/construct.js which set particles into basic orbits 
in a plane or randomised spherical area around an attractor.

`bench/instructor.js` is tying together the various bits of the system

`threeJS` library is used to handle all rendering


####Jote - a *data non grata*

In the project namespace all items with physical position are coined 'jotes' (like a jot; 'one iota') This fresh name is given to avoid thinking of each datum of figment data (each jote) as a point, or a particle or an atom. Every jote has position and movement values which *are* points in space, but can be any kind of thing or object, not automatically having the radius or mass of a particle. Jotes are just things located within the figments virtual space, and the most complex aspect of co-ordinating and optimising *fancy* seems to be the addressing and organisation of everything within that.

The basic properties of jotes are stored in simple arrays, ie. jote number 20's 
x-dimension value is addressed: jote.x[20], if it has mass that can be addressed jote.mass[20]. This scheme is known as 'Structure of Arrays' (SoA) layout and contrasts with the 'Array of Structure' (AoS) layout which seems more common in OO design.
AoS might have benefits for code design and extensibility, but SoA allows for more efficient accesss patterns as reading a selection of a jotes elements (such as only position) accesses only the position arrays memory.

####Gravity a basic interaction

Common newtonian Gravity amounts to one formullation of an attractive/repulsive function between things. It is a fairly simple formula where attraction is given by the inverse of the square of the distance between. More algorithm complexety can be involved in discerning the details of each separation between things than in calculating the resulting influence of the separations. 

#### Cross-quests and inter-quests
The task of optimising all possible interactions between all jotes, on each timestep, requires group-graphing them all in an addressable structure which helps distinguish between distant and close pairs. An implementation of this is fairly well begun and is tested in the solar system figment where groups of objects (ie each planetary system) can be so far separated from the others, that very little accuracy is lost by applying gravitation influence between the groups instead of accounting each individual member.

Here the graphs groups (aka nodes) are called 'spots' as they correspond to *measured spots in space* which all their child spots and jotes are guaranteed to fit within. 

The proceedure to search out collisions or significant forces between all jotes is called a 'quest'. Without a spotmap to optimise such quests there is essentially one spot containing all jotes. All relations between jotes are found by the 'triangular' relations/loop of n*(n+1)/2

With a spotmap of recursively nested spots, quest can be divided into two subproceedures: 'interquest' and 'crossquest'
Crossquests purpose is to investigate all pairings of members *between* 
two spots ie: members_of_A * members_of_b (rectangular)
Interquest purpose is to investigate all pairings *within* a single spot
(the triangular situation). Interquest can do this by (re)interquesting
and crossquesting all of its members and pairs...

To clarify, in figment/spotcollide.js this scheme takes the form: 

```
function questallspots() { interquestspot(rootspot) }

function interquestspot(parent){ 
  
  if(isLeaf(parent)) { concludeLeaf(parent); return }
  
  foreachKidOfParent(kid of parent) //(pseudosyntax here)
  { interquestspot(kid) }
  
  foreachPairsOfKidsInParent(kida,kidb of parent)
  { if(spotsHit(kida,kidb)) 
    { crossquestspots(kida,kidb) } 
  }
}
   
function crossquestspots(para,parb){ 
  
  if(isLeaf(para,parb)) { concludeLeaf(para,parb); return }
  
  foreachPairsOfKidsInParent(kidofa,kidofb of para,parb)
  { if(spotsHit(kidofa,kidofb)) 
    { crossquestspots(kidofa,kidofb) } 
  }
}

```

This basic scheme comprehensively covers all necessary spot-to-spot pairings 
in the spotmap from root spot to every leaf spot (spot containing only jotes). 
`spotsHit()` shows the process can test and conclude suitable spot pairings 
instead of recursing into their members (economising the quest). 
The real code labours more, involving testing and the conclusion of leaf spots, 
also crossquesting can involve calculation for whether to split just one or both of the up-spots.

##Contact formula

This interesting formula efficiently computes time of contact between two spheres.

`times = ( +/-Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感 ) / V慎`

Some notes on it are collected in `docs\timeofcontact.md`.


## Incomplete endfile etc

Spotmap - a fast loading tree graph indexed by a sorted delineation sequence
 Implemented
  Bulk loading, bound updating
 Todo
  Part loading, refining, debug visualisation

'Tempering' - adjusting velocity values to fit the model timestep similar
to the verlet scheme with refinement.

 
electrostatic, or other quasi-natural functions between
things such as a surface tension forming attraction-within-a-range, even a quasi-magnetic
approximating attraction-modified-by-movement. ....?/
