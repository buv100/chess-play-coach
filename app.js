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
