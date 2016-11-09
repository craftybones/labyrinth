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

var generateMaze=function(grid,coord,direction) {
  var row=coord[0];
  var col=coord[1];
  var dir=directions[direction].val;
  var dRow=dir[0];
  var dCol=dir[1];

  if(outOfBounds(coord,MAX_ROWS,MAX_COLS))
    return grid;
  if(grid[row][col]==MAZE_CHAR)
    return grid;
  if(pathBlocked(grid,coord,direction))
    return grid;
  grid[row][col]=MAZE_CHAR;
  grid=generateMaze(grid,[row+dRow,col+dCol],direction);
  var leftOf=sumOfCoordinates(coord,directions[direction].left);
  var rightOf=sumOfCoordinates(coord,directions[direction].right);
  grid=generateMaze(grid,leftOf,directions[direction].leftOf);
  grid=generateMaze(grid,rightOf,directions[direction].rightOf);
  return grid;
}

var MAX_ROWS=10;
var MAX_COLS=10;
var MAIN_CHAR=".";
var MAZE_CHAR="0";

var mainGrid=createGrid(MAX_ROWS,MAX_COLS,MAIN_CHAR);
mainGrid[0][4]=MAZE_CHAR;

var initCoord=[randomNumber(MAX_ROWS),randomNumber(MAX_COLS)];
var initDirection=randomDirection();
var maze=generateMaze(mainGrid,initCoord,initDirection);
// console.log(initDirection);
// console.log(initCoord);
console.log(maze);
