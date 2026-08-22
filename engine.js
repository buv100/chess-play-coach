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

function sideMaterial(arr, forWhite) {
  let total = 0;
  for (let i = 0; i < 64; i++) {
    const ch = arr[i];
    if (isEmpty(ch)) continue;
    const v = PIECE_VALUE[kind(ch)] || 0;
    total += isWhitePiece(ch) === forWhite ? v : -v;
  }
  return forWhite ? total : -total;
}

const MOVE_SYMBOLS = {
  brilliant: "!!",
  best: "!",
  excellent: "✓",
  good: "✓",
  book: "♗",
  inaccuracy: "?!",
  mistake: "?",
  blunder: "??",
};

const MOVE_TITLES = {
  brilliant: "Brilliant",
  best: "Best move",
  excellent: "Excellent",
  good: "Good move",
  book: "Book move",
  inaccuracy: "Inaccuracy",
  mistake: "Mistake",
  blunder: "Blunder",
};

function analyzeMove(board, whiteTurn, move, histLen, options) {
  options = options || {};
  const found = searchBest(board, whiteTurn, 2, Date.now() + 110);
  if (!found) {
    return { kind: "good", idea: "", best: null, why: "", impact: "", symbol: MOVE_SYMBOLS.good };
  }

  const arr = cloneBoard(board);
  const src = squareToIndex(move.slice(0, 2));
  const dst = squareToIndex(move.slice(2, 4));
  const before = evaluate(arr);
  const matBefore = sideMaterial(arr, whiteTurn);
  makeMove(arr, src, dst);
  const after = evaluate(arr);
  const matAfter = sideMaterial(arr, whiteTurn);
  const playedDelta = whiteTurn ? after - before : before - after;
  const materialGiven = matBefore - matAfter;

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
  const isBook = histLen < 14 && loss <= 45;
  const isSacrifice = materialGiven >= 90 && loss <= 35;
  const onlyMove = legalMoves(cloneBoard(board), whiteTurn).length <= 2;

  let kind;
  if (isSacrifice && (move === found.move || loss <= 25)) {
    kind = "brilliant";
  } else if (move === found.move || loss <= 15) {
    kind = onlyMove && loss <= 5 ? "excellent" : "best";
  } else if (loss <= 45) {
    kind = isBook ? "book" : "excellent";
  } else if (loss <= 95) {
    kind = "good";
  } else if (loss <= 170) {
    kind = "inaccuracy";
  } else if (loss <= 300) {
    kind = "mistake";
  } else {
    kind = "blunder";
  }

  const explained = explainMove(board, whiteTurn, move, kind, found.move, histLen, loss, options);
  return {
    kind,
    idea,
    best: found.move,
    why: explained.why,
    impact: explained.impact,
    symbol: MOVE_SYMBOLS[kind] || "",
    loss: Math.round(loss),
  };
}

const PIECE_NAMES = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

function pieceLabel(ch) {
  return PIECE_NAMES[kind(ch)] || "piece";
}

