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

var robots = [];
while (input.length > 0) {
  let cur = input.shift();
  robots.push(cur.match(/-?\d+/g).map(x => Number(x)));
}

var part1;
var part2;
for (let a = 1; a < 10000; a++) {
  robots = robotStep(robots);

  if (a == 100) {
    part1 = calcQuadrants(robots.map(x => x.map(y => y)));  //deep copy
  }

  if (checkTree(robots.map(x => x.map(y => y)))) {  //deep copy
    part2 = a;
    break;
  }
}

function robotStep(robots) {
  let nextStep = [];
  while (robots.length > 0) {
    let [x, y, dx, dy] = robots.shift();
    x = (x + dx) % 101;
    if (x < 0) {
      x = 101 + x;
    }
    y = (y + dy) % 103;
    if (y < 0) {
      y = 103 + y;
    }
    nextStep.push([x, y, dx, dy]);
  }
  return nextStep;
}

function calcQuadrants(robots) {
  var quadrants = [0, 0, 0, 0];
  while (robots.length > 0) {
    let cur = robots.shift();
    if (cur[0] < 50 && cur[1] < 51) {
      quadrants[0]++;
    } else if (cur[0] > 50 && cur[1] < 51) {
      quadrants[1]++;
    } else if (cur[0] < 50 && cur[1] > 51) {
      quadrants[2]++;
    } else if (cur[0] > 50 && cur[1] > 51) {
      quadrants[3]++;
    }
  }
  return quadrants.reduce((a, b) => a * b);
}

function checkTree(robots) {
  let grid = Array(103).fill().map(x => Array(101).fill(false));
  while (robots.length > 0) {
    let [x, y] = robots.shift();
    grid[y][x] = true;
    if (
      //if there are robots in all 8 adjacent locations, tree has been found
      (grid[y - 1] ?? [])[x - 1] && (grid[y - 1] ?? [])[x] && (grid[y - 1] ?? [])[x + 1] &&
      grid[y][x - 1] && grid[y][x + 1] &&
      (grid[y + 1] ?? [])[x - 1] && (grid[y + 1] ?? [])[x] && (grid[y + 1] ?? [])[x + 1]
    ) {
      return true;
    }
  }
  return false;
  //console.log(grid.map(x => x.map(y => y ? "#" : ".").join("")).join("\n"));
};

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);