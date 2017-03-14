Fancy
=====

A JS physics simulation project with a long term goal of achieving a programmatic sense of *fantasy* for autonomous robotry. To this end a physics engine is under developement and is tested with basic examples in a web workbench. 

## Web workbench
A [basic workbench](http://strainer.github.io/fancy/) selects and initialises virtual worlds called 'figments' and renders them for display and testing. The demo currently selects between 'figments', displays a few measurements ie. number of particles, model time step and rendering interlace rate, and arranges keyboard controls for view movements and speed changing. 

## Solar System test
A Solar system figment checks engine performance with accurate data provided by Nasa JPLs email service and involving the real physical constant of G. A quick test which compared figment's projected position of the Earth after a year of virtual time with Nasa JPL's year on position, found the two to be within about 200,000 km of each other - this is very close considering the circumference of Earths orbit is about 1,000,000,000 km. It is possible the discrepancy is due to the limitation of javascripts 64bit FP numbers rather than subtle algorithmic or relativistic error. 

## Near Earth Objects
This figment is just randomly generated to appear like the renderings of near earth asteroids and objects which have been publicised. Quite precise data for thousands of NEOs is available, but its needs converted to position and movement vectors to use in this simulation.

## Trappist-1 System
This system is plotted according to the planets publicised mass and orbits. The closeness of the orbits in this system seems very exceptional.

