##Concise equation for time of contact between two moving spheres

`times = ( +/-Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感 ) / V慎`

Thanks go to a Mr Joshua de Bellis who once worked this equation out for a stranger in a library (me) on being presented with some tricky notes. He showed me the trick is to think about vectors. The equation is closely related to 'the raycasting formula' that is commonly used in raycasting and collision detection programming, only more concise than commonly found.

Im still very far from fluency in the magic realm of vectors but here are some thoughts on the formula. 
 
Expression: `( +/-Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感 ) / V慎`

d , sum of two particles contact-radii
P , delta of two particles position vectors at t=0
V , delta of velocity vectors 

summed-squares or dot-products:
(d*d-P感) , contact-radii minus difference of position at t=0  
*V慎      , sum of squares of dimensions of the delta velocity vector 
            (position change per t) (squared)

V感  : a (curious) scalar produced by summing the product of each dimensions
       position and velocity delta. This forms a scalar which is subtracted 
       from the preceeding expression, ~~when it is large any contact happens
       earlier and small later...~~ It seems to be delta-space-length *of* 
       contact...  

V慎  : this is basically speed of approach squared (scalar and positive) 
       meaning the preceeding expression produces a squared distance.
       
This is the squared distance between the objects at t=0 and their earliest
contact:
 0 - Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感
Same at their lastest contact:
 0 + Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感
 
This must be length (through *delta* space not time) of their contact:
 Sqrt( (d*d-P感)*V慎 + V感*V感 )  //an absolute value

This mayish be length through *delta* space from t=0 until their maximum eclipse
 V感  //this can be negative
 
corrections:
V感 is the length-squared-signed travelled till minimum separation between two points
- the sign will tell if closing or parting
  
V感 / V慎  will be the time taken to make that journey to the minima
 
the distance between spheres centers at the minima
 sqrt( {P- V*(V感 / V慎)}暍P- V*(V感 / V慎)} ) 
 
distance of proximas from the minima?
 Sqrt( (d*d-P感)*V慎 + V感*V感 )
 
 
 

  times = ( +/-Sqrt( (d*d-P感)*V慎 + V感*V感 ) -V感 ) / V慎
  
d: sum of spheres radii
V: vector of difference in sphere velocities
P: vector of difference in sphere positions at t=0

I notice that V慎 (dot product) is the scalar velocity squared,
then the preceeding expression must be a distance squared since
dist/vel = time.

So, this is a distance squared:
 Sqrt( (d*d-P感)*V慎 + V感*V感 )
And this too:
 -V感
 
V感 is very intresting, it seems that it gives the distance
to the spheres minima of separation, squared, yet signed (neat).
This distance might exist in the spheres 'delta-space'
between the origin ([0,0,0] : where Pa resides) and where
Pb resides at the minima - the point of its travel which is
closest to Pa. Because it is in 'delta-space' Pa does not travel,
but this hypoteneus between the origin and Pbs position in delta-space
is the same as the separation between them in real-space.
Why does multiplying the delta-pos of Pb by its delta-vel
give its minima from the origin 'sign-squared' ?
Seems to do with its travel being at right angles to the origin
at the minima.
I must keep recalling that the VP is not at Pbs minima point
VPs length, is signed-square of distance Pb must travel to get
to its minima point.

V感 is the length
from clear on it, and why simply multiplying and suming the position 
and velocity delta-space dimensions pinpoints the minima.
The delta position, doesnt usually pass through the spaces origin,
but when this distance is divided by the delta-velocity squared,
it gives the time at which delta-pos will be smallest.

Also, observing this is added and subtracted with V感 :
 +/-Sqrt( (d*d-P感)*V慎 + V感*V感 )

It seems this expression gives an absolute distance squared
of the delta travel through the duration of eclipse.

In computing it gets called 'the determinant' as when it is 
negative, there is no contact between the spheres and
no way to proceed with slow square root operation.

(d*d-P感)*V慎 + V感*V感

In other physics engines i have found this wrapped up
with unneccessary workings of x=-b+-sqrt(4ac) 

I cant be certain, that there is not a yet more concise
way of determining collision, perhaps even without a
square-root.