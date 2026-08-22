"use strict";

const PIECE_VALUE = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const PST = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, -5, -10, 0, 0, -10, -5, 5,
    5, 10, 10, -20, -20, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -20, -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, 10, 10, 10, 10, 5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    0, 0, 0, 5, 5, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 5, 5, 5, 0, -10,
    -5, 0, 5, 5, 5, 5, 0, -5,
    0, 0, 5, 5, 5, 5, 0, -5,
    -10, 5, 5, 5, 5, 5, 0, -10,
    -10, 0, 5, 0, 0, 0, 0, -10,
    -20, -10, -10, -5, -5, -10, -10, -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    20, 20, 0, 0, 0, 0, 20, 20,
    20, 30, 10, 0, 0, 10, 30, 20,
  ],
};

const KNIGHT = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];
const KING = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function idxToRc(i) {
  return [Math.floor(i / 8), i % 8];
}

function rcToIdx(r, c) {
  return r * 8 + c;
}

function inside(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function indexToSquare(i) {
  return String.fromCharCode(97 + (i % 8)) + String(8 - Math.floor(i / 8));
}

function squareToIndex(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = sq.charCodeAt(1) - 49;
  return (7 - rank) * 8 + file;
}

function isWhitePiece(ch) {
  return ch !== "#" && ch === ch.toUpperCase();
}

function isEmpty(ch) {
  return !ch || ch === "#";
}

function kind(ch) {
  return ch.toLowerCase();
}

function cloneBoard(board) {
  return board.split("");
}

function boardString(arr) {
  return arr.join("");
}

function pathClear(arr, sr, sc, dr, dc) {
  const stepR = Math.sign(dr - sr);
  const stepC = Math.sign(dc - sc);
  let r = sr + stepR;
  let c = sc + stepC;
  while (r !== dr || c !== dc) {
    if (!isEmpty(arr[rcToIdx(r, c)])) {
      return false;
    }
    r += stepR;
    c += stepC;
  }
  return true;
}

function canPieceMove(arr, src, dst) {
  if (src === dst) {
    return false;
  }
  const piece = arr[src];
  const dest = arr[dst];
  if (isEmpty(piece)) {
    return false;
  }
  if (!isEmpty(dest) && isWhitePiece(piece) === isWhitePiece(dest)) {
    return false;
  }

  const [sr, sc] = idxToRc(src);
  const [dr, dc] = idxToRc(dst);
  const dR = dr - sr;
  const dC = dc - sc;
  const adR = Math.abs(dR);
  const adC = Math.abs(dC);
  const white = isWhitePiece(piece);

  switch (kind(piece)) {
    case "k":
      return adR <= 1 && adC <= 1;
    case "n":
      return (adR === 2 && adC === 1) || (adR === 1 && adC === 2);
    case "r":
      return (sr === dr || sc === dc) && pathClear(arr, sr, sc, dr, dc);
    case "b":
      return adR === adC && adR !== 0 && pathClear(arr, sr, sc, dr, dc);
    case "q":
      return ((sr === dr || sc === dc) || (adR === adC && adR !== 0)) && pathClear(arr, sr, sc, dr, dc);
    case "p": {
      const dir = white ? -1 : 1;
      const start = white ? 6 : 1;
      if (dC === 0 && dR === dir && isEmpty(dest)) {
        return true;
      }
      if (dC === 0 && dR === 2 * dir && sr === start && isEmpty(dest) && isEmpty(arr[rcToIdx(sr + dir, sc)])) {
        return true;
      }
      if (adC === 1 && dR === dir && !isEmpty(dest) && isWhitePiece(dest) !== white) {
        return true;
      }
      return false;
    }
    default:
      return false;
  }
}

function findKing(arr, white) {
  const target = white ? "K" : "k";
  return arr.indexOf(target);
}

function inCheck(arr, white) {
  const king = findKing(arr, white);
  if (king < 0) {
    return true;
  }
  for (let i = 0; i < 64; i++) {
    const ch = arr[i];
    if (isEmpty(ch) || isWhitePiece(ch) === white) {
      continue;
    }
    if (canPieceMove(arr, i, king)) {
      return true;
    }
  }
  return false;
}

function makeMove(arr, src, dst) {
  const captured = arr[dst];
  arr[dst] = arr[src];
  arr[src] = "#";
  return captured;
}

function unmakeMove(arr, src, dst, captured) {
  arr[src] = arr[dst];
  arr[dst] = captured;
}

function legalMoves(board, whiteTurn) {
  const arr = typeof board === "string" ? cloneBoard(board) : board;
  const moves = [];
  for (let src = 0; src < 64; src++) {
    const ch = arr[src];
    if (isEmpty(ch) || isWhitePiece(ch) !== whiteTurn) {
      continue;
    }
    for (let dst = 0; dst < 64; dst++) {
      if (!canPieceMove(arr, src, dst)) {
        continue;
      }
      const captured = makeMove(arr, src, dst);
      const legal = !inCheck(arr, whiteTurn);
      unmakeMove(arr, src, dst, captured);
      if (legal) {
        moves.push(indexToSquare(src) + indexToSquare(dst));
      }
    }
  }
  return moves;
}

function evaluate(arr) {
  let score = 0;
  for (let i = 0; i < 64; i++) {
    const ch = arr[i];
    if (isEmpty(ch)) {
      continue;
    }
    const k = kind(ch);
    const white = isWhitePiece(ch);
    const tableIndex = white ? i : i ^ 56;
    const value = (PIECE_VALUE[k] || 0) + (PST[k] ? PST[k][tableIndex] : 0);
    score += white ? value : -value;
  }
  return score;
}

function moveOrder(arr, moves) {
  return moves
    .map((move) => {
      const dst = squareToIndex(move.slice(2, 4));
      const victim = arr[dst];
      const score = isEmpty(victim) ? 0 : 10 * (PIECE_VALUE[kind(victim)] || 0);
      return { move, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.move);
}

function negamax(arr, whiteTurn, depth, alpha, beta, ply, deadline) {
  if (deadline && Date.now() > deadline) {
    return evaluate(arr) * (whiteTurn ? 1 : -1);
  }
  const moves = moveOrder(arr, legalMoves(arr, whiteTurn));
  if (moves.length === 0) {
    if (inCheck(arr, whiteTurn)) {
      return -200000 + ply;
    }
    return 0;
  }
  if (depth <= 0) {
    return evaluate(arr) * (whiteTurn ? 1 : -1);
  }

  let best = -Infinity;
  for (const move of moves) {
    const src = squareToIndex(move.slice(0, 2));
    const dst = squareToIndex(move.slice(2, 4));
    const captured = makeMove(arr, src, dst);
    const score = -negamax(arr, !whiteTurn, depth - 1, -beta, -alpha, ply + 1, deadline);
    unmakeMove(arr, src, dst, captured);
    if (score > best) {
      best = score;
    }
    if (best > alpha) {
      alpha = best;
    }
    if (alpha >= beta) {
      break;
    }
  }
  return best;
}

function searchBest(board, whiteTurn, depth, deadline) {
  const arr = cloneBoard(board);
  const moves = moveOrder(arr, legalMoves(arr, whiteTurn));
  if (!moves.length) {
    return null;
  }
  let bestMove = moves[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;
  for (const move of moves) {
    if (deadline && Date.now() > deadline) {
      break;
    }
    const src = squareToIndex(move.slice(0, 2));
    const dst = squareToIndex(move.slice(2, 4));
    const captured = makeMove(arr, src, dst);
    const score = -negamax(arr, !whiteTurn, depth - 1, -beta, -alpha, 1, deadline);
    unmakeMove(arr, src, dst, captured);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (score > alpha) {
      alpha = score;
    }
  }
  return { move: bestMove, score: bestScore, moves };
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function chooseMove(board, whiteTurn, level) {
  const moves = legalMoves(board, whiteTurn);
  if (!moves.length) {
    return null;
  }
  const lv = Math.max(1, Math.min(10, Number(level) || 1));
  const arr = cloneBoard(board);
  const captures = moves.filter((m) => !isEmpty(arr[squareToIndex(m.slice(2, 4))]));

  if (lv <= 2) {
    if (captures.length && Math.random() < (lv === 1 ? 0.2 : 0.4)) {
      return pickRandom(captures);
    }
    return pickRandom(moves);
  }
  if (lv <= 4) {
    const found = searchBest(board, whiteTurn, 1, Date.now() + 40);
    if (!found) {
      return pickRandom(moves);
    }
    if (Math.random() < 0.35) {
      return pickRandom((found.moves || moves).slice(0, 4));
    }
    return found.move;
  }
  if (lv <= 7) {
    const found = searchBest(board, whiteTurn, 1, Date.now() + 80);
    return (found && found.move) || pickRandom(moves);
  }
  const found = searchBest(board, whiteTurn, 2, Date.now() + 120);
  return (found && found.move) || pickRandom(moves);
}

function bestMove(board, whiteTurn) {
  const found = searchBest(board, whiteTurn, 1, Date.now() + 60);
  return found ? found.move : null;
}

function analyzeMove(board, whiteTurn, move, histLen) {
  const found = searchBest(board, whiteTurn, 1, Date.now() + 50);
  if (!found) {
    return { kind: "good", idea: "", best: null };
  }

  const arr = cloneBoard(board);
  const src = squareToIndex(move.slice(0, 2));
  const dst = squareToIndex(move.slice(2, 4));
  const before = evaluate(arr);
  makeMove(arr, src, dst);
  const after = evaluate(arr);
  const playedDelta = whiteTurn ? after - before : before - after;

  let bestDelta = playedDelta;
  if (found.move && found.move !== move) {
    const probe = cloneBoard(board);
    const bs = squareToIndex(found.move.slice(0, 2));
    const bd = squareToIndex(found.move.slice(2, 4));
    const b0 = evaluate(probe);
    makeMove(probe, bs, bd);
    const b1 = evaluate(probe);
    bestDelta = whiteTurn ? b1 - b0 : b0 - b1;
  }

  const loss = bestDelta - playedDelta;
  const idea = `${found.move.slice(0, 2)} → ${found.move.slice(2, 4)}`;

  if (move === found.move || loss <= 20) {
    return { kind: "best", idea, best: found.move };
  }
  if (loss <= 50) {
    return { kind: histLen < 10 ? "book" : "excellent", idea, best: found.move };
  }
  if (loss <= 100) {
    return { kind: "good", idea, best: found.move };
  }
  if (loss <= 180) {
    return { kind: "inaccuracy", idea, best: found.move };
  }
  if (loss <= 320) {
    return { kind: "mistake", idea, best: found.move };
  }
  return { kind: "blunder", idea, best: found.move };
}

function findThreats(board, forWhite) {
  const arr = cloneBoard(board);
  const threats = [];
  const attackers = [];
  for (let src = 0; src < 64; src++) {
    const atk = arr[src];
    if (!isEmpty(atk) && isWhitePiece(atk) !== forWhite) {
      attackers.push(src);
    }
  }
  for (let dst = 0; dst < 64; dst++) {
    const ch = arr[dst];
    if (isEmpty(ch) || isWhitePiece(ch) !== forWhite) {
      continue;
    }
    for (const src of attackers) {
      if (canPieceMove(arr, src, dst)) {
        threats.push({
          from: indexToSquare(src),
          to: indexToSquare(dst),
        });
        break;
      }
    }
  }
  return threats.slice(0, 6);
}

function quickTip(board, whiteToMove, histLen) {
  const arr = cloneBoard(board);
  if (histLen < 2) {
    return "Open with e4/d4, then bring knights out before the queen.";
  }
  if (inCheck(arr, whiteToMove)) {
    return "You're in check — escape, block, or capture the attacker.";
  }
  const threats = findThreats(board, whiteToMove);
  if (threats.length) {
    return `Threat on ${threats[0].to} — defend it, move it, or counterattack.`;
  }
  const undeveloped = [];
  const back = whiteToMove ? 7 : 0;
  for (let c = 0; c < 8; c++) {
    const ch = arr[rcToIdx(back, c)];
    if (!isEmpty(ch) && isWhitePiece(ch) === whiteToMove) {
      const k = kind(ch);
      if (k === "n" || k === "b") {
        undeveloped.push(k === "n" ? "knight" : "bishop");
      }
    }
  }
  if (undeveloped.length && histLen < 20) {
    return `Develop your ${undeveloped[0]} — idle pieces lose games.`;
  }
  const center = ["d4", "e4", "d5", "e5"];
  let ownCenter = 0;
  for (const sq of center) {
    const ch = arr[squareToIndex(sq)];
    if (!isEmpty(ch) && isWhitePiece(ch) === whiteToMove) {
      ownCenter += 1;
    }
  }
  if (ownCenter === 0 && histLen < 16) {
    return "Claim the center — pawns and pieces love d4/e4.";
  }
  if (histLen >= 20 && histLen < 40) {
    return "Middlegame: create a plan — attack a weak pawn or open a file.";
  }
  if (histLen >= 40) {
    return "Endgame tip: activate the king and push passed pawns.";
  }
  const tips = [
    "Before you move: checks, captures, threats — in that order.",
    "If nothing tactical, improve your worst-placed piece.",
    "Don't move the same piece twice in the opening unless forced.",
    "Trade when ahead in material; avoid trades when behind.",
  ];
  return tips[histLen % tips.length];
}

const LEVELS = [
  { id: 1, name: "Level 1", rating: 250 },
  { id: 2, name: "Level 2", rating: 400 },
  { id: 3, name: "Level 3", rating: 600 },
  { id: 4, name: "Level 4", rating: 800 },
  { id: 5, name: "Level 5", rating: 1000 },
  { id: 6, name: "Level 6", rating: 1200 },
  { id: 7, name: "Level 7", rating: 1400 },
  { id: 8, name: "Level 8", rating: 1600 },
  { id: 9, name: "Level 9", rating: 1900 },
  { id: 10, name: "Level 10", rating: 2200 },
];

function evalBar(board) {
  const arr = typeof board === "string" ? cloneBoard(board) : board;
  const clamped = Math.max(-800, Math.min(800, evaluate(arr)));
  return Math.round(50 + (clamped / 800) * 50);
}

const ChessEngine = {
  legalMoves,
  chooseMove,
  bestMove,
  analyzeMove,
  findThreats,
  quickTip,
  evaluate,
  evalBar,
  inCheck,
  squareToIndex,
  indexToSquare,
  isWhitePiece,
  LEVELS,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ChessEngine;
} else {
  window.ChessEngine = ChessEngine;
}


"use strict";

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function withTip(text, tip) {
  if (!tip || tip === text) {
    return text;
  }
  return `${text} Tip: ${tip}`;
}

function magnusSpeak(kind, extra) {
  extra = extra || {};
  const idea = extra.idea || "";
  const piece = extra.piece || "piece";
  const from = extra.from || "";
  const to = extra.to || "";
  const tip = extra.tip || "";

  const lines = {
    start: [
      "Alright. Let's play. Develop, take the center, and don't hang pieces.",
      "Okay. Your move. Keep it simple and look for threats.",
      "Let's go. Natural moves first — tactics second.",
    ],
    idle: ["Your move.", "Okay. What do you want to do here?", "Go ahead."],
    tip: [
      tip || "Look for captures, checks, and threats.",
      tip || "Improve your worst piece.",
    ],
    brilliant: ["Brilliant. That is just beautiful.", "Wow. That is a fantastic find."],
    best: [
      "Yeah. That's the move.",
      "This is just correct.",
      "Perfect. That's what I would play.",
      "Clean. Exactly.",
    ],
    excellent: ["Excellent. Very strong.", "Yeah, this is a great move."],
    good: ["Good move. Solid.", "This is fine. Practical chess.", "Yeah, I like this."],
    book: ["That's book. You're in known territory.", "Opening theory. Good."],
    inaccuracy: [
      "A bit inaccurate. There was something more precise.",
      "Hmm. Playable, but not the most accurate.",
    ],
    mistake: [
      "That's a mistake. Be more careful.",
      "Yeah, this just isn't good. Undo if you want — or press Hint.",
    ],
    blunder: [
      "Blunder. Calculate before you click.",
      "No. This hangs too much. Undo, or ask for a Hint.",
    ],
    hint1: [
      "Look at the highlighted piece. That's the one to move.",
      from ? `Move your ${piece} (highlighted). Press Hint again for where.` : `Focus on your ${piece}. Press Hint again for where.`,
    ],
    hint2: [
      from && to ? `Now play it: ${from} → ${to}.` : "Here's where it should go.",
      from && to ? `Destination: ${to}. Play ${from}${to}.` : "This is the full move.",
    ],
    undo: ["Okay, take it back. Find something better.", "Fine. Try again.", "Undone. Look for a cleaner idea."],
    suggest: [
      idea ? `I'd look at ${idea}.` : "There's a strong idea here.",
      idea ? `Suggestion: ${idea}.` : "Try a more forcing move.",
    ],
    illegal: ["That move isn't legal. Try again."],
    thinking: ["Thinking..."],
    yourMove: ["Your move.", "Okay. Your turn.", "Back to you."],
  };

  const titleMap = {
    start: "Coach",
    idle: "Coach",
    tip: "Tip",
    yourMove: "Coach",
    thinking: "Coach",
    brilliant: "Brilliant",
    best: "Best move",
    excellent: "Excellent",
    good: "Good move",
    book: "Book move",
    inaccuracy: "Inaccuracy",
    mistake: "Mistake",
    blunder: "Blunder",
    hint1: "Hint",
    hint2: "Best move",
    undo: "Coach",
    suggest: "Idea",
    illegal: "Illegal",
  };

  const kindKey = lines[kind] ? kind : "idle";
  const mappedKind =
    kindKey === "hint1" || kindKey === "hint2"
      ? "hint"
      : kindKey === "yourMove" || kindKey === "start" || kindKey === "thinking" || kindKey === "tip"
        ? "idle"
        : kindKey;

  let text = extra.text || pick(lines[kindKey]);
  if (tip && ["good", "excellent", "best", "book", "yourMove", "start", "suggest"].includes(kindKey)) {
    text = withTip(text, tip);
  } else if (kindKey === "tip") {
    text = tip || text;
  }

  return {
    kind: mappedKind,
    title: titleMap[kindKey] || "Coach",
    text,
    tip: tip || "",
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { magnusSpeak };
} else {
  window.magnusSpeak = magnusSpeak;
}


const START =
  "rnbqkbnrpppppppp################################PPPPPPPPRNBQKBNR";

const PIECE_SVG = {
  K: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,
  Q: `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
  R: `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5L32.5 32H12.5l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
  B: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  N: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>`,
  P: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  k: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,
  q: `<svg viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke="none"><circle cx="6" cy="12" r="2"/><circle cx="14" cy="9" r="2"/><circle cx="22.5" cy="8" r="2"/><circle cx="31" cy="9" r="2"/><circle cx="39" cy="12" r="2"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
  r: `<svg viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5H12.5zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>`,
  b: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  n: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/></g></svg>`,
  p: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

const E = window.ChessEngine;
const speak = window.magnusSpeak;

if (!E || typeof speak !== "function") {
  document.body.insertAdjacentHTML(
    "afterbegin",
    '<p style="margin:0;padding:14px;background:#c23b22;color:#fff;font-family:sans-serif">Failed to load game scripts. Open <a href="https://buv100.github.io/chess-play-coach/?nocache=1" style="color:#fff">this link</a>.</p>'
  );
} else {
bootGame();
}

function bootGame() {
const boardEl = document.getElementById("board");
const coachTitle = document.getElementById("coachTitle");
const coachText = document.getElementById("coachText");
const tipText = document.getElementById("tipText");
const hintBtn = document.getElementById("hintBtn");
const undoBtn = document.getElementById("undoBtn");
const ideaBtn = document.getElementById("ideaBtn");
const newGameBtn = document.getElementById("newGame");
const settingsBtn = document.getElementById("settingsBtn");
const settingsEl = document.getElementById("settings");
const closeSettings = document.getElementById("closeSettings");
const levelsEl = document.getElementById("levels");
const oppRating = document.getElementById("oppRating");
const evalFill = document.getElementById("evalFill");
const evalCol = document.getElementById("evalCol");
const hintArrow = document.getElementById("hintArrow");
const sugArrow = document.getElementById("sugArrow");
const threatLayer = document.getElementById("threatLayer");
const optSuggest = document.getElementById("optSuggest");
const optThreat = document.getElementById("optThreat");
const optEval = document.getElementById("optEval");
const installBtn = document.getElementById("installBtn");
const playerTop = document.getElementById("playerTop");
const playerBottom = document.getElementById("playerBottom");

const LEVELS = E.LEVELS;
let selectedLevel = 5;
let targets = [];
let options = { suggestionArrows: false, threatArrows: true, evaluationBar: true };
let selected = null;
let lastMove = null;
let busy = false;
let boardBuilt = false;
let squares = [];
let paintKey = "";
let snapshots = [];
let pendingHint = null;

let state = {
  board: START,
  turn: "0",
  connected: true,
  thinking: false,
  gameOver: false,
  hintFrom: null,
  hintTo: null,
  hintStep: 0,
  history: [],
  coach: speak("start"),
  tip: "",
  evalBar: 50,
  level: 5,
  suggestion: null,
  showSuggestion: false,
  threats: [],
  canUndo: false,
};

function applyMove(board, move) {
  const cells = board.split("");
  const src = E.squareToIndex(move.slice(0, 2));
  const dst = E.squareToIndex(move.slice(2, 4));
  let piece = cells[src];
  cells[src] = "#";
  const rank = move[3];
  if (piece === "P" && rank === "8") piece = "Q";
  if (piece === "p" && rank === "1") piece = "q";
  cells[dst] = piece;
  return cells.join("");
}

function refreshMeta() {
  const whiteTurn = state.turn === "0";
  state.evalBar = E.evalBar(state.board);
  state.tip = E.quickTip(state.board, whiteTurn, state.history.length);
  state.threats = options.threatArrows ? E.findThreats(state.board, true) : [];
  state.canUndo = snapshots.length > 0 && !state.thinking && !state.gameOver;
  state.connected = true;
  state.level = selectedLevel;
}

function checkGameOver() {
  const whiteTurn = state.turn === "0";
  const moves = E.legalMoves(state.board, whiteTurn);
  if (moves.length) return;
  state.gameOver = true;
  if (E.inCheck(state.board, whiteTurn)) {
    state.coach = speak("idle", {
      text: whiteTurn ? "Checkmate. Black wins." : "Checkmate. You win!",
    });
  } else {
    state.coach = speak("idle", { text: "Stalemate. Draw." });
  }
}

function playBotSoon() {
  if (state.gameOver || state.turn !== "1") return;
  state.thinking = true;
  renderBoard(true);
  setTimeout(() => {
    if (state.gameOver || state.turn !== "1") {
      state.thinking = false;
      renderBoard(true);
      return;
    }
    const move = E.chooseMove(state.board, false, selectedLevel);
    state.thinking = false;
    if (!move) {
      checkGameOver();
      renderBoard(true);
      return;
    }
    snapshots.push({
      board: state.board,
      turn: state.turn,
      history: state.history.slice(),
      lastMove,
    });
    state.board = applyMove(state.board, move);
    state.history.push({ move });
    lastMove = move;
    state.turn = "0";
    state.hintStep = 0;
    state.hintFrom = null;
    state.hintTo = null;
    pendingHint = null;
    state.suggestion = null;
    state.showSuggestion = false;
    refreshMeta();
    state.coach = speak("yourMove", { tip: state.tip });
    checkGameOver();
    renderBoard(true);
  }, 30);
}

function squarePoint(sq) {
  return { x: sq.charCodeAt(0) - 97 + 0.5, y: 8 - Number(sq[1]) + 0.5 };
}

function setLine(el, from, to) {
  if (!from || !to) {
    el.classList.add("hidden");
    return;
  }
  const a = squarePoint(from);
  const b = squarePoint(to);
  el.setAttribute("x1", String(a.x));
  el.setAttribute("y1", String(a.y));
  el.setAttribute("x2", String(b.x));
  el.setAttribute("y2", String(b.y));
  el.classList.remove("hidden");
}

function renderThreats() {
  threatLayer.innerHTML = "";
  if (!options.threatArrows) return;
  (state.threats || []).forEach((t) => {
    const a = squarePoint(t.from);
    const b = squarePoint(t.to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(a.x));
    line.setAttribute("y1", String(a.y));
    line.setAttribute("x2", String(b.x));
    line.setAttribute("y2", String(b.y));
    line.setAttribute("class", "threat");
    line.setAttribute("marker-end", "url(#threatHead)");
    threatLayer.appendChild(line);
  });
}

function renderLevels() {
  levelsEl.innerHTML = LEVELS.map(
    (lv) =>
      `<button type="button" data-level="${lv.id}" class="${lv.id === selectedLevel ? "on" : ""}">${lv.id}</button>`
  ).join("");
  levelsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => setLevel(Number(btn.dataset.level)));
  });
  const found = LEVELS.find((lv) => lv.id === selectedLevel);
  if (oppRating) oppRating.textContent = found ? String(found.rating) : "";
}

function renderCoach() {
  const coach = state.coach || { kind: "idle", title: "Coach", text: "" };
  const kind = state.thinking ? "idle" : coach.kind || "idle";
  coachTitle.textContent = state.thinking ? "Thinking" : coach.title || "Coach";
  coachTitle.className = "badge " + kind;
  coachText.textContent = state.thinking ? "Thinking..." : coach.text || "";
  if (tipText) tipText.textContent = state.thinking ? "" : state.tip || coach.tip || "";
}

function ensureBoard() {
  if (boardBuilt) return;
  boardEl.innerHTML = "";
  squares = [];
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const name = E.indexToSquare(i);
    const sq = document.createElement("div");
    sq.className = `sq ${(row + col) % 2 === 0 ? "light" : "dark"}`;
    sq.setAttribute("role", "button");
    sq.tabIndex = 0;
    if (row === 7) {
      const file = document.createElement("span");
      file.className = "coord file";
      file.textContent = name[0];
      sq.appendChild(file);
    }
    if (col === 0) {
      const rank = document.createElement("span");
      rank.className = "coord rank";
      rank.textContent = name[1];
      sq.appendChild(rank);
    }
    const piece = document.createElement("div");
    piece.className = "piece";
    sq.appendChild(piece);
    const dot = document.createElement("div");
    dot.className = "dot-move hidden";
    sq.appendChild(dot);
    sq.addEventListener("click", () => onSquareClick(name));
    boardEl.appendChild(sq);
    squares.push({ el: sq, piece, dot, name, ch: null });
  }
  boardBuilt = true;
}

function renderBoard(force) {
  ensureBoard();
  const threatened = new Set();
  if (options.threatArrows) (state.threats || []).forEach((t) => threatened.add(t.to));
  const key = [
    state.board, selected || "", targets.join(","), lastMove || "",
    state.hintFrom || "", state.hintTo || "", [...threatened].join(","),
    state.suggestion || "", state.showSuggestion ? "1" : "0", state.hintStep || 0,
    state.evalBar || 50, state.thinking ? "1" : "0",
    (state.coach && state.coach.text) || "", state.tip || "",
  ].join("|");
  if (!force && key === paintKey) return;
  paintKey = key;

  for (let i = 0; i < 64; i++) {
    const cell = squares[i];
    const name = cell.name;
    const ch = state.board[i];
    cell.el.classList.toggle("has-piece", !!(ch && ch !== "#"));
    cell.el.classList.toggle("selected", selected === name);
    cell.el.classList.toggle(
      "last",
      !!(lastMove && (lastMove.slice(0, 2) === name || lastMove.slice(2, 4) === name))
    );
    cell.el.classList.toggle("hint-from", state.hintFrom === name);
    cell.el.classList.toggle("hint-to", state.hintTo === name);
    cell.el.classList.toggle("threatened", threatened.has(name));
    if (cell.ch !== ch) {
      cell.ch = ch;
      cell.piece.innerHTML = ch && ch !== "#" ? PIECE_SVG[ch] || "" : "";
    }
    cell.dot.classList.toggle("hidden", !targets.includes(name));
  }

  if (state.hintStep >= 2 && state.hintFrom && state.hintTo) {
    setLine(hintArrow, state.hintFrom, state.hintTo);
    sugArrow.classList.add("hidden");
  } else {
    hintArrow.classList.add("hidden");
    sugArrow.classList.add("hidden");
  }
  renderThreats();
  evalCol.classList.toggle("off", !options.evaluationBar);
  evalFill.style.height = Math.max(4, Math.min(96, state.evalBar || 50)) + "%";
  if (playerTop) {
    playerTop.classList.toggle("active", state.turn === "1" && !state.gameOver);
  }
  if (playerBottom) {
    playerBottom.classList.toggle("active", state.turn === "0" && !state.gameOver);
  }
  undoBtn.disabled = !state.canUndo || !!state.thinking;
  hintBtn.disabled = !!state.thinking || !!state.gameOver || state.turn !== "0";
  renderCoach();
}

function canHumanMove() {
  return !state.gameOver && !state.thinking && state.turn === "0" && !busy;
}

function loadTargets(from) {
  return E.legalMoves(state.board, true)
    .filter((m) => m.startsWith(from))
    .map((m) => m.slice(2, 4));
}

function onSquareClick(name) {
  if (!canHumanMove()) return;
  if (!selected) {
    const ch = state.board[E.squareToIndex(name)];
    if (!ch || ch === "#" || !E.isWhitePiece(ch)) return;
    selected = name;
    targets = loadTargets(name);
    renderBoard(true);
    return;
  }
  if (selected === name) {
    selected = null;
    targets = [];
    renderBoard(true);
    return;
  }
  if (!targets.includes(name)) {
    const ch = state.board[E.squareToIndex(name)];
    if (ch && ch !== "#" && E.isWhitePiece(ch)) {
      selected = name;
      targets = loadTargets(name);
      renderBoard(true);
      return;
    }
    selected = null;
    targets = [];
    renderBoard(true);
    return;
  }
  const move = selected + name;
  selected = null;
  targets = [];
  sendMove(move);
}

function sendMove(move) {
  if (busy || !canHumanMove()) return;
  const legal = E.legalMoves(state.board, true);
  if (!legal.includes(move)) {
    state.coach = speak("illegal");
    renderBoard(true);
    return;
  }
  busy = true;
  const before = state.board;
  const histLen = state.history.length;
  let analysis = null;
  try {
    analysis = E.analyzeMove(before, true, move, histLen);
  } catch (_) {
    analysis = { kind: "good" };
  }

  snapshots.push({
    board: state.board,
    turn: state.turn,
    history: state.history.slice(),
    lastMove,
  });
  state.board = applyMove(state.board, move);
  state.history.push({ move });
  lastMove = move;
  state.turn = "1";
  state.hintStep = 0;
  state.hintFrom = null;
  state.hintTo = null;
  pendingHint = null;
  state.suggestion = null;
  state.showSuggestion = false;
  refreshMeta();
  state.coach = speak(analysis.kind, { tip: state.tip });
  checkGameOver();
  renderBoard(true);
  busy = false;
  if (!state.gameOver) playBotSoon();
}

function startPractice() {
  selected = null;
  lastMove = null;
  targets = [];
  busy = false;
  snapshots = [];
  pendingHint = null;
  boardBuilt = false;
  state = {
    board: START,
    turn: "0",
    connected: true,
    thinking: false,
    gameOver: false,
    hintFrom: null,
    hintTo: null,
    hintStep: 0,
    history: [],
    coach: speak("start"),
    tip: "",
    evalBar: 50,
    level: selectedLevel,
    suggestion: null,
    showSuggestion: false,
    threats: [],
    canUndo: false,
  };
  renderBoard(true);
  try {
    refreshMeta();
    state.coach = speak("start", { tip: state.tip });
  } catch (_) {
    /* ignore tip errors */
  }
  renderLevels();
  renderBoard(true);
}

function setLevel(level) {
  selectedLevel = level;
  state.level = level;
  renderLevels();
}

function askHint() {
  if (!canHumanMove()) return;

  if (state.hintStep < 1 || !pendingHint) {
    const move = E.bestMove(state.board, true);
    if (!move) {
      state.coach = speak("idle", { text: "No good hint right now." });
      renderBoard(true);
      return;
    }
    pendingHint = move;
    const from = move.slice(0, 2);
    const piece = state.board[E.squareToIndex(from)];
    const names = { p: "pawn", n: "knight", b: "bishop", r: "rook", q: "queen", k: "king" };
    const name = names[(piece || "p").toLowerCase()] || "piece";
    state.hintStep = 1;
    state.hintFrom = from;
    state.hintTo = null;
    state.suggestion = null;
    state.showSuggestion = false;
    state.coach = speak("hint1", { piece: name, from });
    renderBoard(true);
    return;
  }

  const move = pendingHint;
  const from = move.slice(0, 2);
  const to = move.slice(2, 4);
  const piece = state.board[E.squareToIndex(from)];
  const names = { p: "pawn", n: "knight", b: "bishop", r: "rook", q: "queen", k: "king" };
  const name = names[(piece || "p").toLowerCase()] || "piece";
  state.hintStep = 2;
  state.hintFrom = from;
  state.hintTo = to;
  state.coach = speak("hint2", { piece: name, from, to });
  renderBoard(true);
}

function undoMove() {
  if (!snapshots.length || state.thinking) return;
  const snap = snapshots.pop();
  // undo both player and bot if last was bot reply pair
  state.board = snap.board;
  state.turn = snap.turn;
  state.history = snap.history;
  lastMove = snap.lastMove;
  if (state.turn === "1" && snapshots.length) {
    const prev = snapshots.pop();
    state.board = prev.board;
    state.turn = prev.turn;
    state.history = prev.history;
    lastMove = prev.lastMove;
  }
  state.gameOver = false;
  state.hintStep = 0;
  state.hintFrom = null;
  state.hintTo = null;
  pendingHint = null;
  selected = null;
  targets = [];
  refreshMeta();
  state.coach = speak("undo", { tip: state.tip });
  renderBoard(true);
}

function showIdea() {
  askHint();
}

function saveOptions() {
  options.suggestionArrows = optSuggest.checked;
  options.threatArrows = optThreat.checked;
  options.evaluationBar = optEval.checked;
  refreshMeta();
  renderBoard(true);
}

newGameBtn.addEventListener("click", startPractice);
hintBtn.addEventListener("click", askHint);
undoBtn.addEventListener("click", undoMove);
ideaBtn.addEventListener("click", showIdea);
settingsBtn.addEventListener("click", () => settingsEl.classList.remove("hidden"));
closeSettings.addEventListener("click", () => {
  saveOptions();
  settingsEl.classList.add("hidden");
});
settingsEl.addEventListener("click", (e) => {
  if (e.target === settingsEl) settingsEl.classList.add("hidden");
});

if (installBtn) {
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
}

try {
  startPractice();
} catch (err) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    '<p style="padding:12px;color:#fff;background:#c23b22">Error: ' +
      String(err && err.message ? err.message : err) +
      "</p>"
  );
}
} // end bootGame
