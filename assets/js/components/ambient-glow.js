export function initAmbientGlow() {
  const glowContainer = document.getElementById("ambient-glow");
  const orangeGlow = glowContainer?.querySelector(".hero-ambient-glow--orange");
  const blueGlow = glowContainer?.querySelector(".hero-ambient-glow--blue");
  
  if (!glowContainer || !orangeGlow || !blueGlow) {
    return;
  }

  let time1 = Math.random() * Math.PI * 2;
  let time2 = Math.random() * Math.PI * 2;
  let animationId = null;
  let lastTime = 0;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    
    time1 += delta * 0.0008;
    time2 += delta * 0.0005;
    
    const s1 = Math.sin(time1);
    const c1 = Math.cos(time1 * 0.7);
    const s2 = Math.sin(time2);
    const c2 = Math.cos(time2 * 0.8);
    
    orangeGlow.style.setProperty("--glow-intensity", 0.4 + s1 * 0.3);
    orangeGlow.style.setProperty("--glow-scale", 1 + c1 * 0.1);
    orangeGlow.style.setProperty("--glow-move-x", `${s1 * 30}px`);
    orangeGlow.style.setProperty("--glow-move-y", `${c1 * 20}px`);
    
    blueGlow.style.setProperty("--glow-intensity", 0.25 + s2 * 0.15);
    blueGlow.style.setProperty("--glow-scale", 1 + c2 * 0.08);
    blueGlow.style.setProperty("--glow-move-x", `${s2 * -15}px`);
    blueGlow.style.setProperty("--glow-move-y", `${s2 * -15}px`);
    
    animationId = requestAnimationFrame(animate);
  }

  setTimeout(() => {
    glowContainer.classList.add("visible");
    animationId = requestAnimationFrame(animate);
  }, 3000);

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}
