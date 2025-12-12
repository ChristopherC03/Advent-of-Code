//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('./cur input.txt', 'utf8');
  var input = data.split("\r\n\r\n").map(n => n.split("\r\n"));
} catch (err) {
  console.error(err);
}

let presents = input.slice(0, -1).map(n => n.slice(1).reduce((a, b) => a + (b.split('#').length - 1), 0));
let regions = input.slice(-1)[0].map(n => n.split(' ')).map(n => [n[0].slice(0, -1).split('x').map(m => Number(m)), n.slice(1).map(m => Number(m))]);

let part1 = 0;
for (let i = 0; i < regions.length; i++) {
  let [[width, height], presentsUsed] = regions[i];
  let area = width * height;
  presentsUsed = presentsUsed.reduce((a, b, idx) => a + (b * presents[idx]), 0);
  if (area > presentsUsed) {
    part1++;
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", ":)");

/*
// Here's what I had before I saw the "trick".
// It's a brute force that struggles even with the smaller example,
// and would likely never finish on the real input.

let presents = input.slice(0, -1).map(n => [Number(n[0].slice(0, -1)), n.slice(1).map(m => m.split(''))]);
let regions = input.slice(-1)[0].map(n => n.split(' ')).map(n => [n[0].slice(0, -1).split('x').map(m => Number(m)), n.slice(1).map(m => Number(m))]);

let presentRotations = {};
for (let i = 0; i < presents.length; i++) {
  let [key, present] = presents[i];
  let height = present.length - 1;
  let width = present[0].length - 1;

  let rot0 = [];
  for (let y = 0; y <= height; y++) {
    let row = [];
    for (let x = 0; x <= width; x++) {
      row.push(present[y][x]);
    }
    rot0.push(row);
  }

  let rot90 = [];
  for (let x = width; x >= 0; x--) {
    let row = [];
    for (let y = 0; y <= height; y++) {
      row.push(present[y][x]);
    }
    rot90.push(row);
  }

  let rot180 = [];
  for (let y = height; y >= 0; y--) {
    let row = [];
    for (let x = width; x >= 0; x--) {
      row.push(present[y][x]);
    }
    rot180.push(row);
  }

  let rot270 = [];
  for (let x = 0; x <= width; x++) {
    let row = [];
    for (let y = height; y >= 0; y--) {
      row.push(present[y][x]);
    }
    rot270.push(row);
  }

  presentRotations[key] = [rot0, rot90, rot180, rot270];
}

let part1 = 0;
for (let i = 0; i < regions.length; i++) {
  let [[width, height], presentsUsed] = regions[i];
  let map = Array(height).fill().map(_ => Array(width).fill('.'));
  let valid = recurse(map, presentsUsed, 0);
  if (valid) {
    part1++;
  }
  console.log(i, valid);
}

function recurse(map, presentsUsed, idx) {
  if (idx === presentsUsed.length) {
    return true;
  }

  if (presentsUsed[idx] === 0) {
    return recurse(map, presentsUsed, idx + 1);
  }
  
  let validMaps = [];
  let rotations = presentRotations[idx];
  for (let r = 0; r < rotations.length; r++) {
    let present = rotations[r];
    let height = present.length;
    let width = present[0].length;
    for (let y = 0; y <= map.length - height; y++) {
      for (let x = 0; x <= map[y].length - width; x++) {
        let nextMap = map.map(n => [...n]);
        let valid = true;
        for (let dy = 0; dy < height; dy++) {
          let yy = y + dy;
          for (let dx = 0; dx < width; dx++) {
            let xx = x + dx;
            if (present[dy][dx] === '.') {
              continue;
            }
            if (nextMap[yy][xx] === '#') {
              valid = false;
              break;
            }
            nextMap[yy][xx] = '#';
          }
        }
        if (valid) {
          validMaps.push(nextMap);
        }
      }
    }
  }

  let nextPresentsUsed = [...presentsUsed];
  nextPresentsUsed[idx]--;
  for (let v = 0; v < validMaps.length; v++) {
    let valid = recurse(validMaps[v], nextPresentsUsed, idx);
    if (valid) {
      return true;
    }
  }

  return false;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", ":)");
*/