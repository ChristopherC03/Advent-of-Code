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

let numberRows = input.slice(0, -1);
let operations = input.slice(-1)[0].split(' ').filter(n => n !== '');

let rows = numberRows.map(n => n.split(' ').filter(m => m !== '').map(m => Number(m)));
rows = rows[0].map((_, idx) => rows.map(n => n[idx]));
let cols = [[]];
for (let i = 0; i < numberRows[0].length; i++) {
  let col = numberRows.map(n => n[i]);
  if (col.every(n => n === ' ')) {
    cols.push([]);
  } else {
    cols[cols.length - 1].push(Number(col.join('')));
  }
}

let part1 = 0;
let part2 = 0;
for (let o = 0; o < operations.length; o++) {
  let op = operations[o];
  if (op === '+') {
    part1 += rows[o].reduce((a, b) => a + b);
    part2 += cols[o].reduce((a, b) => a + b);
  } else if (op === '*') {
    part1 += rows[o].reduce((a, b) => a * b);
    part2 += cols[o].reduce((a, b) => a * b);
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);