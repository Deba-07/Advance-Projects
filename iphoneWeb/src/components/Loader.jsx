import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    // Simulating loading progress
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 2); // Increase progress by 2% every 100ms
      }
    }, 100);

    // GSAP animation for loader
    gsap.fromTo(
      loaderRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    // Clean up interval
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <Html>
    <div
      ref={loaderRef}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-8 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <div
          className="absolute top-0 flex items-center justify-center w-full h-full text-xl font-semibold text-gray-800"
          style={{ zIndex: 10 }}
        >
          <span>{progress}%</span>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-800">Loading...</p>
    </div>
    </Html>
  );
};

export default Loader;
