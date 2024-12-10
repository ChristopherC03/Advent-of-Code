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
var coords = Array(10).fill().map(x => []); //coords[0] = [[1, 2], [3, 4], ...]   y, x
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    let char = Number(input[y][x]);
    coords[char].push([y, x]);
  }
}

var paths = coords.pop().map(x => [...x, [x]]);
while (coords.length > 0) {
  let nextpaths = [];
  let height = coords.pop();
  while (height.length > 0) {
    let cur = height.pop();
    let possible = paths.filter(x => Math.abs(x[0] - cur[0]) + Math.abs(x[1] - cur[1]) == 1);
    possible = possible.map(x => x[2]).flat();
    //I solved part 2 originally by *removing* this line of code from part 1, no other changes
    //possible = possible.filter((x, idx) => !possible.slice(idx + 1).some(y => y[0] == x[0] && y[1] == x[1]));
    nextpaths.push([...cur, possible]);
  }
  paths = nextpaths;
}

//for each path from 0 to 9, get the locations of the possible 9s, filter duplicates, return amount possible. add them all up
var part1 = paths.map(x => x[2].filter((y, idx) => !x[2].slice(idx + 1).some(z => z[0] == y[0] && z[1] == y[1])).length).reduce((a, b) => a + b);
//for each path from 0 to 9, get the amount of possible 9s. add them all up
var part2 = paths.map(x => x[2].length).reduce((a, b) => a + b);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);