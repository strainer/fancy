Fancy - Physics
===============

Fancy is a physics computing project developed with fanciful ideas of creating a programmatic sense of *fantasy* for the virtual minds of the coming AI revolution...

To this end a general purpose physics engine is under developement and is tested on some basic examples in a [Web Demo](http://strainer.github.io/fancy/). 

The physics engine currently involves:
* Up to 64 thousand objects
* Interactions include: 
* * Point & cloud gravitational and quasi-electrostatic accelerations
* * Drag & pressure effects between close neighbour objects (involving precise collision
detection).
* Model accuracy and stability is maximised with a refined adjustment of velocity data to fit integration timestamp related to the basic 'verlet integration' velocity adjusment.
* An efficient R-tree class spatial index is created and maintained for optimising most object interactions.

The workbench involves:
* Basic UI with readings and controls
* Model entities rendered as rescaled particle cloud, or simple shaded spheres.
* Wireframe view of the spatial index.
* raytrace selection of objects by mouseclick
* Adjustable rendering frame interlace rate
  
The **[Fancy Wiki](https://github.com/strainer/fancy/wiki)** has some design docs.

### Web Demo
The [demo](http://strainer.github.io/fancy/) selects and initialises virtual worlds called 'figments' and renders them for display and testing. Everything is currently orbital in kind, as this is a most straightforward model to begin with. The demo has keyboard controls for zooming and time controls and some readings about the focused object. Objects can be mouseclicked accurately to zoom on them.

## Test worlds (figments)

#### Solar System

Engine performance is exercised with precise information which NASA provides for all solar system bodies via. its 'JPL email service'. A quick test which compared the simulated position of the Earth after a year of 'fancy' time, with Nasa JPL's year-on information, found the two positions to be within about 70,000 km of each other - this is quite close considering the circumference of Earths orbit is about 15000 times as long: 1,000,000,000 km. By reducing the constant G by 0.0035 % from 6.67408e-8 to 6.67384789e-8, the difference between the discrepancy can be reduced to as low as 10 km. 

This solar system test is less than perfect yet: Saturns moons go awry after a few months for some reason, their data may be corrupted or there may be an engine bug triggered by them. Also the planet rendering can be confusing as it can boost object size wrongly. And object clicking doesnt work well.

It is possible javascripts 64bit float numbers can hinder the accuracy of astrological scale models. NASAs figures for position and velocity are given as 80bit floats, most of the solar system has potentially millimeter accuracy at 64bit float but special care and formula arrangements could be required to realise that potential. Full accuracy solar system simulation is beyond Fancy's immediate goals.

#### Near Earth Objects
This figment is proceeduraly generated to have an appearance like the visualisations of near earth asteroids and objects which have been publicised. Quite precise data for thousands of NEOs is available, but its needs converted to position and movement vectors to use in this simulation.

#### Trappist-1 System
This system is plotted according to the planets publicised mass and orbits. The closeness of the orbits in this system seems very exceptional.

#### MassRing & 4MassRing
These figments currently test the '[Spotmap](https://github.com/strainer/fancy/wiki/spotmap)' - which is a spacemapping data structure used to recursively associate objects in relation to separation distance. A view of the spotmap is toggled with the 's'. The spotmap is used in these examples to accelerate gravitation calculations between 250 massive bodies in 'MassRing' and 1300 in '4MassRing'. It will be *more* useful to optimise collision detection/scheduling and to apply close proximity effects such as liquid bonding, between objects.

#### Blue disk
The 'spotmap' is used in this figment to apply a basic pressure and drag function between close neighbouring objects. The functions are calibrated along with gravity, producing some curious looking quasi-astronomical phenomena.

To continue...

* Possibly improve leaf clustering in spotmap
* Introduce a scheme to enable multi-body objects / bonds / 'rigid body', surfaces..
* Different kinds of close object interactions - 'nearest neighbour only' forces,  
* A better workbench 