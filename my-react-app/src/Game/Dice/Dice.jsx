import React, { useState } from 'react';
import { gsap } from 'gsap';
import './Dice.css';
import normalDice from './dice-assets/normal.svg';
import dice1 from './dice-assets/dice1.svg';
import dice2 from './dice-assets/dice2.svg';
import dice3 from './dice-assets/dice3.svg';
import dice4 from './dice-assets/dice4.svg';
import dice5 from './dice-assets/dice5.svg';
import dice6 from './dice-assets/dice6.svg';

function Dice({ onRoll, disabled }) {
  const [rolling, setRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(normalDice);

  const diceImages = {
    1: dice1,
    2: dice2,
    3: dice3,
    4: dice4,
    5: dice5,
    6: dice6,
    normal: normalDice
  };

  const roll = () => {
    if (disabled || rolling) return;
    
    setRolling(true);

    const tl = gsap.timeline({
      onComplete: () => {
        const value = Math.floor(Math.random() * 6) + 1;
        setCurrentFace(diceImages[value]);
        onRoll(value);
        setRolling(false);
      }
    });

    tl.to('.dice-image', {
      rotation: 720,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: function() {
        if (Math.random() > 0.7) {
          const randomFace = Math.floor(Math.random() * 6) + 1;
          setCurrentFace(diceImages[randomFace]);
        }
      }
    })
    .to('.dice-image', {
      scale: 1,
      duration: 0.2,
      ease: 'back.out(1.7)'
    });
  };

  return (
    <div 
      className={`dice ${disabled ? 'disabled' : ''} ${rolling ? 'rolling' : ''}`} 
      onClick={roll}
    >
      <img 
        src={currentFace} 
        alt="Dice" 
        className="dice-image"
      />
    </div>
  );
}

export default Dice;
