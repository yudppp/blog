var hostname = window.location.hostname;
var atags = document.getElementsByTagName("a");
for (var i in atags) {
  var tag = atags[i];
  if (tag.href && tag.href.indexOf(hostname) == -1) {
    tag.target = "_blank";
  }
}

// hljs
hljs.initHighlightingOnLoad();

// ga
(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
ga("create", "UA-70167858-1", "auto");
ga("send", "pageview");

var logos = document.getElementsByClassName("logo");
if (logos.length !== 0) {
  var roughness = Math.random() * 1.2;
  if (roughness > 1.1) {
    roughness += Math.random() * 1.8;
  }
  var rc = rough.canvas(document.getElementsByClassName("logo")[0]);
  rc.circle(60, 55, 79, {
    roughness: roughness,
    stroke: "#333",
    fill: "#ff2e88"
  });
  rc.polygon([[155, 18], [115, 90], [195, 90]], {
    roughness: roughness,
    stroke: "#333",
    fill: "#ffd936"
  });
  rc.rectangle(220, 20, 70, 70, {
    roughness: roughness,
    stroke: "#333",
    fill: "#2e6eff"
  });
}

cheet("↑ ↑ ↓ ↓ ← → ← → b a", function() {
  var body = document.getElementsByTagName("body")[0];
  var className = body.className;
  if (className === "hack") {
    body.className = "hack dark";
  } else {
    body.className = "hack";
  }
});

mediumZoom(".content img");
