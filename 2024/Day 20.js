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

input = input.map(x => x.split(''));
var start = []; //[y, x];
var end = []; //[y, x];
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] == "S") {
      start = [y, x];
      input[y][x] = ".";
    } else if (input[y][x] == "E") {
      end = [y, x];
      input[y][x] = ".";
    }
  }
}

//since there's only one path, just continue to walk to the next space
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //N, E, S, W
var d = 0; //current direction
var graph = [[...start]]; //list of all nodes encountered
var node = [...start]; //current location
while (!node.every((n, idx) => n == end[idx])) { //stop when at the end
  let [y, x] = node;
  let [dy, dx] = dirs[d];
  if (input[y + dy][x + dx] == ".") {
    node = [y + dy, x + dx];
    graph.push(node);
    d += 2; //ensures we don't try the exact opposite of the direction we took to get here
  }
  d = (d + 1) % 4; //check next direction
}

//compare each entry in graph to every entry in front of it
//the manhattan distance between the two is how much cheat time would be required to walk there
//the distance saved is the difference between the distances originally, but removing the manhattan steps taken to get there
var part1 = 0;
var part2 = 0;
for (let a = 0; a < graph.length; a++) {
  let [y1, x1] = graph[a];
  for (let b = a + 1; b < graph.length; b++) {
    let [y2, x2] = graph[b];
    let saved = b - a;
    let manhattan = Math.abs(y2 - y1) + Math.abs(x2 - x1);
    if (manhattan <= 20 && saved - manhattan >= 100) {
      part2++;
    }
    if (manhattan <= 2 && saved - manhattan >= 100) {
      part1++;
    }
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);