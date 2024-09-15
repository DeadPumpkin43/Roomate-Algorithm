import * as dfd from "danfojs-node";

const personTable = new dfd.DataFrame(
  [
    ["Nate", 7, 1, 2, 4],
    ["Grady", 2, 6, 7, 4],
    ["Harry", 2, 7, 6, 5],
    ["Cy", 5, 4, 8, 7],
    ["Daly", 7, 5, 3, 8],
    ["Troy", 8, 4, 3, 6],
    ["Max", 1, 7, 5, 4],
    ["Mason", 1, 4, 3, 6],
    ["Q", 5, 4, 3, 6],
  ],
  {
    columns: ["Name", 1, 2, 3, 4],
  }
);

personTable.print();
