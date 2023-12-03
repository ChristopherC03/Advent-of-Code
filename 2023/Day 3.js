//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data.trim().split("\r\n");
} catch (err) {
  console.error(err);
}

var values = []; //[val, [[y, x], [y, x], ...]]
var specials = []; //[char, y, x]
for (var y = 0; y < input.length; y++) {
  for (var x = 0; x < input[y].length; x++) {
    var char = input[y][x];
    if (!isNaN(char)) {
      var val = ["", []];
      while (!isNaN(char)) {
        //build the value, store all coordinates of the digits while doing so
        val[0] += char;
        val[1].push([y, x]);
        char = input[y][++x];
      }
      val[0] = Number(val[0]);
      values.push(val);
    }

    //'if' rather than 'else if' because the character immediately after a digit may be special
    if (char != "." && char != undefined) {
      specials.push([char, y, x]);
    }
  }
}

//only keep the values
values = values.filter(x =>
  //that have at least one digit
  x[1].some(y =>
    //and at least one special character
    specials.some(z =>
      //be adjacent (both their coordinates within 1 distance)
      Math.abs(y[0] - z[1]) <= 1 && Math.abs(y[1] - z[2]) <= 1
    )
  )
);

var gears = 0;
for (var a = 0; a < specials.length; a++) {
  //reduce the specials to just the gears
  if (specials[a][0] != "*") { continue; }
  //such that exactly two values
  var adjacents = values.filter(y =>
    //each have at least one digit
    y[1].some(z => 
      //be adjacent (both their coordinates within 1 distance)
      Math.abs(z[0] - specials[a][1]) <= 1 && Math.abs(z[1] - specials[a][2]) <= 1
    )
  );
  if (adjacents.length != 2) { continue; }

  //then multiply the two values and add to the running total
  gears += adjacents.map(y => y[0]).reduce((a, b) => a * b);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", values.reduce((a, b) => a + b[0], 0));
console.log("Part 2:", gears);