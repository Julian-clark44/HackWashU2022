var game = {}
game.size = 700
game.dimensions = 8;
game.margin = {top: 50, right: 50, bottom: 50, left: 50}
game.svgWidth = game.size - game.margin.left - game.margin.right;
game.svgHeight = game.size - game.margin.top - game.margin.bottom;
game.tile_size = game.svgWidth / game.dimensions;
game.date = new Date();
game.timer = {
  previous_time: 0,
  current_time: 0,
  dt: 0,
};
game.physics = {
  alpha: 0.0003,
  beta: 0.0008,
};
game.start = {
  x: 0,
  y: 0,
}
game.end = {
  x: 7,
  y: 7,
}
game.square = {
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  size: 30,
};
game.square.x = game.start.x + (game.tile_size - game.square.size) / 2;
game.square.y = game.start.y + (game.tile_size - game.square.size) / 2;

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


var socket = io();

socket.on('connect', function() {
  socket.emit('start game', 1);
});

socket.on('accel_data', function(accel){
  game.date = new Date();
  game.timer.previous_time = game.timer.current_time;
  game.timer.current_time = game.date.getTime();
  game.timer.dt = game.timer.current_time - game.timer.previous_time;
  if(game.timer.previous_time !== 0) updateSquare(accel);
  else drawSquare();
});

socket.on('edges_data', function(edges){
  game.edges = edges
  updateEdges()
});


function updateEdges(){
  game.edges.forEach(e => {
    e[0][0] *= game.tile_size;
    e[0][1] *= game.tile_size;
    e[1][0] *= game.tile_size;
    e[1][1] *= game.tile_size;
  });

  maze.append("rect")
    .attr("fill", "green")
    .attr("x", (game.end.x * game.tile_size))
    .attr("y", (game.end.y * game.tile_size))
    .attr("width", game.tile_size)
    .attr("height", game.tile_size);

  maze.selectAll("path")
    .data(game.edges)
    .enter()
    .append("path")
    .attr("d", d => { 
      return d3.line()(d);
    })
    .attr("stroke", "black")
}

function updateSquare(accel){
  game.square.ax = calculateAccelX(accel[0]);
  game.square.ay = calculateAccelY(accel[1]);
  game.square.vx += game.square.ax * game.timer.dt;
  game.square.vy += game.square.ay * game.timer.dt;
  game.square.x += game.square.vx * game.timer.dt;
  game.square.y += game.square.vy * game.timer.dt;

  drawSquare();
  if(detectEdgeCollisions()) window.location.href = "/loser";
  if(detectEndCollision()) window.location.href = "/winner";
}

function drawSquare(){
  var square = maze.selectAll("#square")
    .data([1]);

  square.enter()
    .append("rect")
    .merge(square)
    .attr("id", "square")
    .attr("x", game.square.x)
    .attr("y", game.square.y)
    .attr("width", game.square.size)
    .attr("height", game.square.size)
    .attr("fill", "red");
}

function calculateAccelX(accel_val){
  if(accel_val > 0) accel_val = Math.max(accel_val - 0.15, 0);
  else accel_val = Math.min(accel_val + 0.15, 0);
  accel_val *= game.physics.alpha;
  accel_val += game.physics.beta * game.square.vx;
  return -accel_val;
}

function calculateAccelY(accel_val){
  if(accel_val > 0) accel_val = Math.max(accel_val - 0.15, 0);
  else accel_val = Math.min(accel_val + 0.15, 0);
  accel_val *= game.physics.alpha;
  accel_val -= game.physics.beta * game.square.vy;
  return accel_val;
}

function detectEdgeCollisions(){
  var collision = false;
  game.edges.forEach(e => {
    var sqr = game.square;

    // either point inside square
    if(e[0][0] > sqr.x && e[0][0] < sqr.x + sqr.size && e[0][1] > sqr.y && e[0][1] < sqr.y + sqr.size) { collision = true; return; }
    if(e[1][0] > sqr.x && e[1][0] < sqr.x + sqr.size && e[1][1] > sqr.y && e[1][1] < sqr.y + sqr.size) { collision = true; return; }

    // through horizontal
    if(e[0][0] < sqr.x && e[1][0] > sqr.x + sqr.size && e[0][1] > sqr.y && e[0][1] < sqr.y + sqr.size) { collision = true; return; }
    if(e[0][0] > sqr.x + sqr.size && e[1][0] < sqr.x && e[0][1] > sqr.y && e[0][1] < sqr.y + sqr.size) { collision = true; return; }

    // through vertically
    if(e[0][1] < sqr.y && e[1][1] > sqr.y + sqr.size && e[0][0] > sqr.x && e[0][0] < sqr.x + sqr.size) { collision = true; return; }
    if(e[0][1] > sqr.y + sqr.size && e[1][1] < sqr.y && e[0][1] > sqr.x && e[0][0] < sqr.x + sqr.size) { collision = true; return; }

    return false;
  });
  return collision;
}

function detectEndCollision(){
  var sqr = game.square;
  if((sqr.x + sqr.size) > (game.end.x * game.tile_size) && (sqr.y + sqr.size) > (game.end.y * game.tile_size)) return true;
  else return false;
}


