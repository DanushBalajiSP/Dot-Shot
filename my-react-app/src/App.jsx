import Header from "./Header/Header";
import Body from "./Body/Body";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

function App() {
  // useGSAP(() => {
  //       gsap.fromTo('.bg-circle', 
  //           { x: -100 },
  //           { 
  //               x: 0,
  //               duration: 2,
  //               ease: 'elastic',
  //               repeat: -1,
  //               yoyo: true,
  //               ease: 'elastic.in'
  //           });
  //   });

  return (
    <>
      <span className="bg-circle" style={{ width: '300px', height: '300px', top: '10%', left: '5%', backgroundColor: 'rgba(255, 182, 193, 0.3)' }}></span>
      <span className="bg-circle" style={{ width: '200px', height: '200px', top: '50%', left: '70%', backgroundColor: 'rgba(173, 216, 230, 0.3)' }}></span>
      <span className="bg-circle" style={{ width: '250px', height: '250px', top: '60%', left: '20%', backgroundColor: 'rgba(144, 238, 144, 0.3)' }}></span>
      <Header />
      <Body />
    </>
  );
}

export default App;
