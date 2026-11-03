(() => {
  "use strict";

  const DATA = window.PORTFOLIO || {};
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const isUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v.trim());

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
    [].concat(children).forEach((c) => c && node.append(c));
    return node;
  }

  function icon(id) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }

  /* ---------- footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  const themeBtn = $("#theme-toggle");
  const metaTheme = $('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#0b0d17" : "#f5f5fa");
    if (persist) {
      try { localStorage.setItem("theme", theme); } catch (e) { /* storage unavailable */ }
    }
  }

  applyTheme(root.getAttribute("data-theme") || "dark", false);
  themeBtn?.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  /* ---------- mobile navigation ---------- */
  const header = $(".site-header");
  const menuBtn = $("#menu-btn");
  const nav = $("#site-nav");

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }

  menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (menuBtn?.getAttribute("aria-expanded") === "true" && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- header shadow on scroll ---------- */
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- active nav link ---------- */
  const navLinks = $$(".nav-list a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => {
            const active = a.getAttribute("href") === "#" + entry.target.id;
            a.classList.toggle("active", active);
            if (active) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const items = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((n, i) => {
      n.style.setProperty("--d", (i % 4) * 70 + "ms");
      io.observe(n);
    });
  }

  /* ---------- typed role text ---------- */
  function initTyped() {
    const target = $("#typed");
    const roles = Array.isArray(DATA.roles) ? DATA.roles.filter(Boolean) : [];
    const live = target?.closest(".role-live");
    if (!target || !roles.length) return;

    // With reduced motion (or a single role) the static line is enough.
    if (reduceMotion.matches || roles.length < 2) {
      live?.remove();
      return;
    }
    $(".role-static")?.classList.add("sr-only");

    let r = 0, c = 0, deleting = false;
    const tick = () => {
      if (reduceMotion.matches) { target.textContent = roles[0]; return; }
      const word = roles[r];
      c += deleting ? -1 : 1;
      target.textContent = word.slice(0, c);
      let wait = deleting ? 28 : 55;
      if (!deleting && c === word.length) { deleting = true; wait = 1700; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    };
    tick();
  }

  /* ---------- socials (only real URLs are shown) ---------- */
  function initSocials() {
    const defs = [
      { key: "github", label: "GitHub", icon: "i-github" },
      { key: "linkedin", label: "LinkedIn", icon: "i-linkedin" }
    ];
    const socials = DATA.socials || {};
    $$("[data-socials]").forEach((list) => {
      defs.forEach((d) => {
        if (!isUrl(socials[d.key])) return;
        const a = el("a", {
          href: socials[d.key].trim(),
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": d.label + " (opens in a new tab)"
        }, [icon(d.icon), el("span", { text: d.label })]);
        list.append(el("li", {}, a));
      });
      if (!list.children.length) list.remove();
    });
  }

  /* ---------- resume button ---------- */
  function initResume() {
    const btn = $("[data-resume]");
    if (!btn) return;
    const label = $("[data-resume-label]", btn);
    const path = typeof DATA.resume === "string" ? DATA.resume.trim() : "";
    if (path) {
      btn.setAttribute("href", path);
      btn.setAttribute("download", "");
    } else if (DATA.email) {
      const subject = encodeURIComponent("Resume request");
      btn.setAttribute("href", "mailto:" + DATA.email + "?subject=" + subject);
      if (label) label.textContent = "Request Resume";
    }
  }

  /* ---------- projects ---------- */
  function renderProjects() {
    const grid = $("#projects-grid");
    if (!grid) return;
    const projects = Array.isArray(DATA.projects) ? DATA.projects : [];

    if (!projects.length) {
      const gh = isUrl(DATA.socials?.github);
      grid.classList.add("is-empty");
      grid.append(
        el("div", { class: "empty card reveal" }, [
          el("span", { class: "empty-icon", "aria-hidden": "true" }, icon("i-folder")),
          el("h3", { text: "Projects are being added" }),
          el("p", { text: "My selected work will appear here soon. In the meantime, feel free to get in touch." }),
          el("a", { class: "btn btn-ghost", href: "#contact" }, ["Contact me", icon("i-arrow")]),
          gh ? el("a", { class: "text-link", href: DATA.socials.github.trim(), target: "_blank", rel: "noopener noreferrer" }, "Browse GitHub") : null
        ])
      );
      return;
    }

    projects.forEach((p) => {
      const media = p.image
        ? el("div", { class: "project-media" }, el("img", {
            src: p.image,
            alt: p.imageAlt || "Screenshot of " + p.title,
            loading: "lazy",
            decoding: "async"
          }))
        : null;

      const links = [];
      if (isUrl(p.live)) {
        links.push(el("a", { class: "btn btn-primary btn-sm", href: p.live, target: "_blank", rel: "noopener noreferrer", "aria-label": "Live demo of " + p.title + " (opens in a new tab)" }, ["Live demo", icon("i-external")]));
      }
      if (isUrl(p.github)) {
        links.push(el("a", { class: "btn btn-ghost btn-sm", href: p.github, target: "_blank", rel: "noopener noreferrer", "aria-label": "GitHub repository for " + p.title + " (opens in a new tab)" }, [icon("i-github"), "Code"]));
      }

      grid.append(
        el("article", { class: "project card reveal" }, [
          media,
          el("div", { class: "project-body" }, [
            el("h3", { text: p.title }),
            el("p", { text: p.description }),
            Array.isArray(p.tech) && p.tech.length
              ? el("ul", { class: "tags tags-sm" }, p.tech.map((t) => el("li", { text: t })))
              : null,
            links.length ? el("div", { class: "project-links" }, links) : null
          ])
        ])
      );
    });
  }

  /* ---------- achievements ---------- */
  function renderAchievements() {
    const list = $("#ach-list");
    if (!list) return;
    (DATA.achievements || []).forEach((a) => {
      const meta = [a.issuer, a.date].filter(Boolean).join(" · ");
      const link = isUrl(a.url)
        ? el("a", { class: "text-link", href: a.url, target: "_blank", rel: "noopener noreferrer" }, "View credential")
        : null;
      list.append(
        el("li", { class: "ach card reveal" }, [
          el("span", { class: "ach-icon", "aria-hidden": "true" }, icon("i-award")),
          el("div", {}, [
            el("h3", { text: a.title }),
            meta ? el("p", { class: "muted", text: meta }) : null,
            a.description ? el("p", { class: "ach-desc", text: a.description }) : null,
            link
          ])
        ])
      );
    });
    if (!list.children.length) list.closest("section")?.remove();
  }

  /* ---------- contact: copy email ---------- */
  const copyBtn = $("#copy-email");
  copyBtn?.addEventListener("click", async () => {
    const label = $("span", copyBtn);
    const email = DATA.email;
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch (e) {
      const ta = el("textarea", { readonly: true, style: "position:fixed;opacity:0" });
      ta.value = email;
      document.body.append(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (err) { /* ignore */ }
      ta.remove();
    }
    label.textContent = ok ? "Copied!" : "Press Ctrl/⌘ + C";
    setTimeout(() => (label.textContent = "Copy email"), 2000);
  });

  /* ---------- contact form (opens the visitor's email app) ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  const defaultNote = status?.textContent;

  function setError(id, msg) {
    const input = $("#" + id);
    const err = $("#" + id + "-err");
    if (!input || !err) return;
    err.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    input.setAttribute("aria-describedby", msg ? err.id : "");
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cf-name").value.trim();
    const email = $("#cf-email").value.trim();
    const message = $("#cf-message").value.trim();
    let firstBad = null;

    const check = (id, bad, msg) => {
      setError(id, bad ? msg : "");
      if (bad && !firstBad) firstBad = $("#" + id);
    };
    check("cf-name", !name, "Please enter your name.");
    check("cf-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Please enter a valid email address.");
    check("cf-message", message.length < 5, "Please write a short message.");

    if (firstBad) { firstBad.focus(); return; }

    const subject = encodeURIComponent("Portfolio enquiry from " + name);
    const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = "mailto:" + DATA.email + "?subject=" + subject + "&body=" + body;
    if (status) status.textContent = "Your email app should open now. If it doesn’t, write to " + DATA.email + ".";
    form.reset();
    setTimeout(() => { if (status) status.textContent = defaultNote; }, 8000);
  });
  $$("input, textarea", form || document).forEach((f) =>
    f.addEventListener("input", () => { if (f.id) setError(f.id, ""); })
  );

  /* ---------- init ---------- */
  initSocials();
  initResume();
  renderProjects();
  renderAchievements();
  initReveal();
  initTyped();
})();
