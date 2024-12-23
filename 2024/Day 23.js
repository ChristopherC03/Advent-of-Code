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

let graph = {};
while (input.length > 0) {
  let [cpu1, cpu2] = input.shift().split("-");
  graph[cpu1] = graph[cpu1] ?? [];
  graph[cpu1].push(cpu2);
  graph[cpu2] = graph[cpu2] ?? [];
  graph[cpu2].push(cpu1);
}

function BronKerbosch(R, P, X) {
  if (P.length == 0 && X.length == 0) {
    cliques.push(R);
    return;
  }
  while (P.length > 0) {
    let vertex = P.shift();
    BronKerbosch([...R, vertex], P.filter(x => graph[vertex].includes(x)), X.filter(x => graph[vertex].includes(x)));
    X.push(vertex);
  }
}

let triplets = [];
for (let cpu1 in graph) {
  let con = graph[cpu1];
  for (let a = 0; a < con.length; a++) {
    let cpu2 = con[a];
    for (let b = a + 1; b < con.length; b++) {
      let cpu3 = con[b];
      let triplet = [cpu1, cpu2, cpu3];
      if (graph[cpu2].includes(cpu3) && triplet.some(x => x[0] == 't') && !triplets.some(x => x.every(y => triplet.includes(y)))) {
        triplets.push(triplet);
      }
    }
  }
}
let part1 = triplets.length;

let cliques = [];
BronKerbosch([], Object.keys(graph), []);
let part2 = cliques.sort((a, b) => b.length - a.length)[0].sort().join(",");

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);