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

function findHistory(starty, startx) {
  let history = [];
  let perimeter = input.map(x => x.map(y => false));
  perimeter[starty][startx] = true;
  do {
    let nextHistory = perimeter.map(x => x.join(",")).join("\n");
    if (history.includes(nextHistory)) {
      return history.map(x => countSteps(x.split("\n").map(y => y.split(","))));
    }
    history.push(nextHistory);
    perimeter = iterateSteps(perimeter);
  } while (true)
}

function iterateSteps(possible) {
  let next = [];
  for (let y = 0; y < possible.length; y++) {
    next.push([]);
    for (let x = 0; x < possible[y].length; x++) {
      let step = (possible[y - 1] ?? [])[x] ?? false;
      step = step || (possible[y][x + 1] ?? false);
      step = step || ((possible[y + 1] ?? [])[x] ?? false);
      step = step || (possible[y][x - 1] ?? false);
      step = step && input[y][x] == ".";
      next[next.length - 1].push(step);
    }
  }
  return next;
}

function countSteps(arr) {
  let steps = 0;
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      steps += (arr[y][x] == "true") ? 1 : 0;
    }
  }
  return steps;
}

input = input.map(x => x.split(""));
var start = input.findIndex(x => x.includes("S"));
start = [start, input[start].indexOf("S")]; //y, x
input[start[0]][start[1]] = ".";
var size = input.length;

//gets the cycle lengths for the possible entry points to a grid
var perimeters = [
  findHistory(0, 0),
  findHistory(0, start[1]),
  findHistory(0, input[0].length - 1),
  findHistory(start[0], 0),
  findHistory(start[0], start[1]),
  findHistory(start[0], input[0].length - 1),
  findHistory(input.length - 1, 0),
  findHistory(input.length - 1, start[1]),
  findHistory(input.length - 1, input[0].length - 1)
];

//solves the quantity of available locations by utilizing patterns made in the input
//this won't work for the example, because it's important that the starting spot has
//a straight path up, right, down, and left, which the example does not have (but all inputs seem to).
function findTotal(step) {
  var total = 0;
  //gets total expected cells that are populated with at least one step
  var cells = Math.floor((step - 1) / size);
  cells = 1 + (4 * Math.ceil((step - Math.floor(size / 2)) / size)) + (2 * cells * (cells + 1));

  //finds the values of the NESW-approached nodes that have not yet reached their cycle
  var index = (step - Math.ceil(size / 2)) % size;
  while (perimeters[1][index + 2] != undefined) {
    total += perimeters[1][index];
    total += perimeters[3][index];
    total += perimeters[5][index];
    total += perimeters[7][index];
    cells -= 4;
    index += size;
  }

  //finds the values of the diagonal nodes that have not yet reached their cycle
  index = (step - 1) % size;
  var multi = Math.floor((step - 1) / size);
  while (perimeters[0][index + 2] != undefined) {
    total += perimeters[0][index] * multi;
    total += perimeters[2][index] * multi;
    total += perimeters[6][index] * multi;
    total += perimeters[8][index] * multi;
    cells -= 4 * multi;
    multi--;
    index += size;
  }

  //the cells remaining are cycling, solve for their values
  var filled = Math.ceil(Math.sqrt(cells / 2));
  var offset = 1 + (((step % 2) + ((filled + 1) % 2)) % 2);
  total += (Math.pow(filled, 2) * perimeters[4][perimeters[4].length - offset]);
  total += (Math.pow(filled - 1, 2) * perimeters[4][perimeters[4].length - [,2,1][offset]]);

  return total;
}

//findTotal only works when the steps expands past the original grid
var part1 = input.map(x => x.map(y => false));
part1[start[0]][start[1]] = true;
for (let a = 0; a < 64; a++) {
  part1 = iterateSteps(part1);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", countSteps(part1.map(x => x.map(y => y ? "true" : "false"))));
console.log("Part 2:", findTotal(26501365));