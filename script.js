const carousel = document.getElementById("carousel");

let autoScroll;
let isPointerDown = false;
let startX = 0;
let scrollLeft = 0;

function startAutoScroll() {
  stopAutoScroll();

  autoScroll = setInterval(() => {
    if (isPointerDown) return;

    carousel.scrollLeft += 1;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft >= maxScroll / 2) {
      carousel.scrollLeft = 0;
    }
  }, 35); // bigger number = slower
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

carousel.addEventListener("mouseenter", stopAutoScroll);
carousel.addEventListener("mouseleave", startAutoScroll);

carousel.addEventListener("touchstart", stopAutoScroll, { passive: true });
carousel.addEventListener("touchend", startAutoScroll, { passive: true });

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
  isPointerDown = false;
  startAutoScroll();
});

carousel.addEventListener("mousemove", (e) => {
  if (!isPointerDown) return;
  e.preventDefault();

  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.2;
  carousel.scrollLeft = scrollLeft - walk;
});

startAutoScroll();
