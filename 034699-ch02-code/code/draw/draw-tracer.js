
window.onload = function() {

  var canvas  = document.getElementById('main');
  var context = canvas.getContext("2d");

  context.beginPath();
  context.lineWidth = 5;
  context.moveTo(50, 50);
  context.lineTo(250, 250);
  context.stroke();
  context.closePath();
}