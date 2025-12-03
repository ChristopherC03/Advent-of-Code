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

input = input.map(n => [n.slice(0, 1), Number(n.slice(1))]);
let dial = 50;
let part1 = 0;
let part2 = 0;
for (let i = 0; i < input.length; i++) {
  let [dir, dist] = input[i];
  part2 += Math.floor(dist / 100);
  if (dir === 'R') {
    if (dial + (dist % 100) >= 100) part2++;
    dial += dist;
  } else {
    if (dial !== 0 && dial <= (dist % 100)) part2++;
    dial -= dist;
  }
  dial = realMod(dial, 100);
  if (dial === 0) part1++;
}

function realMod(n, m) {
  return ((n % m) + m) % m;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);
