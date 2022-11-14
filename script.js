const snake = function (
  head = [3, 4],
  tail = [
    [2, 4],
    [1, 4],
  ],
  orientation = 0,
  grow = 0,
  apple = [6, 4],
  board = [10, 10]
) {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const emptySpace = function () {
    let empty = [];
    let wholeSnake = tail.concat([head]);
    for (let x = 0; x < board[0]; x++) {
      for (let y = 0; y < board[1]; y++) {
        if (
          !wholeSnake.some((position) => position[0] == x && position[1] == y)
        ) {
          let space = [x, y];
          empty.push(space); //all board slots
        }
      }
    }
    return empty;
  };

  const validMoves = function () {
    let moves = [];
    directions.forEach((direction) => {
      const newX = head[0] + direction[0];
      const newY = head[1] + direction[1];
      const newPos = [newX, newY];
      if (newX >= 0 && newX < board[0] && newY >= 0 && newY < board[1]) {
        if (
          !tail.some((position) => {
            return position[0] == newX && position[1] == newY;
          })
        ) {
          moves.push(newPos);
        }
      }
    });
    return moves;
  };

  const eatApple = function () {
    randomSpace = function () {
      const appleSpace = emptySpace();
      const randomIndex = Math.floor(Math.random() * (appleSpace.length - 1));
      return appleSpace[randomIndex];
    };
    grow += 3;
    apple = randomSpace();
  };

  if (head[0] == apple[0] && head[1] == apple[1]) {
    eatApple();
  }

  const isDead = function () {
    if (
      tail.some((position) => {
        return position[0] == head[0] && position[1] == head[1];
      })
    ) {
      return true;
    } else if (
      head[0] < 0 ||
      head[0] >= board[0] ||
      head[1] < 0 ||
      head[1] >= board[1]
    ) {
      return true;
    } else {
      return false;
    }
  };

  const turn = function (newOrientation) {
    if (newOrientation == orientation) {
      return true;
    } else if (
      (orientation % 2 == 0 && newOrientation % 2 == 0) ||
      (orientation % 2 == 1 && newOrientation % 2 == 1)
    ) {
      return false; // Prevent user from turning backwards
    } else {
      orientation = newOrientation;
      return true;
    }
  };

  const advance = function () {
    if (isDead()) {
      return snake();
    }
    const newHead = [
      head[0] + directions[orientation][0],
      head[1] + directions[orientation][1],
    ];
    const newTail = tail;
    newTail.unshift(head);

    if (grow) {
      grow--;
    } else {
      newTail.pop();
    }
    return snake(newHead, newTail, orientation, grow, apple);
  };

  return {
    get head() {
      return head;
    },
    get tail() {
      return tail;
    },
    get board() {
      return board;
    },
    get apple() {
      return apple;
    },
    validMoves,
    turn,
    advance,
    isDead,
  };
};

const dom = function () {
  const generateBoard = function (snakeObj) {
    const board = document.querySelector(".board");
    board.textContent = "";
    for (let y = 0; y < snakeObj.board[1]; y++) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      for (let x = 0; x < snakeObj.board[0]; x++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("data-x", x);
        square.setAttribute("data-y", y);
        bar.appendChild(square);
      }
      board.prepend(bar);
    }
  };

  const refresh = function (snakeObj) {
    const snakeHead = snakeObj.head;
    const appleColor = snakeObj.apple;
    const AppleSquare = document.querySelector(
      `[data-x="${appleColor[0]}"][data-y="${appleColor[1]}"]`
    );
    AppleSquare.classList.add("apple");
    snakeObj.tail.forEach((tailCoord) => {
      let x = tailCoord[0];
      let y = tailCoord[1];
      const snakeSquare = document.querySelector(
        `[data-x="${x}"][data-y="${y}"]`
      );
      snakeSquare.classList.add("body");
      if (snakeObj.isDead()) {
        snakeSquare.classList.add("dead");
      }
    });
    if (!snakeObj.isDead()) {
      const headSquare = document.querySelector(
        `[data-x="${snakeHead[0]}"][data-y="${snakeHead[1]}"]`
      );
      headSquare.classList.add("head");
    }
  };
  return { refresh, generateBoard };
};

const game = function (gameboard = [10, 10], gameTick = 300) {
  let player = snake();
  let theDom = dom();
  let nextTurn = 0;
  theDom.generateBoard(player);
  theDom.refresh(player);
  let tick = setInterval(() => {
    //new game tick
    player.turn(nextTurn);
    player = player.advance();
    theDom.generateBoard(player);
    theDom.refresh(player);
  }, gameTick);
  const controller = function () {
    document.addEventListener("keydown", (e) => {
      if (
        e.key == "ArrowRight" ||
        e.key == "ArrowUp" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowDown"
      ) {
        if (e.key == "ArrowRight") {
          nextTurn = 0;
        } else if (e.key == "ArrowUp") {
          nextTurn = 1;
        } else if (e.key == "ArrowLeft") {
          nextTurn = 2;
        } else if (e.key == "ArrowDown") {
          nextTurn = 3;
        }
        theDom.generateBoard(player);
        theDom.refresh(player);
      }
    });
  };

  let gameController = controller(player);
};

let gameLoop = game();

//export { snake, game };
