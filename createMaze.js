var randomNumber=function(max) {
  return Math.floor(Math.random()*max);
}

var randomDirection=function() {
  return ["north","south","east","west"][randomNumber(4)];
}

var sumOfCoordinates=function(c1,c2) {
  return [c1[0]+c2[0], c1[1]+c2[1]];
}

var createGrid=function(rows,cols,character) {
  var grid=[];
  for (var i = 0; i < rows; i++) {
    grid.push([]);
    for (var j = 0; j < cols; j++) {
      grid[i][j]=character;
    }
  }
  return grid;
}

var printGrid=function(grid,rows,cols) {
  var str="";
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      str+=grid[i][j];
    }
    str+="\n";
  }
  console.log(str);
}

var north=[-1,0];
var south=[1,0];
var east=[0,1];
var west=[0,-1];

var directions={
  north: {val: north, left: west, right: east, leftOf: "west", rightOf: "east"},
  south: {val: south, left: east, right: west, leftOf: "east", rightOf: "west"},
  east: {val: east, left: south, right: north, leftOf: "south", rightOf: "north"},
  west: {val: west, left: north, right: south, leftOf: "north", rightOf: "south"}
};

var outOfBounds=function(coord,mx,my) {
  var x=coord[0];
  var y=coord[1];
  return (x<0 || y<0 || x>=mx || y>=my);
}

var isCoordMazeChar=function(grid,coord) {
  return grid[coord[0]][coord[1]]==MAZE_CHAR;
}

var pathBlocked=function(grid,coord,direction) {
  var left=sumOfCoordinates(coord,directions[direction].left);
  var right=sumOfCoordinates(coord,directions[direction].right);
  var inFront=sumOfCoordinates(coord,directions[direction].val);

  return (!outOfBounds(left,MAX_ROWS,MAX_COLS) && isCoordMazeChar(grid,left))
    || (!outOfBounds(right,MAX_ROWS,MAX_COLS) && isCoordMazeChar(grid,right))
    || (!outOfBounds(inFront,MAX_ROWS,MAX_COLS) && isCoordMazeChar(grid,inFront));
}

var turnRandomly=function(direction) {
  var shouldTurn=Math.random();
  if(shouldTurn<0.5)
    return direction;
  var leftOrRight=Math.random();
  if(leftOrRight>0.5)
    return directions[direction].leftOf;
  return directions[direction].rightOf;
}

var generateMaze=function(grid,coord,direction) {
  var row=coord[0];
  var col=coord[1];

  if(outOfBounds(coord,MAX_ROWS,MAX_COLS))
    return grid;
  if(grid[row][col]==MAZE_CHAR)
    return grid;
  if(pathBlocked(grid,coord,direction))
    return grid;
  grid[row][col]=MAZE_CHAR;
  direction=turnRandomly(direction);
  var inFrontOf=sumOfCoordinates(coord,directions[direction].val);
  var leftOf=sumOfCoordinates(coord,directions[direction].left);
  var right=directions[direction].rightOf;
  var rightOf=sumOfCoordinates(coord,directions[direction].right);
  var behind=sumOfCoordinates(coord,directions[right].right);
  grid=generateMaze(grid,inFrontOf,direction);
  grid=generateMaze(grid,leftOf,directions[direction].leftOf);
  grid=generateMaze(grid,rightOf,directions[direction].rightOf);
  grid=generateMaze(grid,behind,directions[right].rightOf);
  return grid;
}

var MAX_ROWS=30;
var MAX_COLS=30;
var MAIN_CHAR=" ";
var MAZE_CHAR="X";

var mainGrid=createGrid(MAX_ROWS,MAX_COLS,MAIN_CHAR);

var initCoord=[randomNumber(MAX_ROWS),randomNumber(MAX_COLS)];
var initDirection=randomDirection();
var mainMaze=generateMaze(mainGrid,initCoord,initDirection);


var drawChart=function(maze) {
  var rows=d3.select(".maze")
    .selectAll("tr")
    .data(maze)
    .enter()
    .append("tr");
  rows.selectAll("td")
    .data(function(d){return d})
    .enter()
    .append("td")
    .attr("class",function(d,i){
      return d==MAZE_CHAR?"path":"empty";
    });
}

drawChart(mainMaze);
