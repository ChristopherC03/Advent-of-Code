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

let stage = true; //wires, gates
let wires = {}; //wire: bool
let gates = {}; //wire: [input1, gate, input2]
let gatesInverse = {}; //gatesInverse[input1][gate][input2] = wire
while (input.length > 0) {
  let cur = input.shift();

  //double newline. swaps parsing wires to parsing gates
  if (cur == '') {
    stage = false;
    continue;
  }

  if (stage) {
    //wires
    let [wire, bool] = cur.split(': ');
    wires[wire] = bool;
  } else {
    //gates
    let [wire1, gate, wire2, _, wire3] = cur.split(' ');
    gates[wire3] = [wire1, gate, wire2];

    //inverted gates
    gatesInverse[wire1] = gatesInverse[wire1] ?? {};
    gatesInverse[wire1][gate] = gatesInverse[wire1][gate] ?? {};
    gatesInverse[wire1][gate][wire2] = wire3;
    gatesInverse[wire2] = gatesInverse[wire2] ?? {};
    gatesInverse[wire2][gate] = gatesInverse[wire2][gate] ?? {};
    gatesInverse[wire2][gate][wire1] = wire3;
  }
}

//input is a straightforward binary adder; I already know how the pattern will play out,
//so I can ensure the pattern is correct by checking if the next step exists in the input.
//if it DOESN'T, one of the previous two wires was faulty, so I can make a swap
//by checking which of the previous two steps failed, and swap it with what was SUPPOSED to happen.
let a = gatesInverse["x00"]["AND"]["y00"];
let b = gatesInverse["x01"]["XOR"]["y01"];
let num = "01";
let history = [a, b];
let swap = [];
while (swap.length < 8) {
  a = gatesInverse[a]?.["AND"]?.[b];
  if (a === undefined) {
    let [c, d] = history.splice(history.length - 2);
    //make c the correct previous a or b
    if (gatesInverse[d]?.["AND"] !== undefined) {
      let temp = c;
      c = d;
      d = temp;
    }
    //find what the other correct a or b was supposed to be, update this a accordingly
    b = Object.keys(gatesInverse[c]["AND"])[0];
    a = gatesInverse[c]["AND"][b];
    history.push(c, b);
    swap.push(d, b);
    executeSwap(d, b);
  }
  history.push(a);

  b = gatesInverse['x' + num]["AND"]['y' + num];
  history.push(b);

  a = gatesInverse[a]?.["OR"]?.[b];
  if (a === undefined) {
    let [c, d] = history.splice(history.length - 2);
    //make c the correct previous a or b
    if (gatesInverse[d]?.["OR"] !== undefined) {
      let temp = c;
      c = d;
      d = temp;
    }
    //find what the other correct a or b was supposed to be, update this a accordingly
    b = Object.keys(gatesInverse[c]["OR"])[0];
    a = gatesInverse[c]["OR"][b];
    history.push(c, b);
    swap.push(d, b);
    executeSwap(d, b);
  }
  history.push(a);

  num = Number(num) + 1;
  if (num < 10) {
    num = '0' + num;
  }

  b = gatesInverse['x' + num]["XOR"]['y' + num];
  history.push(b);
}
let part2 = swap.sort().join(',');

function executeSwap(wire1, wire2) {
  let [a, b, c] = gates[wire1];
  gatesInverse[a][b][c] = wire2;
  gatesInverse[c][b][a] = wire2;
  [a, b, c] = gates[wire2];
  gatesInverse[a][b][c] = wire1;
  gatesInverse[c][b][a] = wire1;
}

let output = "";
for (let a = 0; a < 100; a++) {
  let zWire = "z";
  if (a < 10) {
    zWire += "0";
  }
  zWire += a;

  output = recurseTest(zWire) + output;
}
let part1 = parseInt(output, 2);

function recurseTest(wire) {
  if (wires[wire] === undefined) {
    wires[wire] = 0;
  }

  if (gates[wire] !== undefined) {
    let [wire1, gate, wire2] = gates[wire];
    recurseTest(wire1);
    recurseTest(wire2);

    let output;
    if (gate == "AND") {
      output = wires[wire1] & wires[wire2];
    } else if (gate == "OR") {
      output = wires[wire1] | wires[wire2];
    } else if (gate == "XOR") {
      output = wires[wire1] ^ wires[wire2];
    }

    delete gates[wire];
    wires[wire] = output;
  }
  return wires[wire];
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);