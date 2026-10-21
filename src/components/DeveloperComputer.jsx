import React, { useEffect, useRef, useState } from 'react';

// A translucent Y2K CRT workstation; the HTML screen also works without WebGL.
export default function DeveloperComputer({ paused }) {
 const host = useRef(null);
 const [ready, setReady] = useState(false);
 useEffect(() => {
  let disposed = false, renderer, observer, frame = 0;
  const resources = [];
  const el = host.current;
  let visible = true;
  const pointer = { x: 0, y: 0 };
  const move = e => {
   if (paused || e.pointerType === 'touch') return;
   const r = el.getBoundingClientRect();
   pointer.x = (e.clientX - r.left) / r.width - .5;
   pointer.y = (e.clientY - r.top) / r.height - .5;
  };
  const leave = () => { pointer.x = pointer.y = 0; };
  const lost = e => { e.preventDefault(); cancelAnimationFrame(frame); setReady(false); };
  let resize = () => {};
  Promise.all([import('three'), import('three/addons/geometries/RoundedBoxGeometry.js')]).then(([T, { RoundedBoxGeometry }]) => {
   if (disposed) return;
   try {
    renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, 1, .1, 30);
    camera.position.set(0, .3, 8.7);
    camera.lookAt(0, 0, 0);
    scene.add(new T.HemisphereLight(0xf2f7ff, 0x4368b0, 3));
    const key = new T.DirectionalLight(0xffffff, 4); key.position.set(-3, 5, 5); scene.add(key);
    const rim = new T.DirectionalLight(0x6497ff, 3); rim.position.set(4, 1, -2); scene.add(rim);
    const computer = new T.Group(); scene.add(computer);
    const silver = new T.MeshStandardMaterial({ color: 0xc4d7f2, metalness: .65, roughness: .28 });
    const cobalt = new T.MeshStandardMaterial({ color: 0x1949ce, metalness: .4, roughness: .32 });
    const dark = new T.MeshStandardMaterial({ color: 0x081c3c, roughness: .5 });
    const shell = new T.MeshPhysicalMaterial({ color: 0x2864ef, metalness: .12, roughness: .18, transmission: .35, thickness: .7, clearcoat: 1, clearcoatRoughness: .12 });
    const pearl = new T.MeshStandardMaterial({ color: 0xe3ebf9, metalness: .35, roughness: .25 });
    const led = new T.MeshBasicMaterial({ color: 0x91e4ff });
    resources.push(silver, cobalt, dark, shell, pearl, led);
    const box = (w, h, d, radius, material, x, y, z) => {
     const geometry = new RoundedBoxGeometry(w, h, d, 3, radius);
     resources.push(geometry);
     const mesh = new T.Mesh(geometry, material); mesh.position.set(x, y, z); computer.add(mesh); return mesh;
    };
    // Deep translucent enclosure, silver face and a low swivel plinth.
    box(2.8, 2.35, 1.65, .35, shell, 0, .28, -.42);
    box(2.36, 1.9, 1.1, .22, cobalt, 0, .28, -.48);
    box(2.84, 2.33, .24, .24, pearl, 0, .28, .44);
    box(2.49, 1.82, .14, .17, silver, 0, .4, .59);
    box(2.29, 1.65, .08, .12, dark, 0, .42, .69);
    box(.9, .28, .85, .12, cobalt, 0, -1.02, -.22);
    box(1.65, .18, 1.16, .085, shell, 0, -1.19, -.12);
    box(.18, .09, .045, .035, led, .98, -.65, .59);
    for (let i = 0; i < 6; i++) box(.2, .025, .025, .008, dark, -.86, -.53 - i * .045, .575);
    // Visible cooling slots on the rear shell.
    for (let i = 0; i < 7; i++) box(.025, .63, .055, .012, cobalt, 1.39, .38, -.85 + i * .13);
    box(2.45, .21, .89, .1, shell, -.14, -1.33, 1.12);
    for (let row = 0; row < 4; row++) {
     for (let col = 0; col < 11; col++) box(.16, .07, .14, .025, pearl, -1.13 + col * .2, -1.18, .83 + row * .18);
    }
    box(.85, .075, .13, .03, silver, -.14, -1.18, 1.51);
    const mouseGeometry = new T.SphereGeometry(1, 24, 16); resources.push(mouseGeometry);
    const mouse = new T.Mesh(mouseGeometry, shell); mouse.scale.set(.24, .14, .37); mouse.position.set(1.5, -1.24, 1.07); computer.add(mouse);
    const screen = document.createElement('canvas'); screen.width = 1000; screen.height = 600;
    const c = screen.getContext('2d');
    c.fillStyle = '#244bd0'; c.fillRect(0, 0, 1000, 600);
    // A period-inspired desktop with one beveled development window.
    c.fillStyle = '#e1e9ff'; c.fillRect(85, 55, 830, 465);
    c.fillStyle = '#7e99ce'; c.fillRect(91, 61, 818, 453);
    c.fillStyle = '#c1d2f3'; c.fillRect(91, 61, 812, 447);
    c.fillStyle = '#173a95'; c.fillRect(103, 73, 788, 45);
    c.font = 'bold 23px monospace'; c.fillStyle = '#edf4ff'; c.fillText('JESTER.EXE', 122, 104);
    ['_', '□', '×'].forEach((label, i) => { c.fillStyle = '#dce7ff'; c.fillRect(779 + i * 35, 81, 28, 27); c.fillStyle = '#173a95'; c.fillText(label, 785 + i * 35, 102); });
    c.fillStyle = '#102b56'; c.font = '22px monospace'; c.fillText('File   Edit   Build   Help', 118, 151);
    c.fillStyle = '#0b2145'; c.fillRect(109, 168, 775, 288);
    c.font = '29px monospace';
    const lines = ['> hello, world.', '', '  DESIGN. BUILD. TEST.', '', '> ready to create_'];
    lines.forEach((text, i) => { c.fillStyle = i === 2 ? '#edf4ff' : '#94c6ff'; c.fillText(text, 141, 215 + i * 49); });
    c.fillStyle = '#173a95'; c.font = '20px monospace'; c.fillText('Local workspace', 120, 489);
    c.fillStyle = '#c1d2f3'; c.fillRect(0, 554, 1000, 46);
    c.fillStyle = '#173a95'; c.fillRect(9, 562, 115, 30); c.fillStyle = '#edf4ff'; c.font = 'bold 21px monospace'; c.fillText('START', 30, 585);
    c.fillStyle = '#173a95'; c.font = '20px monospace'; c.fillText('JP / SYSTEM', 812, 584);
    const texture = new T.CanvasTexture(screen); texture.colorSpace = T.SRGBColorSpace;
    const material = new T.MeshBasicMaterial({ map: texture });
    const geometry = new T.PlaneGeometry(2.13, 1.48); resources.push(texture, material, geometry);
    const display = new T.Mesh(geometry, material); display.position.set(0, .42, .736); computer.add(display);
    computer.rotation.set(.07, -.48, -.045);
    resize = () => { renderer.setSize(el.clientWidth, el.clientHeight); camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix(); renderer.render(scene, camera); };
    resize(); setReady(true);
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(el);
    window.addEventListener('resize', resize);
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    if (!paused) {
     const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      computer.rotation.y += (-.48 + pointer.x * .3 - computer.rotation.y) * .07;
      computer.rotation.x += (.07 + pointer.y * .18 - computer.rotation.x) * .07;
      renderer.render(scene, camera);
     }; tick();
    }
   } catch { setReady(false); }
  }).catch(() => { if (!disposed) setReady(false); });
  return () => { disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('resize', resize); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); resources.forEach(r => r.dispose()); if (renderer) { renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.dispose(); renderer.domElement.remove(); } setReady(false); };
 }, [paused]);
 return <div className="computer-art" ref={host} aria-hidden="true"><div className={`computer-fallback ${ready ? 'hidden-art' : ''}`}><div className="computer-screen"><span>JESTER.EXE</span><pre>{'> hello, world.\n\nDESIGN. BUILD. TEST.\n\n> ready to create_'}</pre></div><div className="computer-stand" /></div></div>;
}
