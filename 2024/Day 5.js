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

var stage = true; //for knowing if we're in the rules or updates section of the input
var rules = {}; //rules[n] returns an array of the numbers n must come before
var updates = []; //[[1, 2, 3], [4, 5, 6], ...]
while (input.length > 0) {
  let cur = input.shift();
  if (cur == "") {
    //double linebreak was here, switch stage from rules to updates
    stage = false;
    continue;
  }

  if (stage) {
    let rule = cur.split("|").map(x => Number(x));
    rules[rule[0]] = rules[rule[0]] ?? [];  //hacky way to create an empty array if currently undefined
    rules[rule[0]].push(rule[1]);
  } else {
    updates.push(cur.split(",").map(x => Number(x)));
  }
}

var part1 = 0;
var part2 = 0;
while (updates.length > 0) {
  let update = updates.shift();
  let before = update.join(",");
  update.sort((a, b) => (rules[b] ?? []).includes(a) ? 1 : -1);
  let after = update.join(",");

  let median = update[(update.length - 1) / 2];

  //need to check if the sort actually did anything, for part1 vs part2
  if (before == after) {
    part1 += median;
  } else {
    part2 += median;
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);