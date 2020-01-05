var interval;
var WIDTH = 10;
var HEIGHT = 10;
var rowCount = 0;
var colCount = 0;
var started = false;
var timeInterval = 500;

var cells = [];

function addListener() {
  document
    .getElementById("myCanvas")
    .addEventListener("mousemove", mouseMove, false);
}

function onLoad() {
  var canvas = document.getElementById("myCanvas");
  canvas.style.left = "150px";
  canvas.style.top = "5px";
  canvas.width = window.innerWidth - 152;
  canvas.height = window.innerHeight - 10;
  canvas.style.position = "absolute";

  addListener();

  rowCount = canvas.height / WIDTH;
  colCount = canvas.width / HEIGHT;

  for (var i = 0; i < rowCount; i++) {
    cells[i] = [];
    for (var j = 0; j < colCount; j++) {
      var cell = {
        row: i,
        col: j,
        width: WIDTH,
        height: HEIGHT,
        isActive: false,
        wasActive: false
      };

      cells[i][j] = cell;
    }
  }
}

function mouseMove(e) {
  var x, y;

  if (e.layerX || e.layerX == 0) {
    // Firefox
    x = e.layerX;
    y = e.layerY;
  } else if (e.offsetX || e.offsetX == 0) {
    // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }

  // if (!started) {
  if (x < colCount && y < rowCount) {
    addPoint(x, y);
    // started = true;
  }
  // } else {
  //   if (x < colCount && y < rowCount) {
  //     addPoint(x, y);
  //   }
  // }
}

function removeListener() {
  document
    .getElementById("myCanvas")
    .removeEventListener("mousemove", mouseMove, false);
}

function stop() {
  clearInterval(interval);
  clearCanvas();

  setTimeout(function() {
    for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[0].length; j++) {
        cells[i][j].isActive = false;
        cells[i][j].wasActive = false;
      }
    }
    addListener();
  }, 50);

  document.getElementById("totalPoints").innerHTML = 0;
}

function addPoint() {
  var row = parseInt(document.getElementById("row").value);
  var col = parseInt(document.getElementById("col").value);

  cells[row][col].wasActive = true;
  cells[row][col].isActive = true;

  document.getElementById("totalPoints").innerHTML =
    parseInt(document.getElementById("totalPoints").innerText) + 1;

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  drawCell(cells[row][col]);
}

function addPoint(col, row) {
  cells[row][col].wasActive = true;
  cells[row][col].isActive = true;

  document.getElementById("totalPoints").innerHTML =
    parseInt(document.getElementById("totalPoints").innerText) + 1;

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  drawCell(cells[row][col]);
}

function removePoint() {
  var row = parseInt(document.getElementById("row").value);
  var col = parseInt(document.getElementById("col").value);

  cells[row][col].wasActive = false;
  cells[row][col].isActive = false;

  document.getElementById("totalPoints").innerHTML =
    parseInt(document.getElementById("totalPoints").innerText) - 1;

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  drawCell(cells[row][col]);
}
function clearCanvas() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function loop() {
  removeListener();
  clearCanvas();

  interval = setInterval(function() {
    setWasActive();

    index = 0;
    var totalSize = cells.length * cells[0].length;
    colIndex = 0;
    rowIndex = 0;

    completed = true;
    while (index < totalSize) {
      if (completed) {
        completed = setIsActive(rowIndex, colIndex);
      } else {
        setIsActive(rowIndex, colIndex);
      }

      if (colIndex + 1 < colCount) {
        colIndex++;
      } else if (rowIndex + 1 < rowCount) {
        rowIndex++;
        colIndex = 0;
      }

      index++;
    }

    for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[0].length; j++) {
        drawCell(cells[i][j]);
      }
    }

    if (completed) {
      stop();
    }
  }, timeInterval);
}

function setWasActive() {
  for (var i = 0; i < rowCount; i++) {
    for (var j = 0; j < colCount; j++) {
      cells[i][j].wasActive = cells[i][j].isActive;
    }
  }
}

function getNeighbours(row, col) {
  var neighbours = [];

  if (col + 1 < colCount) {
    if (row - 1 >= 0) {
      neighbours.push(cells[row - 1][col + 1]);
    }

    neighbours.push(cells[row][col + 1]);

    if (row + 1 < rowCount) {
      neighbours.push(cells[row + 1][col + 1]);
    }
  }

  if (col - 1 >= 0) {
    if (row - 1 >= 0) {
      neighbours.push(cells[row - 1][col - 1]);
    }

    neighbours.push(cells[row][col - 1]);

    if (row + 1 < rowCount) {
      neighbours.push(cells[row + 1][col - 1]);
    }
  }

  if (row + 1 < rowCount) {
    neighbours.push(cells[row + 1][col]);
  }

  if (row - 1 >= 0) {
    neighbours.push(cells[row - 1][col]);
  }

  return neighbours;
}

function setIsActive(rowIndex, colIndex) {
  var completed = true;
  var neighbours = getNeighbours(rowIndex, colIndex);

  var alives = neighbours.filter(e => e.wasActive);

  if (cells[rowIndex][colIndex].wasActive === true) {
    if (alives.length >= 4 || alives.length <= 1) {
      cells[rowIndex][colIndex].isActive = false;
      completed = false;
    } else {
      cells[rowIndex][colIndex].isActive = true;
    }
  } else {
    if (alives.length === 3) {
      cells[rowIndex][colIndex].isActive = true;
      completed = false;
    }
  }

  return completed;
}

function drawCell(cell) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  if (cell.isActive === true) {
    ctx.fillStyle = "rgba(255, 255, 255, 1)"; //getRandomColor();
  } else {
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
  }

  ctx.fillRect(
    cell.col * cell.width,
    cell.row * cell.height,
    cell.width,
    cell.height
  );
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  if (color === "#000000") {
    return getRandomColor();
  }

  return color;
}
