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

//split by spaces, then convert the string values into numbers
input = input.map(x => x.split(' ').map(y => Number(y)));

var part1 = 0;
var part2 = 0;
while (input.length > 0) {
  let cur = input.shift();

  //if the current check is safe by default, both part1 and part2 are safe, move on to the next check
  if (isSafe(cur)) {
    part1++;
    part2++;
    continue;
  }

  //for each element, remove it and do a safeness check without it
  for (let a = 0; a < cur.length; a++) {
    let updated = cur.filter((_, idx) => idx != a);
    let safe = isSafe(updated);
    if (safe) {
      part2++;
      break;
    }
  }
}

function isSafe(check) {
  //the first two elements will be the baseline for increasing values or decreasing values
  let sign = Math.sign(check[1] - check[0]);
  if (sign == 0) {
    return false;
  }

  //for each element comparison, ensure the sign is correct, and that the value is between -3 and 3 (inclusive)
  //note that we exited the function earlier if the sign was 0, so if delta is 0, it will not be equal to the current sign
  for (let a = 1; a < check.length; a++) {
    let delta = check[a] - check[a - 1];
    if (Math.sign(delta) != sign || Math.abs(delta) > 3) {
      return false;
    }
  }
  return true;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);