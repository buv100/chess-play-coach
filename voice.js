"use strict";

(function () {
  let voiceOn = localStorage.getItem("coachVoice") !== "0";
  let lastKey = "";
  let voicesReady = false;
  let pickVoice = null;
  let voiceProfile = { rate: 0.82, pitch: 0.92, lang: "en-GB", volume: 0.95 };

  function scoreVoice(v) {
    let score = 0;
    const name = v.name || "";
    const lang = v.lang || "";

    if (/Natural|Neural|Premium|Enhanced|Wavenet/i.test(name)) score += 130;
    if (/Microsoft (Guy|Ryan|Christopher|Eric|Steffan) Natural/i.test(name)) score += 120;
    if (/Google UK English Male|Google US English/i.test(name) && !/Female/i.test(name)) score += 100;
    if (/Daniel|James|Tom|Mark|George|Lee|Oliver|Colin|Malcolm/i.test(name) && !/Female/i.test(name)) score += 90;
    if (/David|Alex|Fred|Microsoft David/i.test(name) && !/Female|Desktop/i.test(name)) score += 70;
    if (/Male|male/.test(name)) score += 30;
    if (lang.startsWith("en-GB")) score += 15;
    if (lang.startsWith("en")) score += 8;
    if (v.localService) score += 18;

    if (/Female|Samantha|Karen|Aria|Jenny|Zira|Sonia|Libby|Natasha|Victoria|Serena|Moira|Tessa|Allison|Emma|Olivia/i.test(name)) {
      score -= 80;
    }
    if (/Zira|Helena|Catherine/i.test(name)) score -= 50;

    return score;
  }

  function loadVoices() {
    const list = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (list.length) {
      const ranked = list.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
      pickVoice = ranked[0] || null;
      voicesReady = true;
    }
    return list;
  }

  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function setSpeaking(on) {
    const el = document.getElementById("magnusAvatar");
    if (el) el.classList.toggle("speaking", !!on);
  }

  function setShouting(on, kind) {
    const av = document.getElementById("magnusAvatar");
    const panel = document.querySelector(".coach-panel");
    if (av) {
      av.classList.toggle("shouting", !!on);
      if (on && kind) av.setAttribute("data-shout-kind", kind);
      else av.removeAttribute("data-shout-kind");
    }
    if (panel) {
      panel.classList.toggle("shout-flash", !!on);
      if (on && kind) panel.setAttribute("data-shout", kind);
      else panel.removeAttribute("data-shout");
    }
  }

  function coachVoiceEnabled() {
    return voiceOn && !!window.speechSynthesis;
  }

  function setCoachVoice(on) {
    voiceOn = !!on;
    localStorage.setItem("coachVoice", voiceOn ? "1" : "0");
    if (!voiceOn && window.speechSynthesis) {
      speechSynthesis.cancel();
      setSpeaking(false);
      setShouting(false);
    }
    const btn = document.getElementById("voiceBtn");
    if (btn) {
      btn.classList.toggle("off", !voiceOn);
      btn.setAttribute("aria-label", voiceOn ? "Mute coach voice" : "Unmute coach voice");
      btn.textContent = voiceOn ? "🔊" : "🔇";
    }
  }

  function humanizeText(text) {
    return String(text)
      .replace(/\s*→\s*/g, " to ")
      .replace(/\s*—\s*/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function speakLine(text, opts, done) {
    if (!window.speechSynthesis || !text) {
      if (done) done();
      return;
    }
    const utter = new SpeechSynthesisUtterance(humanizeText(text));
    utter.lang = voiceProfile.lang || "en-GB";
    utter.rate = opts.rate ?? voiceProfile.rate ?? 0.82;
    utter.pitch = opts.pitch ?? voiceProfile.pitch ?? 0.92;
    utter.volume = opts.volume ?? voiceProfile.volume ?? 0.95;
    if (pickVoice) utter.voice = pickVoice;
    utter.onstart = () => {
      if (opts.shout) {
        setSpeaking(false);
        setShouting(true, opts.shoutKind || "");
      } else {
        setShouting(false);
        setSpeaking(true);
      }
    };
    utter.onend = () => {
      if (opts.shout) setShouting(false);
      else setSpeaking(false);
      if (done) done();
    };
    utter.onerror = () => {
      setShouting(false);
      setSpeaking(false);
      if (done) done();
    };
    speechSynthesis.speak(utter);
  }

  function speakCoach(coach, thinking, options) {
    options = options || {};
    if (!coachVoiceEnabled() || thinking) return;
    if (!voicesReady) loadVoices();

    const main = (coach && coach.text) || "";
    const extra = (coach && (coach.impact || coach.tip)) || "";
    const text = extra && extra !== main ? `${main} ${extra}` : main;
    const key = text.trim();
    if (!key) return;
    if (!options.force && key === lastKey) return;
    lastKey = key;

    speechSynthesis.cancel();

    const shout = options.skipShout ? null : coach && coach.shout;
    const shoutKind = coach && coach.ratingKind;
    const baseRate = voiceProfile.rate ?? 0.82;
    const basePitch = voiceProfile.pitch ?? 0.92;
    const baseVol = voiceProfile.volume ?? 0.95;

    const speakMain = () => {
      speakLine(key, { rate: baseRate, pitch: basePitch, volume: baseVol, shout: false });
    };

    if (shout) {
      speakLine(
        shout,
        {
          shout: true,
          shoutKind: shoutKind || "brilliant",
          rate: Math.min(1.05, baseRate + 0.08),
          pitch: Math.min(1.08, basePitch + 0.06),
          volume: baseVol,
        },
        speakMain
      );
    } else {
      speakMain();
    }
  }

  function resetSpeakKey() {
    lastKey = "";
  }

  function prime() {
    loadVoices();
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0;
    speechSynthesis.speak(u);
  }

  function setProfile(profile) {
    voiceProfile = Object.assign({ rate: 0.82, pitch: 0.92, lang: "en-GB", volume: 0.95 }, profile || {});
    if (profile && profile.lang) voiceProfile.lang = profile.lang;
  }

  window.CoachVoice = {
    speak: speakCoach,
    setEnabled: setCoachVoice,
    isEnabled: coachVoiceEnabled,
    reset: resetSpeakKey,
    prime,
    setProfile,
  };

  window.addEventListener("DOMContentLoaded", () => {
    setCoachVoice(voiceOn);
  });
})();
