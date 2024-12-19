//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.split("\r\n");
} catch (err) {
  console.error(err);
}

let towels = input.shift().split(", ");
input.shift();
let patterns = [...input];

let possible = {'': 1}; //possible combinations for every encountered sub-pattern
let part1 = 0;
let part2 = 0;
while (patterns.length > 0) {
  let total = matchRecurse(patterns.shift());
  if (total > 0) {
    part1++;
    part2 += total;
  }
}

function matchRecurse(pattern) {
  if (possible[pattern] === undefined) {
    let subPossible = 0;
    for (let a = 0; a < towels.length; a++) {
      if (pattern.startsWith(towels[a])) {
        let nextPattern = pattern.slice(towels[a].length);
        subPossible += matchRecurse(nextPattern);
      }
    }
    possible[pattern] = subPossible;
  }

  return possible[pattern];
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);