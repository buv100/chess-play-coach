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
