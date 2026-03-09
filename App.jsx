import { useState, useEffect, useCallback } from "react";

const cards = [
  { question: "What is the largest planet in our solar system?", answer: "Jupiter — it's so massive that all other planets could fit inside it twice over." },
  { question: "How long does light from the Sun take to reach Earth?", answer: "About 8 minutes and 20 seconds — traveling 93 million miles at 186,000 miles per second." },
  { question: "What is a light-year?", answer: "The distance light travels in one year — approximately 5.88 trillion miles (9.46 trillion km)." },
  { question: "What is the name of the galaxy we live in?", answer: "The Milky Way — a barred spiral galaxy containing 200–400 billion stars." },
  { question: "What is a black hole?", answer: "A region of spacetime where gravity is so strong that nothing — not even light — can escape its event horizon." },
  { question: "What planet is known as the Red Planet?", answer: "Mars — its reddish color comes from iron oxide (rust) covering its surface." },
  { question: "How many moons does Saturn have?", answer: "146 confirmed moons — the most of any planet in our solar system." },
  { question: "What is the hottest planet in our solar system?", answer: "Venus — with surface temperatures around 900°F (475°C) due to its thick CO₂ atmosphere." },
  { question: "What was the first artificial satellite launched into space?", answer: "Sputnik 1 — launched by the Soviet Union on October 4, 1957." },
  { question: "What is a neutron star?", answer: "The collapsed core of a massive star — so dense that a teaspoon would weigh about a billion tons." },
  { question: "What is the Oort Cloud?", answer: "A vast, distant shell of icy objects surrounding our solar system, thought to be the source of long-period comets." },
  { question: "Which mission first landed humans on the Moon?", answer: "Apollo 11 — Neil Armstrong and Buzz Aldrin landed on July 20, 1969." },
];

