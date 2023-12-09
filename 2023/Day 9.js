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

input = input.map(x => x.match(/-?\d+/g).map(y => Number(y)));
var part1 = [];
var part2 = [];
for (let a = 0; a < input.length; a++) {
  let dx = []; //[first, last]
  let cur = input[a];
  do {
    dx.push([cur[0], cur[cur.length - 1]]);
    let prev = cur;
    cur = [];
    for (let b = 1; b < prev.length; b++) {
      cur.push(prev[b] - prev[b - 1]);
    }
  } while (cur.some(x => x != 0));

  part1.push(dx.reduce((a, b) => a + b[1], 0));
  //both these work, not sure which is faster
  part2.push(dx.reverse().reduce((a, b) => b[0] - a, 0));
  //part2.push(dx.reduce((a, b, idx) => a + (idx % 2 == 0 ? b[0] : -b[0]), 0));
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1.reduce((a, b) => a + b));
console.log("Part 2:", part2.reduce((a, b) => a + b));