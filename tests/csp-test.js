
const rotatingGroup = document.getElementById("rotating-group");
const rotateButton = document.getElementById("rotate-button");

let currentRotation = 0;

rotateButton.addEventListener("click", () => {
  currentRotation += 90;

  rotatingGroup.style.transform = `rotate(${currentRotation}deg)`;
});



const serviceWorkerButton = document.getElementById("service-worker-button");
const serviceWorkerStatus = document.getElementById("service-worker-status");

serviceWorkerButton.addEventListener("click", async () => {
  try {
    serviceWorkerStatus.textContent = "Registering service worker...";

    const registration = await navigator.serviceWorker.register(
      "./csp-test-sw.js"
    );

    serviceWorkerStatus.textContent = "Waiting for service worker...";

    await navigator.serviceWorker.ready;

    const worker = registration.active;

    if (!worker) {
      throw new Error("No active service worker found.");
    }

    // Listen for the reply before sending the message.
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data === "UPDATE_MESSAGE_RECEIVED") {
        serviceWorkerStatus.textContent =
          "Service worker registration and messaging successful.";
      }
    });

    serviceWorkerStatus.textContent = "Sending test message...";

    worker.postMessage("CHECK_FOR_UPDATE");

  } catch (error) {
    serviceWorkerStatus.textContent =
      "Service worker test failed: " + error.message;

    console.error(error);
  }
});

const exportButton = document.getElementById("export-button");
const exportStatus = document.getElementById("export-status");

exportButton.addEventListener("click", () => {
  const testData = {
    message: "CSP export test successful",
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(testData, null, 2)], {
    type: "application/json"
  });

  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = "csp-test-export.json";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);

  exportStatus.textContent =
    "Download triggered. Check your Downloads folder.";
});
const importFile = document.getElementById("import-file");
const importStatus = document.getElementById("import-status");

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];

  if (!file) {
    importStatus.textContent = "No file selected.";
    return;
  }

  try {
    const fileContents = await file.text();
    const importedData = JSON.parse(fileContents);

    importStatus.textContent =
      "Import successful: " + importedData.message;
  } catch (error) {
    importStatus.textContent =
      "Import failed: " + error.message;

    console.error(error);
  }
});
const openDialogButton = document.getElementById("open-dialog-button");
const closeDialogButton = document.getElementById("close-dialog-button");
const testDialog = document.getElementById("test-dialog");

openDialogButton.addEventListener("click", () => {
  testDialog.showModal();
});

closeDialogButton.addEventListener("click", () => {
  testDialog.close();
});