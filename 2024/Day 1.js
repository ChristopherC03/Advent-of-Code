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

var lists = [[], []];

//for each line,
input = input.map(x =>
  //split by whitespace, any length (greater than zero).
  x.split(/\s+/)
    //for each resulting string,
    .map((y, idx) =>
      //convert to a number, and push into its associated list.
      lists[idx].push(Number(y))
    )
);

//sort the two lists.
lists.map(x => x.sort());

//for each entry in the first list, get the distance between itself and its associated entry in the second list.
//then, add to the running total.
var part1 = lists[0].reduce((a, b, idx) => a + Math.abs(b - lists[1][idx]), 0);

//for each entry in the first list, filter the second list to get only the values equal to said entry.
//return the length of the filter, to get the amount of times that entry appeared in the second list.
//multiply by the entry's value itself, then add to the running total.
var part2 = lists[0].reduce((a, b) => a + (b * lists[1].filter(x => x === b).length), 0);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);
