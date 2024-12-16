//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.split("\r\n");
} catch (err) {
  console.error(err);
}

input = input.map(x => x.split(''));
var start = []; //[y, x];
var end = []; //[y, x];
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] == "S") {
      start = [y, x];
      input[y][x] = ".";
    } else if (input[y][x] == "E") {
      end = [y, x];
      input[y][x] = ".";
    }
  }
}

const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //N, E, S, W
var solved = input.map(x => x.map(y => [false, false, false, false])); //N, E, S, W; if used to check adjacent nodes already
var distances = input.map(x => x.map(y => [Infinity, Infinity, Infinity, Infinity])); //N, E, S, W; lowest distance from start to here
distances[start[0]][start[1]][1] = 0; //start position, facing east, has initial distance of 0
var unsolved = [[...start, 1]]; //initialize with starting position
var best = input.map(x => x.map(y => [[], [], [], []])); //record best previous step
while (unsolved.length > 0) {
  //sort to ensure we grab lowest distance
  unsolved.sort((a, b) => distances[a[0]][a[1]][a[2]] - distances[b[0]][b[1]][b[2]]);
  let [y, x, dir] = unsolved.shift();
  if (solved[y][x][dir]) {
    //already checked, skip
    continue;
  }

  //update adjacent nodes
  for (let d = 0; d < 4; d++) {
    if (d == dir) {
      //compare against stepping forward
      let [dy, dx] = dirs[d];
      compare([y, x, dir], [y + dy, x + dx, dir], 1);
    } else {
      //compare against rotating
      let cost = 1000;
      if (d == (dir + 2) % 4) {
        //rotating 180 costs two rotations
        cost = 2000;
      }
      compare([y, x, dir], [y, x, d], cost);
    }
  }

  solved[y][x][dir] = true;
}

function compare(current, destination, cost) {
  let [cy, cx, cd] = current;
  let [dy, dx, dd] = destination;

  //wall, don't attempt a move
  if (input[dy][dx] == "#") {
    return;
  }

  //check if cost is lower
  if (distances[dy]?.[dx]?.[dd] > distances[cy][cx][cd] + cost) {
    distances[dy][dx][dd] = distances[cy][cx][cd] + cost;
    unsolved.push([dy, dx, dd]);
    best[dy][dx][dd] = [];
  }

  //for part 2, if cost is equal (or was lower, but has just been made equal), update best paths array
  if (distances[dy]?.[dx]?.[dd] == distances[cy][cx][cd] + cost) {
    best[dy][dx][dd].push([cy, cx, cd]);
  }
}

var part1 = Math.min(...distances[end[0]][end[1]]);

//you may be able to reach the end with the same minimal steps, but from different directions.
//get all of the possible directions you can end at, while still maintaining minimal steps.
var enddirs = distances[end[0]][end[1]].map((x, idx) => x == part1 ? idx : -1).filter(x => x != -1);
var path = input.map(x => x.map(y => [false, false, false, false])); //N, E, S, W; if part of best path
var part2 = 1; //init as 1 because the last tile itself is also part of the best path(s)
while (enddirs.length > 0) {
  bestBackwards([end[0], end[1], enddirs.shift()]);
}

//work backwards to find all possible best paths
function bestBackwards(location) {
  let [y, x, dir] = location;
  let before = best[y][x][dir];
  while (before.length > 0) {
    let next = before.pop();
    if (!path[next[0]][next[1]][next[2]]) {
      //being the same node in the best path but in a different direction doesn't count
      if (!path[next[0]][next[1]].some(x => x)) {
        part2++;
      }
      path[next[0]][next[1]][next[2]] = true;
      bestBackwards(next);
    }
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);