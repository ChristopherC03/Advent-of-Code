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

//convert to 2D grid
input = input.map(x => x.split(''));

var part1 = 0;
var part2 = 0;
var word = "XMAS";
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    //part1
    //E, SE, S, SW, W, NW, N, NE
    let dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
    while (dirs.length > 0) {
      let dir = dirs.shift();
      let found = true;
      for (let z = 0; z < word.length; z++) {
        //move in the current direction
        let dy = dir[0] * z;
        let dx = dir[1] * z;
        //hacky way to avoid checking out of range
        let cur = (input[y + dy] ?? [])[x + dx] ?? '';
        //ensure letter we're checking is appropriate for the word
        if (cur != word.charAt(z)) {
          found = false;
          break;
        }
      }
      if (found) {
        part1++;
      }
    }

    //part2
    let cur = input[y][x];
    //really hacky way to check for an X-MAS
    if (cur == "A" &&
      (((input[y - 1] ?? [])[x - 1] == "M" && (input[y + 1] ?? [])[x + 1] == "S") ||
       ((input[y - 1] ?? [])[x - 1] == "S" && (input[y + 1] ?? [])[x + 1] == "M")) &&
      (((input[y - 1] ?? [])[x + 1] == "M" && (input[y + 1] ?? [])[x - 1] == "S") ||
       ((input[y - 1] ?? [])[x + 1] == "S" && (input[y + 1] ?? [])[x - 1] == "M"))
    ) {
      part2++;
    }
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);