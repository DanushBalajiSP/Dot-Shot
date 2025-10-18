import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Dice from './Dice/Dice';
import PlayerArea from './Area/PlayerArea';
import OpponentArea from './Area/OpponentArea';
import './GameBoard.css';

function GameBoard({ onBackToHome }) {
  const [playerCards, setPlayerCards] = useState(Array(6).fill(0));
  const [opponentCards, setOpponentCards] = useState(Array(6).fill(0));
  
  const [currentTurn, setCurrentTurn] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [attackMode, setAttackMode] = useState(null);
  const [gameMessage, setGameMessage] = useState('Welcome to DOT - SHOT! Click "Toss to Start" to begin.');
  const [gameStarted, setGameStarted] = useState(false);
  
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  
  const gameBoardRef = useRef(null);

  // Entrance Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.fromTo('.game-header',
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }, '-=0.3'
    )
    // .fromTo('.player-area',
    //   { x: -100, opacity: 0 },
    //   { x: 0, opacity: 1, duration: 0.6 }, '-=0.3'
    // )
    // .fromTo('.opponent-area',
    //   { x: 100, opacity: 0 },
    //   { x: 0, opacity: 1, duration: 0.6 }, '-=0.6'
    // )
    .fromTo('.divider-container',
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.4'
    )
    .fromTo('.dice',
      { scale: 0, rotation: -360, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4'
    );
  }, []);

  const handleBackToHome = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onBackToHome();
      }
    });

    tl.to('.back-home-btn', { x: 100, opacity: 0, duration: 0.3, ease: 'power2.in' })
    .to('.game-header', { y: -50, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2')
    .to(['.player-area', '.opponent-area', '.divider-container'], 
      { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2');
  };

  const doToss = () => {
    const winner = Math.random() < 0.5 ? 'player' : 'opponent';
    setCurrentTurn(winner);
    setDiceResult(null);
    setGameMessage(`${winner === 'player' ? 'Blue Bolt' : 'Red Spark'} won the toss!`);
    setAttackMode(null);
  };

  const resetGame = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setPlayerCards(Array(6).fill(0));
        setOpponentCards(Array(6).fill(0));
        setCurrentTurn(null);
        setDiceResult(null);
        setAttackMode(null);
        setGameStarted(false);
        setGameOver(false);
        setWinner(null);
        setGameMessage('Game Reset! Click "Toss to Start" to begin new game.');
      }
    });

    tl.to('.card', {
      opacity: 0.5,
      duration: 0.2,
      ease: 'power2.in'
    })
    .to('.card', {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const hasKnockedOutCards = (player) => {
    const cards = player === 'player' ? playerCards : opponentCards;
    return cards.some(lvl => lvl === -1);
  };

  const checkWinCondition = (cards, playerType) => {
    const allKnockedOut = cards.every(lvl => lvl === -1);
    
    if (allKnockedOut) {
      const winnerName = playerType === 'player' ? 'Red Spark' : 'Blue Bolt';
      setGameOver(true);
      setWinner(winnerName);
      setGameMessage(`🎉 ${winnerName} WINS! 🎉 All opponent cards knocked out!`);
      
      triggerCelebration(winnerName);
      return true;
    }
    return false;
  };

  const triggerCelebration = (winnerName) => {
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    overlay.innerHTML = `
      <div class="celebration-content">
        <h1 class="celebration-title">${winnerName} WINS!</h1>
      </div>
    `;
    document.body.appendChild(overlay);

    // Animate celebration
    gsap.fromTo('.celebration-overlay', 
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );

    gsap.from('.celebration-content', {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    // Confetti effect (simple emoji burst)
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.textContent = ['🎉', '🎊', '⭐', '✨', '🏆'][Math.floor(Math.random() * 5)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      overlay.appendChild(confetti);
    }

    setTimeout(() => {
      gsap.to('.celebration-overlay', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => overlay.remove()
      });
    }, 5000);
  };

  const onDiceRoll = (value) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    setDiceResult(value);
    const cardIndex = value - 1;
    
    if (currentTurn === 'player') {
      if (playerCards[cardIndex] === -1) {
        setGameMessage(`⚠️ Blue Bolt's Card ${value} is knocked out! Turn passes to Red Spark.`);
        setCurrentTurn('opponent');
        return;
      }
      
      const newCards = playerCards.map((lvl, idx) => (idx === cardIndex ? lvl + 1 : lvl));
      setPlayerCards(newCards);
      setGameMessage(`Blue Bolt rolled ${value}. Card ${value} leveled up!`);
      setCurrentTurn('opponent');
    } else {
      if (opponentCards[cardIndex] === -1) {
        setGameMessage(`⚠️ Red Spark's Card ${value} is knocked out! Turn passes to Blue Bolt.`);
        setCurrentTurn('player');
        return;
      }
      
      const newCards = opponentCards.map((lvl, idx) => (idx === cardIndex ? lvl + 1 : lvl));
      setOpponentCards(newCards);
      setGameMessage(`Red Spark rolled ${value}. Card ${value} leveled up!`);
      setCurrentTurn('player');
    }
    setAttackMode(null);
  };

  const onCardSelectForAction = (player, cardIndex) => {
    const cards = player === 'player' ? playerCards : opponentCards;
    
    if (cards[cardIndex] >= 4 && currentTurn === player) {
      const hasKnockedOut = hasKnockedOutCards(player);
      
      if (hasKnockedOut) {
        setAttackMode({ player, cardIndex, action: null, canHeal: true });
        setGameMessage(`Card ${cardIndex + 1} is ready! Choose: Attack opponent or Heal teammate?`);
      } else {
        setAttackMode({ player, cardIndex, action: 'attack', canHeal: false });
        setGameMessage(`Card ${cardIndex + 1} is ready! Select opponent's card to attack!`);
      }
    }
  };

  const chooseAttack = () => {
    if (!attackMode) return;
    setAttackMode({ ...attackMode, action: 'attack' });
    setGameMessage(`Select opponent's card to attack!`);
  };

  const chooseHeal = () => {
    if (!attackMode) return;
    setAttackMode({ ...attackMode, action: 'heal' });
    setGameMessage(`Select your knocked-out card to heal!`);
  };

  const onCardAttacked = (targetPlayer, targetIndex) => {
    if (!attackMode || attackMode.action !== 'attack') return;
    
    if (attackMode.player === targetPlayer) {
      setGameMessage('You cannot attack your own cards!');
      return;
    }

    const attackerClass = attackMode.player === 'player' 
      ? `.player-area .card:nth-child(${attackMode.cardIndex + 1})`
      : `.opponent-area .card:nth-child(${attackMode.cardIndex + 1})`;
    
    const targetClass = targetPlayer === 'player'
      ? `.player-area .card:nth-child(${targetIndex + 1})`
      : `.opponent-area .card:nth-child(${targetIndex + 1})`;

    const tl = gsap.timeline({
      onComplete: () => {
        let newTargetCards;
        
        // Set target card to knockout (-1)
        if (targetPlayer === 'player') {
          newTargetCards = playerCards.map((lvl, idx) => (idx === targetIndex ? -1 : lvl));
          setPlayerCards(newTargetCards);
        } else {
          newTargetCards = opponentCards.map((lvl, idx) => (idx === targetIndex ? -1 : lvl));
          setOpponentCards(newTargetCards);
        }

        // Decrease attacker's level by 1
        if (attackMode.player === 'player') {
          setPlayerCards((cards) =>
            cards.map((lvl, idx) => (idx === attackMode.cardIndex ? lvl - 1 : lvl))
          );
        } else {
          setOpponentCards((cards) =>
            cards.map((lvl, idx) => (idx === attackMode.cardIndex ? lvl - 1 : lvl))
          );
        }
        
        setGameMessage(`💥 Card ${attackMode.cardIndex + 1} attacked Card ${targetIndex + 1}! Target knocked out.`);
        setAttackMode(null);
        
        const gameEnded = checkWinCondition(newTargetCards, targetPlayer);
        
        if (!gameEnded) {
          setCurrentTurn(currentTurn === 'player' ? 'opponent' : 'player');
        }
      }
    });

    tl.to(attackerClass, {
      x: attackMode.player === 'player' ? 100 : -100,
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(targetClass, {
      scale: 0.8,
      backgroundColor: '#ff4444',
      rotation: 10,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.1')
    .to(attackerClass, {
      x: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.in'
    })
    .to(targetClass, {
      scale: 1,
      backgroundColor: '#2b2b2b',
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.2');
  };

  const onCardHealed = (targetPlayer, targetIndex) => {
    if (!attackMode || attackMode.action !== 'heal') return;
    
    if (attackMode.player !== targetPlayer) {
      setGameMessage('You can only heal your own cards!');
      return;
    }

    const cards = targetPlayer === 'player' ? playerCards : opponentCards;
    
    if (cards[targetIndex] !== -1) {
      setGameMessage('You can only heal knocked-out cards!');
      return;
    }

    const healerClass = attackMode.player === 'player' 
      ? `.player-area .card:nth-child(${attackMode.cardIndex + 1})`
      : `.opponent-area .card:nth-child(${attackMode.cardIndex + 1})`;
    
    const targetClass = targetPlayer === 'player'
      ? `.player-area .card:nth-child(${targetIndex + 1})`
      : `.opponent-area .card:nth-child(${targetIndex + 1})`;

    const tl = gsap.timeline({
      onComplete: () => {
        if (targetPlayer === 'player') {
          setPlayerCards((cards) =>
            cards.map((lvl, idx) => (idx === targetIndex ? 0 : lvl))
          );
        } else {
          setOpponentCards((cards) =>
            cards.map((lvl, idx) => (idx === targetIndex ? 0 : lvl))
          );
        }

        if (attackMode.player === 'player') {
          setPlayerCards((cards) =>
            cards.map((lvl, idx) => (idx === attackMode.cardIndex ? lvl - 1 : lvl))
          );
        } else {
          setOpponentCards((cards) =>
            cards.map((lvl, idx) => (idx === attackMode.cardIndex ? lvl - 1 : lvl))
          );
        }
        
        setGameMessage(`💚 Card ${attackMode.cardIndex + 1} healed Card ${targetIndex + 1}! Target restored.`);
        setAttackMode(null);
        setCurrentTurn(currentTurn === 'player' ? 'opponent' : 'player');
      }
    });

    tl.to(healerClass, {
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out'
    })
    .to(targetClass, {
      scale: 1.2,
      backgroundColor: '#4ade80',
      duration: 0.3,
      ease: 'power2.inOut'
    }, '-=0.1')
    .to(healerClass, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.in'
    })
    .to(targetClass, {
      scale: 1,
      backgroundColor: '#f9f9f9',
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.1');
  };

  return (
    <div ref={gameBoardRef} className="game-board">
      {/* Header Section */}
      <div className={`game-header ${gameOver ? 'winner-header' : ''}`}>
        <button className="back-home-btn" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        
        <div className="game-message">
          {gameMessage}
        </div>

        {!gameStarted ? (
          <button 
            className="toss-btn" 
            onClick={doToss}
            disabled={currentTurn !== null}
          >
            Toss to Start
          </button>
        ) : (
          <button className="reset-btn" onClick={resetGame}>
            🔄 Reset Game
          </button>
        )}
      </div>

      {/* Main Play Area - Split Screen */}
      <div className="play-area">
        <div className="player-side">
          <PlayerArea 
            cards={playerCards} 
            isActive={currentTurn === 'player' && !gameOver}
            onCardSelect={onCardSelectForAction}
            onCardAttack={onCardAttacked}
            onCardHeal={onCardHealed}
            attackMode={attackMode}
            playerType="player"
          />
        </div>

        <div className="divider-container">
          <div className="divider-line"></div>
          <div className="dice-wrapper">
            <Dice
              onRoll={onDiceRoll}
              disabled={currentTurn === null || attackMode !== null || gameOver}
            />
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="opponent-side">
          <OpponentArea 
            cards={opponentCards} 
            isActive={currentTurn === 'opponent' && !gameOver}
            onCardSelect={onCardSelectForAction}
            onCardAttack={onCardAttacked}
            onCardHeal={onCardHealed}
            attackMode={attackMode}
            playerType="opponent"
          />
        </div>
      </div>

      {attackMode && attackMode.action === null && attackMode.canHeal && !gameOver && (
        <div className="action-buttons">
          <button className="attack-choice-btn" onClick={chooseAttack}>
            ⚔️ Attack Opponent
          </button>
          <button className="heal-choice-btn" onClick={chooseHeal}>
            💚 Heal Teammate
          </button>
        </div>
      )}

      {attackMode && !gameOver && (
        <button 
          className="cancel-attack-btn" 
          onClick={() => {
            setAttackMode(null);
            setGameMessage('Action cancelled. Continue rolling the dice.');
          }}
        >
          Cancel Action
        </button>
      )}
    </div>
  );
}

export default GameBoard;
