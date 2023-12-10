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
var SLoc = input.findIndex(x => x.includes("S"));
SLoc = [SLoc, input[SLoc].indexOf("S")];
var loopMap = input.map(x => x.map(y => false));
var distances = input.map(x => x.map(y => -Infinity));
distances[SLoc[0]][SLoc[1]] = 0;
var searchQueue = [SLoc]; //[y, x]
var allowed = { //type, allowed to go [N, E, S, W]
  "|": [true, false, true, false],
  "-": [false, true, false, true],
  "L": [true, true, false, false],
  "J": [true, false, false, true],
  "7": [false, false, true, true],
  "F": [false, true, true, false],
  ".": [false, false, false, false],
  "S": [true, true, true, true]
};

//Part 1: Assemble the main loop in loopMap, as well as the distances to each pipe
while (searchQueue.length > 0) {
  let cur = searchQueue.shift();
  if (loopMap[cur[0]][cur[1]] === false) {
    let char = input[cur[0]][cur[1]];
    loopMap[cur[0]][cur[1]] = char;
    let dist = distances[cur[0]][cur[1]] + 1;
    let dir;

    //N
    dir = (input[cur[0] - 1] ?? [])[cur[1]];
    if (dir != undefined && allowed[char][0] && allowed[dir][2] && loopMap[cur[0] - 1][cur[1]] === false) {
      searchQueue.push([cur[0] - 1, cur[1]]);
      distances[cur[0] - 1][cur[1]] = dist;
    }

    //E
    dir = input[cur[0]][cur[1] + 1];
    if (dir != undefined && allowed[char][1] && allowed[dir][3] && loopMap[cur[0]][cur[1] + 1] === false) {
      searchQueue.push([cur[0], cur[1] + 1]);
      distances[cur[0]][cur[1] + 1] = dist;
    }

    //S
    dir = (input[cur[0] + 1] ?? [])[cur[1]];
    if (dir != undefined && allowed[char][2] && allowed[dir][0] && loopMap[cur[0] + 1][cur[1]] === false) {
      searchQueue.push([cur[0] + 1, cur[1]]);
      distances[cur[0] + 1][cur[1]] = dist;
    }

    //W
    dir = input[cur[0]][cur[1] - 1];
    if (dir != undefined && allowed[char][3] && allowed[dir][1] && loopMap[cur[0]][cur[1] - 1] === false) {
      searchQueue.push([cur[0], cur[1] - 1]);
      distances[cur[0]][cur[1] - 1] = dist;
    }
  }
}

//Part 2: Expand the map into 3x3 chunks, then do a floodfill to remove areas outside the loop
var expandedMap = [];
var expandTable = {
  "|": [".#.", ".#.", ".#."],
  "-": ["...", "###", "..."],
  "L": [".#.", ".##", "..."],
  "J": [".#.", "##.", "..."],
  "7": ["...", "##.", ".#."],
  "F": ["...", ".##", ".#."],
  false: ["...", ".!.", "..."],
  "S": [".#.", "###", ".#."]
};

for (let a = 0; a < loopMap.length; a++) {
  let expanded = ["", "", ""];
  for (let b = 0; b < loopMap[a].length; b++) {
    expandTable[loopMap[a][b]].map((x, idx) => expanded[idx] += x);
  }
  expandedMap.push(...expanded)
}
expandedMap = expandedMap.map(x => x.split(""));

var floodQueue = [[0, 0]]; //[y, x]
while (floodQueue.length > 0) {
  let cur = floodQueue.shift();
  if (expandedMap[cur[0]][cur[1]] != "#") {
    expandedMap[cur[0]][cur[1]] = "#";
    let char;
    
    //N
    char = (expandedMap[cur[0] - 1] ?? [])[cur[1]];
    if (char != undefined && char != "#") {
      floodQueue.push([cur[0] - 1, cur[1]]);
    }
    
    //E
    char = expandedMap[cur[0]][cur[1] + 1];
    if (char != undefined && char != "#") {
      floodQueue.push([cur[0], cur[1] + 1]);
    }
    
    //S
    char = (expandedMap[cur[0] + 1] ?? [])[cur[1]];
    if (char != undefined && char != "#") {
      floodQueue.push([cur[0] + 1, cur[1]]);
    }
    
    //W
    char = expandedMap[cur[0]][cur[1] - 1];
    if (char != undefined && char != "#") {
      floodQueue.push([cur[0], cur[1] - 1]);
    }
  }
}

//part 1 finds max distance, part 2 finds all remaining !s
console.log("----- OUTPUT -----");
console.log("Part 1:", distances.reduce((a, b) => Math.max(a, b.reduce((c, d) => Math.max(c, d))), -Infinity));
console.log("Part 2:", expandedMap.reduce((a, b) => a + b.reduce((c, d) => c + (d == "!" ? 1 : 0), 0), 0));