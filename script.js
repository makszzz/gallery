const carousel = document.getElementById("carousel");
const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let position = 0;
let speed = window.innerWidth <= 600 ? 0.35 : 0.45;
let isDragging = false;
let isPaused = false;
let startX = 0;
let startPosition = 0;
let movedX = 0;
let animationId = null;
let resumeTimeout = null;

function getHalfTrackWidth() {
  return track.scrollWidth / 2;
}

function setTrackPosition() {
  track.style.transform = `translate3d(${-position}px, 0, 0)`;
}

function normalizePosition() {
  const half = getHalfTrackWidth();

  if (position >= half) {
    position -= half;
  }

  if (position < 0) {
    position += half;
  }
}

function animate() {
  if (!isPaused && !isDragging) {
    position += speed;
    normalizePosition();
    setTrackPosition();
  }

  animationId = requestAnimationFrame(animate);
}

function startAuto() {
  if (!animationId) {
    animationId = requestAnimationFrame(animate);
  }
}

function stopAuto() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function pauseThenResume(delay = 1200) {
  isPaused = true;
  clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => {
    isPaused = false;
  }, delay);
}

function getStep() {
  const slide = track.querySelector(".slide");
  const gap = parseInt(window.getComputedStyle(track).gap) || 0;
  return slide.offsetWidth + gap;
}

function moveBy(amount) {
  position += amount;
  normalizePosition();
  setTrackPosition();
}

prevBtn.addEventListener("click", () => {
  moveBy(-getStep());
  pauseThenResume(1200);
});

nextBtn.addEventListener("click", () => {
  moveBy(getStep());
  pauseThenResume(1200);
});

carousel.addEventListener("mouseenter", () => {
  if (window.innerWidth > 768) isPaused = true;
});

carousel.addEventListener("mouseleave", () => {
  if (window.innerWidth > 768 && !isDragging) isPaused = false;
});

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  isPaused = true;
  startX = e.clientX;
  startPosition = position;
  movedX = 0;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  movedX = deltaX;
  position = startPosition - deltaX;
  normalizePosition();
  setTrackPosition();
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  pauseThenResume(900);
});

carousel.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  isDragging = true;
  isPaused = true;
  startX = touch.clientX;
  startPosition = position;
  movedX = 0;
}, { passive: true });

carousel.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = Math.abs(touch.clientY - (e.touches[0].clientY));

  movedX = deltaX;

  position = startPosition - deltaX;
  normalizePosition();
  setTrackPosition();
}, { passive: true });

carousel.addEventListener("touchend", () => {
  if (!isDragging) return;
  isDragging = false;
  pauseThenResume(900);
}, { passive: true });

window.addEventListener("resize", () => {
  speed = window.innerWidth <= 600 ? 0.35 : 0.45;
  normalizePosition();
  setTrackPosition();
});

setTrackPosition();
startAuto();
