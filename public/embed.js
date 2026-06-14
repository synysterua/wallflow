(function () {
  "use strict";

  var APP_URL = "https://wallflow.app";

  var scripts = document.querySelectorAll("script[data-token]");

  if (scripts.length === 0) {
    console.warn("[Wallflow] embed.js loaded but no data-token attribute found.");
    return;
  }

  scripts.forEach(function (script) {
    var token = script.getAttribute("data-token");
    if (!token) {
      console.warn("[Wallflow] script tag is missing data-token attribute.");
      return;
    }
    if (!/^[0-9a-f]{32}$/.test(token)) {
      console.warn("[Wallflow] data-token is not a valid 32-character hex string.");
      return;
    }

    var iframe = document.createElement("iframe");
    iframe.src = APP_URL + "/widget/" + token;
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.height = "400px";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("title", "Wall of Love — Wallflow");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");

    if (script.parentNode) {
      script.parentNode.insertBefore(iframe, script.nextSibling);
    }

    window.addEventListener("message", function (event) {
      // Only trust messages from our own widget origin
      if (event.origin !== APP_URL) return;
      if (
        event.data &&
        event.data.type === "wallflow:height" &&
        typeof event.data.height === "number" &&
        event.data.height > 0
      ) {
        iframe.style.height = event.data.height + "px";
      }
    });
  });
})();
