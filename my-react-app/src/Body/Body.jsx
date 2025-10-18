import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import { ScrollTrigger } from 'gsap/all';
import { gsap } from 'gsap';
import './Body.css';

gsap.registerPlugin(ScrollTrigger); 

function Body({ onStartGame }) {
    const scrollRef = useRef(); 
    const buttonRef = useRef(null);

    useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    
    tl.fromTo('.box', {
        scale: 0,
        opacity: 0,
    }, {
        scale: 1,
        opacity: 1,
        x: (i) => 450 - (i * 100),
        rotation: 360,
        borderRadius: '20% 0%',
        duration: 1.6,
        stagger: 0.15,
    })
    .from(['.highlight', '.catch-text', buttonRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.3,
    }, '-=0.6'); // Start before boxes finish
}, []);


    return (
        <>
            <div className="body-main">
                <div className="box-c" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}} ref={scrollRef}>
                    <div className="box 1" style={{width: '100px', height: '100px', backgroundColor: '#dca0e8ff'}}></div>
                    <div className="box 2" style={{width: '100px', height: '100px', backgroundColor: '#eab6f4ff'}}></div>
                    <div className="box 3" style={{width: '100px', height: '100px', backgroundColor: '#f0c5f9'}}></div>
                </div>
                <h1 className='highlight'>Welcome to The DOT - SHOT</h1>
                <p className='catch-text'>A shooting game for everyone!</p>
                <button 
                    ref={buttonRef} 
                    className='start-button' 
                    aria-label="Start Game"
                    onClick={onStartGame}
                >
                    Start Game
                </button>
            </div>
        </>
    );
}
export default Body;