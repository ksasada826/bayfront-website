const siteNav = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

const isJa = document.documentElement.lang === "ja";

function setNavOpen(open) {
  if (!siteNav || !navToggle) return;
  siteNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute(
    "aria-label",
    open
      ? (isJa ? "メニューを閉じる" : "Close menu")
      : (isJa ? "メニューを開く" : "Open menu")
  );
}

if (navToggle) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setNavOpen(!siteNav.classList.contains("is-open"));
  });
}

if (navLinks) {
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setNavOpen(false);
});

document.addEventListener("click", (e) => {
  if (!siteNav || !siteNav.classList.contains("is-open")) return;
  if (!siteNav.contains(e.target)) setNavOpen(false);
});
