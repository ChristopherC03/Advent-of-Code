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

let divider = input.indexOf('');
let ranges = input.slice(0, divider).map(n => n.split('-').map(m => Number(m)));
let ingredients = input.slice(divider + 1).map(n => Number(n));

ranges.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < ranges.length; i++) {
  let prev = ranges[i - 1];
  let cur = ranges[i];
  if (prev[1] >= cur[0]) {
    ranges[i - 1][1] = Math.max(prev[1], cur[1]);
    ranges.splice(i, 1);
    i--;
  }
}
let part2 = ranges.reduce((a, b) => a + (b[1] - b[0]) + 1, 0);

let part1 = 0;
for (let i = 0; i < ingredients.length; i++) {
  let ingredient = ingredients[i];
  if (ranges.some(n => n[0] <= ingredient && ingredient <= n[1])) part1++;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);