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

function mapPad(pad) {
  //gives a map; for each key in a pad, store all possible (valid) paths to each other key in the pad
  let entries = pad.map((y, idxy) => y.map((x, idxx) => [x, [idxy, idxx]])).flat();
  let empty = entries.find(x => x[0] == ' ')[1];
  let map = {};
  for (let a = 0; a < entries.length; a++) {
    let [k1, v1] = entries[a];
    let [ey, ex] = v1.map((x, idx) => empty[idx] - x);
    map[k1] = {};
    for (let b = 0; b < entries.length; b++) {
      let [k2, v2] = entries[b];
      let [dy, dx] = v1.map((x, idx) => v2[idx] - x);
      let combos = combinations([Math.abs(dy), Math.abs(dx)]);

      //at least one combo will walk into the blank area
      if (
        (ex == 0 || Math.sign(dx) == Math.sign(ex)) && Math.abs(dx) >= Math.abs(ex) &&
        (ey == 0 || Math.sign(dy) == Math.sign(ey)) && Math.abs(dy) >= Math.abs(ey)
      ) {
        //filters all combos by checking only the first few moves that are required to walk into the blank area,
        //and ensuring there aren't exactly as many ys and xs in that window that would lead the path there
        combos = combos.filter(n => n.slice(0, Math.abs(ey) + Math.abs(ex)).split('y').length - 1 != Math.abs(ey));
      }
      //turns all combos from "yyxx" into "^^>>" (with appropriate direction), and adds the "A" at the end
      combos = combos.map(n => n.split('').map(m => m == "y" ? (dy < 0 ? "^" : "v") : (dx < 0 ? "<" : ">")).join('') + "A");
      map[k1][k2] = combos;
    }
  }
  return map;
}

function recurseRobot(code, robotDepth, map) {
  if (lengths[code]?.[robotDepth] === undefined) {
    lengths[code] = lengths[code] ?? [];
    let pairs = getPairs("A" + code);
    if (robotDepth == 0) {
      //base case; sum of all pairs
      lengths[code][robotDepth] = pairs.map(x => map[x[0]][x[1]][0].length).reduce((a, b) => a + b);
    } else {
      //recurse; sum of (best of any possible next path from each pair)
      lengths[code][robotDepth] = pairs.map(x => Math.min(...nextSteps(x, map).map(y => recurseRobot(y, robotDepth - 1, dirMap)))).reduce((a, b) => a + b);
    }
  }
  
  return lengths[code][robotDepth];
}

function getPairs(code) {
  code = code.split('');
  return code.slice(0, -1).map((x, idx) => x + (code[idx + 1]));
}

function nextSteps(code, map) {
  //returns all possible ways the given code can be written by the next robot
  let pairs = getPairs(code);
  let possible = [""];
  while (pairs.length > 0) {
    let [char1, char2] = pairs.shift();
    let nextPossible = [];
    let steps = map[char1][char2];
    for (a = 0; a < steps.length; a++) {
      nextPossible.push(...possible.map(x => x + steps[a]));
    }
    possible = nextPossible;
  }
  return possible;
}

function combinations(items) {
  //returns all combinations of requested "y" and "x" quantities
  let [y, x] = items;
  if (y == 0 || x == 0) {
    return ["y".repeat(y) + "x".repeat(x)];
  }
  
  let combos = [];
  for (let a = 0; a <= x; a++) {
    combos.push(...combinations([y - 1, x - a]).map(n => "x".repeat(a) + "y" + n));
  }
  return combos;
}

let numpad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [' ', '0', 'A']
];

let dirpad = [
  [' ', '^', 'A'],
  ['<', 'v', '>']
];

let numMap = mapPad(numpad);
let dirMap = mapPad(dirpad);
let lengths = {}; //memoization for the recurse

let part1 = 0;
let part2 = 0;
while (input.length > 0) {
  let code = input.shift();
  let numeric = Number(code.slice(0, -1));
  part1 += numeric * recurseRobot(code, 2, numMap);
  part2 += numeric * recurseRobot(code, 25, numMap);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);