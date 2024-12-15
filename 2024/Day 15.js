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

var stage = true; //true is map, false is directions
var map1 = []; //part1 map
var map2 = []; //part2 map
var directions = []; //["<", "^", ...];
var location1; //[y, x];
var location2; //[y, x];
for (let y = 0; y < input.length; y++) {
  if (input[y].length == 0) {
    stage = false;
    continue;
  }

  let cur1 = [];
  let cur2 = [];
  for (let x = 0; x < input[y].length; x++) {
    let char = input[y][x];
    if (char == "@") {
      location1 = [y, x];
      location2 = [y, x * 2]; //since everything is twice as wide in part2
      char = ".";
    }
    cur1.push(char);

    if (char == "#") {
      cur2.push("#", "#");
    } else {
      cur2.push(char, ".");
    }
  }

  if (stage) {
    map1.push(cur1);
    map2.push(cur2);
  } else {
    directions.push(...cur1);
  }
}

var dirMap = {"^": [-1, 0], ">": [0, 1], "v": [1, 0], "<": [0, -1]};
while (directions.length > 0) {
  let dir = dirMap[directions.shift()];
  [map1, location1] = step(map1, location1, dir);
  [map2, location2] = step(map2, location2, dir, true);
}

//returns the new map and the robot's new location after moving one step
function step(map, loc, dir, part2 = false) {
  let [y, x] = loc;
  let [dy, dx] = dir;

  //handles the recursive vertical box pushing logic
  if (part2 && dy != 0) {
    y += dy;
    let valid, found;
    if (map[y][x] == "O") {
      //left-half box directly above/below
      [valid, found] = findBoxes(map, [y, x], dir, [[y, x]]);
    } else if (map[y][x - 1] == "O") {
      //right-half box directly above/below
      [valid, found] = findBoxes(map, [y, x - 1], dir, [[y, x - 1]]);
    } else if (map[y][x] == "#") {
      //wall, don't move
      return [map, loc];
    } else {
      //empty, just move there
      return [map, [y, x]];
    }
    
    if (!valid) {
      //one of the boxes would be pushed into a wall
      return [map, loc];
    } else {
      //sort found boxes based on height, to avoid moving a box inside another
      if (dy == 1) {
        found.sort((a, b) => a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]);
      } else {
        found.sort((a, b) => b[0] == a[0] ? b[1] - a[1] : b[0] - a[0]);
      }

      //move boxes up or down
      while (found.length > 0) {
        let [boxy, boxx] = found.pop();
        map[boxy][boxx] = ".";
        map[boxy + dy][boxx] = "O";
      }

      return [map, [y, x]];
    }
  } else {
    //move in this direction until no longer encountering a box
    do {
      y += dy;
      x += dx;
    } while (map[y][x] == "O" || (part2 && map[y + dy][x - 1] == "O")) //avoid moving into right-side of a box for part2

    //if we're now encountering a wall, don't move
    if (map[y][x] == "#") {
      return [map, loc];
    }

    //otherwise, move the robot and all the boxes over
    loc = [loc[0] + dy, loc[1] + dx];
    while (y != loc[0] || x != loc[1]) {
      map[y][x] = map[y - dy][x - dx];
      y -= dy;
      x -= dx;
    }
    map[y][x] = ".";
    return [map, loc];
  }
}

//recursively checks all boxes in a vertical stack, for part2
function findBoxes(map, loc, dir, found) {
  let [y, x] = loc;
  let [dy, dx] = dir;
  y += dy;
  
  //each box's left-side looks for the left-side of a box in the three above adjacent spaces 
  for (let a = -1; a <= 1; a++) {
    let valid = true;
    //a wall to the top-left of a box isn't an issue
    if (a != -1 && map[y][x + a] == "#") {
      return [false, []];
    //avoid duplicate checking a box
    } else if (map[y][x + a] == "O" && !found.some(n => n[0] == y && n[1] == x + a)) {
      //create a list of found boxes, to know where to edit the map later
      found.push([y, x + a]);
      [valid, found] = findBoxes(map, [y, x + a], dir, found);
    }

    //encountered a wall, send a false up the chain
    if (!valid) {
      return [false, []];
    }
  }

  //if you got here, you've checked possible boxes above you and found no walls,
  //so send a true and the found boxes up the chain
  return [true, found];
}

//calculates the total GPS score
function calcGPS(map) {
  let GPS = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == "O") {
        GPS += (100 * y) + x;
      }
    }
  }
  return GPS;
}

var part1 = calcGPS(map1);
var part2 = calcGPS(map2);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);