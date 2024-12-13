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

let info = [[]];
while (input.length > 0) {
  //extracts the digits from each line, for each machine
  let cur = input.shift();
  if (cur == "") {
    info.push([]);
  } else {
    info[info.length - 1].push(cur.match(/\d+/g).map(x => Number(x)));
  }
}

function solveSystem(x1, y1, x2, y2, x3, y3, part2) {
  //(x1)n + (x2)m = x3
  //(y1)n + (y2)m = y3
  //multiply top equation by y1, and bottom by x1
  //(x1 * y1)n + (x2 * y1)m = (x3 * y1)
  //(y1 * x1)n + (y2 * x1)m = (y3 * x1)
  //subtract the bottom from the top, n's coefficients get cancelled out
  //divide m's coefficient from the total result to get value of m
  //use m's value to get the value of n
  let m = ((x3 * y1) - (y3 * x1)) / ((x2 * y1) - (y2 * x1));
  let n = (x3 - (x2 * m)) / x1;
  if (Number.isInteger(m) && Number.isInteger(n) && (part2 || (n < 100 && m < 100))) {
    return (n * 3) + m;
  }
  return 0;
}

var part1 = 0;
var part2 = 0;
while (info.length > 0) {
  let [[x1, y1], [x2, y2], [x3, y3]] = info.shift();
  part1 += solveSystem(x1, y1, x2, y2, x3, y3, false);
  part2 += solveSystem(x1, y1, x2, y2, x3 + 10000000000000, y3 + 10000000000000, true);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);