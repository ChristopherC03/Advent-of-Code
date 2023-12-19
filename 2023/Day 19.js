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
var workflows = {};
var parts = [];
var mode = true; //true: workshops, false: parts
while (input.length > 0) {
  let cur = input.shift();
  if (cur.length == 0) {
    //double linebreak
    mode = false;
  } else if (mode) {
    //workshops
    cur = cur.split("{");
    let workflow = cur[0];
    let rules = cur[1].slice(0, -1);
    rules = rules.split(",").map(x => x.split(":"));
    for (let a = 0; a < rules.length - 1; a++) {
      rules[a][0] = [rules[a][0].slice(0, 1), rules[a][0].slice(1, 2), Number(rules[a][0].slice(2))];
    }
    workflows[workflow] = rules;
  } else {
    //parts
    let part = {};
    let rating = cur.slice(1, -1).split(",").map(x => x.split("="));
    for (let a = 0; a < rating.length; a++) {
      part[rating[a][0]] = Number(rating[a][1]);
    }
    parts.push(part);
  }
}

//cleans up workflows with rules that don't actually matter
//(e.g., lnx{m>1548:A,A} and qs{s>3448:A,lnx} both end up being superficial workflows)
let found;
do {
  //remove tail-end rules that lead to the same place
  found = [];
  let keys = Object.keys(workflows);
  for (let a = 0; a < keys.length; a++) {
    let rules = workflows[keys[a]];
    while (rules.length > 1 && rules[rules.length - 1][0] == rules[rules.length - 2][1]) {
      rules.splice(rules.length - 2, 1);
    }
    if (rules.length == 1) {
      found.push(keys[a]);
    }
  }

  //replace workflow gotos that lead to a constant value with that constant value
  for (let a = 0; a < keys.length; a++) {
    let rules = workflows[keys[a]];
    for (let b = 0; b < rules.length; b++) {
      let rule = rules[b];
      let index = found.indexOf(rule[rule.length - 1]);
      if (index != -1) {
        rule[rule.length - 1] = workflows[rule[rule.length - 1]][0][0];
      }
    }
  }

  //remove constant valued workflows
  for (let a = 0; a < found.length; a++) {
    delete workflows[found[a]];
  }
} while (found.length > 0)

//part 1
//it would be more efficient to run these through ranges["in"] generated below,
//but this was my original code for part 1 so I decided to keep it in.
var part1 = 0;
while (parts.length > 0) {
  let part = parts.shift();
  let workflow = "in";
  //until workflow accept/reject state is found
  while (workflow != "A" && workflow != "R") {
    let rules = workflows[workflow];
    //for each rule
    for (let a = 0; a < rules.length; a++) {
      let rule = rules[a];
      //check if this rule applies, then apply it if so
      if (rule.length == 1) {
        workflow = rule[0];
        break;
      } else if (
        (rule[0][1] == ">" && part[rule[0][0]] > rule[0][2]) ||
        (rule[0][1] == "<" && part[rule[0][0]] < rule[0][2])
      ) {
        workflow = rule[1];
        break;
      }
    }
  }
  
  //add part values to accepted, if it was accepted
  if (workflow == "A") {
    part1 += Object.values(part).reduce((a, b) => a + b);
  }
}

//part 2
//work backwards to get a list of ranges for each node that leads to an accepted value
var ranges = {};
var remaining = Object.keys(workflows);
let index = 0;
while (remaining.length > 0) {
  //see if current index is dead end (only leads to constants or nodes we've already completed)
  let workflow = workflows[remaining[index]];
  let deadend = true;
  for (let a = 0; a < workflow.length; a++) {
    let rule = workflow[a];
    if (remaining.includes(rule[rule.length - 1])) {
      deadend = false;
      break;
    }
  }

  //if deadend, assemble range based on rules
  if (deadend) {
    let failRange = {
      "x": [1, 4000],
      "m": [1, 4000],
      "a": [1, 4000],
      "s": [1, 4000]
    };
    let accepted = [];
    for (let a = 0; a < workflow.length; a++) {
      //last rule, don't need to update ranges
      let rule = workflow[a];
      if (rule.length == 1) {
        if (rule[0] != "R") {
          if (rule[0] != "A") {
            accepted.push(...mergeRanges(ranges[rule[0]], failRange));
          } else {
            accepted.push(failRange);
          }
        }
        break;
      }

      //goto isn't a void, find the successful range for this rule and apply
      if (rule[1] != "R") {
        let successRange = {};
        Object.entries(failRange).map(x => successRange[x[0]] = [...x[1]]);
        if (rule[0][1] == ">") {
          successRange[rule[0][0]][0] = Math.max(successRange[rule[0][0]][0], rule[0][2] + 1);
        } else {
          successRange[rule[0][0]][1] = Math.min(successRange[rule[0][0]][1], rule[0][2] - 1);
        }

        if (rule[1] != "A") {
          accepted.push(...mergeRanges(ranges[rule[1]], successRange));
        } else {
          accepted.push(successRange);
        }
      }

      //find the failed range for this rule and apply
      if (rule[0][1] == ">") {
        failRange[rule[0][0]][1] = Math.min(failRange[rule[0][0]][1], rule[0][2]);
      } else {
        failRange[rule[0][0]][0] = Math.max(failRange[rule[0][0]][0], rule[0][2]);
      }
    }
    ranges[remaining[index]] = accepted;
    remaining.splice(index, 1);
    index--;
  }
  
  index = (index + 1) % remaining.length;
}

function mergeRanges(range1, range2) {
  let merges = [];
  for (let a = 0; a < range1.length; a++) {
    let merge = {};
    let keys = ["x", "m", "a", "s"];
    for (let b = 0; b < keys.length; b++) {
      let key = keys[b];
      let r1 = range1[a][key]
      let r2 = range2[key];
      merge[key] = [Math.max(r1[0], r2[0]), Math.min(r1[1], r2[1])];
    }
    merges.push(merge);
  }
  return merges;
}

var part2 = ranges["in"]
  .map(x => Object.values(x)
    .map(y => (y[1] - y[0]) + 1)
    .reduce((a, b) => a * b))
  .reduce((a, b) => a + b);

console.log("----- OUTPUT -----");
console.log("Part 1:", part1);
console.log("Part 2:", part2);