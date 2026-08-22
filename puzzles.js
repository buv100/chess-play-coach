"use strict";

function emptyBoard() {
  return "#".repeat(64);
}

function put(board, sq, piece) {
  const file = sq.charCodeAt(0) - 97;
  const rank = 8 - Number(sq[1]);
  const i = rank * 8 + file;
  return board.slice(0, i) + piece + board.slice(i + 1);
}

function buildBoard(setups) {
  let b = emptyBoard();
  setups.forEach(([sq, piece]) => {
    b = put(b, sq, piece);
  });
  return b;
}

const PUZZLES = [
  {
    id: 1,
    title: "Back-rank mate",
    theme: "Mate in 1",
    side: "white",
    intro: "White to move. Deliver checkmate on the back rank.",
    board: buildBoard([
      ["a8", "k"],
      ["a7", "R"],
      ["c1", "K"],
    ]),
    moves: ["a7a8"],
  },
  {
    id: 2,
    title: "Corner mate",
    theme: "Mate in 1",
    side: "white",
    intro: "White to move. The black king is trapped in the corner.",
    board: buildBoard([
      ["a8", "k"],
      ["c7", "Q"],
      ["c1", "K"],
    ]),
    moves: ["c7b8"],
  },
  {
    id: 3,
    title: "Free queen",
    theme: "Win material",
    side: "white",
    intro: "White to move. Black left the queen undefended.",
    board: buildBoard([
      ["d8", "k"],
      ["d5", "q"],
      ["d1", "Q"],
      ["e1", "K"],
    ]),
    moves: ["d1d5"],
  },
  {
    id: 4,
    title: "Knight fork",
    theme: "Tactics — fork",
    side: "white",
    intro: "White to move. Fork the king and queen with your knight.",
    board: buildBoard([
      ["e8", "k"],
      ["d5", "q"],
      ["f3", "N"],
      ["e1", "K"],
    ]),
    moves: ["f3e5"],
  },
  {
    id: 5,
    title: "Pin and win",
    theme: "Tactics — pin",
    side: "white",
    intro: "White to move. Exploit the pin and win material.",
    board: buildBoard([
      ["e8", "k"],
      ["e7", "B"],
      ["d7", "r"],
      ["a2", "R"],
      ["e1", "K"],
    ]),
    moves: ["a2d2"],
  },
  {
    id: 6,
    title: "Promotion",
    theme: "Endgame",
    side: "white",
    intro: "White to move. Push the pawn and promote.",
    board: buildBoard([
      ["g8", "k"],
      ["g7", "P"],
      ["e1", "K"],
    ]),
    moves: ["g7g8q"],
  },
  {
    id: 7,
    title: "Discovered check",
    theme: "Tactics — discovery",
    side: "white",
    intro: "White to move. Move the bishop and unleash the rook.",
    board: buildBoard([
      ["e8", "k"],
      ["e5", "b"],
      ["e1", "R"],
      ["c1", "K"],
    ]),
    moves: ["e5b8"],
  },
  {
    id: 8,
    title: "Smothered mate",
    theme: "Mate in 1",
    side: "white",
    intro: "White to move. Deliver smothered mate.",
    board: buildBoard([
      ["h8", "k"],
      ["g8", "r"],
      ["g6", "Q"],
      ["f6", "N"],
      ["e1", "K"],
    ]),
    moves: ["f6f7"],
  },
  {
    id: 9,
    title: "Mate in two",
    theme: "Mate in 2",
    side: "white",
    intro: "White to play and force mate in two moves.",
    board: buildBoard([
      ["g8", "k"],
      ["f6", "p"],
      ["h6", "p"],
      ["d1", "Q"],
      ["e1", "K"],
    ]),
    moves: ["d1h5", "g8h8", "h5h7"],
  },
  {
    id: 10,
    title: "Trapped queen",
    theme: "Win material",
    side: "white",
    intro: "White to move. Trap the black queen.",
    board: buildBoard([
      ["e8", "k"],
      ["d4", "q"],
      ["b5", "N"],
      ["e1", "K"],
    ]),
    moves: ["b5c7"],
  },
];

function getPuzzle(index) {
  if (!PUZZLES.length) return null;
  const i = ((index % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  return PUZZLES[i];
}

const PuzzleLib = {
  PUZZLES,
  getPuzzle,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PuzzleLib;
} else {
  window.PuzzleLib = PuzzleLib;
}
