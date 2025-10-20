import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import './Dice.css';

function Dice({ onRoll, disabled }) {
  const [rolling, setRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const diceRef = useRef(null);
  const floatingFaceRef = useRef(null);

  // Dice face configurations with 3D rotations
  const faceRotations = {
    1: { x: 0, y: 0 },      // Front
    2: { x: 0, y: -90 },    // Right
    3: { x: -90, y: 0 },    // Top
    4: { x: 90, y: 0 },     // Bottom
    5: { x: 0, y: 90 },     // Left
    6: { x: 0, y: 180 }     // Back
  };

  const roll = () => {
    if (disabled || rolling) return;

    setRolling(true);

    const value = Math.floor(Math.random() * 6) + 1;
    const dice = diceRef.current;
    const { x, y } = faceRotations[value];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentValue(value);
        setRolling(false);
        animateFaceToCard(value);
      }
    });

    // STEP 1: chaotic spin (randomized to look organic)
    tl.to(dice, {
      rotationX: `+=${720 + Math.random() * 360}`,
      rotationY: `+=${720 + Math.random() * 360}`,
      rotationZ: `+=${360 + Math.random() * 180}`,
      duration: 0.8,
      ease: 'power2.in'
    });

    // STEP 2: controlled settle to final face
    tl.to(dice, {
      rotationX: x,
      rotationY: y,
      rotationZ: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });

    // STEP 3: little bounce pop
    tl.to(dice, {
      scale: 1.1,
      duration: 0.1,
      ease: 'back.out(3)'
    }).to(dice, {
      scale: 1,
      duration: 0.1
    });
  };


  // Animation 2: Float magic ball from dice to target card
const animateFaceToCard = (value) => {
  const activeArea = document.querySelector('.area.active');
  if (!activeArea) {
    onRoll(value);
    return;
  }

  const targetCard = activeArea.querySelector(`.card:nth-child(${value})`);
  if (!targetCard) {
    onRoll(value);
    return;
  }

  // Create magic ball element
  const magicBall = document.createElement('div');
  magicBall.className = 'magic-ball';
  document.body.appendChild(magicBall);

  // Get dice and target card positions
  const diceRect = diceRef.current.getBoundingClientRect();
  const cardRect = targetCard.getBoundingClientRect();

  // Position the magic ball at dice center
  gsap.set(magicBall, {
    position: 'fixed',
    left: diceRect.left + diceRect.width / 2,
    top: diceRect.top + diceRect.height / 2,
    xPercent: -50,
    yPercent: -50,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, #ffd700 0%, #b8860b 80%)',
    boxShadow: '0 0 20px #ffd700, 0 0 40px #daa520',
    zIndex: 9999,
    opacity: 0.9,
  });

  // GSAP timeline animation
  const tl = gsap.timeline({
    onComplete: () => {
      magicBall.remove();
      onRoll(value);
    },
  });

  // Animate the ball with trail and bounce
  tl.to(magicBall, {
    duration: 0.8,
    left: cardRect.left + cardRect.width / 2,
    top: cardRect.top + cardRect.height / 2,
    scale: 1.5,
    ease: 'power2.inOut',
    boxShadow: '0 0 40px #ffd700, 0 0 80px #daa520', // Updated shadow color for golden ball
  })
    .to(targetCard, {
      scale: 1.1,
      boxShadow: '0 0 25px rgba(255,215,0,0.6)', // Updated shadow color for target card
      duration: 0.15,
      ease: 'back.out(3)',
    }, '-=0.2')
    .to(magicBall, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    })
    .to(targetCard, {
      scale: 1,
      boxShadow: 'none',
      duration: 0.2,
    }, '-=0.1');
};

  return (
    <div 
      className={`dice-container ${disabled ? 'disabled' : ''} ${rolling ? 'rolling' : ''}`} 
      onClick={roll}
    >
      <div className="dice-scene">
        <div className="dice-cube" ref={diceRef}>
          <div className="dice-face dice-face-1">
            <span className="dot"></span>
          </div>
          <div className="dice-face dice-face-2">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face dice-face-3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face dice-face-4">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face dice-face-5">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face dice-face-6">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dice;
