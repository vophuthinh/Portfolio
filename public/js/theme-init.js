(function () {
  try {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.remove("dark");
    }
  } catch (error) {
    // Fail safely if storage is unavailable.
  }
})();
