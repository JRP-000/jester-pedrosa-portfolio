import React from 'react';
import { useEffect, useRef, useState } from 'react';

// The approved artwork remains the fallback. A transparent WebGL surface adds
// depth, responsive tilt and subtle liquid displacement without changing its identity.
export default function ChromeOrb({ paused }) {
 const host=useRef(null), [ready,setReady]=useState(false);
 useEffect(()=>{
  if(paused || !host.current) return;
  let disposed=false, frame=0, renderer, geometry, material, texture, observer;
  const target={x:0,y:0}, current={x:0,y:0}; let visible=true;
  const el=host.current;
  const pointer=e=>{const r=el.getBoundingClientRect();target.x=(e.clientX-r.left)/r.width-.5;target.y=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{target.x=0;target.y=0;};
  const contextLost=e=>{e.preventDefault();cancelAnimationFrame(frame);setReady(false);};
  let resize=()=>{};
  import('three').then(THREE=>{
   if(disposed)return;
   try {
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, navigator.hardwareConcurrency<=4 ? 1 : 2));
    renderer.setClearColor(0,0); renderer.outputColorSpace=THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',contextLost);
    const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);camera.position.z=3;
    geometry=new THREE.PlaneGeometry(1.95,1.95,40,40);
    texture=new THREE.TextureLoader().load('/assets/chrome-orb.png',()=>{if(!disposed)setReady(true);});texture.colorSpace=THREE.SRGBColorSpace;
    material=new THREE.ShaderMaterial({transparent:true,uniforms:{map:{value:texture},time:{value:0},pointer:{value:new THREE.Vector2()},intro:{value:1}},vertexShader:`varying vec2 vUv; uniform float time; uniform vec2 pointer; uniform float intro; void main(){vUv=uv;vec3 p=position;float wave=sin(p.x*8.+p.y*6.+time)*cos(p.y*7.-time*.7);p.z+=wave*(.015+intro*.065);p.x+=sin(p.y*5.+time*.35)*.012;p.z+=pointer.x*p.x*.18-pointer.y*p.y*.18;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform sampler2D map;uniform float time;uniform float intro;uniform vec2 pointer;varying vec2 vUv;void main(){vec2 uv=vUv;float influence=exp(-length(uv-(pointer*.5+.5))*5.);uv+=vec2(sin(uv.y*18.+time),cos(uv.x*15.-time))*(.0015+intro*.005)*influence;gl_FragColor=texture2D(map,uv);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`});
    const mesh=new THREE.Mesh(geometry,material);scene.add(mesh);
    resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);};resize();window.addEventListener('resize',resize);
    observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{rootMargin:'80px'});observer.observe(el);
    let last=performance.now(),elapsed=0;
    const tick=now=>{frame=requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible || document.hidden)return;elapsed+=dt;current.x+=(target.x-current.x)*.06;current.y+=(target.y-current.y)*.06;material.uniforms.time.value=elapsed;material.uniforms.intro.value=Math.max(0,1-elapsed/1.5);material.uniforms.pointer.value.set(current.x,current.y);mesh.rotation.y=current.x*.1;mesh.rotation.x=current.y*.08;mesh.rotation.z=Math.sin(elapsed*.25)*.018;renderer.render(scene,camera);}; frame=requestAnimationFrame(tick);
    el.addEventListener('pointermove',pointer);el.addEventListener('pointerleave',leave);
   } catch {setReady(false);}
  }).catch(()=>setReady(false));
  return()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener('resize',resize);el.removeEventListener('pointermove',pointer);el.removeEventListener('pointerleave',leave);geometry?.dispose();material?.dispose();texture?.dispose();if(renderer){renderer.dispose();renderer.domElement.remove();}setReady(false);};
 },[paused]);
 return <div className="orb-art" ref={host} aria-hidden="true"><img src="/assets/chrome-orb.png" width="1280" height="1280" alt="" className={ready&&!paused?'orb-fallback hidden-art':'orb-fallback'} fetchPriority="high"/></div>;
}
