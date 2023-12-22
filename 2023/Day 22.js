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

input = input.map(x => x.split("~").map(y => y.split(",").map(z => Number(z))));
input.sort((a, b) => a[0][2] - b[0][2]);
var grid = []; //x, y, z
var blocks = {}; //id: ["x,y,z", "x,y,z"]

//puts the blocks in the grid, decreasing z values as necessary
for (let a = 0; a < input.length; a++) {
  blocks[a] = [];
  let brick = input[a];
  let [[x1, y1, z1], [x2, y2, z2]] = findConflict(brick);

  for (let x = x1; x <= x2; x++) {
    grid[x] = grid[x] ?? [];
    for (let y = y1; y <= y2; y++) {
      grid[x][y] = grid[x][y] ?? [];
      for (let z = z1; z <= z2; z++) {
        grid[x][y][z] = a;
        blocks[a].push(x + "," + y + "," + z);
      }
    }
  }
}

//keep going down until we do intersect (or until z would intersect with the ground)
function findConflict(brick) {
  let [[x1, y1, z1], [x2, y2, z2]] = brick;
  while (z1 > 0) {
    for (let x = x1; x <= x2; x++) {
      grid[x] = grid[x] ?? [];
      for (let y = y1; y <= y2; y++) {
        grid[x][y] = grid[x][y] ?? [];
        for (let z = z1; z <= z2; z++) {
          if (grid[x][y][z] != undefined) {
            return [[x1, y1, z1 + 1], [x2, y2, z2 + 1]];
          }
        }
      }
    }
    z1--;
    z2--;
  }
  return [[x1, y1, z1 + 1], [x2, y2, z2 + 1]];
}

//for each block, finds the blocks it is supported by
//builds a dependancy tree and finds those that are only supported by one block (for part 1)
var dependancy = {};
var disallowed = new Set();
for (let a = 0; a < input.length; a++) {
  let block = blocks[a];
  let found = new Set();
  for (let b = 0; b < block.length; b++) {
    let [x, y, z] = block[b].split(",").map(x => Number(x));
    let below = grid[x][y][z - 1];
    if (below != a && below != undefined) {
      found.add(below);
    }
  }

  dependancy[a] = [...found];
  if (found.size == 1) {
    disallowed.add([...found][0]);
  }
}

//finds reactions for all bricks
var reaction = 0;
for (let a = 0; a < input.length; a++) {
  let removed = [a];
  let dependant = {};
  Object.entries(dependancy).map(x => dependant[x[0]] = [...x[1]]);
  while (removed.length > 0) {
    let cur = removed.shift();
    for (let b = 0; b < input.length; b++) {
      let index = dependant[b].indexOf(cur);
      if (index != -1) {
        dependant[b].splice(index, 1);
        if (dependant[b].length == 0) {
          removed.push(b);
          reaction++;
        }
      }
    }
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", input.length - disallowed.size);
console.log("Part 2:", reaction);