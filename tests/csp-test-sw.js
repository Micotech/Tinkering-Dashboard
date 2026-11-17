
self.addEventListener("install", () => {
  console.log("Test service worker installed.");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data === "CHECK_FOR_UPDATE") {
    event.source.postMessage("UPDATE_MESSAGE_RECEIVED");
  }
});

