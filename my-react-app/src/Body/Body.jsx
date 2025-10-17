import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import { ScrollTrigger } from 'gsap/all';
import { gsap } from 'gsap';
import './Body.css';

gsap.registerPlugin(ScrollTrigger); 

function Body() {
    const scrollRef = useRef(); 
    useGSAP(() => {
         // ensure all boxes start at x:0, then animate each to a specific x value with stagger
        const positions = [450, 350, 250];
        const boxes = gsap.utils.toArray('.box');
        gsap.set(boxes, { 
            x: 0, 
            rotation: 0,
            borderRadius: '100%',
            color: '#ed7373e8',
         });
        
        // timeline to control stagger precisely
        const tl = gsap.timeline();
        boxes.forEach((el, i) => {
            tl.to(el, {
                x: positions[i] ?? positions[positions.length - 1],
                rotation: 360,
                borderRadius: '20% 0%',
                duration: 1.6,
                ease: 'power2.inOut',
                transformOrigin: '50% 50%',
            }, i * 0.15); // stagger by index
        });
 
        gsap.fromTo('.highlight', {
            opacity: 0,
            y: 20,
        }, {
            ease: 'power1.inOut',
            opacity: 1,
            delay: 1,
            stagger: 0.2,
            y: 0,
        })
        
        gsap.fromTo('.catch-text', {
            opacity: 0,
            y: 20,
        }, {
            ease: 'power1.inOut',
            opacity: 1,
            delay: 1.3,
            stagger: 0.5,
            y: 0,
        })
    }, []);

    return (
        <>
            <div className="body-main">
                <div className="box-c" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}} ref={scrollRef}>
                    <div className="box 1" style={{width: '100px', height: '100px', backgroundColor: '#f0c5f9'}}></div>
                    <div className="box 2" style={{width: '100px', height: '100px', backgroundColor: '#f0c5f9'}}></div>
                    <div className="box 3" style={{width: '100px', height: '100px', backgroundColor: '#f0c5f9'}}></div>
                </div>
                <h1 className='highlight'>Welcome to The Idea Spark</h1>
                <p className='catch-text'>Your go-to platform for innovative ideas and creative solutions.</p>
            </div>
        </>
    );
}
export default Body;