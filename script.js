const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const track = carousel.querySelector(".carousel-track");

let autoScroll = null;
let isDragging = false;
let dragStarted = false;
let startX = 0;
let startY = 0;
let startScrollLeft = 0;
let isHorizontalDrag = false;
let resumeTimer = null;
let animationFrame = null;

function getStep() {
  const slide = carousel.querySelector(".slide");
  if (!slide) return 300;
  const gap = parseInt(window.getComputedStyle(track).gap) || 0;
  return slide.offsetWidth + gap;
}

function getHalfWidth() {
  return track.scrollWidth / 2;
}

function setStartPosition() {
  carousel.scrollLeft = 1;
}

function normalizeLoop() {
  const half = getHalfWidth();

  if (carousel.scrollLeft >= half) {
    carousel.scrollLeft -= half;
  } else if (carousel.scrollLeft <= 0) {
    carousel.scrollLeft += half;
  }
}

function stopAutoScroll() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  if (resumeTimer) clearTimeout(resumeTimer);
}

function startAutoScroll() {
  stopAutoScroll();

  const speed = window.innerWidth <= 600 ? 0.35 : 0.45;

  function step() {
    if (!isDragging) {
      carousel.scrollLeft += speed;
      normalizeLoop();
    }
    animationFrame = requestAnimationFrame(step);
  }

  animationFrame = requestAnimationFrame(step);
}

function pauseThenResume(delay = 1200) {
  stopAutoScroll();
  resumeTimer = setTimeout(() => {
    startAutoScroll();
  }, delay);
}

function handleArrow(direction) {
  stopAutoScroll();
  carousel.scrollBy({
    left: direction * getStep(),
    behavior: "smooth"
  });

  setTimeout(() => {
    normalizeLoop();
    startAutoScroll();
  }, 700);
}

prevBtn.addEventListener("click", () => handleArrow(-1));
nextBtn.addEventListener("click", () => handleArrow(1));

carousel.addEventListener("mouseenter", () => {
  if (window.innerWidth > 600) stopAutoScroll();
});

carousel.addEventListener("mouseleave", () => {
  if (window.innerWidth > 600 && !isDragging) startAutoScroll();
});

carousel.addEventListener(
  "touchstart",
  (e) => {
    if (!e.touches.length) return;

    isDragging = true;
    dragStarted = true;
    isHorizontalDrag = false;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startScrollLeft = carousel.scrollLeft;

    stopAutoScroll();
  },
  { passive: true }
);

carousel.addEventListener(
  "touchmove",
  (e) => {
    if (!dragStarted || !e.touches.length) return;

    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    if (!isHorizontalDrag) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        isHorizontalDrag = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isDragging = false;
        dragStarted = false;
        return;
      }
    }

    if (isHorizontalDrag) {
      carousel.scrollLeft = startScrollLeft - deltaX;
      normalizeLoop();
    }
  },
  { passive: true }
);

carousel.addEventListener(
  "touchend",
  () => {
    isDragging = false;
    dragStarted = false;
    isHorizontalDrag = false;
    pauseThenResume(900);
  },
  { passive: true }
);

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStarted = true;
  isHorizontalDrag = true;
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
  stopAutoScroll();
});

window.addEventListener("mouseup", () => {
  if (!dragStarted) return;
  isDragging = false;
  dragStarted = false;
  pauseThenResume(900);
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDragging || !dragStarted) return;
  e.preventDefault();
  const deltaX = e.pageX - startX;
  carousel.scrollLeft = startScrollLeft - deltaX;
  normalizeLoop();
});

carousel.addEventListener("scroll", normalizeLoop);
window.addEventListener("resize", () => {
  normalizeLoop();
});

setStartPosition();
startAutoScroll();
