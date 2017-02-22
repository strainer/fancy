// ~ -:- Fancy - foresight physics engine for futuroids -:- ~ + 
/*        Copyright 2017 by Andrew Strain. No warranty        * 
 *  This program can be redistributed and modified under the  * 
 *  terms of the FSF GNU AGPLv3 - see License.md for details  * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** */ 

/// miscellaneous helper functions

// Multiline Function String - Nate Ferrero - P.D.
function heredoc (f,br) { 
  return (f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]).replace(/(?:\r\n|\r|\n)/g, br||'<br />')
};

// performance.now() polyfill from https://gist.github.com/paulirish/5438650
(function(){
  if (typeof window.performance === 'undefined') 
  {  window.performance = {} }
  
  if (!window.performance.now){
    var nowOffset = Date.now()
    if (performance.timing && performance.timing.navigationStart)
    { nowOffset = performance.timing.navigationStart }
    
    window.performance.now = function now(){
      return Date.now() - nowOffset
    } 
}})()

function perfnow(){ return window.performance.now() }

function emptyElement(elem) {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
}
