import { useEffect, useRef } from 'react';

export default function HeroMotion({ paused }) {
 const pausedRef = useRef(paused);
 const entrances = useRef([]);
 useEffect(() => {
  pausedRef.current = paused;
  if (paused) entrances.current.forEach(animation => animation.finish());
 }, [paused]);
 useEffect(() => {
  const hero = document.querySelector('.hero-professional');
  if (!hero) return;
  let started = false, visible = false;
  const syncVisibility = () => { hero.dataset.motion = visible && !document.hidden ? 'running' : 'paused'; };
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncVisibility(); });
  visibility.observe(hero);
  document.addEventListener('visibilitychange', syncVisibility);
  const start = () => {
   if (started || document.querySelector('.loader')) return;
   started = true;
   observer.disconnect();
   if (pausedRef.current || !visible || location.hash && location.hash !== '#top') return;
   const targets = hero.querySelectorAll('h1 span, .hero-role, .hero-intro, .hero-actions');
   const easing = getComputedStyle(hero).getPropertyValue('--ease').trim();
   entrances.current = [...targets].map((el, i) => el.animate([
    { transform: 'translateY(22px)', opacity: .2 },
    { transform: 'translateY(0)', opacity: 1 }
   ], { duration: 850, delay: i * 70, easing, fill: 'backwards' }));
  };
  const observer = new MutationObserver(start);
  observer.observe(document.querySelector('.site'), { childList: true, subtree: true });
  // The intersection callback also handles a repeat visit without the loader.
  const frame = requestAnimationFrame(() => { visible = hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < innerHeight; syncVisibility(); start(); });
  return () => {
   cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
   document.removeEventListener('visibilitychange', syncVisibility);
   entrances.current.forEach(animation => animation.cancel());
   delete hero.dataset.motion;
  };
 }, []);
 return null;
}
