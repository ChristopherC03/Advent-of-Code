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

var seeds = input.shift().match(/\d+/g).map(x => Number(x));
var almanac = [];
while (input.length > 0) {
  let cur = input.shift();
  if (cur == "") {
    almanac.push([]);
    input.shift();
  } else {
    let next = cur.match(/\d+/g).map(x => Number(x));
    next[0] -= next[1]; //make it an easier to work with offset value
    next[2] += next[1] - 1; //make the range explicit, instead of saying quantity of values
    almanac[almanac.length - 1].push(next);
  }
}

function mapRanges(ranges) {
  for (let a = 0; a < almanac.length; a++) {
    let newRanges = []; //those that are specifically mapped to a new range
    let testedRanges = []; //those that did not find a new range yet
    for (let b = 0; b < almanac[a].length; b++) {
      while (ranges.length > 0) {
        let curRange = ranges.shift();
        //check if any overlap exists w/ "a<=d and c<=b"
        if (curRange[0] <= almanac[a][b][2] && almanac[a][b][1] <= curRange[1]) {
          //anything in curRange that is BEFORE when almanac[a][b] STARTS
          if (almanac[a][b][1] > curRange[0]) {
            testedRanges.push([curRange[0], almanac[a][b][1] - 1]);
          }

          //anything in curRange that is AFTER when almanac[a][b] ENDS
          if (curRange[1] > almanac[a][b][2]) {
            testedRanges.push([almanac[a][b][2] + 1, curRange[1]]);
          }

          //the section in curRange that OVERLAPS almanac[a][b], and map it by adding the offset value
          newRanges.push([Math.max(curRange[0], almanac[a][b][1]) + almanac[a][b][0], Math.min(curRange[1], almanac[a][b][2]) + almanac[a][b][0]]);
        } else {
          testedRanges.push(curRange);
        }
      }
      ranges = testedRanges;
      testedRanges = [];
    }

    //join overlaps like [1, 4], [3, 6] -> [1, 6]
    ranges = [...ranges, ...newRanges].sort((a, b) => a[1] - b[1]);
    for (let b = 0; b < ranges.length - 1; b++) {
      if (ranges[b][1] >= ranges[b + 1][0] - 1) {
        ranges[b] = [ranges[b][0], ranges.splice(b + 1, 1)[0][1]];
        b--;
      }
    }
  }
  return ranges[0][0];
}

var part1 = seeds.map(x => [x, x]);
var part2 = seeds.reduce((a, b, idx) => {
  if (idx % 2 == 0) { a.push([]); }
  a[a.length - 1].push(b);
  return a;
}, []).map(x => [x[0], x[0] + x[1]]);

console.log("----- OUTPUT -----");
console.log("Part 1:", mapRanges(part1));
console.log("Part 2:", mapRanges(part2));
