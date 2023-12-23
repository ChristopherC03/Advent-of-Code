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

//finds the longest distance for a given map
function solve(map) {
  //find all the branching paths and record
  var graph = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == "#") {
        continue;
      }
  
      let available = 0;
      if (((map[y - 1] ?? [])[x] ?? "#") != "#") { available++; }
      if ((map[y][x + 1] ?? "#") != "#") { available++; }
      if (((map[y + 1] ?? [])[x] ?? "#") != "#") { available++; }
      if ((map[y][x - 1] ?? "#") != "#") { available++; }
      if (available > 2) {
        graph[y + "," + x] = {};
      }
    }
  }
  var startkey = "0,1";
  var endkey = (map.length - 1) + "," + (map[0].length - 2);
  graph[startkey] = {};
  graph[endkey] = {};
  
  //for each element in the graph, perform a floodfill to find the distances to other nodes
  let decisions = Object.keys(graph).map(x => x.split(",").map(y => Number(y)));
  while (decisions.length > 0) {
    let start = decisions.shift();
    let pkey = start.join(",");
    let queue = [[...start, 1]];
    let visited = [];
    while (queue.length > 0) {
      let [y, x, dist] = queue.shift();
      let key = y + "," + x;
      let next = move(map, y, x);
      while (next.length > 0) {
        let [ny, nx] = next.shift();
        let nkey = ny + "," + nx;
        if (!visited.includes(nkey)) {
          if (graph[nkey] != undefined) {
            graph[pkey][nkey] = dist;
          } else {
            queue.push([ny, nx, dist + 1]);
          }
        }
      }
      visited.push(key);
    }
  }
  
  //recurse find all pathways through graph to find largest
  return recurseGraph(startkey, 0, [], graph, endkey);
}

//checks NESW for available moves
function move(map, y, x) {
  let available = [];

  //up
  if ((map[y - 1] ?? [])[x] == "." || (map[y - 1] ?? [])[x] == "^") {
    available.push([y - 1, x]);
  }

  //right
  if (map[y][x + 1] == "." || map[y][x + 1] == ">") {
    available.push([y, x + 1]);
  }

  //down
  if ((map[y + 1] ?? [])[x] == "." || (map[y + 1] ?? [])[x] == "v") {
    available.push([y + 1, x]);
  }

  //left
  if (map[y][x - 1] == "." || map[y][x - 1] == "<") {
    available.push([y, x - 1]);
  }

  return available;
}

//recurse find all pathways through graph to find largest
function recurseGraph(cur, dist, visited, graph, endkey) {
  if (cur == endkey) {
    return dist;
  }
  
  let options = Object.entries(graph[cur]);
  let max = 0;
  while (options.length > 0) {
    let [next, nextdist] = options.shift();
    if (!visited.includes(next)) {
      max = Math.max(max, recurseGraph(next, dist + nextdist, [...visited, cur], graph, endkey));
    }
  }
  return max;
}

//approx. execution time: 50 sec.
input = input.map(x => x.split(""));
var part1 = solve(input);
input = input.map(x => x.map(y => ["^", ">", "v", "<"].includes(y) ? "." : y));
var part2 = solve(input);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);