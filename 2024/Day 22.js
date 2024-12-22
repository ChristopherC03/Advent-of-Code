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

input = input.map(x => Number(x));

function evolve(sec) {
  let num = sec * 64;
  sec = mixprune(sec, num);
  num = Math.floor(sec / 32);
  sec = mixprune(sec, num);
  num = sec * 2048;
  num = mixprune(sec, num);
  return num;
}

function mixprune(sec, num) {
  return Number(BigInt(sec) ^ BigInt(num)) % 16777216;
}

let part1 = 0;
let part2 = 0;
let sequences = {}; //sequences[a][b][c][d] = [running total for sequence [a, b, c, d], most recent monkey]
for (let n = 0; n < input.length; n++) {
  let secret = input[n];
  let changes = [[secret % 10]]; //[[value, change], [value, change], evolve2, evolve3]
  for (let i = 0; i < 2000; i++) {
    //part1
    secret = evolve(secret);

    //part2
    let price = secret % 10;
    changes.push([price, price - changes[changes.length - 1][0]]);
    if (changes.length == 5) {
      changes.shift();
      let [a, b, c, d] = changes.map(x => x[1]);
      sequences[a] = sequences[a] ?? {};
      sequences[a][b] = sequences[a][b] ?? {};
      sequences[a][b][c] = sequences[a][b][c] ?? {};
      sequences[a][b][c][d] = sequences[a][b][c][d] ?? [0, -1];
      let [p, m] = sequences[a][b][c][d];
      //if this sequence wasn't already encountered by this buyer,
      if (m != n) {
        //increment the running total for this sequence by the current price
        let total = p + price;
        sequences[a][b][c][d] = [total, n];
        part2 = Math.max(part2, total);
      }
    }
  }
  part1 += secret;
}

//program execution time ~15 seconds
console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);