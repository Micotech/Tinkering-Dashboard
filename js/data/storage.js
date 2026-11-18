// LocalStorage keys used by the application.
import { migrations } from "./migrations.js";
const STORAGE_KEYS = {
  data: "tinkeringDashboard.data",
  session: "tinkeringDashboard.session",
  snapshot: "tinkeringDashboard.snapshot",
  corrupt: "tinkeringDashboard.corrupt"
};
// The newest data format this version of the app supports.
const CURRENT_SCHEMA_VERSION = 1;
// Storage limits, measured in UTF-16 code units.
const MAX_DOCUMENT_SIZE = 500_000;
const MAX_USER_CONTENT_SIZE = 495_000;
// Measure the size of a JSON value in UTF-16 code units.
function getStorageSize(value) {
  return JSON.stringify(value).length;
}
// Check whether LocalStorage is available.
// Check whether LocalStorage can be accessed.
function isStorageAvailable() {
  try {
    localStorage.getItem(STORAGE_KEYS.data);
    return true;
  } catch {
    return false;
  }
}

// Read a value from LocalStorage without crashing.
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
// Write a value to LocalStorage without crashing.
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
// Parse stored JSON without crashing.
function parseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
// Write a value and verify that it was stored correctly.
function writeAndVerify(key, value) {
  if (!writeStorage(key, value)) {
    return false;
  }

  const savedValue = readStorage(key);

  return savedValue === value;
}
// Ask the browser to preserve the app's stored data.
export async function requestPersistence() {
  try {
    if (!navigator.storage?.persist) {
      return false;
    }

    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
// Read and parse the main application document.
function readStoredDocument() {
  const rawData = readStorage(STORAGE_KEYS.data);

  if (rawData === null) {
    return {
      rawData: null,
      document: null,
      status: "empty"
    };
  }

  const document = parseJSON(rawData);

  if (document === null) {
    return {
      rawData,
      document: null,
      status: "corrupt"
    };
  }

  return {
    rawData,
    document,
    status: "parsed"
  };
}
// Check whether a parsed document has a supported structure and version.
function checkDocumentVersion(document) {
  if (
    !document ||
    typeof document !== "object" ||
    Array.isArray(document) ||
    document.app !== "tinkering-dashboard" ||
    !Number.isInteger(document.schemaVersion) ||
    document.schemaVersion < 1
  ) {
    return "corrupt";
  }

  if (document.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return "newer";
  }

  return "supported";
}

// Upgrade an older document one version at a time.
// Upgrade an older document one version at a time.
function migrateDocument(document) {
  let migratedDocument = document;

  while (migratedDocument.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const previousVersion = migratedDocument.schemaVersion;
    const migration = migrations[previousVersion];

    if (typeof migration !== "function") {
      return null;
    }

    try {
      migratedDocument = migration(migratedDocument);
    } catch {
      return null;
    }

    if (
      !migratedDocument ||
      typeof migratedDocument !== "object" ||
      migratedDocument.schemaVersion !== previousVersion + 1
    ) {
      return null;
    }
  }

  return migratedDocument;
}

// Load the application document from LocalStorage.
export function load() {
  // Check whether LocalStorage can be accessed.
  if (!isStorageAvailable()) {
    return {
      status: "unavailable",
      document: null
    };
  }

  const storedData = readStoredDocument();

  // First launch: no saved document exists.
  if (storedData.status === "empty") {
    return {
      status: "empty",
      document: null
    };
  }

  // Invalid JSON.
  if (storedData.status === "corrupt") {
    return {
      status: "corrupt",
      document: null,
      rawData: storedData.rawData
    };
  }

  // Check the document's identity and schema version.
  const versionStatus = checkDocumentVersion(storedData.document);

  if (versionStatus === "corrupt") {
    return {
      status: "corrupt",
      document: null,
      rawData: storedData.rawData
    };
  }

  // Never modify data from a newer version of the app.
  if (versionStatus === "newer") {
    return {
      status: "newer",
      document: storedData.document
    };
  }

  // Upgrade older documents when necessary.
  const document = migrateDocument(storedData.document);

  if (!document) {
    return {
      status: "corrupt",
      document: null,
      rawData: storedData.rawData
    };
  }

  return {
    status: "ok",
    document
  };
}