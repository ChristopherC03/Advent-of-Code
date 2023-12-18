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

input = input.map(x => x.split(" "));

//part 2
var part1 = [];
var part2 = [];
for (let a = 0; a < input.length; a++) {
  part1.push([input[a][0], Number(input[a][1])]);
  let hex = input[a][2].slice(2, -1);
  let dir = ["R", "D", "L", "U"][Number(hex.slice(-1))];
  let steps = parseInt(hex.slice(0, -1), 16);
  part2.push([dir, steps]);
}

function findArea(directions) {
  var vertices = [[0, 0]]; //x, y
  var length = 0;
  for (let a = 0; a < directions.length; a++) {
    let [dir, steps] = directions[a];
    dir = [[0, -1], [1, 0], [0, 1], [-1, 0]][["U", "R", "D", "L"].indexOf(dir)];
    let cur = [...vertices[vertices.length - 1]];
    length += steps;
    cur[0] += dir[0] * steps;
    cur[1] += dir[1] * steps;
    vertices.push(cur);
  }

  //shoestring formula
  let x = 0;
  let y = 0;
  for (let a = 1; a < vertices.length; a++) {
    x += (vertices[a - 1][0] * vertices[a][1]);
    y += (vertices[a - 1][1] * vertices[a][0]);
  }
  //pick's theorem
  return ((Math.abs(x - y) + length + 2) / 2);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", findArea(part1));
console.log("Part 2:", findArea(part2));