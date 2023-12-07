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

//returns 1 if hand1 is better, -1 if hand2 is better
function compareHands(hand1, hand2, part2 = false) {
  //higher quantity of some same label is the first rule
  let quanChars = [findQuanChar(hand1, part2), findQuanChar(hand2, part2)];
  let difference = quanChars[0].findIndex((x, idx) => x != quanChars[1][idx]);
  if (difference != -1) { return Math.sign(quanChars[0][difference] - quanChars[1][difference]); }

  //first higher card type is the second rule
  difference = hand1.findIndex((x, idx) => x != hand2[idx]);
  return Math.sign(cards.indexOf(hand1[difference]) - cards.indexOf(hand2[difference]));
}

//finds the quantities of all characters in a string
function findQuanChar(n, part2) {
  let chars = {};
  n.map(x => {
    chars[x] = (chars[x] ?? 0) + 1;
  });

  //adds the joker wildcard to highest total, if part2
  if (part2) {
    let joker = chars["J"];
    delete chars["J"];
    let sorted = Object.values(chars).sort((a, b) => b - a);
    sorted[0] = (sorted[0] ?? 0) + (joker ?? 0);
    return sorted;
  } else {
    return Object.values(chars).sort((a, b) => b - a);
  }
}

input = input.map(x => x.split(" ")).map(x => [x[0].split(""), Number(x[1])]);

var cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var part1 = [...input].sort((a, b) => compareHands(a[0], b[0]));

//"J" is now the worst card for part2
cards = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
var part2 = [...input].sort((a, b) => compareHands(a[0], b[0], true));

console.log("----- OUTPUT -----");
console.log("Part 1:", part1.reduce((a, b, idx) => a + (b[1] * (idx + 1)), 0));
console.log("Part 2:", part2.reduce((a, b, idx) => a + (b[1] * (idx + 1)), 0));