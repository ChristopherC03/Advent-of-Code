//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file "cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.trim().split("\r\n");
} catch (err) {
  console.error(err);
}

input = input.map(x => x.split(""));
var max = 0;
for (let a = 0; a < input.length; a++) {
  max = Math.max(max, checkEnergized([a, 0, 0, 1]));
  max = Math.max(max, checkEnergized([a, input[0].length - 1, 0, -1]));
}
for (let a = 0; a < input[0].length; a++) {
  max = Math.max(max, checkEnergized([0, a, 1, 0]));
  max = Math.max(max, checkEnergized([input.length - 1, a, -1, 0]));
}

function checkEnergized(init) {
  var beams = [init]; //[y, x, dy, dx]
  var energized = input.map(x => x.map(y => false));
  var visited = {};

  while (beams.length > 0) {
    let [y, x, dy, dx] = beams.shift();
    let char = (input[y] ?? [])[x];
    if (visited[y + "," + x + "," + dy + "," + dx] || char == undefined) {
      continue;
    }
    visited[y + "," + x + "," + dy + "," + dx] = true;
    (energized[y] ?? [])[x] = true;
    switch (char) {
      case "/":
        //[5, 5, 1, 0] -> [5, 4, 0, -1]
        //[5, 5, 0, 1] -> [4, 5, -1, 0]
        //[5, 5, -1, 0] -> [5, 6, 0, 1]
        //[5, 5, 0, -1] -> [6, 5, 1, 0]
        beams.push([y - dx, x - dy, -dx, -dy]);
        break;
      case "\\":
        //[5, 5, 1, 0] -> [5, 6, 0, 1]
        //[5, 5, 0, 1] -> [6, 5, 1, 0]
        //[5, 5, -1, 0] -> [5, 4, 0, -1]
        //[5, 5, 0, -1] -> [4, 5, -1, 0]
        beams.push([y + dx, x + dy, dx, dy]);
        break;
      case "|":
        //[5, 5, 1, 0] -> [6, 5, 1, 0]
        //[5, 5, 0, 1] -> [6, 5, 1, 0], [4, 5, -1, 0]
        //[5, 5, -1, 0] -> [4, 5, -1, 0]
        //[5, 5, 0, -1] -> [6, 5, 1, 0], [4, 5, -1, 0]
        if (dx != 0) {
          beams.push([y + 1, x, 1, 0]);
          beams.push([y - 1, x, -1, 0]);
        } else {
          beams.push([y + dy, x + dx, dy, dx]);
        }
        break;
      case "-":
        //[5, 5, 1, 0] -> [5, 6, 1, 0], [5, 4, -1, 0]
        //[5, 5, 0, 1] -> [5, 6, 0, 1]
        //[5, 5, -1, 0] -> [5, 6, 1, 0], [5, 4, -1, 0]
        //[5, 5, 0, -1] -> [5, 4, 0, -1]
        if (dy != 0) {
          beams.push([y, x + 1, 0, 1]);
          beams.push([y, x - 1, 0, -1]);
        } else {
          beams.push([y + dy, x + dx, dy, dx]);
        }
        break;
      case ".":
        beams.push([y + dy, x + dx, dy, dx]);
        break;
    }
  }
  
  return energized.reduce((a, b) => a + b.reduce((c, d) => c + (d ? 1 : 0), 0), 0);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", checkEnergized([0, 0, 0, 1]));
console.log("Part 2:", max);