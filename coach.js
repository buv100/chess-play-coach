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
    styleLine: "Simplify, squeeze, win endgames",
    avatar: "coaches/magnus.jpg",
    avatarFallback: "magnus.svg",
    voice: { rate: 0.82, pitch: 0.9, volume: 0.95, lang: "en-GB" },
    reframe: {
      prefix: "In my style —",
      suffix: "I simplify and squeeze — no need to force anything.",
      good: {
        default: "Solid and practical. Small edges are how I win long games.",
        capture: "Clean material gain. I trade chaos for a clearer endgame.",
        develop: "Natural development — I never rush when the position doesn't need it.",
        center: "Central control quietly limits their options. That's my kind of edge.",
        check: "Forcing moves are fine, but follow up with purpose, not fireworks.",
        openFile: "Open files are for rooks — activate them and keep the pressure steady.",
      },
      inaccuracy: "Small slip. I would tighten up before the edge disappears.",
      mistake: "That drifts from my style — I cut losses and find the safest active plan.",
      blunder: "Too loose. I always ask: what can they take next?",
    },
    lines: {
      start: [
        "Alright. Let's play my way — develop, take space, and don't hang pieces.",
        "I keep it simple. Practical moves beat pretty ones.",
        "Let's go. I'll show you how I grind positions without forcing anything.",
      ],
      best: ["Yeah. That's the move.", "Clean. Exactly what I'd play.", "Correct — no drama needed."],
      excellent: ["Excellent. Very strong.", "Sharp and practical."],
      good: ["Good move. Solid.", "Fine — keeps the position playable.", "I like this. Low risk."],
      book: ["Book. Theory is theory for a reason.", "Known territory — stay on track."],
      inaccuracy: ["A bit loose. There was something tighter.", "Playable, but not my precision."],
      mistake: ["Mistake. Recalculate — I never gift chances.", "Not good. Undo or defend."],
      blunder: ["Blunder. I would never leave that hanging.", "No — calculate one more move."],
      brilliant: ["Beautiful. Even I appreciate that.", "Wow. Strong find."],
      hint1: ["Look at the highlighted piece.", "That piece wants to move — press Hint again for where."],
      hint2: ["Play the arrow. Simple and strong.", "There — that's the idea."],
      undo: ["Fine. Take it back and simplify.", "Okay. Find something cleaner."],
      yourMove: ["Your move.", "Back to you — keep it practical."],
      idle: ["Your move.", "Go ahead.", "What do you want here?"],
      illegal: ["Illegal. Try again."],
      suggest: ["There's a cleaner idea here.", "Look for the practical try."],
    },
  },

  kasparov: {
    id: "kasparov",
    name: "Garry Kasparov",
    tagline: "Dynamic attack",
    styleLine: "Initiative, attack, never passive",
    avatar: "coaches/kasparov.jpg",
    avatarFallback: "kasparov.svg",
    voice: { rate: 0.84, pitch: 0.93, volume: 0.95, lang: "en-GB" },
    reframe: {
      prefix: "Dynamic chess —",
      suffix: "Initiative is everything. Make them defend!",
      good: {
        default: "Active! Seize space and keep the king nervous.",
        capture: "Win material AND keep attacking — that's Garry's way.",
        develop: "Develop with tempo — every move should ask a question.",
        center: "The center is a battlefield. Occupy it with purpose.",
        check: "Check! Force them to weaken their structure.",
        openFile: "Open the file and invade — rooks belong on the seventh.",
      },
      inaccuracy: "Too passive. I would sharpen the position with a threat.",
      mistake: "You gave them breathing room. Attackers don't do that.",
      blunder: "Disaster. The initiative was yours — now it's theirs.",
    },
    lines: {
      start: [
        "Fight! I play for the initiative — develop fast and aim at their king.",
        "Chess is war. Take the center and make every move aggressive.",
        "Let's go. I hate passive play — find threats from move one.",
      ],
      best: ["Yes! That's fighting chess.", "Strong — keeps the initiative.", "Exactly. Make them suffer."],
      excellent: ["Excellent! Dynamic and powerful.", "This keeps them under pressure."],
      good: ["Solid, but look for a sharper follow-up.", "Good — now find the threat."],
      book: ["Theory — but remember: openings serve the attack.", "Book move. Plan the assault."],
      inaccuracy: ["Too soft. There was a more forcing line.", "Passive. I would push harder."],
      mistake: ["Mistake. You lost the initiative.", "Weak. They'll counterattack now."],
      blunder: ["Blunder! Always check their threats when you attack.", "No — that hands them the game."],
      brilliant: ["Brilliant! That's champion-level aggression.", "Fire on the board — love it."],
      hint1: ["That piece leads the attack.", "Move this piece — Hint again for the strike."],
      hint2: ["Strike here. Force the issue.", "This is the aggressive try."],
      undo: ["Take it back. Attack with calculation.", "Undo — find the forcing move."],
      yourMove: ["Your turn — find a threat.", "Attack! Your move."],
      idle: ["Don't sit still — your move.", "Find something forcing."],
      illegal: ["Illegal. The attack must be legal too."],
      suggest: ["There's a more dynamic idea.", "Sharpen it — threaten something."],
    },
  },

  tal: {
    id: "tal",
    name: "Mikhail Tal",
    tagline: "Tactical wizard",
    styleLine: "Sacrifices, chaos, combinations",
    avatar: "coaches/tal.jpg",
    avatarFallback: "tal.svg",
    voice: { rate: 0.83, pitch: 0.94, volume: 0.95, lang: "en-GB" },
    reframe: {
      prefix: "Tal magic —",
      suffix: "Complications favor the brave — make them calculate nightmares.",
      good: {
        default: "Enterprising! I love positions where pieces fly.",
        capture: "Take it — and look for the next combination.",
        develop: "Develop with tricks in mind. Even quiet moves can set traps.",
        center: "Control the center so pieces can jump into tactics.",
        check: "Check! The king hunt begins.",
        openFile: "Open lines are highways for sacrifices and checks.",
      },
      inaccuracy: "Missed spice. I would stir the pot with a tactic.",
      mistake: "Too safe. Sometimes you must sacrifice to win.",
      blunder: "Ouch. But even after a blunder — look for a swindle!",
    },
    lines: {
      start: [
        "Let's create chaos! I sacrifice for attack — complications are my home.",
        "I play for the spectacular. Look for tactics every move.",
        "Ready? The board is a canvas — paint with sacrifices.",
      ],
      best: ["Gorgeous. The pieces sing.", "Yes! Tactical and strong.", "That's the spirit."],
      excellent: ["Excellent — feels like a combination.", "Beautiful chess."],
      good: ["Good. But is there a tactic hiding?", "Solid — now look for fireworks."],
      book: ["Book — but theory ends where tactics begin.", "Known move. Hunt for tricks anyway."],
      inaccuracy: ["A bit dull. I would complicate.", "Missed a spicy idea."],
      mistake: ["Mistake — but maybe a sacrifice saves you next move?", "Inaccurate. Look for a tactic."],
      blunder: ["Blunder! Still — never stop looking for a trap.", "Bad, but Tal never resigns mentally."],
      brilliant: ["Brilliant! Pure Tal.", "That's poetry — a real combination."],
      hint1: ["This piece wants to sacrifice or attack.", "Hint again — the finish is wild."],
      hint2: ["Play it! Trust the calculation.", "There — tactical gold."],
      undo: ["Take it back. Find the combination.", "Try again — look for a sacrifice."],
      yourMove: ["Your move — any tactics?", "Create something beautiful."],
      idle: ["Your turn. Complicate!", "What sacrifice is lurking?"],
      illegal: ["That move isn't legal — even magicians follow rules."],
      suggest: ["There's a tactical idea here.", "Look for a sacrifice or fork."],
    },
  },

  fischer: {
    id: "fischer",
    name: "Bobby Fischer",
    tagline: "Precision & best move",
    styleLine: "Find the best move — always",
    avatar: "coaches/fischer.jpg",
    avatarFallback: "fischer.svg",
    voice: { rate: 0.8, pitch: 0.88, volume: 0.95, lang: "en-US" },
    reframe: {
      prefix: "Best move chess —",
      suffix: "If you see a good move, look for a better one.",
      good: {
        default: "Correct. Accuracy is non-negotiable.",
        capture: "Win material when it's sound — that's objective chess.",
        develop: "Develop with purpose. Every tempo counts.",
        center: "Central pawns and pieces — classical and correct.",
        check: "Check is fine if it's the most accurate continuation.",
        openFile: "Open files belong to rooks — place them correctly.",
      },
      inaccuracy: "Inaccuracy. I would find the precise move.",
      mistake: "Mistake. Sloppy play loses to good opponents.",
      blunder: "Blunder. One bad move can ruin everything — I learned that the hard way.",
    },
    lines: {
      start: [
        "I play the best move. Period. Calculate and don't bluff.",
        "Chess is truth. Find the objectively strongest continuation.",
        "Let's go. Accuracy beats everything — even talent.",
      ],
      best: ["Best move.", "Correct.", "That's the line."],
      excellent: ["Excellent — very precise.", "Strong and accurate."],
      good: ["Good. But was it the best?", "Acceptable — verify with calculation."],
      book: ["Book. Know your openings cold.", "Theory — memorized and correct."],
      inaccuracy: ["Inaccuracy. There was a better move.", "Not precise enough."],
      mistake: ["Mistake. I hate loose moves.", "Wrong. Fix it."],
      blunder: ["Blunder! Unacceptable.", "Terrible — calculate before you click."],
      brilliant: ["Brilliant! The best move found.", "Perfect calculation."],
      hint1: ["This piece — calculate its best square.", "Hint again for the precise move."],
      hint2: ["Play it. That's the best line.", "Objective best — play it."],
      undo: ["Take it back. Find the best move.", "Undo and calculate properly."],
      yourMove: ["Your move. Best move only.", "Calculate. Your turn."],
      idle: ["Your move.", "Find the truth in the position."],
      illegal: ["Illegal move. The rules are the rules."],
      suggest: ["There's a stronger move.", "Look deeper — best move is there."],
    },
  },

  capablanca: {
    id: "capablanca",
    name: "José Capablanca",
    tagline: "Simple & natural",
    styleLine: "Natural moves, pure technique",
    avatar: "coaches/capablanca.svg",
    avatarFallback: "capablanca.svg",
    voice: { rate: 0.81, pitch: 0.9, volume: 0.95, lang: "en-GB" },
    reframe: {
      prefix: "Natural chess —",
      suffix: "Simple moves are often the strongest — don't force what isn't there.",
      good: {
        default: "Natural and harmonious. The pieces find good squares.",
        capture: "Take what is free — simplicity wins endgames.",
        develop: "Develop logically. No need for fireworks.",
        center: "Central control — classical and effortless.",
        check: "A useful check, if it improves your position.",
        openFile: "Rooks belong on open files — elementary, but powerful.",
      },
      inaccuracy: "Slightly unnatural. The position had a simpler path.",
      mistake: "Unnecessary complication. Return to natural moves.",
      blunder: "A rare ugly move. Simplify and defend carefully.",
    },
    lines: {
      start: [
        "Play naturally. Good moves flow from the position — don't force.",
        "I believe in simple, logical chess. Develop and coordinate.",
        "Let's play. The easiest good move is often best.",
      ],
      best: ["Natural and strong.", "Simple — exactly right.", "The position plays itself."],
      excellent: ["Excellent. Effortless technique.", "Very clean."],
      good: ["Good. Logical.", "Harmonious — I approve."],
      book: ["Book. Classical development.", "Sound opening play."],
      inaccuracy: ["A little artificial. Simpler was available.", "Not the most natural."],
      mistake: ["Mistake. You complicated unnecessarily.", "Avoid clutter — simplify."],
      blunder: ["Blunder. Even simple positions punish errors.", "Careless — undo if you can."],
      brilliant: ["Beautiful simplicity.", "Elegant — like a clear endgame."],
      hint1: ["This piece belongs on a natural square.", "Hint again for the simple finish."],
      hint2: ["There — logical and strong.", "Play it. Nothing forced."],
      undo: ["Take it back. Find the natural move.", "Undo — simplify."],
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
    styleLine: "Restrict, squeeze, prophylaxis",
    avatar: "coaches/karpov.svg",
    avatarFallback: "karpov.svg",
    voice: { rate: 0.8, pitch: 0.89, volume: 0.95, lang: "en-GB" },
    reframe: {
      prefix: "Positional play —",
      suffix: "Restrict their plans first — then the attack plays itself.",
      good: {
        default: "Prophylactic and strong. You limit their counterplay.",
        capture: "Win material while keeping control — classic Karpov.",
        develop: "Develop with restraint — don't open lines for them.",
        center: "Central control restricts their pieces. Slowly, surely.",
        check: "Useful if it ties them down — not if it frees them.",
        openFile: "Occupy the file and infiltrate — squeeze, don't rush.",
      },
      inaccuracy: "Soft. Tighten the screws — restrict more.",
      mistake: "You loosened the grip. They'll breathe now.",
      blunder: "Blunder. Positional control lost in one move.",
    },
    lines: {
      start: [
        "I improve slowly and restrict you. Small advantages decide games.",
        "Play prophylactically — ask what they want, then prevent it.",
        "Let's go. Patience and pressure — no need to rush the attack.",
      ],
      best: ["Precise. Restrictive.", "Strong — they have fewer good moves now."],
      excellent: ["Excellent positional play.", "You tighten the noose."],
      good: ["Good. Keeps pressure.", "Solid restriction."],
      book: ["Book — solid foundation.", "Correct opening — now restrict."],
      inaccuracy: ["Too generous. Tighten up.", "They get counterplay from this."],
      mistake: ["Mistake. You opened a door.", "Loose — they will exploit it."],
      blunder: ["Blunder. Positional collapse.", "Bad — defend and simplify."],
      brilliant: ["Excellent prophylaxis.", "Strong — like a boa constrictor."],
      hint1: ["Improve this piece — restriction first.", "Hint again for the squeeze."],
      hint2: ["Play it. Limit their options.", "There — positional gold."],
      undo: ["Take it back. Restrict better.", "Undo — find the clamp."],
      yourMove: ["Your move. What do they want?", "Prophylaxis — your turn."],
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
      from && to ? `Now play it: ${from} → ${to}.` : "Here's where it should go.",
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
    const mv = `${extra.move.slice(0, 2)}→${extra.move.slice(2, 4)}`;
    text = `I play ${mv}. ${text}`;
  } else if (!extra.byCoach && extra.hintUsed && !extra.text) {
    text = `Hint move — still rated. ${text}`;
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
