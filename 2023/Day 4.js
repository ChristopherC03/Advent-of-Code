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

//parses input into a list of cards where each card has two arrays: the numbers you have and the winning numbers
input = input.map(x => x.slice(x.indexOf(":") + 2).split("|").map(y => y.match(/\d+/g).map(z => Number(z))));

//finds how many numbers match the winning numbers
for (var a = 0; a < input.length; a++) {
  var won = 0;
  for (var b = 0; b < input[a][0].length; b++) {
    won += input[a][1].includes(input[a][0][b]) ? 1 : 0;
  }
  input[a] = won;
}

//find all the copies of cards
var cards = Array(input.length).fill(1);
for (var a = 0; a < cards.length; a++) {
  for (var b = 0; b < input[a]; b++) {
    cards[a + 1 + b] += cards[a];
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", input.reduce((a, b) => a + Math.floor(Math.pow(2, b - 1)), 0));
console.log("Part 2:", cards.reduce((a, b) => a + b));