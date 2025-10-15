import { useEffect, useRef } from "react";

export function StarfieldBackground() {
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starfieldRef.current) return;

    const starfield = starfieldRef.current;
    const numStars = 150;
    const numParticles = 20;

    // Clear existing content
    starfield.innerHTML = '';

    // Generate stars
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 2 + 2) + 's';
      starfield.appendChild(star);
    }

    // Generate floating particles
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
      starfield.appendChild(particle);
    }
  }, []);

  return <div ref={starfieldRef} className="starfield" />;
}
