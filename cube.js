var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = '1900', h = '1000';
const MODEL_MIN_X = -2, MODEL_MAX_X = 2;
const MODEL_MIN_Y = -1, MODEL_MAX_Y = 1;
const STEP = 2;
ctx.canvas.style.backgroundColor = 'rgb(0, 0, 0)';
var points = [];
var triangles = [];
var colors = ['red', 'green', 'blue', 'white', 'orange', 'purple', 'cyan', 'yellow'];

function initGeometry(){
  for(var x = -1; x <= 1; x += STEP){
    for(var y = -1; y <= 1; y += STEP){ 
      for(var z = -1; z <= 1; z += STEP){
        points.push(new Vector(x, y, z));
      }
    }
  }
  for(var dimension = 0; dimension <= 2; dimension++){
    //dimension 0 = x
    //dimension 1 = y
    //dimension 2 = z
    for (var side = -1; side <= 1; side += 2){
      var sidePoints = points.filter((point) => {
          return point[dimension] === side;
      });
      var a = sidePoints[0],
          b = sidePoints[1],
          c = sidePoints[2],
          d = sidePoints[3];
      if(dimension == 1){
        triangles.push(makeTriangle(a, b, c, dimension, side));
        triangles.push(makeTriangle(d, b, c, dimension, side));
      } else{
        triangles.push(makeTriangle(a, b, c, dimension, -side));
        triangles.push(makeTriangle(d, b, c, dimension, -side)); 
      } 
    }
  }
}

function makeTriangle(a, b, c, dimension, side){
  var side1 = b.subtract(a),
      side2 = c.subtract(a);
  var orientationVector = side1.crossProduct(side2);

  if(Math.sign(orientationVector[dimension]) == Math.sign(side)){
    return [a, b, c];
  }
  return [a, c, b];
}

//Voegt een 3d perspectief toe aan de cubus
function perspectiveProjection(point){
  var x = point[0],
      y = point[1],
      z = point[2];

  return new Vector(
    x / (z + 4),
    y / (z + 4),
    z
  );
}

//Zet een 3d om naar 2d
function project(point){
  var perspectivePoint = perspectiveProjection(point);

  var x = perspectivePoint[0],
      y = perspectivePoint[1],
      z = perspectivePoint[2];

  return new Vector(
      w * (x - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X), //Dit zet point[0] om van -1 tot 1 getal naar een coordinaat voor in de canvas 
      h * (1 - (y - MODEL_MAX_Y) / (MODEL_MIN_Y - MODEL_MAX_Y)),
      z
  );
}

function renderPoints(point){
    //Rendered de punten uit de point array
    var projectedPoint = project(point);
    var x = projectedPoint[0], y = projectedPoint[1];

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1, y + 1);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function renderTriangle(triangle, color){
    var projectedTriangle = triangle.map(project);
    var a = projectedTriangle[0], 
        b = projectedTriangle[1],
        c = projectedTriangle[2];
    var side1 = b.subtract(a),
        side2 = c.subtract(a);
    if(side1.ccw(side2)){
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(a[0], a[1]);
      ctx.strokeStyle = 'black';
      ctx.fillStyle = color;
      ctx.stroke();
      ctx.fill();
    }
}

var theta = 0;
var dtheta = 0.02;

function render(){
  ctx.fillStyle = 'black';
  ctx.clearRect(0, 0, w, h);
  theta += dtheta;

  triangles.forEach((triangle, idx) => {
    var rotatedTriangle = triangle.map((point) => {
      point = point.rotateY(theta);
      point = point.rotateX(0.45 * theta);
      return point;
    });
    var color = colors[Math.floor(idx / 2)];
    renderTriangle(rotatedTriangle, color);
  });
  requestAnimationFrame(render);
}

initGeometry();
render();