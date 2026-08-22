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
  excellent: "âœ“",
  good: "âœ“",
  book: "â™—",
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
  const idea = `${found.move.slice(0, 2)} â†’ ${found.move.slice(2, 4)}`;
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
    reasons.push("Check â€” " + (forCoach ? "you must deal with it first." : "the opponent must deal with it first."));
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
      impacts.push("Rooks and queens are strongest on open files â€” they can penetrate.");
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
          ? `I missed ${bestMove.slice(0, 2)}â†’${bestMove.slice(2, 4)} â€” a free ${pieceLabel(probe[bd])}.`
          : `You missed ${bestMove.slice(0, 2)}â†’${bestMove.slice(2, 4)} â€” a free ${pieceLabel(probe[bd])}.`
      );
    } else if (loss > 100) {
      reasons.push(`Stronger was ${bestMove.slice(0, 2)}â†’${bestMove.slice(2, 4)}.`);
    }
  }

  if (ratingKind === "brilliant") {
    impacts.unshift("A sacrifice that works â€” the engine loves it.");
  }

  if (positive) {
    if (!reasons.length) {
      reasons.push(
        forCoach
          ? "Solid â€” my pieces stay coordinated and the king stays safe."
          : "Solid â€” your pieces stay coordinated and the king stays safe."
      );
    }
    if (!impacts.length) {
      if (histLen < 16) {
        impacts.push(
          forCoach
            ? "Keep developing â€” I'll be ready to castle and fight for the center."
            : "Keep developing â€” you'll be ready to castle and fight for the center."
        );
      } else if (histLen < 36) {
        impacts.push("Look next for tactics: forks, pins, and weak pawns to target.");
      } else {
        impacts.push("In the endgame, activate the king and push passed pawns.");
      }
    }
  } else if (ratingKind === "inaccuracy") {
    if (!impacts.length) {
      impacts.push("Small errors add up â€” sharper play keeps more options open.");
    }
  } else if (ratingKind === "mistake") {
    if (!impacts.length) {
      impacts.push(
        forCoach
          ? "You can seize the initiative â€” check my threats before I move again."
          : "The opponent can seize the initiative â€” check their threats before you move again."
      );
    }
  } else if (ratingKind === "blunder") {
    if (!impacts.length) {
      impacts.push(
        forCoach
          ? "One blunder can decide the game â€” you can punish this."
          : "One blunder can decide the game â€” undo or find a defense immediately."
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
    return "You're in check â€” escape, block, or capture the attacker.";
  }
  const threats = findThreats(board, whiteToMove);
  if (threats.length) {
    return `Threat on ${threats[0].to} â€” defend it, move it, or counterattack.`;
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
    return `Develop your ${undeveloped[0]} â€” idle pieces lose games.`;
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
    return "Claim the center â€” pawns and pieces love d4/e4.";
  }
  if (histLen >= 20 && histLen < 40) {
    return "Middlegame: create a plan â€” attack a weak pawn or open a file.";
  }
  if (histLen >= 40) {
    return "Endgame tip: activate the king and push passed pawns.";
  }
  const tips = [
    "Before you move: checks, captures, threats â€” in that order.",
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
"use strict";

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const SHOUT_KINDS = ["brilliant", "blunder", "mistake", "inaccuracy"];

const COACH_SHOUTS = {
  magnus: {
    brilliant: ["Wow!", "Yes!", "Incredible!"],
    blunder: ["No!", "Oh no!", "What?!"],
    mistake: ["Ouch!", "Hmm!"],
    inaccuracy: ["Hmm!"],
  },
  kasparov: {
    brilliant: ["YES!", "Attack!", "Fire!"],
    blunder: ["NO!", "Disaster!", "How?!"],
    mistake: ["Weak!", "No no!"],
    inaccuracy: ["Too soft!"],
  },
  tal: {
    brilliant: ["WOW!", "Magic!", "Beautiful!"],
    blunder: ["Oh!", "Oops!", "Ha!"],
    mistake: ["Hmm!", "Wild!"],
    inaccuracy: ["Not spicy enough!"],
  },
  fischer: {
    brilliant: ["Perfect!", "Yes!"],
    blunder: ["NO!", "Unacceptable!", "Terrible!"],
    mistake: ["Wrong!", "No!"],
    inaccuracy: ["Sloppy!"],
  },
  capablanca: {
    brilliant: ["Lovely!", "Elegant!"],
    blunder: ["Oh dear!", "No!"],
    mistake: ["Careless!"],
    inaccuracy: ["Hmm."],
  },
  karpov: {
    brilliant: ["Precise!", "Strong!"],
    blunder: ["No!", "Loose!"],
    mistake: ["Slip!"],
    inaccuracy: ["Soft."],
  },
};

function pickShout(coachId, kindKey) {
  if (!SHOUT_KINDS.includes(kindKey)) return null;
  const coachShouts = COACH_SHOUTS[coachId] || COACH_SHOUTS.magnus;
  const list = coachShouts[kindKey];
  return list && list.length ? pick(list) : null;
}

const POSITIVE = ["best", "excellent", "good", "book", "brilliant"];

function styleReframe(coach, why, impact, kind) {
  const w = (why || "").toLowerCase();
  const positive = POSITIVE.includes(kind);
  const rf = coach.reframe || {};
  let outWhy = why || "";
  let outImpact = impact || "";

  if (positive && rf.good) {
    if (w.includes("capture") || w.includes("win the")) outImpact = rf.good.capture || outImpact;
    else if (w.includes("check")) outImpact = rf.good.check || outImpact;
    else if (w.includes("develop")) outImpact = rf.good.develop || outImpact;
    else if (w.includes("center")) outImpact = rf.good.center || outImpact;
    else if (w.includes("open file")) outImpact = rf.good.openFile || outImpact;
    else outImpact = rf.good.default || outImpact;
  } else if (kind === "inaccuracy" && rf.inaccuracy) {
    outImpact = rf.inaccuracy;
  } else if (kind === "mistake" && rf.mistake) {
    outImpact = rf.mistake;
  } else if (kind === "blunder" && rf.blunder) {
    outImpact = rf.blunder;
  }

  if (rf.prefix && outWhy) outWhy = `${rf.prefix} ${outWhy}`;
  if (rf.suffix && outImpact) outImpact = `${outImpact} ${rf.suffix}`;
  else if (rf.suffix && !outImpact) outImpact = rf.suffix;

  return { why: outWhy.trim(), impact: outImpact.trim() };
}

const COACHES = {
  magnus: {
    id: "magnus",
    name: "Magnus Carlsen",
    tagline: "Practical chess",
    avatar: "magnus.svg",
    voice: { rate: 0.86, pitch: 1.02, volume: 0.92 },
    reframe: {
      prefix: "In my style â€”",
      suffix: "I simplify and squeeze â€” no need to force anything.",
      good: {
        default: "Solid and practical. Small edges are how I win long games.",
        capture: "Clean material gain. I trade chaos for a clearer endgame.",
        develop: "Natural development â€” I never rush when the position doesn't need it.",
        center: "Central control quietly limits their options. That's my kind of edge.",
        check: "Forcing moves are fine, but follow up with purpose, not fireworks.",
        openFile: "Open files are for rooks â€” activate them and keep the pressure steady.",
      },
      inaccuracy: "Small slip. I would tighten up before the edge disappears.",
      mistake: "That drifts from my style â€” I cut losses and find the safest active plan.",
      blunder: "Too loose. I always ask: what can they take next?",
    },
    lines: {
      start: [
        "Alright. Let's play my way â€” develop, take space, and don't hang pieces.",
        "I keep it simple. Practical moves beat pretty ones.",
        "Let's go. I'll show you how I grind positions without forcing anything.",
      ],
      best: ["Yeah. That's the move.", "Clean. Exactly what I'd play.", "Correct â€” no drama needed."],
      excellent: ["Excellent. Very strong.", "Sharp and practical."],
      good: ["Good move. Solid.", "Fine â€” keeps the position playable.", "I like this. Low risk."],
      book: ["Book. Theory is theory for a reason.", "Known territory â€” stay on track."],
      inaccuracy: ["A bit loose. There was something tighter.", "Playable, but not my precision."],
      mistake: ["Mistake. Recalculate â€” I never gift chances.", "Not good. Undo or defend."],
      blunder: ["Blunder. I would never leave that hanging.", "No â€” calculate one more move."],
      brilliant: ["Beautiful. Even I appreciate that.", "Wow. Strong find."],
      hint1: ["Look at the highlighted piece.", "That piece wants to move â€” press Hint again for where."],
      hint2: ["Play the arrow. Simple and strong.", "There â€” that's the idea."],
      undo: ["Fine. Take it back and simplify.", "Okay. Find something cleaner."],
      yourMove: ["Your move.", "Back to you â€” keep it practical."],
      idle: ["Your move.", "Go ahead.", "What do you want here?"],
      illegal: ["Illegal. Try again."],
      suggest: ["There's a cleaner idea here.", "Look for the practical try."],
    },
  },

  kasparov: {
    id: "kasparov",
    name: "Garry Kasparov",
    tagline: "Dynamic attack",
    avatar: "kasparov.svg",
    voice: { rate: 0.88, pitch: 1.04, volume: 0.92 },
    reframe: {
      prefix: "Dynamic chess â€”",
      suffix: "Initiative is everything. Make them defend!",
      good: {
        default: "Active! Seize space and keep the king nervous.",
        capture: "Win material AND keep attacking â€” that's Garry's way.",
        develop: "Develop with tempo â€” every move should ask a question.",
        center: "The center is a battlefield. Occupy it with purpose.",
        check: "Check! Force them to weaken their structure.",
        openFile: "Open the file and invade â€” rooks belong on the seventh.",
      },
      inaccuracy: "Too passive. I would sharpen the position with a threat.",
      mistake: "You gave them breathing room. Attackers don't do that.",
      blunder: "Disaster. The initiative was yours â€” now it's theirs.",
    },
    lines: {
      start: [
        "Fight! I play for the initiative â€” develop fast and aim at their king.",
        "Chess is war. Take the center and make every move aggressive.",
        "Let's go. I hate passive play â€” find threats from move one.",
      ],
      best: ["Yes! That's fighting chess.", "Strong â€” keeps the initiative.", "Exactly. Make them suffer."],
      excellent: ["Excellent! Dynamic and powerful.", "This keeps them under pressure."],
      good: ["Solid, but look for a sharper follow-up.", "Good â€” now find the threat."],
      book: ["Theory â€” but remember: openings serve the attack.", "Book move. Plan the assault."],
      inaccuracy: ["Too soft. There was a more forcing line.", "Passive. I would push harder."],
      mistake: ["Mistake. You lost the initiative.", "Weak. They'll counterattack now."],
      blunder: ["Blunder! Always check their threats when you attack.", "No â€” that hands them the game."],
      brilliant: ["Brilliant! That's champion-level aggression.", "Fire on the board â€” love it."],
      hint1: ["That piece leads the attack.", "Move this piece â€” Hint again for the strike."],
      hint2: ["Strike here. Force the issue.", "This is the aggressive try."],
      undo: ["Take it back. Attack with calculation.", "Undo â€” find the forcing move."],
      yourMove: ["Your turn â€” find a threat.", "Attack! Your move."],
      idle: ["Don't sit still â€” your move.", "Find something forcing."],
      illegal: ["Illegal. The attack must be legal too."],
      suggest: ["There's a more dynamic idea.", "Sharpen it â€” threaten something."],
    },
  },

  tal: {
    id: "tal",
    name: "Mikhail Tal",
    tagline: "Tactical wizard",
    avatar: "tal.svg",
    voice: { rate: 0.87, pitch: 1.05, volume: 0.92 },
    reframe: {
      prefix: "Tal magic â€”",
      suffix: "Complications favor the brave â€” make them calculate nightmares.",
      good: {
        default: "Enterprising! I love positions where pieces fly.",
        capture: "Take it â€” and look for the next combination.",
        develop: "Develop with tricks in mind. Even quiet moves can set traps.",
        center: "Control the center so pieces can jump into tactics.",
        check: "Check! The king hunt begins.",
        openFile: "Open lines are highways for sacrifices and checks.",
      },
      inaccuracy: "Missed spice. I would stir the pot with a tactic.",
      mistake: "Too safe. Sometimes you must sacrifice to win.",
      blunder: "Ouch. But even after a blunder â€” look for a swindle!",
    },
    lines: {
      start: [
        "Let's create chaos! I sacrifice for attack â€” complications are my home.",
        "I play for the spectacular. Look for tactics every move.",
        "Ready? The board is a canvas â€” paint with sacrifices.",
      ],
      best: ["Gorgeous. The pieces sing.", "Yes! Tactical and strong.", "That's the spirit."],
      excellent: ["Excellent â€” feels like a combination.", "Beautiful chess."],
      good: ["Good. But is there a tactic hiding?", "Solid â€” now look for fireworks."],
      book: ["Book â€” but theory ends where tactics begin.", "Known move. Hunt for tricks anyway."],
      inaccuracy: ["A bit dull. I would complicate.", "Missed a spicy idea."],
      mistake: ["Mistake â€” but maybe a sacrifice saves you next move?", "Inaccurate. Look for a tactic."],
      blunder: ["Blunder! Still â€” never stop looking for a trap.", "Bad, but Tal never resigns mentally."],
      brilliant: ["Brilliant! Pure Tal.", "That's poetry â€” a real combination."],
      hint1: ["This piece wants to sacrifice or attack.", "Hint again â€” the finish is wild."],
      hint2: ["Play it! Trust the calculation.", "There â€” tactical gold."],
      undo: ["Take it back. Find the combination.", "Try again â€” look for a sacrifice."],
      yourMove: ["Your move â€” any tactics?", "Create something beautiful."],
      idle: ["Your turn. Complicate!", "What sacrifice is lurking?"],
      illegal: ["That move isn't legal â€” even magicians follow rules."],
      suggest: ["There's a tactical idea here.", "Look for a sacrifice or fork."],
    },
  },

  fischer: {
    id: "fischer",
    name: "Bobby Fischer",
    tagline: "Precision & best move",
    avatar: "fischer.svg",
    voice: { rate: 0.84, pitch: 0.98, volume: 0.92 },
    reframe: {
      prefix: "Best move chess â€”",
      suffix: "If you see a good move, look for a better one.",
      good: {
        default: "Correct. Accuracy is non-negotiable.",
        capture: "Win material when it's sound â€” that's objective chess.",
        develop: "Develop with purpose. Every tempo counts.",
        center: "Central pawns and pieces â€” classical and correct.",
        check: "Check is fine if it's the most accurate continuation.",
        openFile: "Open files belong to rooks â€” place them correctly.",
      },
      inaccuracy: "Inaccuracy. I would find the precise move.",
      mistake: "Mistake. Sloppy play loses to good opponents.",
      blunder: "Blunder. One bad move can ruin everything â€” I learned that the hard way.",
    },
    lines: {
      start: [
        "I play the best move. Period. Calculate and don't bluff.",
        "Chess is truth. Find the objectively strongest continuation.",
        "Let's go. Accuracy beats everything â€” even talent.",
      ],
      best: ["Best move.", "Correct.", "That's the line."],
      excellent: ["Excellent â€” very precise.", "Strong and accurate."],
      good: ["Good. But was it the best?", "Acceptable â€” verify with calculation."],
      book: ["Book. Know your openings cold.", "Theory â€” memorized and correct."],
      inaccuracy: ["Inaccuracy. There was a better move.", "Not precise enough."],
      mistake: ["Mistake. I hate loose moves.", "Wrong. Fix it."],
      blunder: ["Blunder! Unacceptable.", "Terrible â€” calculate before you click."],
      brilliant: ["Brilliant! The best move found.", "Perfect calculation."],
      hint1: ["This piece â€” calculate its best square.", "Hint again for the precise move."],
      hint2: ["Play it. That's the best line.", "Objective best â€” play it."],
      undo: ["Take it back. Find the best move.", "Undo and calculate properly."],
      yourMove: ["Your move. Best move only.", "Calculate. Your turn."],
      idle: ["Your move.", "Find the truth in the position."],
      illegal: ["Illegal move. The rules are the rules."],
      suggest: ["There's a stronger move.", "Look deeper â€” best move is there."],
    },
  },

  capablanca: {
    id: "capablanca",
    name: "JosÃ© Capablanca",
    tagline: "Simple & natural",
    avatar: "capablanca.svg",
    voice: { rate: 0.85, pitch: 1.0, volume: 0.92 },
    reframe: {
      prefix: "Natural chess â€”",
      suffix: "Simple moves are often the strongest â€” don't force what isn't there.",
      good: {
        default: "Natural and harmonious. The pieces find good squares.",
        capture: "Take what is free â€” simplicity wins endgames.",
        develop: "Develop logically. No need for fireworks.",
        center: "Central control â€” classical and effortless.",
        check: "A useful check, if it improves your position.",
        openFile: "Rooks belong on open files â€” elementary, but powerful.",
      },
      inaccuracy: "Slightly unnatural. The position had a simpler path.",
      mistake: "Unnecessary complication. Return to natural moves.",
      blunder: "A rare ugly move. Simplify and defend carefully.",
    },
    lines: {
      start: [
        "Play naturally. Good moves flow from the position â€” don't force.",
        "I believe in simple, logical chess. Develop and coordinate.",
        "Let's play. The easiest good move is often best.",
      ],
      best: ["Natural and strong.", "Simple â€” exactly right.", "The position plays itself."],
      excellent: ["Excellent. Effortless technique.", "Very clean."],
      good: ["Good. Logical.", "Harmonious â€” I approve."],
      book: ["Book. Classical development.", "Sound opening play."],
      inaccuracy: ["A little artificial. Simpler was available.", "Not the most natural."],
      mistake: ["Mistake. You complicated unnecessarily.", "Avoid clutter â€” simplify."],
      blunder: ["Blunder. Even simple positions punish errors.", "Careless â€” undo if you can."],
      brilliant: ["Beautiful simplicity.", "Elegant â€” like a clear endgame."],
      hint1: ["This piece belongs on a natural square.", "Hint again for the simple finish."],
      hint2: ["There â€” logical and strong.", "Play it. Nothing forced."],
      undo: ["Take it back. Find the natural move.", "Undo â€” simplify."],
      yourMove: ["Your move. Keep it simple.", "Play naturally."],
      idle: ["Your turn.", "What does the position want?"],
      illegal: ["That isn't legal. Try a natural move."],
      suggest: ["There's a simpler strong idea.", "Look for the natural continuation."],
    },
  },

  karpov: {
    id: "karpov",
    name: "Anatoly Karpov",
    tagline: "Positional squeeze",
    avatar: "karpov.svg",
    voice: { rate: 0.9, pitch: 0.9 },
    reframe: {
      prefix: "Positional play â€”",
      suffix: "Restrict their plans first â€” then the attack plays itself.",
      good: {
        default: "Prophylactic and strong. You limit their counterplay.",
        capture: "Win material while keeping control â€” classic Karpov.",
        develop: "Develop with restraint â€” don't open lines for them.",
        center: "Central control restricts their pieces. Slowly, surely.",
        check: "Useful if it ties them down â€” not if it frees them.",
        openFile: "Occupy the file and infiltrate â€” squeeze, don't rush.",
      },
      inaccuracy: "Soft. Tighten the screws â€” restrict more.",
      mistake: "You loosened the grip. They'll breathe now.",
      blunder: "Blunder. Positional control lost in one move.",
    },
    lines: {
      start: [
        "I improve slowly and restrict you. Small advantages decide games.",
        "Play prophylactically â€” ask what they want, then prevent it.",
        "Let's go. Patience and pressure â€” no need to rush the attack.",
      ],
      best: ["Precise. Restrictive.", "Strong â€” they have fewer good moves now."],
      excellent: ["Excellent positional play.", "You tighten the noose."],
      good: ["Good. Keeps pressure.", "Solid restriction."],
      book: ["Book â€” solid foundation.", "Correct opening â€” now restrict."],
      inaccuracy: ["Too generous. Tighten up.", "They get counterplay from this."],
      mistake: ["Mistake. You opened a door.", "Loose â€” they will exploit it."],
      blunder: ["Blunder. Positional collapse.", "Bad â€” defend and simplify."],
      brilliant: ["Excellent prophylaxis.", "Strong â€” like a boa constrictor."],
      hint1: ["Improve this piece â€” restriction first.", "Hint again for the squeeze."],
      hint2: ["Play it. Limit their options.", "There â€” positional gold."],
      undo: ["Take it back. Restrict better.", "Undo â€” find the clamp."],
      yourMove: ["Your move. What do they want?", "Prophylaxis â€” your turn."],
      idle: ["Your move.", "Think what they're planning."],
      illegal: ["Illegal. Stay precise."],
      suggest: ["A more restrictive move exists.", "Clamp down on their plans."],
    },
  },
};

let currentCoachId = "magnus";

function loadCoachId() {
  try {
    const saved = localStorage.getItem("coachId");
    if (saved && COACHES[saved]) currentCoachId = saved;
  } catch (_) {
    /* ignore */
  }
}

function getCoach() {
  return COACHES[currentCoachId] || COACHES.magnus;
}

function setCoach(id) {
  if (!COACHES[id]) return getCoach();
  currentCoachId = id;
  try {
    localStorage.setItem("coachId", id);
  } catch (_) {
    /* ignore */
  }
  return getCoach();
}

function listCoaches() {
  return Object.values(COACHES);
}

loadCoachId();

function coachSpeak(kind, extra) {
  extra = extra || {};
  const coach = getCoach();
  const idea = extra.idea || "";
  const piece = extra.piece || "piece";
  const from = extra.from || "";
  const to = extra.to || "";
  const tip = extra.tip || "";

  const baseLines = {
    idle: ["Your move.", "Go ahead.", "Okay."],
    tip: [tip || "Look for captures, checks, and threats.", tip || "Improve your worst piece."],
    thinking: ["Thinking..."],
    hint1: [
      from ? `Move your ${piece} (highlighted). Press Hint again for where.` : `Focus on your ${piece}. Press Hint again for where.`,
      "Look at the highlighted piece. That's the one to move.",
    ],
    hint2: [
      from && to ? `Now play it: ${from} â†’ ${to}.` : "Here's where it should go.",
      from && to ? `Destination: ${to}. Play ${from}${to}.` : "This is the full move.",
    ],
    suggest: [
      idea ? `I'd look at ${idea}.` : "There's a strong idea here.",
      idea ? `Suggestion: ${idea}.` : "Try a more forcing move.",
    ],
  };

  const coachLines = coach.lines || {};
  const lines = Object.assign({}, baseLines, coachLines);

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

  let why = extra.why || "";
  let impact = extra.impact || "";
  if (why || impact) {
    const reframed = styleReframe(coach, why, impact, kindKey);
    why = reframed.why;
    impact = reframed.impact;
  }

  let text = extra.text || pick(lines[kindKey]);

  if (extra.byCoach && extra.move && !extra.text) {
    const mv = `${extra.move.slice(0, 2)}â†’${extra.move.slice(2, 4)}`;
    text = `I play ${mv}. ${text}`;
  } else if (!extra.byCoach && extra.hintUsed && !extra.text) {
    text = `Hint move â€” still rated. ${text}`;
  }

  if (!extra.text && why && ["best", "excellent", "good", "book", "inaccuracy", "mistake", "blunder", "brilliant"].includes(kindKey)) {
    text = `${text} ${why}`;
  }

  let tipOut = impact || tip;
  if (!impact && tip && ["good", "excellent", "best", "book", "yourMove", "start", "suggest"].includes(kindKey)) {
    tipOut = tip;
  } else if (kindKey === "tip") {
    tipOut = tip || text;
  }

  if (kindKey === "start" && coach.tagline && !tipOut) {
    tipOut = coach.reframe && coach.reframe.suffix ? coach.reframe.suffix : coach.tagline;
  }

  const ratingKind = ["best", "excellent", "good", "book", "inaccuracy", "mistake", "blunder", "brilliant"].includes(kindKey)
    ? kindKey
    : null;
  const shout = pickShout(coach.id, kindKey);

  return {
    kind: mappedKind,
    title: titleMap[kindKey] || "Coach",
    text,
    tip: tipOut || "",
    why,
    impact,
    coachId: coach.id,
    coachName: coach.name,
    ratingKind,
    byCoach: !!extra.byCoach,
    shout,
  };
}

function magnusSpeak(kind, extra) {
  return coachSpeak(kind, extra);
}

const api = {
  coachSpeak,
  magnusSpeak,
  getCoach,
  setCoach,
  listCoaches,
  COACHES,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
} else {
  window.CoachLib = api;
  window.magnusSpeak = magnusSpeak;
  window.coachSpeak = coachSpeak;
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
const CoachLib = window.CoachLib;
const speak = CoachLib ? CoachLib.coachSpeak : window.magnusSpeak;

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
const coachBrand = document.getElementById("coachBrand");
const coachAvatar = document.getElementById("coachAvatar");
const coachPicker = document.getElementById("coachPicker");
const oppName = document.getElementById("oppName");
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
const optVoice = document.getElementById("optVoice");
const voiceBtn = document.getElementById("voiceBtn");
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

function coachForMove(analysis, move, opts) {
  opts = opts || {};
  return speak(analysis.kind, {
    why: analysis.why || "",
    impact: analysis.impact || "",
    tip: opts.byCoach ? state.tip || "Your move." : analysis.impact || state.tip,
    byCoach: !!opts.byCoach,
    move,
    hintUsed: !!opts.hintUsed,
  });
}

function saveRatingDetail(analysis, move, byCoach) {
  const symbol = analysis.symbol || (E.MOVE_SYMBOLS && E.MOVE_SYMBOLS[analysis.kind]) || "";
  const detail = {
    kind: analysis.kind,
    move,
    byCoach: !!byCoach,
    why: analysis.why || "",
    impact: analysis.impact || "",
    symbol,
    best: analysis.best || null,
    loss: analysis.loss,
  };
  state.ratingDetail = detail;
  state.lastRating = {
    kind: detail.kind,
    symbol: detail.symbol,
    sq: move.slice(2, 4),
    byCoach: detail.byCoach,
  };
  return detail;
}

function openRatingExplain() {
  const d = state.ratingDetail;
  if (!d || state.thinking) return;

  const title = (E.MOVE_TITLES && E.MOVE_TITLES[d.kind]) || d.kind;
  const who = d.byCoach ? "My" : "Your";
  const mv = `${d.move.slice(0, 2)}→${d.move.slice(2, 4)}`;
  const parts = [`${who} move ${mv} — ${title}.`];

  if (d.why) parts.push(d.why);
  if (d.impact) parts.push(d.impact);
  if (d.best && d.best !== d.move) {
    parts.push(`Stronger was ${d.best.slice(0, 2)}→${d.best.slice(2, 4)}.`);
  }

  state.coach = speak(d.kind, {
    text: parts.join(" "),
    why: d.why,
    impact: d.impact,
    move: d.move,
    byCoach: d.byCoach,
  });
  renderCoach();
  if (window.CoachVoice) {
    window.CoachVoice.speak(state.coach, false, { force: true, skipShout: true });
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
    const before = state.board;
    const histLen = state.history.length;
    let analysis = null;
    try {
      analysis = E.analyzeMove(before, false, move, histLen, { forCoach: true });
    } catch (_) {
      analysis = { kind: "good", why: "", impact: "", symbol: "✓" };
    }
    snapshots.push({
      board: state.board,
      turn: state.turn,
      history: state.history.slice(),
      lastMove,
    });
    state.board = applyMove(state.board, move);
    const ratingDetail = saveRatingDetail(analysis, move, true);
    state.history.push({ move, rating: analysis.kind, by: "coach", ratingDetail });
    lastMove = move;
    state.turn = "0";
    state.hintStep = 0;
    state.hintFrom = null;
    state.hintTo = null;
    pendingHint = null;
    state.suggestion = null;
    state.showSuggestion = false;
    refreshMeta();
    state.coach = coachForMove(analysis, move, { byCoach: true });
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

function applyCoachUI() {
  if (!CoachLib) return;
  const coach = CoachLib.getCoach();
  if (coachBrand) coachBrand.textContent = coach.name;
  if (coachAvatar) {
    coachAvatar.src = coach.avatar;
    coachAvatar.alt = coach.name + " AI Coach";
  }
  if (oppName) oppName.textContent = coach.name.split(" ").pop() || "Coach";
  if (window.CoachVoice && coach.voice) {
    window.CoachVoice.setProfile(coach.voice);
  }
  document.title = coach.name + " — Play Coach";
}

function renderCoachPicker() {
  if (!coachPicker || !CoachLib) return;
  const current = CoachLib.getCoach().id;
  coachPicker.innerHTML = CoachLib.listCoaches()
    .map(
      (c) =>
        `<button type="button" class="coach-card${c.id === current ? " on" : ""}" data-coach="${c.id}" aria-pressed="${c.id === current}">` +
        `<img src="${c.avatar}" alt="" class="coach-card-img" />` +
        `<span class="coach-card-name">${c.name.split(" ").pop()}</span>` +
        `<span class="coach-card-tag">${c.tagline}</span>` +
        `</button>`
    )
    .join("");
  coachPicker.querySelectorAll("[data-coach]").forEach((btn) => {
    btn.addEventListener("click", () => {
      CoachLib.setCoach(btn.dataset.coach);
      applyCoachUI();
      renderCoachPicker();
      if (window.CoachVoice) window.CoachVoice.reset();
      state.coach = speak("start");
      renderBoard(true);
    });
  });
}

function renderCoach() {
  const coach = state.coach || { kind: "idle", title: "Coach", text: "" };
  const badgeKind = state.thinking ? "idle" : coach.ratingKind || coach.kind || "idle";
  coachTitle.textContent = state.thinking ? "Thinking" : coach.title || "Coach";
  coachTitle.className = "badge " + badgeKind;
  if (coachText) {
    const body = state.thinking ? "Thinking..." : coach.text || "";
    if (!state.thinking && coach.shout && body) {
      coachText.innerHTML = `<span class="coach-shout">${coach.shout}</span> ${body}`;
    } else {
      coachText.textContent = body;
    }
  }
  if (tipText) {
    const impact = state.coach && state.coach.impact;
    tipText.textContent = state.thinking ? "" : impact || state.tip || (state.coach && state.coach.tip) || "";
  }
  const panel = document.querySelector(".coach-panel");
  if (panel) {
    if (!state.thinking && coach.shout && coach.ratingKind) {
      panel.setAttribute("data-shout", coach.ratingKind);
    } else if (!panel.classList.contains("shout-flash")) {
      panel.removeAttribute("data-shout");
    }
  }
  if (window.CoachVoice) {
    if (state.thinking) {
      window.speechSynthesis && window.speechSynthesis.cancel();
    } else {
      window.CoachVoice.speak(coach, false);
    }
  }
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
    const ratingBadge = document.createElement("button");
    ratingBadge.type = "button";
    ratingBadge.className = "move-badge hidden";
    ratingBadge.setAttribute("aria-label", "Explain this move rating");
    ratingBadge.title = "Tap to explain this move";
    ratingBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      openRatingExplain();
    });
    sq.appendChild(ratingBadge);
    sq.addEventListener("click", () => onSquareClick(name));
    boardEl.appendChild(sq);
    squares.push({ el: sq, piece, dot, ratingBadge, name, ch: null });
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
    (state.lastRating && state.lastRating.kind) || "",
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
    const dest = lastMove ? lastMove.slice(2, 4) : "";
    const badge = cell.ratingBadge;
    if (badge) {
      const show = !!(state.lastRating && name === dest && !state.thinking);
      badge.classList.toggle("hidden", !show);
      if (show) {
        badge.textContent = state.lastRating.symbol || (E.MOVE_SYMBOLS && E.MOVE_SYMBOLS[state.lastRating.kind]) || "";
        badge.className = "move-badge " + (state.lastRating.kind || "good") + (state.lastRating.byCoach ? " coach-move" : " player-move");
      }
    }
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
  const hintUsed = state.hintStep >= 1 || !!(pendingHint && pendingHint === move);
  let analysis = null;
  try {
    analysis = E.analyzeMove(before, true, move, histLen, { forCoach: false });
  } catch (_) {
    analysis = { kind: "good", why: "", impact: "", symbol: "✓" };
  }

  snapshots.push({
    board: state.board,
    turn: state.turn,
    history: state.history.slice(),
    lastMove,
  });
  state.board = applyMove(state.board, move);
  const ratingDetail = saveRatingDetail(analysis, move, false);
  state.history.push({ move, rating: analysis.kind, by: "player", hintUsed, ratingDetail });
  lastMove = move;
  state.turn = "1";
  state.hintStep = 0;
  state.hintFrom = null;
  state.hintTo = null;
  pendingHint = null;
  state.suggestion = null;
  state.showSuggestion = false;
  refreshMeta();
  state.coach = coachForMove(analysis, move, { byCoach: false, hintUsed });
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
  if (window.CoachVoice) window.CoachVoice.reset();
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
    lastRating: null,
    ratingDetail: null,
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
  const last = state.history[state.history.length - 1];
  if (last && last.ratingDetail) {
    state.ratingDetail = last.ratingDetail;
    state.lastRating = {
      kind: last.ratingDetail.kind,
      symbol: last.ratingDetail.symbol,
      sq: last.ratingDetail.move.slice(2, 4),
      byCoach: last.ratingDetail.byCoach,
    };
  } else if (last && last.rating && last.move) {
    state.ratingDetail = null;
    state.lastRating = {
      kind: last.rating,
      symbol: (E.MOVE_SYMBOLS && E.MOVE_SYMBOLS[last.rating]) || "",
      sq: last.move.slice(2, 4),
      byCoach: last.by === "coach",
    };
  } else {
    state.ratingDetail = null;
    state.lastRating = null;
  }
  if (window.CoachVoice) window.CoachVoice.reset();
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
  if (optVoice && window.CoachVoice) {
    window.CoachVoice.setEnabled(optVoice.checked);
  }
  refreshMeta();
  renderBoard(true);
}

if (voiceBtn && window.CoachVoice) {
  voiceBtn.addEventListener("click", () => {
    window.CoachVoice.setEnabled(!window.CoachVoice.isEnabled());
    if (optVoice) optVoice.checked = window.CoachVoice.isEnabled();
  });
}

document.body.addEventListener(
  "click",
  () => {
    if (window.CoachVoice) window.CoachVoice.prime();
  },
  { once: true }
);

newGameBtn.addEventListener("click", startPractice);
hintBtn.addEventListener("click", askHint);
undoBtn.addEventListener("click", undoMove);
ideaBtn.addEventListener("click", showIdea);
settingsBtn.addEventListener("click", () => {
  if (optVoice && window.CoachVoice) {
    optVoice.checked = window.CoachVoice.isEnabled();
  }
  settingsEl.classList.remove("hidden");
});
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
  applyCoachUI();
  renderCoachPicker();
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
