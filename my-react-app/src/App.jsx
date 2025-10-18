import Header from "./Header/Header";
import Body from "./Body/Body";
import Game from "./Game/GameBoard";
import { gsap } from "gsap";
import { useState } from "react";

function App() {
  const [gameState, setGameState] = useState('home'); // 'home' or 'playing'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startGameTransition = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setGameState('playing');
        setIsTransitioning(false);
      }
    });

    tl.to('.header-content', {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    })
    .to('.box-c', {
      x: -200,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.3')
    .to(['.highlight', '.catch-text', '.start-button'], {
      y: 50,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.in'
    }, '-=0.4');
  };

  const backToHomeTransition = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setGameState('home');
        setIsTransitioning(false);
      }
    });

    tl.to('.game-board', {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      ease: 'power2.in'
    });
  };

  return (
    <>
      <span className="bg-circle" style={{ width: '300px', height: '300px', top: '10%', left: '5%', backgroundColor: 'rgba(255, 182, 193, 0.3)' }}></span>
      <span className="bg-circle" style={{ width: '200px', height: '200px', top: '50%', left: '70%', backgroundColor: 'rgba(173, 216, 230, 0.3)' }}></span>
      <span className="bg-circle" style={{ width: '250px', height: '250px', top: '60%', left: '20%', backgroundColor: 'rgba(144, 238, 144, 0.3)' }}></span>
      {gameState === 'home' && (
        <>
          <Header />
          <Body onStartGame={startGameTransition} />
        </>
      )}
      {gameState === 'playing' && (
        <Game onBackToHome={backToHomeTransition} />
      )}
    </>
  );
  
}

export default App;
