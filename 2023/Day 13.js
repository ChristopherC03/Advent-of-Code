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

var grids = [[]];
while (input.length > 0) {
  let cur = input.shift();
  if (cur.length == 0) {
    grids.push([]);
  } else {
    grids[grids.length - 1].push(cur.split(""));
  }
}

var mirrors = [0, 0]; //part 1, part 2
while (grids.length > 0) {
  findReflection(grids.shift()).map((x, idx) => mirrors[idx] += x);
}

function findReflection(grid) {
  let reflections = []; //part 1, part 2
  let start;

  //find horizontal
  start = [0, 1];
  while (start[1] < grid.length) {
    let pair = [...start];
    let smudges = 0;

    while (pair[0] >= 0 && pair[1] < grid.length) {
      smudges += compareArrs(grid[pair[0]], grid[pair[1]]);
      pair[0]--;
      pair[1]++;
    }

    if (smudges == 0) {
      reflections[0] = start[1] * 100;
    } else if (smudges == 1) {
      reflections[1] = start[1] * 100;
    }

    start[0]++;
    start[1]++;
  }

  //find vertical
  start = [0, 1];
  while (start[1] < grid[0].length) {
    let pair = [...start];
    let smudges = 0;

    while (pair[0] >= 0 && pair[1] < grid[0].length) {
      smudges += compareArrs(grid.map(x => x[pair[0]]), grid.map(x => x[pair[1]]));
      pair[0]--;
      pair[1]++;
    }

    if (smudges == 0) {
      reflections[0] = start[1];
    } else if (smudges == 1) {
      reflections[1] = start[1];
    }

    start[0]++;
    start[1]++;
  }
  
  return reflections;
}

function compareArrs(array1, array2) {
  return array1.filter((x, idx) => x != array2[idx]).length;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", mirrors[0]);
console.log("Part 2:", mirrors[1]);