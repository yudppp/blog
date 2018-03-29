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
  var rc = rough.canvas(document.getElementsByClassName("logo")[0]);
  rc.circle(55, 55, 80, { roughness: 0.5, fill: "#ff2e88" });
  rc.polygon([[150, 20], [110, 90], [190, 90]], {
    roughness: 0.5,
    fill: "#ffd936"
  });
  rc.rectangle(219, 20, 70, 70, { roughness: 0.5, fill: "#2e6eff" });
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
