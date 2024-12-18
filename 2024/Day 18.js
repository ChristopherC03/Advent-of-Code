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

input = input.map(x => x.split(',').map(y => Number(y)));
let size = 71;
let part1 = solve(input.slice(0, 1024))[1]; //gives first 1024 coords

let i = input.length;
while (!solve(input.slice(0, --i))[0]); //keeps checking with less walls until one is solvable
let part2 = input[i].join(',');

function solve(bytes) {
  const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //N, E, S, W
  let distances = Array(size).fill().map(x => Array(size).fill(Infinity));
  distances[0][0] = 0;
  for (let a = 0; a < bytes.length; a++) {
    let [x, y] = bytes[a];
    distances[y][x] = -1; //-1 designates a wall
  }
  let unsolved = [[0, 0]];

  while (unsolved.length > 0) {
    let [y, x] = unsolved.shift();
    let distance = distances[y][x];
    for (let d = 0; d < 4; d++) {
      let [dy, dx] = dirs[d];
      let yy = y + dy;
      let xx = x + dx;
      //skip if destination is wall or distination is already checked
      if (distances[yy]?.[xx] == -1 || distances[yy]?.[xx] != Infinity) {
        continue;
      }
      distances[yy][xx] = distance + 1;
      unsolved.push([yy, xx]);
    }

    //found path to exit, stop checking
    if (distances[size - 1][size - 1] != Infinity) {
      return [true, distances[size - 1][size - 1]];
    }
  }

  return [false, Infinity];
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);