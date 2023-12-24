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

input = input.map(x => x.match(/-?\d+/g).map(y => Number(y)));

function check(first, second) {
  //equates both hail paths' x and y intersections (e.g., 18 - 1a = 19 - 2b -> [1, -1, 2])
  let equations = [];
  for (let c = 0; c < 2; c++) {
    equations.push([second[0 + c] - first[0 + c], first[3 + c], -second[3 + c]]);
  }

  //solves hail path equations (quantity of time before intersection for both hail paths)
  let answers = [];
  let solve = -(equations[0][2] / equations[1][2]);
  solve = equations[1].map(x => x * solve);
  solve = solve.map((x, idx) => x + equations[0][idx]);
  if (solve[1] == 0) {
    if (solve[0] == 0) {
      //edge case for some reason
      solve = 1;
    } else {
      //parallel
      return [[-1],[-1]];
    }
  } else {
    solve = solve[0] / solve[1];
  }
  answers.push(solve);
  solve = (equations[0][0] - (equations[0][1] * solve)) / equations[0][2];
  answers.push(solve);

  //x and y coordinate where intersected
  let solved = [first[0] + (first[3] * answers[0]), first[1] + (first[4] * answers[0])];
  return [solved, answers.map(x => Math.abs(Math.round(x) - x) < 0.01 ? Math.round(x) : x)];
}

function part2() {
  for (let vx = -1000; vx <= 1000; vx++) {
    for (let vy = -1000; vy <= 1000; vy++) {
      let mult;
      let gaussian = [
        [vx - input[0][3], 0, 1, 0, input[0][0]],
        [0, vx - input[1][3], 1, 0, input[1][0]],
        [vy - input[0][4], 0, 0, 1, input[0][1]],
        [0, vy - input[1][4], 0, 1, input[1][1]]
      ];

      //make bottom left corner all zeroes
      mult = -(gaussian[2][0] / gaussian[0][0]);
      gaussian[0].forEach((x, idx) => gaussian[2][idx] += (x * mult));
      mult = -(gaussian[3][1] / gaussian[1][1]);
      gaussian[1].forEach((x, idx) => gaussian[3][idx] += (x * mult));
      mult = -(gaussian[3][2] / gaussian[2][2]);
      gaussian[2].forEach((x, idx) => gaussian[3][idx] += (x * mult));

      //make diagonal all ones
      mult = gaussian[0][0];
      gaussian[0] = gaussian[0].map(x => x / mult);
      mult = gaussian[1][1];
      gaussian[1] = gaussian[1].map(x => x / mult);
      mult = gaussian[2][2];
      gaussian[2] = gaussian[2].map(x => x / mult);
      mult = gaussian[3][3];
      gaussian[3] = gaussian[3].map(x => x / mult);

      //extrapolate values
      gaussian[3] = gaussian[3][4];
      gaussian[2] = gaussian[2][4] - gaussian[2].slice(3, -1).reduce((a, b, idx) => a + (b * gaussian[idx + 3]), 0);
      gaussian[1] = gaussian[1][4] - gaussian[1].slice(2, -1).reduce((a, b, idx) => a + (b * gaussian[idx + 2]), 0);
      gaussian[0] = gaussian[0][4] - gaussian[0].slice(1, -1).reduce((a, b, idx) => a + (b * gaussian[idx + 1]), 0);

      if (gaussian.some(x => isNaN(x) || x == Infinity)) {
        continue;
      }
      gaussian = gaussian.map(x => Math.round(x));

      for (let a = 0; a < input.length; a++) {
        if (check([gaussian[2], gaussian[3], 0, vx, vy, 0], input[a])[1].some(x => Math.sign(x) == -1 || x != Math.floor(x))) {
          break;
        }
        if (a == input.length - 1) {
          return gaussian;
        }
      }
    }
  }
}

var part1 = 0;
for (let a = 0; a < input.length; a++) {
  for (let b = a + 1; b < input.length; b++) {
    let [solved, answers] = check(input[a], input[b]);
    if (answers.every(x => Math.sign(x) != -1) && solved.every(x => 200000000000000 <= x && x <= 400000000000000)) {
      part1++;
    }
  }
}

//approx. execution time: 20 sec.
let [a, b, x, y] = part2();
let end = (input[0][2] + (a * input[0][5]));
let vz = Math.abs(end - (input[1][2] + (b * input[1][5]))) / Math.abs(a - b);
let z = end - (a * vz);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", x + y + z);
