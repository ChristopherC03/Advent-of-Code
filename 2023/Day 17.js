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

function findDistance(consecinfo) {
  distances = {}; //y,x,dy,dx,consec: dist
  visited = {}; //y,x,dy,dx,consec: true
  distances["0,0,0,1,0"] = 0;
  distances["0,0,1,0,0"] = 0;
  queue = [[0, "0,0,0,1,0"], [0, "0,0,1,0,0"]]; //sorted [dist, key]

  // let debug = 0;
  while (queue.length > 0) {
    let [dist, key] = queue.shift();
    let [y, x, dy, dx, consec] = key.split(",").map(x => Number(x));
    let turny, turnx;
    if (visited[key] == true) {
      continue;
    }
    visited[key] = true;

    // if (dist % 100 == 0 && dist > debug) {
    //   debug = dist;
    //   console.log(debug);
    // }

    //straight
    if (consec < consecinfo[0]) {
      updateDistances(dist, y, x, dy, dx, consec, true);
    }

    //left turn
    [turny, turnx] = [-dx, -dy];
    if (consec > consecinfo[1]) {
      updateDistances(dist, y, x, turny, turnx, consec);
    }

    //right turn
    [turny, turnx] = [dx, dy];
    if (consec > consecinfo[2]) {
      updateDistances(dist, y, x, turny, turnx, consec);
    }
  }

  return distances;
}

function updateDistances(dist, y, x, dy, dx, consec, straight = false) {
  let nextkey = (y + dy) + "," + (x + dx) + "," + dy + "," + dx + ",";
  if (straight) {
    nextkey += (consec + 1);
  } else {
    nextkey += "1";
  }

  if (visited[nextkey] != true && (input[y + dy] ?? [])[x + dx] != undefined) {
    //declare default value, if necessary
    distances[nextkey] = distances[nextkey] ?? Infinity;
    //mark as shorter distance, if necessary
    let nextdist = dist + input[y + dy][x + dx];
    distances[nextkey] = Math.min(distances[nextkey], nextdist);
    //add to queue
    queue.splice(indexSorted(queue, nextdist), 0, [nextdist, nextkey]);
  }
}

function indexSorted(arr, val) {
  var low = 0;
  var high = arr.length;
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (arr[mid][0] < val) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

input = input.map(x => x.split("").map(y => Number(y)));
var distances, visited, queue;

var part1 = Object.entries(findDistance([3, 0, 0]))
.map(x => [...x[0].split(",").map(y => Number(y)), x[1]])
.filter(x => x[0] == input.length - 1 && x[1] == input[0].length - 1)[0][5];

var part2 = Object.entries(findDistance([10, 3, 3]))
.map(x => [...x[0].split(",").map(y => Number(y)), x[1]])
.filter(x => x[0] == input.length - 1 && x[1] == input[0].length - 1 && x[4] > 3)[0][5];

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);