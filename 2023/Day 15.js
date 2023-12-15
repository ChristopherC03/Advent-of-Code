//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file "cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.trim();
} catch (err) {
  console.error(err);
}

input = input.split(",");
var part1 = 0;
for (var a = 0; a < input.length; a++) {
  part1 += hash(input[a]);
}

var boxes = Array(255).fill().map(x => []); //[[label, value], [label, value]], [box2], [box3], ...
for (var a = 0; a < input.length; a++) {
  if (input[a].includes("=")) {
    let [label, value] = input[a].split("=");
    let box = hash(label);
    if (boxes[box].some(x => x[0] == label)) {
      boxes[box][boxes[box].findIndex(x => x[0] == label)][1] = Number(value);
    } else {
      boxes[box].push([label, Number(value)]);
    }
  } else if (input[a].includes("-")) {
    let label = input[a].split("-")[0];
    let box = hash(label);
    if (boxes[box].some(x => x[0] == label)) {
      boxes[box].splice(boxes[box].findIndex(x => x[0] == label), 1);
    }
  }
}

var part2 = 0;
for (let a = 0; a < boxes.length; a++) {
  for (let b = 0; b < boxes[a].length; b++) {
    part2 += (a + 1) * (b + 1) * boxes[a][b][1];
  }
}

function hash(str) {
  let value = 0;
  for (let a = 0; a < str.length; a++) {
    value += str.charCodeAt(a);
    value *= 17;
    value %= 256;
  }
  return value;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);