var _SEQ=0;

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
  return (x<1 || y<1 || x>=(mx-1) || y>=(my-1));
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
  if(shouldTurn<0.4)
    return direction;
  var leftOrRight=Math.random();
  if(leftOrRight>0.5)
    return directions[direction].leftOf;
  return directions[direction].rightOf;
}

var createMazePath=function(grid,coord,direction) {
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
  grid=createMazePath(grid,inFrontOf,direction);
  grid=createMazePath(grid,leftOf,directions[direction].leftOf);
  grid=createMazePath(grid,rightOf,directions[direction].rightOf);
  grid=createMazePath(grid,behind,directions[right].rightOf);
  return grid;
}

var createMaze=function(grid,initCoord,initDir) {
  var grid=createMazePath(grid,initCoord,initDir);
  var startingRows=[];
  var endingRows=[];
  for (var i = 0; i < grid.length; i++) {
    if(grid[i][1]==MAZE_CHAR)
      startingRows.push(i);
    if(grid[i][MAX_COLS-2]==MAZE_CHAR)
      endingRows.push(i);
  }
  var startRow=randomNumber(startingRows.length);
  grid[startingRows[startRow]][0]=MAZE_CHAR;
  var endRow=randomNumber(endingRows.length)
  var randomEndingRow=grid[endingRows[endRow]];
  randomEndingRow.pop();
  randomEndingRow.push(MAZE_CHAR);
  return {grid: grid, start: [startingRows[startRow],0], end: [endingRows[endRow],MAX_COLS-1]};
}

var MAX_ROWS=50;
var MAX_COLS=50;
var MAIN_CHAR="-";
var MAZE_CHAR="X";

var mainGrid=createGrid(MAX_ROWS,MAX_COLS,MAIN_CHAR);

var initCoord=[randomNumber(MAX_ROWS-2)+1,randomNumber(MAX_COLS-2)+1];
var initDirection=randomDirection();
var mainMaze=createMaze(mainGrid,initCoord,initDirection);

var drawChart=function(maze) {
  var rows=d3.select(".maze")
    .selectAll("tr")
    .data(maze.grid)
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

var drawSolution=function(solution) {
  var rows=d3.select(".maze").selectAll("tr")._groups[0];
  solution.forEach(function(s){
    rows[s[0]].childNodes[s[1]].className="solution";
  });
}

var drawCell=function(r,c,cl) {
  _SEQ+=1;
  setTimeout(function(){
    var rows=d3.select(".maze").selectAll("tr")._groups[0];
    rows[r].childNodes[c].className=cl;
  },_SEQ*20);
}
var isSameCoord=function(c1,c2) {
  return (c1[0]==c2[0])&&(c1[1]==c2[1]);
}

var solveMaze=function(grid,start,stop,solution) {
  for (var i = 0; i < solution.length; i++) {
    if(isSameCoord(solution[i],start))
      return undefined;
  }
  if(isSameCoord(start,stop)) {
    solution.push(stop);
    drawCell(stop[0],stop[1],"solution");
    return solution;
  }
  var r=start[0];
  var c=start[1];

  if(r<0 || c<0 || r>=MAX_ROWS || c>=MAX_COLS)
    return undefined;
  if(grid[r][c]!= MAZE_CHAR)
    return undefined;
  solution.push(start);
  drawCell(r,c,"solution");
  if(solveMaze(grid,[r+1,c],stop,solution))
    return solution;
  if(solveMaze(grid,[r,c+1],stop,solution))
    return solution;
  if(solveMaze(grid,[r-1,c],stop,solution))
    return solution;
  if(solveMaze(grid,[r,c-1],stop,solution))
    return solution;
  solution.pop();
  drawCell(r,c,"path");
  return undefined;
}

var solve=function(maze) {
  return solveMaze(maze.grid,maze.start,maze.end,[],0);
}

drawChart(mainMaze);
var solution=solve(mainMaze);
// drawSolution(solution);
