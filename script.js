document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;


  const themeBtn = document.getElementById("theme-btn");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const currentTheme = () =>
    root.dataset.theme || (prefersDark.matches ? "dark" : "light");

  function paintThemeButton() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    themeBtn.textContent = next === "dark" ? "Dark" : "Light";
    themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
  }

  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintThemeButton();
  });

  paintThemeButton();

 
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  const links = [...menu.querySelectorAll("a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => {
            const match = a.getAttribute("href") === `#${entry.target.id}`;
            if (match) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
});
