'use client';

import { useState, useEffect } from 'react';

interface StarWarsIntroProps {
  onComplete: () => void;
}

export default function StarWarsIntro({ onComplete }: StarWarsIntroProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      onComplete();
    }, 12000); // 12 seconds for the full intro

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showIntro) return null;

  return (
    <div className="intro-crawl" onClick={() => { setShowIntro(false); onComplete(); }}>
      <div className="intro-text">
        <div className="intro-title">
          GALAXY AI TERMINAL
        </div>
        
        <p>Episode IV</p>
        <p>A NEW HOPE FOR AI</p>
        <br />
        <p>
          It is a period of digital revolution.
          Rebel developers, striking from hidden
          terminals, have won their first victory
          against the evil Empire of Traditional Programming.
        </p>
        <br />
        <p>
          During the battle, rebel spies managed
          to steal secret plans to the Empire's
          ultimate weapon, the GPT MODEL,
          an artificial intelligence with enough
          power to understand an entire galaxy.
        </p>
        <br />
        <p>
          Pursued by the Empire's sinister agents,
          Princess Developer races home aboard
          her starship, custodian of the stolen
          plans that can save her people and
          restore freedom to the galaxy...
        </p>
        <br />
        <p style={{ fontSize: '16px', opacity: 0.7 }}>
          Click anywhere to skip
        </p>
      </div>
      
      {/* Stars background */}
      <div className="stars">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}