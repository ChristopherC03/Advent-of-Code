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

//parse input
var path = input.shift().split("").map(x => ["L", "R"].indexOf(x));
input.shift();
var network = {}; //AAA: [BBB, CCC]
while (input.length > 0) {
  let cur = input.shift().match(/\w+/g);
  network[cur[0]] = [cur[1], cur[2]];
}

//for each "__A" node, find time spent finding a "__Z" node
var nodes = Object.keys(network).filter(x => x[2] == "A");
var firstZs = [];
var part1;
while (nodes.length > 0) {
  let pathWalked = 0;
  let node = nodes.shift();
  part1 = (node == "AAA");
  while (node[2] != "Z") {
    node = network[node][path[pathWalked % path.length]];
    pathWalked++;
  }
  firstZs.push(pathWalked);
  if (part1) { part1 = pathWalked; }
}

//use the euclidean algorithm to derive greatest common divisor
function gcd(a, b) {
  if (b == 0) { return a; }
  return gcd(b, a % b);
}

//derive least common multiple utilizing greatest common divisor
console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", firstZs.reduce((a, b) => (a * b) / gcd(a, b)));
