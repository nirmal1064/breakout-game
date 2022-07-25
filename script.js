// adding serviceworker
window.addEventListener("load", function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log(`Service Worker Registered ${registration.scope}`);
      })
      .catch((err) => {
        console.log("Service Worker Not Registered", err);
      });
  }
});
