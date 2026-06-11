/* Arduview LP — front-end only (no backend yet).
   - scroll reveal
   - email capture stub (logs + local success state; wire to ESP/Shopify later)
   - deposit checkout stub (routes to Page 2 -> Shopify checkout later)
*/
(function () {
  "use strict";

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- email capture (3 points: hero / mid / final) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll(".cta__form").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector(".cta__input");
      var email = (input && input.value || "").trim();
      // capture the email if it's valid (demo: localStorage stub)
      if (EMAIL_RE.test(email)) {
        console.log("[arduview] capture @ " + form.dataset.capture + ":", email);
        try {
          var list = JSON.parse(localStorage.getItem("arduview_leads") || "[]");
          list.push({ email: email, at: form.dataset.capture, t: Date.now() });
          localStorage.setItem("arduview_leads", JSON.stringify(list));
        } catch (e) {}
      }
      // demo click-through: every CTA leads to the deposit page
      window.location.href = "deposit.html";
    });
  });

  /* ---------- deposit checkout stub ---------- */
  var checkout = document.querySelector("[data-checkout]");
  if (checkout) {
    checkout.addEventListener("click", function (ev) {
      ev.preventDefault();
      // TODO: redirect to Shopify secure checkout for the $5 deposit SKU
      console.log("[arduview] -> Shopify $5 deposit checkout");
      checkout.textContent = "redirecting to secure checkout…";
    });
  }
})();
