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

var words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
var part1Output = [];
var part2Output = [];
for (var a = 0; a < input.length; a++) {
  var part1 = [];
  var part2 = [];
  for (var b = 0; b < input[a].length; b++) {
    //check for first digit
    if (part1[0] == undefined && !isNaN(input[a].charAt(b))) {
      part1[0] = Number(input[a].charAt(b));
      if (part2[0] == undefined) {
        part2[0] = part1[0];
      }
    }
    
    //check for last digit
    if (part1[1] == undefined && !isNaN(input[a].charAt(input[a].length - (b + 1)))) {
      part1[1] = Number(input[a].charAt(input[a].length - (b + 1)));
      if (part2[1] == undefined) {
        part2[1] = part1[1];
      }
    }

    //check for first word
    if (part2[0] == undefined) {
      var index = words.findIndex(x => input[a].slice(b).startsWith(x));
      if (index != -1) {
        part2[0] = index + 1;
      }
    }

    //check for last word
    if (part2[1] == undefined) {
      var index = words.findIndex(x => input[a].slice(-b - 2).startsWith(x));
      if (index != -1) {
        part2[1] = index + 1;
      }
    }

    //break if done
    if (part1[0] != undefined && part1[1] != undefined) {
      break;
    }
  }
  part1Output.push(Number(part1.join("")));
  part2Output.push(Number(part2.join("")));
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1Output.reduce((a, b) => a + b));
console.log("Part 2:", part2Output.reduce((a, b) => a + b));
