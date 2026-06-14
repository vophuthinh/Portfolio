// Load non-critical third-party stylesheets after initial paint
(function () {
  function loadCSS(href, attrs) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    if (attrs) {
      for (var k in attrs) l[k] = attrs[k];
    }
    document.head.appendChild(l);
  }

  loadCSS(
    "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Poppins:wght@300;400;500;600;700&display=swap"
  );

  loadCSS(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
    {
      integrity:
        "sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==",
      crossOrigin: "anonymous",
      referrerPolicy: "no-referrer",
    }
  );
})();
