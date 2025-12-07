//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('./cur input.txt', 'utf8');
  var input = data.split("\r\n");
} catch (err) {
  console.error(err);
}

input = input.map(n => n.split(''));
let start = input[0].indexOf('S');
let y = 1;
let beams = [[start, 1]]; //x, num uniq paths
let part1 = 0;
while (y < input.length) {
  let nextBeams = {}; //x: num uniq paths
  for (let i = 0; i < beams.length; i++) {
    let [x, paths] = beams[i];
    if (input[y][x] === '^') {
      nextBeams[x - 1] = (nextBeams[x - 1] ?? 0) + paths;
      nextBeams[x + 1] = (nextBeams[x + 1] ?? 0) + paths;
      part1++;
    } else {
      nextBeams[x] = (nextBeams[x] ?? 0) + paths;
    }
  }
  beams = Object.entries(nextBeams).map(n => [Number(n[0]), n[1]]);
  y++;
}
let part2 = beams.reduce((a, b) => a + b[1], 0);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);