//---> prevents debug menu closing when code finishes
process.stdin.resume();

//---> opens the file 'cur input"
const fs = require('fs');
try {
  const data = fs.readFileSync('\cur input.txt', 'utf8');
  var input = data;
} catch (err) {
  console.error(err);
}

input = input.split('');
var data = []; //[ID, length]
for (let a = 0; a < input.length; a++) {
  let val = Number(input[a]);
  if (val == 0) {
    //no point keeping track of zero length data
    continue;
  }
  if (a % 2 == 0) {
    data.push([a / 2, val]);
  } else {
    //I give free spaces an ID of -1
    if (data[data.length - 1][0] == -1) {
      //if there was a file with size 0, this will merge the two free spaces
      data[data.length - 1][1] += val;
    } else {
      data.push([-1, val]);
    }
  }
}

var data1 = data.map(x => [...x]);
var end = data1.pop();
for (let a = 0; a < data1.length; a++) {
  //finds free space going left to right 
  let free = data1[a];
  if (free[0] == -1) {
    if (free[1] > end[1]) {
      //more free space available than the rest of the held file
      data1.splice(a, 1, [...end], [-1, free[1] - end[1]]);
    } else {
      //more (or equal) of the held file available than the rest of the free space
      data1[a] = [end[0], free[1]];
    }
    end[1] -= free[1];

    while (end[0] == -1 || end[1] <= 0) {
      //grab the rightmost file
      end = data1.pop();
    }
  }
}
if (end[1] > 0) {
  //put the held file back into the data
  if (data1[data1.length - 1][0] == end[0]) {
    data1[data1.length - 1][1] += end[1];
  } else {
    data1.push(end);
  }
}

var data2 = data.map(x => [...x]);
var pointer = data2.length - 1;
while (pointer > 0) {
  //finds file going right to left
  let file = data2[pointer];
  if (file[0] == -1) {
    pointer--;
    continue;
  }
  for (let a = 0; a < pointer; a++) {
    //finds free spaces going left to right
    let free = data2[a];
    if (free[0] == -1 && free[1] >= file[1]) {
      //first, replace the current file from the end of the data with free space
      data2.splice(pointer, 1, [-1, file[1]]);
      free[1] -= file[1];
      if (free[1] > 0) {
        //if there was still some free space left, keep it
        data2.splice(a, 0, file);
        pointer++;
      } else {
        //if we used up all the free space available, remove it
        data2.splice(a, 1, file);
      }

      //merge adjacent free spaces
      if (data2[pointer - 1][0] == data2[pointer][0]) {
        data2.splice(pointer - 1, 2, [-1, data2[pointer - 1][1] + data2[pointer][1]]);
        pointer--;
      }
      if (data2[pointer][0] == (data2[pointer + 1] ?? [])[0]) {
        data2.splice(pointer, 2, [-1, data2[pointer][1] + data2[pointer + 1][1]]);
      }
      break;
    }
  }
  pointer--;
}

function calcChecksum(files) {
  var checksum = 0;
  var pointer = 0;
  for (let a = 0; a < files.length; a++) {
    let file = files[a];
    if (file[0] != -1) {
      //math solution to adding the appropriate amount in one line,
      //just from knowing the file's ID and length, and the data pointer
      checksum += file[0] * ((pointer * file[1]) + ((file[1] - 1) * (file[1]) / 2));
    }
    pointer += file[1];
  }
  return checksum;
}

var part1 = calcChecksum(data1);
var part2 = calcChecksum(data2);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);