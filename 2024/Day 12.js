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

var visited = input.map(x => x.map(y => false));
var dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //N, E, S, W
var part1 = 0;
var part2 = 0;
for (let y = 0; y < visited.length; y++) {
  for (let x = 0; x < visited[y].length; x++) {
    if (!visited[y][x]) {
      let result = floodFill(y, x);
      part1 += result[0];
      part2 += result[1];
    }
  }
}

function floodFill(startY, startX) {
  let type = input[startY][startX];
  let queue = [[startY, startX]];
  visited[startY][startX] = true;
  let area = 0;
  let perimeter = 0;
  let sides = 0;
  while (queue.length > 0) {
    let [y, x] = queue.pop();
    let adjacents = [];
    for (let a = 0; a < dirs.length; a++) {
      let [dy, dx] = dirs[a];
      let yy = y + dy;
      let xx = x + dx;
      let adjacent = input[yy]?.[xx] == type;
      adjacents.push(adjacent);

      if (!adjacent) {
        perimeter++;
      } else if (!(visited[yy]?.[xx] ?? true)) {
        queue.push([yy, xx]);
        visited[yy][xx] = true;
      }
    }

    //adds north sides, checked by rightmost letter
    if (!adjacents[0] && (!adjacents[1] || input[y - 1]?.[x + 1] == type)) {
      sides++;
    }
    //adds east sides, checked by topmost letter
    if (!adjacents[1] && (!adjacents[0] || input[y - 1]?.[x + 1] == type)) {
      sides++;
    }
    //adds south sides, checked by leftmost letter
    if (!adjacents[2] && (!adjacents[3] || input[y + 1]?.[x - 1] == type)) {
      sides++;
    }
    //adds west sides, checked by bottommost letter
    if (!adjacents[3] && (!adjacents[2] || input[y + 1]?.[x - 1] == type)) {
      sides++;
    }
    
    area++;
  }

  return [area * perimeter, area * sides];
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);