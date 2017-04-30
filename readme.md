Fancy - Physics
===============

Fancy is a physics computation project developed with fanciful ideas of creating a *programmatic sense of fantasy* for the virtual minds of the coming AI revolution...

To this end a general physics simulator is under developement and is tested on some basic examples in a [web demo](http://strainer.github.io/fancy/). 

[Fancy wiki](https://github.com/strainer/fancy/wiki) has some design docs.

### Web Demo
The [demo](http://strainer.github.io/fancy/) selects and initialises virtual worlds called 'figments' and renders them for display and testing. Everything is currently orbital in kind, as this is most straightforward to begin with. The demo has keyboard controls for zooming and time controls and some readings about the focused object.

## Test worlds (figments)

#### Solar System

Engine performance is checked with accurate information which NASA provides for all solar system bodies via. Nasa JPLs email service. A quick test which compared the simulated position of the Earth after a year of 'fancy' time, with Nasa JPL's year-on information, found the two positions to be within about 70,000 km of each other - this is quite close considering the circumference of Earths orbit is about 15000 times as long: 1,000,000,000 km. It is possible the discrepancy is due to the limitation of javascripts 64bit FP numbers rather than subtle algorithmic or physics error. NASAs figures are given as 80bit floats, and the scale differences in the solar system are such that the positions of the Gas Giants moons are compromised when clipped to 64bits. Full accuracy solar system simulation is beyond Fancys requirement but this test works well.

#### Near Earth Objects
This figment is proceeduraly generated to appear like the graphs of near earth asteroids and objects which have been publicised. Quite precise data for thousands of NEOs is available, but its needs converted to position and movement vectors to use in this simulation.

#### Trappist-1 System
This system is plotted according to the planets publicised mass and orbits. The closeness of the orbits in this system seems very exceptional.

#### MassRing & 4MassRing
These figments currently test the '[Spotmap](https://github.com/strainer/fancy/wiki/spotmap)' - which is a spacemapping data structure used to recursively associate objects in relation to separation distance. A view of the spotmap is toggled with the 's'. The spotmap is used in these examples to accelerate gravitation calculations between 250 massive bodies in 'MassRing' and more in '4MassRing'. It will be *more* useful to optimise collision detection/scheduling and to apply close proximity effects such as liquid bonding, between objects.

to be con...