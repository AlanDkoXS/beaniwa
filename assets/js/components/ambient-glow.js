export function initAmbientGlow() {
  const glowContainer = document.getElementById("ambient-glow");
  const orangeGlow = glowContainer?.querySelector(".hero-ambient-glow--top");
  const blueGlow = glowContainer?.querySelector(".hero-ambient-glow--bottom");

  if (!glowContainer || !orangeGlow) {
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
    const s2 = Math.sin(time * 0.5 + Math.PI);
    const c2 = Math.cos(time * 0.6 + Math.PI);

    orangeGlow.style.setProperty("--glow-intensity", 0.4 + s * 0.3);
    orangeGlow.style.setProperty("--glow-scale", 1 + c * 0.1);
    orangeGlow.style.setProperty("--glow-move-x", `${s * 30}px`);
    orangeGlow.style.setProperty("--glow-move-y", `${c * 20}px`);

    if (blueGlow) {
      blueGlow.style.setProperty("--glow-intensity", 0.3 + s2 * 0.25);
      blueGlow.style.setProperty("--glow-scale", 1 + c2 * 0.15);
      blueGlow.style.setProperty("--glow-move-x", `${s2 * 25}px`);
      blueGlow.style.setProperty("--glow-move-y", `${c2 * 25}px`);
    }

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
