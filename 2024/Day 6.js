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

var location = []; //[y, x];
var visited = []; //for each square of the map, array of the directions guard has been in while there
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //up, right, down, left
var part2 = 0;
for (let y = 0; y < input.length; y++) {
  let cur = [];
  for (let x = 0; x < input[y].length; x++) {
    cur.push([]);
    if (input[y][x] == '^') {
      //guard location, remove icon from map, set location, and initialize this square as visited while going upwards
      input[y][x] = '.';
      location = [y, x];
      cur[cur.length - 1] = [0];
    }
  }
  visited.push(cur);
}

function simulateGuard(location, dir, visited, vanilla) {
  while (true) {
    //applies the current direction's delta to our current location
    let [y, x] = location.map((x, idx) => x + dirs[dir][idx]);

    //if out of bounds of the map
    if (y < 0 || y >= input.length || x < 0 || x >= input[0].length) {
      return [location, dir, visited, false];
    }

    //if we're in a loop
    if (visited[y][x].includes(dir)) {
      return [location, dir, visited, true];
    }

    //bumped into an obstacle, rotate and don't move forward yet
    if (input[y][x] === '#' || (!vanilla[0] && y == vanilla[1][0] && x == vanilla[1][1])) {
      dir = (dir + 1) % 4;
      continue;
    }

    //if we haven't placed an obstacle yet and this is a brand new location
    //(note visiting the same location twice IS possible without looping, just with a different direction)
    if (vanilla[0] && visited[y][x].length == 0) {
      //recurse; we know that everything up until the added obstacle is the same, this prevents redoing that work
      //simulate what the guard's trip would be like with this obstacle there,
      //and if we ended up in a loop instead of exiting the map, add to part2's total
      var test = simulateGuard([...location], dir, visited.map(x => x.map(y => [...y])), [false, [y, x]]);
      if (test[3]) {
        part2++;
      }
    }

    visited[y][x].push(dir);
    location = [y, x];
  }
}

//add up all the visited locations for part1
var part1 = simulateGuard(location, 0, visited, [true])[2].reduce((a, b) => a + b.reduce((c, d) => c + Math.min(d.length, 1), 0), 0);

//program execution time ~4 seconds
console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);