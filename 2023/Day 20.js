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

//parse input
var part2 = [{}];
var modules = {}; //type, destinations, recent sent pulse (false = low, true = high), specialization
while (input.length > 0) {
  let cur = input.shift().split(" -> ");
  let destinations = cur[1].split(", ");
  let name = cur[0];
  let type = name.slice(0, 1);
  if (name == "broadcaster") {
    modules[name] = ["", destinations, false];
  } else {
    name = name.slice(1);
    modules[name] = [type, destinations, false];
    if (type == "%") {
      modules[name].push(false);
    } else if (type == "&") {
      modules[name].push([]);
    }
  }

  if (destinations.includes("rx")) {
    part2[1] = name;
  }
}

//need to record all conjunction module's connected input modules
//also records the modules that connect to the module that connects to rx
let entries = Object.entries(modules);
while (entries.length > 0) {
  let cur = entries.shift();
  let module = cur[0];
  let destinations = [...cur[1][1]];
  while (destinations.length > 0) {
    let destination = destinations.shift();
    if ((modules[destination] ?? [])[0] == "&") {
      modules[destination][3].push(module);
    }

    if (destination == part2[1]) {
      part2[0][module] = [];
    }
  }
}

//solve
function sendPulses() {
  let queue = [["broadcaster", false]];
  let pulses = [1, 0];
  while (queue.length > 0) {
    let [module, sent] = queue.shift();
    if (modules[module] == undefined) {
      continue;
    }
    let [type, destinations] = modules[module];
    if (type == "") {
      queue.push(...destinations.map(x => [x, sent]));
      modules[module][2] = sent;
      pulses[modules[module][2] ? 1 : 0] += destinations.length;
    } else if (type == "%") {
      if (!sent) {
        modules[module][3] = !modules[module][3];
        queue.push(...destinations.map(x => [x, modules[module][3]]));
        modules[module][2] = modules[module][3];
        pulses[modules[module][2] ? 1 : 0] += destinations.length;
      }
    } else if (type == "&") {
      if (modules[module][3].map(x => modules[x][2]).every(x => x)) {
        queue.push(...destinations.map(x => [x, false]));
        modules[module][2] = false;
        pulses[modules[module][2] ? 1 : 0] += destinations.length;
      } else {
        queue.push(...destinations.map(x => [x, true]));
        modules[module][2] = true;
        pulses[modules[module][2] ? 1 : 0] += destinations.length;
      }
    }

    if (destinations.includes(part2[1]) && modules[module][2]) {
      part2[0][module].push(index);
    }
  }
  return pulses;
}

var part1 = [0, 0];
var index = 1;
while (Object.values(part2[0]).map(x => x.length > 0).some(x => !x)) {
  let pulses = sendPulses();
  if (index <= 1000) {
    pulses.forEach((x, idx) => part1[idx] += x);
  }
  index++;
}

//for lcm, for part 2
function gcd(a, b) {
  if (b == 0) { return a; }
  return gcd(b, a % b);
}

console.log("----- OUTPUT -----");
console.log("Part 1:", part1.reduce((a, b) => a * b));
console.log("Part 2:", Object.values(part2[0]).map(x => x[0]).reduce((a, b) => (a * b) / gcd(a, b)));