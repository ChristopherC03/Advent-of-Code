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

input = input.map(n => n.split('').map(m => Number(m)));

function solveBatteries(batteries) {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    let bank = input[i];
    let left = 0;
    let right = bank.length - batteries;
    let volts = "";
    for (let b = 0; b < batteries; b++) {
      let section = bank.slice(left, right + 1);
      let max = Math.max(...section);
      let idx = section.indexOf(max);
      volts += max;
      left += 1 + idx;
      right++;
    }
    total += Number(volts);
  }
  return total;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", solveBatteries(2));
console.log("Part 2:", solveBatteries(12));