function explainMove(board, whiteTurn, move, ratingKind, bestMove, histLen, loss, options) {
  options = options || {};
  const forCoach = !!options.forCoach;
  const subj = forCoach ? "I" : "You";
  const poss = forCoach ? "my" : "your";
  const opp = forCoach ? "you" : "the opponent";
  const arr = cloneBoard(board);
  const src = squareToIndex(move.slice(0, 2));
  const dst = squareToIndex(move.slice(2, 4));
  const piece = arr[src];
  const captured = arr[dst];
  const toSq = move.slice(2, 4);
  const fromSq = move.slice(0, 2);
  const reasons = [];
  const impacts = [];
  const positive = ["best", "excellent", "good", "book", "brilliant"].includes(ratingKind);

  if (!isEmpty(captured)) {
    reasons.push(`${subj} win the ${pieceLabel(captured)} on ${toSq}.`);
    impacts.push("Material up usually means a safer endgame and more attacking options.");
  }

  makeMove(arr, src, dst);
  const oppWhite = !whiteTurn;

  if (inCheck(arr, oppWhite)) {
    reasons.push("Check — " + (forCoach ? "you must deal with it first." : "the opponent must deal with it first."));
    impacts.push("Forcing moves steal time: they can't improve while in check.");
  }

  const back = whiteTurn ? 7 : 0;
  const [sr] = idxToRc(src);
  const pk = kind(piece);
  if ((pk === "n" || pk === "b") && sr === back && histLen < 22) {
    reasons.push(`The ${pieceLabel(piece)} develops off the back rank.`);
    impacts.push("Developed pieces control the center and support attacks later.");
  }

  const centerSq = ["d4", "e4", "d5", "e5", "c4", "f4", "c5", "f5"];
  if (pk === "p" && centerSq.includes(toSq) && histLen < 18) {
    reasons.push(`${subj} claim central space.`);
    impacts.push("The center opens lines for " + poss + " rooks and queen in the middlegame.");
  }

  if (pk === "r" || pk === "q") {
    const file = toSq.charCodeAt(0) - 97;
    let pawnOnFile = false;
    for (let r = 0; r < 8; r++) {
      const ch = arr[rcToIdx(r, file)];
      if (!isEmpty(ch) && kind(ch) === "p") {
        pawnOnFile = true;
        break;
      }
    }
    if (!pawnOnFile && histLen > 10) {
      reasons.push(`${forCoach ? "My" : "Your"} ${pieceLabel(piece)} moves to an open file.`);
      impacts.push("Rooks and queens are strongest on open files — they can penetrate.");
    }
  }

  const hanging = findThreats(boardString(arr), whiteTurn);
  if (hanging.length && !positive) {
    reasons.push(`Something on ${hanging[0].to} is left attacked.`);
    impacts.push(
      forCoach
        ? "If you take it, I lose material and the initiative."
        : "If they take it, you lose material and the initiative."
    );
  }

  const oppThreats = findThreats(boardString(arr), oppWhite);
  if (oppThreats.length && positive && !isEmpty(captured)) {
    impacts.push(
      forCoach
        ? "Even after winning material, watch your threats on the next move."
        : "Even after winning material, watch their threats on the next move."
    );
  }

  if (!positive && bestMove && bestMove !== move) {
    const probe = cloneBoard(board);
    const bd = squareToIndex(bestMove.slice(2, 4));
    const bs = squareToIndex(bestMove.slice(0, 2));
    const bestCap = !isEmpty(probe[bd]);
    if (bestCap && isEmpty(captured)) {
      reasons.push(
        forCoach
          ? `I missed ${bestMove.slice(0, 2)}→${bestMove.slice(2, 4)} — a free ${pieceLabel(probe[bd])}.`
          : `You missed ${bestMove.slice(0, 2)}→${bestMove.slice(2, 4)} — a free ${pieceLabel(probe[bd])}.`
      );
    } else if (loss > 100) {
      reasons.push(`Stronger was ${bestMove.slice(0, 2)}→${bestMove.slice(2, 4)}.`);
    }
  }

  if (ratingKind === "brilliant") {
    impacts.unshift("A sacrifice that works — the engine loves it.");
  }

  if (positive) {
    if (!reasons.length) {
      reasons.push(
        forCoach
          ? "Solid — my pieces stay coordinated and the king stays safe."
          : "Solid — your pieces stay coordinated and the king stays safe."
      );
    }
    if (!impacts.length) {
      if (histLen < 16) {
        impacts.push(
          forCoach
            ? "Keep developing — I'll be ready to castle and fight for the center."
            : "Keep developing — you'll be ready to castle and fight for the center."
        );
      } else if (histLen < 36) {
        impacts.push("Look next for tactics: forks, pins, and weak pawns to target.");
      } else {
        impacts.push("In the endgame, activate the king and push passed pawns.");
      }
    }
  } else if (ratingKind === "inaccuracy") {
    if (!impacts.length) {
      impacts.push("Small errors add up — sharper play keeps more options open.");
    }
  } else if (ratingKind === "mistake") {
    if (!impacts.length) {
      impacts.push(
        forCoach
          ? "You can seize the initiative — check my threats before I move again."
          : "The opponent can seize the initiative — check their threats before you move again."
      );
    }
  } else if (ratingKind === "blunder") {
    if (!impacts.length) {
      impacts.push(
        forCoach
          ? "One blunder can decide the game — you can punish this."
          : "One blunder can decide the game — undo or find a defense immediately."
      );
    }
  }

  return {
    why: reasons.slice(0, 2).join(" "),
    impact: impacts[0] || "",
  };
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
  MOVE_SYMBOLS,
  MOVE_TITLES,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ChessEngine;
} else {
  window.ChessEngine = ChessEngine;
}
