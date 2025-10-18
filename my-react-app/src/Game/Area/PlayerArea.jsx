import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import DotShotLevel from '../DotShotLevel';
import './Area.css';

function PlayerArea({ cards, isActive, onCardSelect, onCardAttack, onCardHeal, attackMode, playerType }) {
  const areaRef = useRef(null);

  // useGSAP(() => {
  //   gsap.fromTo('.player-area .card', 
  //     { scale: 0, opacity: 0 },
  //     { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)', delay: 0.6 }
  //   );
  // }, []);

  const handleCardClick = (index) => {
    if (attackMode && attackMode.action === null && attackMode.player === playerType && attackMode.cardIndex === index) {
      return;
    }

    if (attackMode && attackMode.action === 'attack' && attackMode.player !== playerType) {
      onCardAttack(playerType, index);
    }
    else if (attackMode && attackMode.action === 'heal' && attackMode.player === playerType) {
      onCardHeal(playerType, index);
    }
    else if (!attackMode && cards[index] >= 4 && isActive) {
      onCardSelect(playerType, index);
    }
  };

  return (
    <div ref={areaRef} className={`area player-area ${isActive ? 'active' : ''}`}>
      <h2>Blue Bolt</h2>
      <div className="cards">
        {cards.map((lvl, idx) => {
          const isActionCard = attackMode?.player === playerType && attackMode?.cardIndex === idx;
          const canAct = lvl >= 4 && isActive && !attackMode;
          const isAttackTarget = attackMode?.action === 'attack' && attackMode.player !== playerType;
          const isHealTarget = attackMode?.action === 'heal' && attackMode.player === playerType && lvl === -1;
          const isKnockedOut = lvl === -1;
          
          return (
            <div 
              key={idx} 
              className={`card ${canAct ? 'can-act' : ''} ${isActionCard ? 'action-card' : ''} ${isAttackTarget ? 'attack-target' : ''} ${isHealTarget ? 'heal-target' : ''} ${isKnockedOut ? 'knocked-out' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <div className="card-index">{idx + 1}</div>
              
              <DotShotLevel level={lvl} />
              
              {lvl >= 4 && <div className="action-badge">⚡</div>}
              {isKnockedOut && <div className="knockout-badge">💀</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayerArea;
