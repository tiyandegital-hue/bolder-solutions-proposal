/* Bolder Solutions — shared site script: mobile nav + quote-request builder. */
(function(){
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("mainnav");
  if (toggle && nav) {
    toggle.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  /* Quote form -> copy-ready brief + mailto (no backend, no data stored) */
  var form = document.getElementById("quoteform");
  if (!form) return;

  function mark(id, bad){
    var wrap = document.getElementById(id);
    if (wrap) wrap.classList.toggle("invalid", !!bad);
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("q-name").value.trim();
    var phone = document.getElementById("q-phone").value.trim();
    var email = document.getElementById("q-email").value.trim();
    var service = document.getElementById("q-service").value;
    var details = document.getElementById("q-details").value.trim();
    var date = document.getElementById("q-date").value;
    var consent = document.getElementById("q-consent").checked;

    var bad = false;
    mark("f-name", !name);            if (!name) bad = true;
    mark("f-phone", !phone);          if (!phone) bad = true;
    mark("f-service", !service);      if (!service) bad = true;
    var brief = document.getElementById("brief");
    var df = document.getElementById("q-details");
    df.closest(".field").classList.toggle("invalid", !details);
    if (!details) bad = true;
    var emailBad = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    mark("f-email", emailBad);        if (emailBad) bad = true;
    var consentErr = document.getElementById("q-consent-err");
    consentErr.style.display = consent ? "none" : "block";
    if (!consent) bad = true;

    if (bad) {
      var first = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (first) first.focus();
      return;
    }

    var lines = [
      "QUOTE REQUEST — Bolder Solutions",
      "",
      "Name:    " + name,
      "Phone:   " + phone,
      "Email:   " + (email || "(not provided)"),
      "Service: " + service,
      "Preferred date: " + (date || "(flexible)"),
      "",
      "Project details:",
      details,
      "",
      "— sent from boldersolutions.ca/quote.html"
    ];
    var text = lines.join("\n");
    brief.textContent = text;
    brief.style.display = "block";

    var mailto = "mailto:kyle@boldersolutions.ca"
      + "?subject=" + encodeURIComponent("Quote request — " + service + " (" + name + ")")
      + "&body=" + encodeURIComponent(text);
    var mailLink = document.getElementById("brief-mailto");
    mailLink.setAttribute("href", mailto);
    document.getElementById("brief-actions").style.display = "flex";

    document.getElementById("brief-copy").onclick = function(){
      var done = function(){ this.textContent = "Copied ✓"; }.bind(this);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else { done(); }
    };

    brief.scrollIntoView({behavior:"smooth", block:"start"});
  });

  form.addEventListener("reset", function(){
    setTimeout(function(){
      form.querySelectorAll(".field.invalid").forEach(function(f){ f.classList.remove("invalid"); });
      document.getElementById("q-consent-err").style.display = "none";
      document.getElementById("brief").style.display = "none";
      document.getElementById("brief-actions").style.display = "none";
    }, 0);
  });
})();
