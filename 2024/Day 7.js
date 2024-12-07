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

//extract only the numbers from the input
input = input.map(x => x.split(' ').map((y, idx) => idx == 0 ? Number(y.slice(0, -1)) : Number(y)));

function check(equation, concat) {
  let first = equation.shift();
  let second = equation.shift();
  let operators = [first + second, first * second];
  if (concat) {
    //"concat" is a bool, used when checking for part2, to add the concat operator
    operators.push(Number(first + "" + second));
  }
  if (equation.length == 0) {
    //bottom level of recurse
    return operators;
  }

  let possible = [];
  while (operators.length > 0) {
    //recurse with each of the possible operators
    let cur = operators.shift();
    possible.push(...check([cur, ...equation], concat));
  }
  return possible;
}

var part1 = [];
var part2 = [];
while (input.length > 0) {
  let cur = input.shift();
  let expected = cur.shift();
  //check if the expected value is in all possible operation combinations, by recursing
  if (check([...cur], false).includes(expected)) {
    part1.push(expected);
    part2.push(expected);
  //if it wasn't, try again with the concatination operator
  } else if (check(cur, true).includes(expected)) {
    part2.push(expected);
  }
}
//sum all found test values
part1 = part1.reduce((a, b) => a + b);
part2 = part2.reduce((a, b) => a + b);

//program execution time ~5 seconds
console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);