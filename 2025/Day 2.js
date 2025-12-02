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

input = input[0].split(',').map(n => n.split('-').map(m => Number(m))).sort((a, b) => a[0] - b[0]);
let len = Math.ceil(Math.log10(input[input.length - 1][1]));
let part1 = new Set();
let part2 = new Set();
let val = 1;
while (Math.log10(val) < (len / 2)) {
  let rep = 2;
  while (rep < len) {
    let ID = Number(val.toString().repeat(rep));
    if (input.some(n => n[0] <= ID && ID <= n[1])) {
      if (rep === 2) part1.add(ID);
      part2.add(ID);
    }
    rep++;
  }
  val++;
}
part1 = [...part1].reduce((a, b) => a + b);
part2 = [...part2].reduce((a, b) => a + b);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);