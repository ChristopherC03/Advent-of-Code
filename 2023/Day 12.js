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

var part1 = input.map(x => x.split(" ")).map(x => [x[0].split(""), x[1].split(",").map(y => Number(y))]);
var part2 = input.map(x => x.split(" ")).map(x => [Array(5).fill(x[0]).join("?").split(""), Array(5).fill(x[1]).join(",").split(",").map(y => Number(y))]);

var solutions = [0, 0]; //part 1, part 2
var solved; //used for memoization
for (var a = 0; a < input.length; a++) {
  solved = [];
  possibilities([...part1[a][0]], [...part1[a][1]]);
  solutions[0] += Object.values(solved[solved.length - 1])[0];

  solved = [];
  possibilities([...part2[a][0]], [...part2[a][1]]);
  solutions[1] += Object.values(solved[solved.length - 1])[0];
}

function possibilities(line, info) {
  while (line.length > 0) {
    let char = line.shift();
    if ((solved[line.length] ?? {})[info.join(",")] != undefined) {
      return solved[line.length][info.join(",")];
    }

    if (char == ".") {
      //walk until the next character is no longer a dot
      while (line[0] == ".") {
        char = line.shift();
        if ((solved[line.length] ?? {})[info.join(",")] != undefined) {
          return solved[line.length][info.join(",")];
        }
      }
    } else if (char == "#") {
      //walk until we reach a dot or the current spring count finishes
      //note: this will automatically skip ?s, as they would need to be #s for the result to succeed,
      //and the character proceeding the end of the #s will be skipped, as after a # must be a dot
      while (char != "." && info[0] > 0 && char != undefined) {
        info[0]--;
        char = line.shift();
        if ((solved[line.length] ?? {})[info.join(",")] != undefined) {
          return solved[line.length][info.join(",")];
        }
      }

      if (info[0] != 0 || char == "#") {
        return 0;
      } else {
        info.shift();
      }
    } else if (char == "?") {
      //recurses with both possibilities, append to solved how many we found with our current state (for memoization)
      let found = 0;
      found += possibilities(["#", ...line], [...info]);
      found += possibilities([".", ...line], [...info]);
      solved[line.length] = solved[line.length] ?? {};
      solved[line.length][info.join(",")] = found;
      return found;
    }
  }

  if (info.length > 0) {
    return 0;
  }

  //appending to solved here for an edge case where the outcome has only one possibility and we never recurse
  solved[0] = solved[0] ?? {};
  solved[0][""] = 1;
  return 1;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", solutions[0]);
console.log("Part 2:", solutions[1]);