//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data;
} catch (err) {
  console.error(err);
}

input = input.split(' ');
var map = {}; //map[0][2] is stone 0 after 2 steps

function recurseStep(stone, steps) {
  if (map[stone]?.[steps] === undefined) {
    map[stone] = map[stone] ?? [];
    if (steps == 1) {
      //base case
      map[stone][steps] = nextStep(stone).length;
    } else {
      //recurse
      map[stone][steps] = nextStep(stone).reduce((a, b) => a + recurseStep(b, steps - 1), 0);
    }
  }
  
  return map[stone][steps];
}

function nextStep(stone) {
  if (stone == "0") {
    return ["1"];
  } else if (stone.length % 2 == 0) {
    return [stone.slice(0, stone.length / 2), String(Number(stone.slice(stone.length / 2)))];
  } else {
    return [String(Number(stone) * 2024)];
  }
}

var part1 = input.reduce((a, b) => a + recurseStep(b, 25), 0);
var part2 = input.reduce((a, b) => a + recurseStep(b, 75), 0);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);
