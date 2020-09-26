window.onload = Construct();
var c;
var ctx;
var mouse = {
  x: 0,
  y: 0
};
var lastStep = 0;
var particles = [{
  x: 0,
  y: 0
}];

function Construct() {
  setTimeout(function() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    c.addEventListener('mousemove', function(e) {
      var m = getMousePos(c, e);
      mouse.x = m.x;
      mouse.y = m.y;
    }, false);
    
    window.requestAnimationFrame(animationFrame);
  }, 1);  
}

function animationFrame(milliseconds) {
  var elapsed = milliseconds - lastStep;
  lastStep = milliseconds;

  render(elapsed);
  
  window.requestAnimationFrame(animationFrame);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = evt.clientX - rect.top;
  var mouseY = evt.clientY - rect.left;
  return {
    x: mouseX,
    y: mouseY
  };
}

function render(elapsed) {
  setCanvasSize();
  clearCanvas();
  moveParticles(elapsed);
  renderParticles();
  target();
}

function setCanvasSize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function clearCanvas() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveParticles(milliseconds) {
  particles.forEach(function(p) {
    var data = distanceAndAngleBetweenTwoPoints(p.x, p.y, mouse.x, mouse.y);
    var velocity = data.distance / 0.5;
    var toMouseVector = new Vector(velocity, data.angle);
    var elapsedSeconds = milliseconds / 1000;

    p.x += (toMouseVector.magnitudeX * elapsedSeconds);
    p.y += (toMouseVector.magnitudeY * elapsedSeconds);
  });
}

function renderParticles() {
  particles.forEach(function(p) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(p.x, p.y);
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function target() {
    console.log('targeted');
    ctx.beginPath();
    ctx.arc(199, 100, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

function distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
  var x = x2 - x1,
    y = y2 - y1;

  return {
    // x^2 + y^2 = r^2
    distance: Math.sqrt(x * x + y * y),

    // convert from radians to degrees
    angle: Math.atan2(y, x) * 180 / Math.PI
  }
}

function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;

  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}