function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="white"
            opacity={s.opacity}
            style={{
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function FlashcardApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [usedIndices, setUsedIndices] = useState([0]);
  const [cardKey, setCardKey] = useState(0);

  const getRandomIndex = useCallback(() => {
    if (usedIndices.length >= cards.length) {
      return Math.floor(Math.random() * cards.length);
    }
    let next;
    do {
      next = Math.floor(Math.random() * cards.length);
    } while (usedIndices.includes(next));
    return next;
  }, [usedIndices]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      const next = getRandomIndex();
      setCurrentIndex(next);
      setUsedIndices((prev) => {
        const updated = [...prev, next];
        return updated.length >= cards.length ? [next] : updated;
      });
      setIsFlipped(false);
      setCardKey((k) => k + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleFlip = () => {
    if (isAnimating) return;
    setIsFlipped((f) => !f);
  };

  const card = cards[currentIndex];
  const progress = ((usedIndices.length - 1) / cards.length) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050a14;
          min-height: 100vh;
          font-family: 'Crimson Pro', serif;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.9; }
        }

        @keyframes nebula-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(-20px, 15px) scale(1.05); opacity: 0.22; }
        }

        @keyframes float-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,179,237,0.3), 0 0 60px rgba(99,179,237,0.1); }
          50% { box-shadow: 0 0 35px rgba(99,179,237,0.5), 0 0 90px rgba(99,179,237,0.2); }
        }

        @keyframes rotate-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .app-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          z-index: 1;
        }

        .nebula {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .nebula-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%);
          top: -150px; right: -150px;
          animation: nebula-drift 12s ease-in-out infinite;
        }

        .nebula-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%);
          bottom: -100px; left: -100px;
          animation: nebula-drift 15s ease-in-out infinite reverse;
        }

        .nebula-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%);
          top: 40%; left: 10%;
          animation: nebula-drift 10s ease-in-out 2s infinite;
        }

        .header {
          text-align: center;
          margin-bottom: 44px;
          animation: float-in 0.8s ease-out both;
        }

        .title {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #e2e8f0 0%, #93c5fd 40%, #c4b5fd 70%, #f9a8d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .description {
          font-size: 1.15rem;
          color: rgba(148,163,184,0.9);
          font-style: italic;
          letter-spacing: 0.04em;
          max-width: 420px;
          line-height: 1.6;
          margin: 0 auto 12px;
        }

        .card-count {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,179,237,0.1);
          border: 1px solid rgba(99,179,237,0.25);
          border-radius: 999px;
          padding: 5px 16px;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: #93c5fd;
          text-transform: uppercase;
        }

        .card-count::before {
          content: '✦';
          font-size: 0.6rem;
        }

        .progress-bar-container {
          width: min(520px, 90vw);
          margin-bottom: 32px;
          animation: float-in 0.8s ease-out 0.1s both;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: rgba(148,163,184,0.6);
          text-transform: uppercase;
          font-family: 'Cinzel', serif;
          margin-bottom: 8px;
        }

        .progress-track {
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 2px;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scene {
          width: min(520px, 90vw);
          height: min(340px, 60vw);
          perspective: 1200px;
          cursor: pointer;
          animation: float-in 0.8s ease-out 0.2s both;
          margin-bottom: 36px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-inner.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 40px;
          text-align: center;
        }

        .card-front {
          background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(23,37,84,0.9) 100%);
          border: 1px solid rgba(99,179,237,0.3);
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .card-back {
          background: linear-gradient(135deg, rgba(23,10,42,0.95) 0%, rgba(45,18,82,0.9) 100%);
          border: 1px solid rgba(167,139,250,0.35);
          transform: rotateY(180deg);
          box-shadow: 0 0 30px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.1);
        }

        .card-face::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 19px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 18px;
          padding: 4px 14px;
          border-radius: 999px;
        }

        .card-front .card-label {
          color: #93c5fd;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.2);
        }

        .card-back .card-label {
          color: #c4b5fd;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.2);
        }

        .card-text {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.65;
          color: rgba(226,232,240,0.92);
          font-weight: 300;
          max-width: 380px;
        }

        .card-front .card-text {
          font-style: italic;
        }

        .card-hint {
          position: absolute;
          bottom: 16px;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: rgba(148,163,184,0.4);
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-hint::before, .card-hint::after {
          content: '—';
          opacity: 0.5;
        }

        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
          pointer-events: none;
        }

        .orbit-1 {
          width: 580px; height: 580px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-color: rgba(99,179,237,0.06);
        }

        .orbit-2 {
          width: 700px; height: 700px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-color: rgba(139,92,246,0.04);
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: float-in 0.8s ease-out 0.3s both;
        }

        .btn-next {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
          border: 1px solid rgba(139,92,246,0.4);
          color: #e2e8f0;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 32px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-next::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn-next:hover::before { opacity: 1; }
        .btn-next:hover {
          border-color: rgba(167,139,250,0.7);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.3);
        }
        .btn-next:active { transform: translateY(0); }

        .btn-next svg {
          width: 16px; height: 16px;
          transition: transform 0.3s;
        }

        .btn-next:hover svg { transform: translateX(4px); }

        .card-number {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: rgba(148,163,184,0.5);
          text-transform: uppercase;
        }

        .flip-tip {
          margin-top: 20px;
          font-size: 0.72rem;
          color: rgba(148,163,184,0.35);
          letter-spacing: 0.1em;
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          animation: float-in 0.8s ease-out 0.4s both;
        }

        @media (max-width: 480px) {
          .scene { height: 280px; }
          .card-face { padding: 28px 24px; }
        }
      `}</style>

      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
      <StarField />

      <div className="app-container">
        <header className="header">
          <h1 className="title">Cosmos</h1>
          <p className="description">Journey through the universe — one cosmic mystery at a time</p>
          <span className="card-count">{cards.length} cards in this set</span>
        </header>

        <div className="progress-bar-container">
          <div className="progress-label">
            <span>Progress</span>
            <span>{usedIndices.length - 1} / {cards.length} explored</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="scene" onClick={handleFlip} role="button" aria-label="Flip card">
          <div className="orbit-ring orbit-1" />
          <div className="orbit-ring orbit-2" />
          <div key={cardKey} className={`card-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="card-face card-front">
              <span className="card-label">Question</span>
              <p className="card-text">{card.question}</p>
              <span className="card-hint">tap to reveal</span>
            </div>
            <div className="card-face card-back">
              <span className="card-label">Answer</span>
              <p className="card-text">{card.answer}</p>
              <span className="card-hint">tap to flip back</span>
            </div>
          </div>
        </div>

        <div className="controls">
          <span className="card-number">Card {currentIndex + 1} of {cards.length}</span>
          <button className="btn-next" onClick={handleNext}>
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="flip-tip">✦ Click card to flip · Click next for a random card ✦</p>
      </div>
    </>
  );
}