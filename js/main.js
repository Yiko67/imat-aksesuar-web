// İmat Aksesuar — site scripts
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (backToTop) backToTop.classList.toggle("show", y > 480);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
      var expanded = mainNav.classList.contains("open");
      navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mainNav.classList.remove("open"); });
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Active nav link by current path
  var path = window.location.pathname.replace(/index\.html$/, "");
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var normalized = href.replace(/index\.html$/, "");
    if (normalized === path || (normalized !== "/" && normalized !== "" && path.endsWith(normalized))) {
      a.classList.add("active");
    }
  });

  // Certificate lightbox
  var lightbox = document.querySelector("#lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll(".cert-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var img = thumb.querySelector("img");
        lightboxImg.src = img.getAttribute("data-full") || img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // Contact form (static prototype — no backend wired yet)
  var contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.querySelector("#form-success");
      if (success) success.classList.add("show");
      contactForm.reset();
      if (success) success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
