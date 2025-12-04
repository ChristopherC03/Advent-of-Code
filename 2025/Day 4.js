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

input = input.map(n => n.split(''));
let next = simStep();
let part1 = next;
let part2 = next;
while (next > 0) {
  next = simStep();
  part2 += next;
}

function simStep() {
  let total = 0;
  let nextGrid = [];
  for (let y = 0; y < input.length; y++) {
    let row = [];
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '.') {
        row.push('.');
        continue;
      }

      let adjacent = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          if (input[y + dy]?.[x + dx] === '@') adjacent++;
        }
      }

      if (adjacent < 4) {
        total++;
        row.push('.');
      } else {
        row.push('@');
      }
    }
    nextGrid.push(row);
  }
  input = nextGrid;
  return total;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);