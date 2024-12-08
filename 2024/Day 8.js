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

input = input.map(x => x.split(''));

var coords = {}; //frequency: [y, x];
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    let char = input[y][x];
    if (char != ".") {
      coords[char] = coords[char] ?? [];
      coords[char].push([y, x]);
    }
  }
}

var frequencies = Object.keys(coords);
var part1 = []; //"y,x"
var part2 = []; //"y,x"
while (frequencies.length > 0) {
  let frequency = frequencies.shift();
  let antennas = coords[frequency];
  while (antennas.length > 0) {
    let antenna = antennas.shift();
    for (let a = 0; a < antennas.length; a++) {
      //pairs all similar-frequency antennas for antinodes
      let compare = antennas[a];
      let [dy, dx] = antenna.map((x, idx) => compare[idx] - x);

      let i = 0;
      while (true) {
        let antinodes = [[antenna[0] - (dy * i), antenna[1] - (dx * i)], [compare[0] + (dy * i), compare[1] + (dx * i)]];
        antinodes = antinodes.filter(x => x[0] >= 0 && x[0] < input.length && x[1] >= 0 && x[1] < input[0].length);
        if (antinodes.length == 0) {
          //stop checking if both possbile are out of bounds
          break;
        }
        antinodes = antinodes.map(x => x.join(","));
        if (i == 1) {
          part1.push(...antinodes.filter(x => !part1.includes(x)));
        }
        part2.push(...antinodes.filter(x => !part2.includes(x)));
        i++;
      }
    }
  }
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1.length);
console.log("Part 2:", part2.length);