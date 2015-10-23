
window.onload = function() {

  document.ontouchmove = function(e){ e.preventDefault(); }

  var draw = {
    fill: "#000000",
    stroke: "#000000",
    clear: "#ffffff",
    size: 5,
    cap: 'round',
    join: 'round',
    width: 300,
    height: 300
  }

  var canvas  = document.getElementById('main');
  var canvastop = canvas.offsetTop

  var context = canvas.getContext("2d");

  var lastx;
  var lasty;

  function clear() {
    context.fillStyle = draw.clear;
    context.rect(0, 0, draw.width, draw.height);
    context.fill();
  }

  
  function path( moves ) {
    context.beginPath();
    context.strokeStyle = draw.stroke;
    context.fillStyle = draw.fill;
    context.lineCap = draw.cap;
    context.lineJoin = draw.join;
    context.lineWidth = draw.size;

    moves()

    context.fill();
    context.stroke();
    context.closePath();
  }

  function dot(x,y) {
    path(function(){
      context.arc(x,y,1,0,Math.PI*2,true);
    });
  }

  function line(fromx,fromy, tox,toy) {
    path(function(){
      context.moveTo(fromx, fromy);
      context.lineTo(tox, toy);
    });
  }


  function position(event,action) {
    event.preventDefault();                 

    var newx = event.touches[0].clientX;
    var newy = event.touches[0].clientY - canvastop;
    
    action(lastx,lasty, newx,newy)

    lastx = newx;
    lasty = newy;
  }

  canvas.ontouchstart = function(event){                   
    position(event,function(lastx,lasty, newx,newy){
      dot(newx,newy);
    })
  }

  canvas.ontouchmove = function(event){                   
    position(event,function(lastx,lasty, newx,newy){
      line(lastx,lasty, newx,newy);
    })
  }


  var clearButton = document.getElementById('clear');
  clearButton.onclick = clear;

  clear();
}