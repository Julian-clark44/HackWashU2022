var game = {}
game.size = 700
game.dimensions = 8;
game.margin = {top: 50, right: 50, bottom: 50, left: 50}
game.svgWidth = game.size - game.margin.left - game.margin.right;
game.svgHeight = game.size - game.margin.top - game.margin.bottom;
game.tile_size = game.svgWidth / game.dimensions;


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
  console.log(accel);
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
  console.log(game.edges)
}


