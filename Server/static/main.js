var game = {}
game.size = 700
game.dimensions = 8;
game.margin = {top: 50, right: 50, bottom: 50, left: 50}
game.svgWidth = game.size - game.margin.left - game.margin.right;
game.svgHeight = game.size - game.margin.top - game.margin.bottom;
game.tile_size = game.svgWidth / game.dimensions;
game.time = getTime();

svg = d3.select("#gameDiv")
  .append("svg")
  .attr("width", game.size)
  .attr("height", game.size)

svg.append("rect")
  .attr("width", game.size)
  .attr("height", game.size)
  .attr("fill", "tan")

maze = svg.append("g")
  .attr("transform", "translate(" + game.margin.left + ", " + game.margin.top + ")")


var x = 0;
var y = 0;
var vx = 0;
var vy = 0;
var ax = 0;
var ay = 0;

function getVx(dt) {
  ax = accel[0] - ax * .4;
  vx += dt * ax;
}

function getVy(dt) {
  ay = accel[1] - ay * .4;
  vy += dt * ay;
}

function getX(dt) {
  x += dt * getVx(dt);
}

function getY(dt) {
  y += dt * getVy(dt);
}
function getPosition(dt) {
  getX();
  getY();
  game.time() = t1;
}

var socket = io();
socket.on('connect', function () {
  socket.emit('transmit', 1);
});

socket.on('accel_data', function (accel) {
  console.log(accel);
  t1.getTime();
  getPosition(t1 - game.time());
});



  

/*var socket = io();

socket.on('connect', function() {
  socket.emit('start game', 1);
});

socket.on('accel_data', function(accel){
  console.log(accel);
});

socket.on('edges_data', function(edges){
  game.edges = edges
  updateEdges()
});*/


function updateEdges(){

  game.edges.forEach(e => {
    e[0][0] *= game.tile_size;
    e[0][1] *= game.tile_size;
    e[1][0] *= game.tile_size;
    e[1][1] *= game.tile_size;
  });

  maze.selectAll("path")
    .data(game.edges)
    .enter()
    .append("path")
    .attr("d", d => { 
      return d3.line()(d);
    })
    .attr("stroke", "black")
  console.log(game.edges)
}


