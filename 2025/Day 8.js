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
for (let b1 = 0; b1 < input.length; b1++) {
  for (let b2 = b1 + 1; b2 < input.length; b2++) {
    let dist = Math.sqrt(input[b1].reduce((a, b, idx) => a + Math.pow(b - input[b2][idx], 2), 0));
    dists.push([dist, b1, b2]);
  }
}
dists.sort((a, b) => a[0] - b[0]);

let circuits = [];
let i = 0;
let part1;
while ((circuits[0] ?? []).length < input.length) {
  let [_, b1, b2] = dists[i++];
  let idx1 = circuits.findIndex(n => n.includes(b1));
  let idx2 = circuits.findIndex(n => n.includes(b2));
  
  if (idx1 === -1 && idx2 === -1) {
    circuits.push([b1, b2]);
  } else if (idx1 === -1) {
    circuits[idx2].push(b1);
  } else if (idx2 === -1) {
    circuits[idx1].push(b2);
  } else if (idx1 !== idx2) {
    circuits[idx1].push(...circuits[idx2]);
    circuits.splice(idx2, 1);
  }

  if (i === 1000) {
    circuits.sort((a, b) => b.length - a.length);
    part1 = circuits.slice(0, 3).reduce((a, b) => a * b.length, 1);
  }
}
let [_, b1, b2] = dists[i - 1];
let part2 = input[b1][0] * input[b2][0];

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);