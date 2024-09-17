import * as dfd from "danfojs-node";
import random from "random";
import { maxIndices } from "./returnIndices.js";

const personTable = new dfd.DataFrame(
  [
    ["Nate", 7, 1, 2, 4, 0],
    ["Grady", 2, 6, 7, 4, 1],
    ["Harry", 1, 7, 6, 5, 2],
    ["Cy", 5, 4, 8, 7, 3],
    ["Daly", 7, 5, 3, 8, 4],
    ["Troy", 8, 4, 3, 6, 5],
    ["Max", 1, 7, 5, 4, 6],
    ["Mason", 1, 4, 3, 6, 7],
    ["Q", 5, 4, 3, 6, 8],
  ],
  {
    columns: ["Name", 1, 2, 3, 4, "TrueIndex"],
  }
);

var tempTable = personTable.copy();

var pairArray = [];

var pairAmounts = Math.ceil(personTable.shape[0] / 3);
for (var i = 0; i < pairAmounts; i++) {
  var columnArray = tempTable["TrueIndex"].values;
  var chosenSelect = random.int(0, tempTable.shape[0] - 1);
  var trueIndex = tempTable.iloc({ rows: [chosenSelect] })["TrueIndex"]
    .values[0];
  var userSelections = tempTable.iloc({
    rows: [chosenSelect],
    columns: [1, 2, 3, 4],
  }).values[0];
  var doubleChosen = [];
  userSelections.forEach((e) => {
    var currIndex = columnArray.findIndex((a) => a == e);
    if (currIndex == -1) {
      return;
    }

    if (
      tempTable
        .iloc({ rows: [currIndex], columns: [1, 2, 3, 4] })
        .values[0].includes(trueIndex)
    ) {
      doubleChosen.push(currIndex);
    }
  });
  var pairMate;
  var doubleCount = [];

  doubleChosen.forEach((e) => {
    var otherSelected = tempTable.iloc({ rows: [e], columns: [1, 2, 3, 4] })
      .values[0];
    var pair = 0;
    otherSelected.forEach((f) => {
      pair += userSelections.includes(f) ? 1 : 0;
    });
    doubleCount.push(pair);
  });
  if (doubleCount.length <= 0) {
    i--;
    continue;
  }
  var maxCanidates = maxIndices(doubleCount);
  if (maxCanidates.length > 1) {
    maxCanidates = maxCanidates[random.int(0, maxCanidates.length - 1)];
  }
  pairMate = columnArray[doubleChosen[maxCanidates]];
  tempTable.drop({
    index: [chosenSelect, doubleChosen[maxCanidates]],
    inplace: true,
  });
  tempTable.resetIndex({
    inplace: true,
  });

  console.log(
    `doubleChosen:${doubleChosen} \n Index:${trueIndex} \n TempTable Index:${chosenSelect} \n In Common:${doubleCount} \n Top Canidate:${maxCanidates} \n PairMate:${pairMate}`
  );
  pairArray.push([trueIndex, pairMate]);
  tempTable.print();
}
console.log(pairArray);
var pairNames = [];

pairArray.forEach((e) => {
  var f = [];
  e.forEach((a) => {
    f.push(personTable.iloc({ rows: [a] })["Name"].values[0]);
  });
  pairNames.push(f);
});
console.log(pairNames);
var addOnArray = [];
pairArray.forEach((e) => {
  var arr = [];
  tempTable["TrueIndex"].values.forEach((a) => {
    var value = 0;
    e.forEach((d) => {
      var personSelfValue = personTable
        .iloc({ rows: [a], columns: [1, 2, 3, 4] })
        .values[0].includes(d)
        ? 0.5
        : 0;

      var otherValue = personTable
        .iloc({ rows: [d], columns: [1, 2, 3, 4] })
        .values[0].includes(a)
        ? 1
        : 0;

      value += personSelfValue;
      value += otherValue;
      /*console.log(
        `Self Value:${personSelfValue}\nOther Value:${otherValue}\nIndex:${a}\nOther Index${d}`
      );*/
    });
    console.log(`Index:${a}\nPair:${e}\nValue:${value}`);
    arr.push(value);
  });
  addOnArray.push(arr);
});

console.log(addOnArray);
var addon = new dfd.DataFrame(addOnArray, {
  index: pairArray,
  columns: tempTable["TrueIndex"].values,
});
addon.print();

function checkIfWonOthers(currentIndex, person, minimumNum = null) {
  var checkDex = addon.index;
  checkDex.splice(checkDex.indexOf(currentIndex), 1);
  var highestValue;
  var foundWin = false;
  checkDex.forEach((e) => {
    var locRes = addon.loc({ rows: [e] }).values[0];
    var locColumn = addon.loc({ rows: [e] }).columns;
    var winn = maxIndices(locRes);
    if (winn.length > 1) {
      return;
    }
    if (locColumn[winn[0]] == person) {
      foundWin = true;
      highestValue =
        locRes[winn[0]] > highestValue ? locRes[winn[0]] : highestValue;
    }
  });

  if (!minimumNum) {
    return foundWin;
  }
  if (highestValue >= minimumNum && foundWin) {
    return true;
  } else {
    return false;
  }
}

for (var e in pairArray) {
  var candidates = addon.loc({ rows: [pairArray[e]] }).values[0];
  var candidatesTrueIndex = addon.loc({ rows: [pairArray[e]] }).columns;
  console.log(pairArray[e]);
  console.log(candidates);
  var winners = maxIndices(candidates);
  var realWinner;
  if (winners.length > 1) {
    for (var a in winners) {
      console.log(`Winner:${winners[a]} Winners:${winners}`);
      if (
        checkIfWonOthers(
          e,
          candidatesTrueIndex[winners[a]],
          candidates[winners[a]]
        )
      ) {
        realWinner = candidatesTrueIndex[winners[a]];
        break;
      }
    }
    if (!realWinner) {
      realWinner =
        candidatesTrueIndex[winners[random.int(0, winners.length - 1)]];
    }
  } else {
    realWinner = candidatesTrueIndex[winners[0]];
  }
  addon.print();
  console.log(pairArray[e]);
  addon.drop({ index: [pairArray[e]], inplace: true });
  addon.drop({ columns: [realWinner], inplace: true });
  pairArray[e].push(realWinner);
  console.log(realWinner);
}
console.log(pairArray);
