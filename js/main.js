/* ============================================================
   Duke Electric Vehicles / main.js
   Nav, scroll reveal, counters, bars, specimen fallbacks
   ============================================================ */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initCounters();
  initEffBars();
  initImageFallbacks();
  setYear();

  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => el.classList.add("visible"));
  }, 2500);
});

function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "CLOSE" : "MENU";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.textContent = "MENU";
      })
    );
  }
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.target || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => io.observe(el));
}

function initEffBars() {
  const bars = document.querySelectorAll(".eff-bar");
  if (!bars.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          requestAnimationFrame(() => {
            bar.style.width = (bar.dataset.width || 0) + "%";
          });
          io.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((bar) => io.observe(bar));
}

function initImageFallbacks() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const div = document.createElement("div");
      div.className = "img-fallback";
      div.textContent = img.dataset.label || img.alt || "photo coming soon";
      img.replaceWith(div);
    });
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
