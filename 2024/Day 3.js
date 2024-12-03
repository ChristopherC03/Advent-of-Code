//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data;
} catch (err) {
  console.error(err);
}

var part1 = 0;
var part2 = 0;
var enabled = true;
for (let a = 0; a < input.length; a++) {
  if (input.startsWith("do()", a)) {
    enabled = true;
    a += 3;
  } else if (input.startsWith("don't()", a)) {
    enabled = false;
    a += 6;
  } else if (input.startsWith("mul(", a)) {
    a += 4;
    let vals = ["", ""];

    //make sure the next characters are numbers
    while (!isNaN(input[a])) {
      vals[0] += input[a];
      a++;
    }

    //make sure there's a comma
    if (input[a] != ",") {
      continue;
    }
    a++;

    //make sure the next characters are also numbers
    while (!isNaN(input[a])) {
      vals[1] += input[a];
      a++;
    }

    //and ensure it's closed off with a parenthesis
    if (input[a] != ")") {
      continue;
    }

    let val = Number(vals[0]) * Number(vals[1]);
    if (enabled) {
      part2 += val;
    }
    part1 += val;
  }
}

//bonus! part1 one-liner with regex
//var part1 = input.match(/mul\(\d+,\d+\)/g).map(x => x.match(/\d+/g).reduce((a, b) => a * b)).flat().reduce((a, b) => a + Number(b), 0);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);