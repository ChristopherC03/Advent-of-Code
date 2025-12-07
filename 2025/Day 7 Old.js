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
let beams = [start];
let part1 = 0;
while (y < input.length) {
  let nextBeams = new Set();
  for (let i = 0; i < beams.length; i++) {
    let x = beams[i];
    if (input[y][x] === '^') {
      nextBeams.add(x - 1);
      nextBeams.add(x + 1);
      part1++;
    } else {
      nextBeams.add(x);
    }
  }
  beams = [...nextBeams];
  y++;
}

let memoization = {};
let part2 = recurse(start, 1);
function recurse(x, y) {
  let state = `${x},${y}`;
  if (memoization[state] !== undefined) {
    return memoization[state];
  }

  if (y >= input.length) {
    memoization[state] = 1;
    return 1;
  }

  let timelines = 0;
  if (input[y][x] === '^') {
    timelines += recurse(x - 1, y + 1);
    timelines += recurse(x + 1, y + 1);
  } else {
    timelines += recurse(x, y + 1);
  }

  memoization[state] = timelines;
  return timelines;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);

console.log("Part 2:", part2);
