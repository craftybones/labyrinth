var randomNumber=function(max) {
  return Math.floor(Math.random()*max);
}

var randomDirection=function() {
  return ["north","south","east","west"][randomNumber(4)];
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
  north: {val: north, left: west, right: east},
  south: {val: south, left: east, right: west},
  east: {val: east, left: south, right: north},
  west: {val: west, left: north, right: south}
};

var outOfBounds=function(x,y,mx,my) {
  return (x<0 || y<0 || x>=mx || y>=my);
}

var generateMaze=function(grid,coord,direction) {
  var row=coord[0];
  var col=coord[1];
  var dir=directions[direction].val;
  var dRow=dir[0];
  var dCol=dir[1];

  if(outOfBounds(row,col,MAX_ROWS,MAX_COLS) || )
    return grid;

  grid[row][col]="X";
  return generateMaze(grid,[row+dRow,col+dCol],direction)
}

var MAX_ROWS=5;
var MAX_COLS=5;
var MAIN_CHAR="-";
var MAZE_CHAR="X";

var mainGrid=createGrid(MAX_ROWS,MAX_COLS,MAIN_CHAR);

var initCoord=[randomNumber(MAX_ROWS),randomNumber(MAX_COLS)];
var initDirection=randomDirection();
var maze=generateMaze(mainGrid,initCoord,initDirection);
console.log(initDirection);
console.log(initCoord);
console.log(maze);
