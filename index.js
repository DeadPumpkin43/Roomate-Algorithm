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
