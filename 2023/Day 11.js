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

//get coordinates of "#"s
var galaxies = []; //[y, x]
for (let a = 0; a < input.length; a++) {
  for (let b = 0; b < input[a].length; b++) {
    if (input[a][b] == "#") {
      galaxies.push([a, b]);
    }
  }
}

//find where the map needs to expand
var expand = [[], []]; //rows, columns
for (let a = 0; a < input.length; a++) {
  if (!input[a].some(x => x == "#")) {
    //expand this row
    expand[0].push(a);
  }
}
for (let a = 0; a < input[0].length; a++) {
  if (!input.some(x => x[a] == "#")) {
    //expand this column
    expand[1].push(a);
  }
}

//get pair lengths
var pairs = [0, 0]; //part 1, part 2
for (let a = 0; a < galaxies.length; a++) {
  for (let b = a + 1; b < galaxies.length; b++) {
    //sort coords for easier arithmatic
    let coords = [[Math.max(galaxies[a][0], galaxies[b][0]), Math.max(galaxies[a][1], galaxies[b][1])], [Math.min(galaxies[a][0], galaxies[b][0]), Math.min(galaxies[a][1], galaxies[b][1])]];
    let dist = (coords[0][0] - coords[1][0]) + (coords[0][1] - coords[1][1]);
    let expansion = expand[0].filter(x => coords[0][0] > x && x > coords[1][0]).length;
    expansion += expand[1].filter(x => coords[0][1] > x && x > coords[1][1]).length;
    pairs[0] += dist + expansion;
    pairs[1] += dist + (expansion * 999999);
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", pairs[0]);
console.log("Part 2:", pairs[1]);