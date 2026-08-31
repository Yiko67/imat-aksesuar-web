// İmat Aksesuar — site scripts
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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

  // Hero hotspots — interactive house pins
  var heroHotspots = document.querySelector(".hero-hotspots");
  if (heroHotspots) {
    var hotspots = Array.prototype.slice.call(heroHotspots.querySelectorAll(".hotspot"));
    var spotlight = document.querySelector(".hero-spotlight");

    var closeHotspot = function (hs) {
      if (!hs.classList.contains("is-open")) return;
      hs.classList.remove("is-open");
      var pin = hs.querySelector(".hotspot-pin");
      if (pin) pin.setAttribute("aria-expanded", "false");
      var card = hs.querySelector(".hotspot-card");
      if (card) card.classList.remove("card-left", "card-right", "card-top");
    };
    var closeAllHotspots = function (except) {
      hotspots.forEach(function (hs) { if (hs !== except) closeHotspot(hs); });
      if (!except) {
        heroHotspots.classList.remove("has-open");
        if (spotlight) spotlight.classList.remove("is-visible");
      }
    };
    var positionCard = function (hs) {
      var card = hs.querySelector(".hotspot-card");
      var pin = hs.querySelector(".hotspot-pin");
      if (!card || !pin) return;
      card.classList.remove("card-left", "card-right", "card-top");
      var pinRect = pin.getBoundingClientRect();
      var cardWidth = card.offsetWidth || 300;
      var estCardHeight = 190;
      var margin = 16;
      if (pinRect.left + cardWidth / 2 > window.innerWidth - margin) {
        card.classList.add("card-left");
      } else if (pinRect.left - cardWidth / 2 < margin) {
        card.classList.add("card-right");
      }
      if (pinRect.bottom + estCardHeight > window.innerHeight - margin) {
        card.classList.add("card-top");
      }
    };
    var openHotspot = function (hs) {
      closeAllHotspots(hs);
      hs.classList.add("is-open");
      var pin = hs.querySelector(".hotspot-pin");
      if (pin) pin.setAttribute("aria-expanded", "true");
      heroHotspots.classList.add("has-open");
      if (spotlight) {
        spotlight.style.setProperty("--sx", hs.style.getPropertyValue("--x") || "50%");
        spotlight.style.setProperty("--sy", hs.style.getPropertyValue("--y") || "50%");
        spotlight.classList.add("is-visible");
      }
      positionCard(hs);
    };

    hotspots.forEach(function (hs) {
      var pin = hs.querySelector(".hotspot-pin");
      if (!pin) return;
      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        if (hs.classList.contains("is-open")) {
          closeHotspot(hs);
          heroHotspots.classList.remove("has-open");
          if (spotlight) spotlight.classList.remove("is-visible");
        } else {
          openHotspot(hs);
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (!heroHotspots.contains(e.target)) closeAllHotspots();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllHotspots();
    });
    window.addEventListener("resize", function () {
      var open = hotspots.find(function (hs) { return hs.classList.contains("is-open"); });
      if (open) positionCard(open);
    });
  }

  // Language switcher (UI only — English content coming later)
  var langSwitches = document.querySelectorAll(".lang-switch");
  if (langSwitches.length) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    var toastTimer;
    var showToast = function (message) {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
    };

    langSwitches.forEach(function (wrap) {
      var btn = wrap.querySelector(".lang-switch-btn");
      var options = wrap.querySelectorAll(".lang-option");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = wrap.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          var lang = opt.getAttribute("data-lang");
          wrap.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          if (lang === "en") {
            showToast("İngilizce içerik yakında eklenecek");
          }
        });
      });
    });
    document.addEventListener("click", function (e) {
      langSwitches.forEach(function (wrap) {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove("is-open");
          var btn = wrap.querySelector(".lang-switch-btn");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        langSwitches.forEach(function (wrap) { wrap.classList.remove("is-open"); });
      }
    });
  }

  // Magnetic primary buttons — pointer devices only, subtle pull toward cursor
  if (!reduceMotion && pointerFine) {
    document.querySelectorAll(".btn--primary").forEach(function (btn) {
      var strength = 10;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = "translate(" + (relX * strength) + "px, " + (relY * strength) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  // Product card 3D tilt — pointer devices only, subtle (~3deg max)
  if (!reduceMotion && pointerFine) {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var maxTilt = 3;
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--ry", (relX * maxTilt * 2) + "deg");
        card.style.setProperty("--rx", (relY * -maxTilt * 2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // Count-up animation for numeric stats
  var counterEls = Array.prototype.filter.call(
    document.querySelectorAll(".hero-stats-strip .stat b, .stats-strip .stat b"),
    function (el) { return /^\d+$/.test(el.textContent.trim()); }
  );
  if (counterEls.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.textContent.trim(), 10);
      if (reduceMotion) { el.textContent = target; return; }
      var start = null;
      var duration = 900;
      var step = function (ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counterEls.forEach(function (el) { counterIo.observe(el); });
    } else {
      counterEls.forEach(function (el) { /* leave static value */ });
    }
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
