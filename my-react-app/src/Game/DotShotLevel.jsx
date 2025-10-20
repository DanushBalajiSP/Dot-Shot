import React from 'react';
import './DotShotLevel.css';

const DotShotLevel = ({ level }) => {
  // Knocked Out State
  if (level === -1) {
    return (
      <div className="dotshot-level knockout">
        <div className="ko-animation">💥 KNOCKED OUT 💥</div>
      </div>
    );
  }
  
  // Ready to Fire State (Level 4+)
  if (level >= 4) {
    return (
      <div className="dotshot-level ready">
        <div className="ready-indicator">
          ⚡ READY TO FIRE ⚡
        </div>
        <div className="power-dots">
          {Array(level).fill(0).map((_, idx) => (
            <div 
              key={idx} 
              className="power-dot"
            >
              ●
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="dotshot-level">
      <div className="shot-chamber">
        {Array(4).fill(0).map((_, idx) => (
          <div 
            key={idx} 
            className={`shot-dot ${idx < level ? 'loaded' : 'empty'}`}
          >
            {idx < level ? '⬤' : '◉'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DotShotLevel;
