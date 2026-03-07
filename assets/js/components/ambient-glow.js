export function initAmbientGlow() {
  const glowContainer = document.getElementById("ambient-glow");
  const glowElement = glowContainer?.querySelector(".hero-ambient-glow");
  
  if (!glowContainer || !glowElement) {
    return;
  }

  let time = Math.random() * Math.PI * 2;
  let animationId = null;
  let lastTime = 0;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    
    time += delta * 0.0008;
    const s = Math.sin(time);
    const c = Math.cos(time * 0.7);
    
    const intensity = 0.4 + s * 0.3;
    const scale = 1 + c * 0.1;
    const moveX = s * 30;
    const moveY = c * 20;
    
    glowElement.style.setProperty("--glow-intensity", intensity);
    glowElement.style.setProperty("--glow-scale", scale);
    glowElement.style.setProperty("--glow-move-x", `${moveX}px`);
    glowElement.style.setProperty("--glow-move-y", `${moveY}px`);
    
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
