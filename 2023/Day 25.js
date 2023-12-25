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

//parses input
var wires = {};
while (input.length > 0) {
  let cur = input.shift().split(" ");
  cur[0] = cur[0].slice(0, -1);
  wires[cur[0]] = wires[cur[0]] ?? new Set();
  for (let a = 1; a < cur.length; a++) {
    wires[cur[0]].add(cur[a]);
    wires[cur[a]] = wires[cur[a]] ?? new Set();
    wires[cur[a]].add(cur[0]);
  }
}

//wires as set -> wires as array
let keys = Object.keys(wires);
for (let a = 0; a < keys.length; a++) {
  wires[keys[a]] = [...wires[keys[a]]];
}

//if nine nodes make a loop, they're all considered part of the same group
var loops = new Set();
for (let a = 0; a < keys.length; a++) {
  findLoop(keys[a]);
}

//edit the line [ prevnodes.length == 8 ] for differing graph densities, if necessary
function findLoop(curnode, prevnodes = []) {
  if (prevnodes.length == 8) {
    if (wires[curnode].includes(prevnodes[0])) {
      loops.add([...prevnodes, curnode].sort().join(","));
    }
    return;
  }

  for (let a = 0; a < wires[curnode].length; a++) {
    let nextnode = wires[curnode][a];
    if (prevnodes.includes(nextnode)) {
      continue;
    }
    findLoop(nextnode, [...prevnodes, curnode]);
  }
}

//group the loops
var groups = [...loops].map(x => x.split(","));
do {
  groups = joinGroups(groups);
} while (groups.length > 2)

//combines input array if two elements have shared values 
function joinGroups(input) {
  let groups = [];
  while (input.length > 0) {
    let group = input.shift();
    let index = groups.findIndex(x => group.some(y => x.has(y)));
    if (index != -1) {
      group.forEach(x => groups[index].add(x));
    } else {
      groups.push(new Set(group));
    }
  }
  return groups.map(x => [...x]);
}

//approx. execution time: 15 sec.
console.log("----- OUTPUT -----");
console.log("Part 1:", groups[0].length * groups[1].length);
console.log("Part 2:", ":)");