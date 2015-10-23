
document.ontouchmove = function(e){ e.preventDefault(); }

$(document).ready(function(){

  // index of current image
  var imgI = 0;

  var img  = $('#img'+imgI);
  var main = $('#main');

  var start = {active:false};
  var current = {
    xdeg:0, ydeg:0, zdeg:0,
    h:img.height(), w:img.width()
  };

  main.bind('touchstart',function(e){                   
    e.preventDefault();

    start.xdeg = current.xdeg;
    start.ydeg = current.ydeg;
    start.zdeg = current.zdeg;
    start.w    = img.height();
    start.h    = img.width();

    if( e.originalEvent.touches.length < 2 ) {
      start.x = e.originalEvent.touches[0].pageX;
      start.y = e.originalEvent.touches[0].pageY;
      start.when = new Date().getTime();
      start.active = true;
    }
  });

  main.bind('touchmove',function(e){                   
    e.preventDefault();                 
    current.x = e.originalEvent.touches[0].pageX;
    current.y = e.originalEvent.touches[0].pageY;

    if( start.active 
        && !isSwipe(e) 

        // single finger touch events only
        && e.originalEvent.touches.length < 2 ) 
    {
      var dr = 160;

      // distance finger has moved
      var dx = current.x - start.x;
      var dy = current.y - start.y;

      // damp the movement
      dx = Math.abs(1 + Math.sin((dx/dr)-(Math.PI/2))) * dx;
      dy = Math.abs(1 + Math.sin((dy/dr)-(Math.PI/2))) * dy;
      
      // map to degrees of rotation
      current.ydeg = start.ydeg + ( 180 * (dx / dr) );
      current.xdeg = start.xdeg + ( 180 * (dy / dr) );

      rotate();
    }
  });

  main.bind('touchend',function(e){                   
    e.preventDefault();                 
    start.active = false;

    if( isSwipe(e) ) {
      var xdist    = current.x - start.x;
      var lastimgI = imgI;
      imgI = 0 < xdist ? imgI-1 : imgI+1;
      imgI = imgI < 0 ? 0 : 2 < imgI ? 2 : imgI;

      if( imgI != lastimgI ) {
        img = $('#img'+imgI);

        var css = { 
          webkitTransform:'', 
          webkitTransition: '-webkit-transform 1s'
        };

        $('#img'+lastimgI)
          .css(css)
          .addClass( imgI < lastimgI ? 'rightout' : 'leftout' );

        img
          .css(css)
          .removeClass( imgI < lastimgI ? 'leftout' : 'rightout' );

        current.ydeg = 0;
        current.xdeg = 0;
        current.zdeg = 0;
        current.h    = img.height();
        current.w    = img.width();

        setTimeout(function(){
          img.css({webkitTransition:''});
        },1000);
      }
    }
  });

  main[0].ongesturechange = function(e) {
    var scale = e.scale;

    // damp zoom scale
    scale = 
      scale <= 1 
      ? Math.sin( scale * (Math.PI/2)) 
      : 1+( Math.pow(scale-1,2) );

    img.width(  start.w * scale );
    img.height( start.h * scale );

    if( 2 < Math.abs(e.rotation) ) {
      current.zdeg = (start.zdeg + e.rotation) % 360;
      rotate();
    }
  };

  function isSwipe(e) {
    var duration = new Date().getTime()-start.when;
    var xdist    = current.x - start.x;
    return duration < 500 && 160 < Math.abs( xdist );
  }

  function rotate() {
    img.css(
      "-webkit-transform",
      'rotateX('+current.xdeg+'deg) rotateY('+current.ydeg+'deg) rotateZ('+current.zdeg+'deg)'
    );
  }
});
