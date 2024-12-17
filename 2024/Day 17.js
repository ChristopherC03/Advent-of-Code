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

var registers = [];
var instructions = [];
for (let a = 0; a < 3; a++) {
  registers.push(BigInt(input.shift().match(/\d+/)));
}
input.shift();
instructions = input.shift().match(/\d+/g).map(x => BigInt(x));

//recurses in octal; starting from 1000, checks 1100, 1200, 1300, ... 1700
//the rightmost digit of the output is based on the leftmost digit of the octal value
//the second-to-rightmost digit of the output is based on the two leftmost digits of the octal value, and so on
function recurseOctal(cur, depth) {
  for (let a = 0; a < 8; a++) {
    let next = cur + (Math.pow(8, depth) * a);
    let out = run([BigInt(next), 0n, 0n]);

    //work right-to-left, checking if output and instructions are equal
    let found = instructions.length - 1;
    while (found >= 0 && out[found] == instructions[found]) {
      found--;
    }

    //output and instructions were equal, quine solved
    if (found < 0) {
      return next;
    }

    //each octal digit corresponds to a matching output,
    //so if we're behind, don't bother trying to "catch up"
    if (found < depth) {
      let won = recurseOctal(next, depth - 1);
      if (won != -1) {
        //we need the smallest, so go ahead and exit out of all recurses when first quine value is found
        return won;
      }
    }
  }

  //failed branch
  return -1;
}

function run(registers) {
  //assumes registers all all bigints
  //necessary to avoid overflow issues with bitwise operations
  let pointer = 0;
  let out = [];
  while (instructions.length > pointer) {
    let literal = instructions[pointer + 1];
    let combo = literal;
    if (combo > 3) {
      combo = registers[combo - 4n];
    }

    switch (instructions[pointer]) {
      case 0n:
        registers[0] = registers[0] >> combo;
        break;
      case 1n:
        registers[1] = registers[1] ^ literal;
        break;
      case 2n:
        registers[1] = combo & 7n;
        break;
      case 3n:
        pointer = registers[0] ? Number(literal) - 2 : pointer;
        break;
      case 4n:
        registers[1] = registers[1] ^ registers[2];
        break;
      case 5n:
        out.push(combo & 7n);
        break;
      case 6n:
        registers[1] = registers[0] >> combo;
        break;
      case 7n:
        registers[2] = registers[0] >> combo;
        break;
    }
  
    pointer += 2;
  }

  return out;
}

var part1 = run([...registers]).join(',');
var part2 = recurseOctal(0, instructions.length);
//console.log(run([BigInt(part2), 0n, 0n]).join(','));

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);