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
game.ball = {
  x: 300,
  y: 300,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
};
game.physics = {
  alpha: 0.0003,
  beta: 0.0008,
};

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
  if(game.timer.previous_time !== 0) updateBall(accel);
  else drawBall();
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

  maze.selectAll("path")
    .data(game.edges)
    .enter()
    .append("path")
    .attr("d", d => { 
      return d3.line()(d);
    })
    .attr("stroke", "black")
}

function updateBall(accel){
  game.ball.ax = calculateAccelX(accel[0]);
  game.ball.ay = calculateAccelY(accel[1]);
  game.ball.vx += game.ball.ax * game.timer.dt;
  game.ball.vy += game.ball.ay * game.timer.dt;
  game.ball.x += game.ball.vx * game.timer.dt;
  game.ball.y += game.ball.vy * game.timer.dt;

  drawBall();
}

function drawBall(){
  var ball = maze.selectAll("circle")
    .data([1]);

  ball.enter()
    .append("circle")
    .merge(ball)
    .attr("cx", game.ball.x)
    .attr("cy", game.ball.y)
    .attr("r", 15)
    .attr("fill", "red");
}

function calculateAccelX(accel_val){
  if(accel_val > 0) accel_val = Math.max(accel_val - 0.15, 0);
  else accel_val = Math.min(accel_val + 0.15, 0);
  accel_val *= game.physics.alpha;
  accel_val += game.physics.beta * game.ball.vx;
  return -accel_val;
}

function calculateAccelY(accel_val){
  if(accel_val > 0) accel_val = Math.max(accel_val - 0.15, 0);
  else accel_val = Math.min(accel_val + 0.15, 0);
  accel_val *= game.physics.alpha;
  accel_val -= game.physics.beta * game.ball.vy;
  return accel_val;
}


