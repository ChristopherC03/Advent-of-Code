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
console.log(input);

for (let a = 0; a < input.length; a++) {

}

console.log("----- OUTPUT -----");
console.log("Part 1:", );
console.log("Part 2:", );