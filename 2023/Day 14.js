//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file "cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.trim().split("\r\n");
} catch (err) {
  console.error(err);
}

input = input.map(x => x.split(""));
var seen = [];

var part1 = findLoad(roll(input.map(x => [...x]), -1, 0));
var part2 = input.map(x => [...x]);
var cycles = 0;
while (true) {
  let map = part2.map(x => x.join("")).join("\n");
  if (seen.includes(map)) {
    let found = seen.indexOf(map);
    let cycle = found + ((1000000000 - found) % (cycles - found));
    part2 = findLoad(seen[cycle].split("\n").map(x => x.split("")));
    break;
  }
  seen.push(map);
  
  roll(part2, -1, 0); //N
  roll(part2, 0, -1); //W
  roll(part2, 1, 0);  //S
  roll(part2, 0, 1);  //E
  cycles++;
}

function roll(grid, dy, dx) {
  while (true) {
    let still = true;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == "O" && (grid[y + dy] ?? [])[x + dx] == ".") {
          grid[y][x] = ".";
          grid[y + dy][x + dx] = "O";
          still = false;
        }
      }
    }

    if (still) {
      return grid;
    }
  }
}

function findLoad(grid) {
  let load = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == "O") {
        load += grid.length - y;
      }
    }
  }
  return load;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);