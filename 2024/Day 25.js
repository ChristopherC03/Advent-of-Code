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

input.push('');

let locks = [];
let keys = [];
let cur = [];
while (input.length > 0) {
  let row = input.shift();
  if (row == '') {
    if (cur[0][0] == '#') {
      locks.push(cur);
    } else {
      keys.push(cur);
    }
    cur = [];
  } else {
    cur.push(row.split(''));
  }
}

let part1 = 0;
for (let l = 0; l < locks.length; l++) {
  let lock = locks[l];
  for (let k = 0; k < keys.length; k++) {
    let key = keys[k];
    if (compareGrids(lock, key)) {
      part1++;
    }
  }
}

function compareGrids(lock, key) {
  for (let y = 0; y < lock.length; y++) {
    for (let x = 0; x < lock[y].length; x++) {
      if (lock[y][x] == '#' && key[y][x] == '#') {
        return false;
      }
    }
  }

  return true;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", ":)");