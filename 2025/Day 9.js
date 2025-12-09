//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('./cur input.txt', 'utf8');
  var input = data.split("\r\n");
} catch (err) {
  console.error(err);
}

input = input.map(n => n.split(',').map(m => Number(m)));
let dists = [];
for (let c1 = 0; c1 < input.length; c1++) {
  for (let c2 = c1 + 1; c2 < input.length; c2++) {
    let dist = input[c1].reduce((a, b, idx) => a * (Math.abs(b - input[c2][idx]) + 1), 1);
    dists.push([dist, c1, c2]);
  }
}
dists.sort((a, b) => b[0] - a[0]);
let part1 = dists[0][0];

let part2;
for (let i = 0; i < dists.length; i++) {
  let [dist, c1, c2] = dists[i];
  let [x1, y1] = input[c1];
  let [x2, y2] = input[c2];
  let rect = [Math.min(x1, x2) + 1, Math.min(y1, y2) + 1, Math.max(x1, x2) - 1, Math.max(y1, y2) - 1];
  let valid = true;
  for (let l = 1; l <= input.length; l++) {
    let [x3, y3] = input[l - 1];
    let [x4, y4] = input[l % input.length];
    let line = [Math.min(x3, x4), Math.min(y3, y4), Math.max(x3, x4), Math.max(y3, y4)];
    if (rect[0] <= line[2] && line[0] <= rect[2] && rect[1] <= line[3] && line[1] <= rect[3]) {
      valid = false;
      break;
    }
  }

  if (valid) {
    part2 = dist;
    break;
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);