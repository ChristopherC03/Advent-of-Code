//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('./cur input.txt', 'utf8');
  var input = data.split("\r\n");
} catch (err) {
  console.error(err);
}

let regex = /(\[[.|#]+\]) ((?:\((?:\d+,?)+\) ?)+) ({(?:\d+,?)+})/;
input = input.map(n => n.match(regex).slice(1, 4));

let part1 = 0;
let part2 = 0;
for (let i = 0; i < input.length; i++) {
  let [light, buttons, joltage] = input[i];
  light = light.slice(1, -1).split('').map(n => n === '.' ? 0 : 1);
  buttons = buttons.split(' ').map(n => n.slice(1, -1).split(',').map(m => Number(m)));
  joltage = joltage.slice(1, -1).split(',').map(n => Number(n));

  let combos = {};
  combos[Array(joltage.length).fill(0).join(',')] = 0;
  let singleButtonJolts = buttons.map(_ => Array(joltage.length).fill(0));
  buttons.forEach((n, idx) => n.forEach(m => singleButtonJolts[idx][m]++));
  let buttonJolts = [[[], Array(joltage.length).fill(0)]];
  for (let p = 1; p <= buttons.length; p++) {
    let nextButtonJolts = [];
    for (let b1 = 0; b1 < buttonJolts.length; b1++) {
      let [buttonsUsed, curButtonJolts] = buttonJolts[b1];
      let lastButton = buttonsUsed[buttonsUsed.length - 1] ?? -1;
      for (let b2 = lastButton + 1; b2 < singleButtonJolts.length; b2++) {
        let combined = curButtonJolts.map((n, idx) => n + singleButtonJolts[b2][idx]);
        let combinedStr = combined.join(',');
        if (combos[combinedStr] !== undefined) {
          continue;
        }
        combos[combinedStr] = p;
        nextButtonJolts.push([[...buttonsUsed, b2], combined]);
      }
    }
    buttonJolts = nextButtonJolts;
  }
  combos = Object.entries(combos).map(n => [n[1], n[0].split(',').map(m => Number(m))]).sort((a, b) => a[0] - b[0]);

  part1 += combos.find(n => n[1].every((m, idx) => m % 2 === light[idx]))[0];
  part2 += recurse(combos, joltage, {});
}

function recurse(combos, joltage, memoize) {
  let state = joltage.join(',');
  if (memoize[state] !== undefined) {
    return memoize[state];
  }

  let min = Infinity;
  for (let c = 0; c < combos.length; c++) {
    let [presses, buttonJolts] = combos[c];
    let nextJoltage = joltage.map((n, idx) => n - buttonJolts[idx]);
    if (nextJoltage.every(n => n === 0)) {
      min = Math.min(min, presses);
      continue;
    }
    if (nextJoltage.some(n => n < 0)) {
      continue;
    }
    if (nextJoltage.every(n => n % 2 === 0)) {
      nextJoltage = nextJoltage.map(n => n / 2);
      min = Math.min(min, presses + (2 * recurse(combos, nextJoltage, memoize)));
    }
  }
  
  memoize[state] = min;
  return min;
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);
