import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import DotShotLevel from '../DotShotLevel';
import './Area.css';

function OpponentArea({ cards, isActive, onCardSelect, onCardAttack, onCardHeal, attackMode, playerType }) {
  const areaRef = useRef(null);
  const cardsRef = useRef([]);

  // Cards entrance animation
  useGSAP(() => {
    gsap.fromTo('.opponent-area .card',
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.4, 
        stagger: 0.08, 
        ease: 'back.out(1.7)',
        delay: 0.6
      }
    );
  }, []);

  // Card hover animations - FIXED: Only for interactive cards
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const ctx = gsap.context(() => {
        card.addEventListener('mouseenter', () => {
          const isKnockedOut = cards[index] === -1;
          const isCanAct = cards[index] >= 4 && isActive && !attackMode;
          const isActionCard = attackMode?.player === playerType && attackMode?.cardIndex === index;
          const isAttackTarget = attackMode?.action === 'attack' && attackMode.player !== playerType;
          const isHealTarget = attackMode?.action === 'heal' && attackMode.player === playerType && cards[index] === -1;

          // FIXED: Only hover if card is actually interactive
          const isInteractive = isCanAct || isActionCard || isAttackTarget || isHealTarget;

          if (!isInteractive) {
            return; // Exit early - no hover effect for normal cards
          }

          // Apply hover effect only to interactive cards
          gsap.to(card, {
            scale: 1.05,
            y: -4,
            duration: 0.2,
            ease: 'power2.out',
            boxShadow: isCanAct ? '0 6px 18px rgba(255, 215, 0, 0.28)' :
                       isAttackTarget ? '0 6px 18px rgba(220, 53, 69, 0.12)' :
                       isHealTarget ? '0 6px 18px rgba(40, 167, 69, 0.12)' :
                       'none'
          });

          const badge = card.querySelector('.action-badge, .knockout-badge');
          if (badge) {
            gsap.to(badge, {
              y: -3,
              scale: 1.1,
              duration: 0.2,
              ease: 'power2.out'
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          // Reset any hover effects
          gsap.to(card, {
            scale: 1,
            y: 0,
            boxShadow: 'none',
            duration: 0.2,
            ease: 'power2.in'
          });

          const badge = card.querySelector('.action-badge, .knockout-badge');
          if (badge) {
            gsap.to(badge, {
              y: 0,
              scale: 1,
              duration: 0.2,
              ease: 'power2.in'
            });
          }
        });
      });

      return () => ctx.revert();
    });
  }, [cards, attackMode, playerType, isActive]); // Added isActive dependency

  // Active area animation
  useEffect(() => {
    if (isActive) {
      const tl = gsap.timeline();
      
      tl.to(areaRef.current, {
        opacity: 1,
        scale: 1.03,
        duration: 0.3,
        background: 'rgba(255, 255, 255, 0.15)'
      }).to(areaRef.current, {
        boxShadow: '0 0 45px rgba(255, 255, 255, 0.8), 0 0 90px rgba(255, 255, 255, 0.4)',
        duration: 0.3,
        ease: 'none'
      });
    } else {
      gsap.killTweensOf(areaRef.current);
      gsap.to(areaRef.current, {
        opacity: 0.65,
        scale: 1,
        boxShadow: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        duration: 0.3
      });
    }

    return () => gsap.killTweensOf(areaRef.current);
  }, [isActive]);

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
    <div ref={areaRef} className={`area opponent-area ${isActive ? 'active' : ''}`}>
      <h2>Red Spark</h2>
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
              ref={el => cardsRef.current[idx] = el}
              className={`card ${canAct ? 'can-act' : ''} ${isActionCard ? 'action-card' : ''} 
                         ${isAttackTarget ? 'attack-target' : ''} ${isHealTarget ? 'heal-target' : ''} 
                         ${isKnockedOut ? 'knocked-out' : ''}`}
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

export default OpponentArea;
