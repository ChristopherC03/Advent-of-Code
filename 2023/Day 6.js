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

var part1 = input.map(x => x.match(/\d+/g).map(y => Number(y)));
var part2 = input.map(x => Number(x.match(/\d+/g).join("")));

var output = [];
for (var a = 0; a < part1[0].length; a++) {
  output.push(solveQuadratic(part1[0][a], part1[1][a]));
}

//uses the quadratic formula to get the lower and upper integer roots where
//the boat will surpass the record distance in the given timeframe.
//the quantity of possible solves is equal to the quantity of integers between the roots (inclusive).
function solveQuadratic(time, dist) {
  let quadratic = [time / 2, Math.sqrt(Math.pow(time, 2) - (4 * dist)) / 2];
  quadratic = [Math.floor((quadratic[0] - quadratic[1]) + 1), Math.ceil((quadratic[0] + quadratic[1]) - 1)];
  return ((quadratic[1] - quadratic[0]) + 1);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", output.reduce((a, b) => a * b));
console.log("Part 2:", solveQuadratic(part2[0], part2[1]));
