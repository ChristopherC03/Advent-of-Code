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

let map = {};
for (let i = 0; i < input.length; i++) {
  let [inWire, outWires] = input[i].split(': ');
  outWires = outWires.split(' ');
  map[inWire] = outWires;
}

let memoize = {};
let part1 = recurseTraverse("you", []);

memoize = {};
let part2 = recurseTraverse("svr", ["fft", "dac"]);

function recurseTraverse(loc, required) {
  let atRequired = required.indexOf(loc);
  if (atRequired !== -1) {
    required.splice(atRequired, 1);
  }

  if (loc === "out") {
    if (required.length === 0) {
      return 1;
    } else {
      return 0;
    }
  }

  let state = `${loc}|${required.join(',')}`;
  if (memoize[state] !== undefined) {
    return memoize[state];
  }

  let next = map[loc];
  let paths = 0;
  for (let i = 0; i < next.length; i++) {
    paths += recurseTraverse(next[i], [...required]);
  }

  memoize[state] = paths;
  return paths;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);