const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let autoScroll;
let isPointerDown = false;
let startX = 0;
let scrollLeft = 0;

function getStep() {
  const slide = document.querySelector(".slide");
  const track = document.querySelector(".carousel-track");
  if (!slide || !track) return 300;

  const gap = parseInt(window.getComputedStyle(track).gap) || 0;
  return slide.offsetWidth + gap;
}

function normalizeLoop() {
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  if (carousel.scrollLeft >= maxScroll / 2) {
    carousel.scrollLeft = 0;
  }
  if (carousel.scrollLeft <= 0) {
    carousel.scrollLeft = 1;
  }
}

function startAutoScroll() {
  stopAutoScroll();

  autoScroll = setInterval(() => {
    if (isPointerDown) return;
    carousel.scrollLeft += 1;
    normalizeLoop();
  }, 35);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

prevBtn.addEventListener("click", () => {
  stopAutoScroll();
  carousel.scrollBy({ left: -getStep(), behavior: "smooth" });
  setTimeout(startAutoScroll, 1200);
});

nextBtn.addEventListener("click", () => {
  stopAutoScroll();
  carousel.scrollBy({ left: getStep(), behavior: "smooth" });
  setTimeout(startAutoScroll, 1200);
});

carousel.addEventListener("mouseenter", stopAutoScroll);
carousel.addEventListener("mouseleave", startAutoScroll);

carousel.addEventListener("touchstart", stopAutoScroll, { passive: true });
carousel.addEventListener("touchend", () => {
  setTimeout(startAutoScroll, 900);
}, { passive: true });

carousel.addEventListener("mousedown", (e) => {
  isPointerDown = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
  stopAutoScroll();
});

carousel.addEventListener("mouseleave", () => {
  isPointerDown = false;
});

carousel.addEventListener("mouseup", () => {
  if (!isPointerDown) return;
  isPointerDown = false;
  setTimeout(startAutoScroll, 900);
});

carousel.addEventListener("mousemove", (e) => {
  if (!isPointerDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.2;
  carousel.scrollLeft = scrollLeft - walk;
});

carousel.addEventListener("scroll", normalizeLoop);

startAutoScroll();
