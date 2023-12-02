//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.trim().split("\r\n");
} catch (err) {
  console.error(err);
}

for (var a = 0; a < input.length; a++) {
  input[a] = input[a].slice(input[a].indexOf(":") + 2);
  input[a] = input[a].split(";").join(",").split(", ");
  input[a] = input[a].map(x => x.split(" ")).map(x => [Number(x[0]), x[1]]);
  var totals = [0, 0, 0];
  input[a].map(x => {
    var index = ["red", "green", "blue"].indexOf(x[1]);
    totals[index] = Math.max(totals[index], x[0]);
  });
  input[a] = totals;
}

var part1 = input.map(x => x.some((y, idx) => y > [12, 13, 14][idx]));
part1 = part1.reduce((a, b, idx) => a + (b ? 0 : idx + 1), 0);
var part2 = input.map(x => x.reduce((a, b) => a * b));
part2 = part2.reduce((a, b) => a + b);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);