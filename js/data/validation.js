// Clean and validate a text value.
function validateString(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }

  const cleanedValue = value.trim();

  if (cleanedValue.length > maxLength) {
    return null;
  }

  return cleanedValue;
}
// Check whether a value belongs to an allowed set.
function validateEnum(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    return null;
  }

  return value;
}
// Check whether a value is a valid local date.
function validateLocalDate(value) {
  if (typeof value !== "string") {
    return null;
  }

  // Check the YYYY-MM-DD format.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  // Check whether the calendar date actually exists.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return value;
}

// Check whether a URL is valid and uses HTTP or HTTPS.
function validateUrl(value) {
  const cleanedValue = validateString(value, 2000);

  if (!cleanedValue) {
    return null;
  }

  try {
    const url = new URL(cleanedValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return cleanedValue;
  } catch {
    return null;
  }
}
// Validate a value that may be null.
function validateNullable(value, validator) {
  if (value === null) {
    return null;
  }

  return validator(value);
}
// Check whether a value is a single emoji.
// Check whether an icon belongs to the approved emoji list.
function validateIcon(value) {
  const allowedIcons = [
    "🎨", "💻", "🧠", "🌍", "🎲",
    "📷", "🎬", "🎵", "✍️", "🖌️",
    "📚", "🔬", "💡", "🧩", "🌱",
    "🏃", "🍳", "🧭", "🎯", "🚀"
  ];

  if (!allowedIcons.includes(value)) {
    return null;
  }

  return value;
}
// Check whether a value is a valid UTC timestamp.
function validateTimestamp(value) {
  const cleanedValue = validateString(value, 30);

  if (!cleanedValue) {
    return null;
  }

  // Require the ISO 8601 UTC format.
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(cleanedValue)) {
    return null;
  }

  const timestamp = new Date(cleanedValue);

  if (
    Number.isNaN(timestamp.getTime()) ||
    timestamp.toISOString() !== cleanedValue
  ) {
    return null;
  }

  return cleanedValue;
}
// Validate a category record.
export function validateCategory(category) {
  if (!category || typeof category !== "object" || Array.isArray(category)) {
    return null;
  }

  const id = validateString(category.id, 100);
  const name = validateString(category.name, 80);
  const icon = validateIcon(category.icon);
  const colorToken = validateEnum(category.colorToken, [
    "purple",
    "pink",
    "blue",
    "mint",
    "yellow",
    "coral"
  ]);

  if (!id || !name || !icon || !colorToken) {
    return null;
  }

  if (
    typeof category.isDefault !== "boolean" ||
    typeof category.isArchived !== "boolean"
  ) {
    return null;
  }

  const createdAt = validateTimestamp(category.createdAt);
  const updatedAt = validateTimestamp(category.updatedAt);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name,
    icon,
    colorToken,
    isDefault: category.isDefault,
    isArchived: category.isArchived,
    createdAt,
    updatedAt
  };
}

// Validate an activity record.
export function validateActivity(activity) {
  if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
    return null;
  }

  const id = validateString(activity.id, 100);
  const name = validateString(activity.name, 80);
  const description = validateString(activity.description, 5000);
  const categoryId = validateString(activity.categoryId, 100);

  const difficulty = validateNullable(
    activity.difficulty,
    (value) => validateEnum(value, [
      "beginner",
      "intermediate",
      "advanced"
    ])
  );

  const suggestedDuration = activity.suggestedDuration;

  if (
    !id ||
    !name ||
    description === null ||
    !categoryId ||
    (activity.difficulty !== null && difficulty === null)
  ) {
    return null;
  }

  if (
    suggestedDuration !== null &&
    (!Number.isInteger(suggestedDuration) || suggestedDuration <= 0)
  ) {
    return null;
  }

  if (
    typeof activity.isFavourite !== "boolean" ||
    typeof activity.isArchived !== "boolean"
  ) {
    return null;
  }

  const savedForLaterAt = validateNullable(
    activity.savedForLaterAt,
    validateTimestamp
  );

  if (activity.savedForLaterAt !== null && savedForLaterAt === null) {
    return null;
  }

  const createdAt = validateTimestamp(activity.createdAt);
  const updatedAt = validateTimestamp(activity.updatedAt);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name,
    description,
    categoryId,
    suggestedDuration,
    difficulty,
    isFavourite: activity.isFavourite,
    savedForLaterAt,
    isArchived: activity.isArchived,
    createdAt,
    updatedAt
  };
}
// Validate an attempt record.
export function validateAttempt(attempt) {
  if (!attempt || typeof attempt !== "object" || Array.isArray(attempt)) {
    return null;
  }

  const id = validateString(attempt.id, 100);
  const activityKey = validateString(attempt.activityKey, 100);
  const activityId = validateNullable(
    attempt.activityId,
    (value) => validateString(value, 100)
  );
  const activityName = validateString(attempt.activityName, 80);
  const categoryId = validateString(attempt.categoryId, 100);
  const outcome = validateEnum(attempt.outcome, [
    "attempted",
    "completed"
  ]);
  const date = validateLocalDate(attempt.date);

  const durationMinutes = attempt.durationMinutes;

  if (
    !id ||
    !activityKey ||
    !activityName ||
    !categoryId ||
    !outcome ||
    !date ||
    (attempt.activityId !== null && activityId === null)
  ) {
    return null;
  }

  if (
    durationMinutes !== null &&
    (!Number.isInteger(durationMinutes) || durationMinutes <= 0)
  ) {
    return null;
  }

  const createdAt = validateTimestamp(attempt.createdAt);

  if (!createdAt) {
    return null;
  }

  return {
    id,
    activityKey,
    activityId,
    activityName,
    categoryId,
    outcome,
    date,
    durationMinutes,
    createdAt
  };
}

// Validate a journal entry.
export function validateJournalEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return null;
  }

  const id = validateString(entry.id, 100);
  const activityId = validateNullable(
    entry.activityId,
    (value) => validateString(value, 100)
  );
  const activityName = validateString(entry.activityName, 80);
  const categoryId = validateNullable(
    entry.categoryId,
    (value) => validateString(value, 100)
  );
  const date = validateLocalDate(entry.date);
  const whatIThought = validateString(entry.whatIThought, 5000);

  const optionalTextFields = [
    "whatIDid",
    "whatILearned",
    "whatIEnjoyed",
    "whatIDisliked",
    "notes"
  ];

  const cleanedText = {};

  for (const field of optionalTextFields) {
  cleanedText[field] = validateNullable(
    entry[field],
    (value) => validateString(value, 5000)
  );

  if (
    entry[field] !== null &&
    (cleanedText[field] === null || cleanedText[field] === "")
  ) {
    return null;
  }
}

  const wouldRepeat = validateNullable(
    entry.wouldRepeat,
    (value) => validateEnum(value, ["yes", "maybe", "no"])
  );

  if (
    !id ||
    !activityName ||
    !date ||
    !whatIThought ||
    (entry.activityId !== null && activityId === null) ||
    (entry.categoryId !== null && categoryId === null) ||
    (entry.wouldRepeat !== null && wouldRepeat === null)
  ) {
    return null;
  }

  const createdAt = validateTimestamp(entry.createdAt);
  const updatedAt = validateTimestamp(entry.updatedAt);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    activityId,
    activityName,
    categoryId,
    date,
    whatIThought,
    ...cleanedText,
    wouldRepeat,
    createdAt,
    updatedAt
  };
}
// Validate a discovery record.
export function validateDiscovery(discovery) {
  if (!discovery || typeof discovery !== "object" || Array.isArray(discovery)) {
    return null;
  }

  const id = validateString(discovery.id, 100);
  const title = validateString(discovery.title, 80);
  const description = validateString(discovery.description, 5000);

  const categoryId = validateNullable(
    discovery.categoryId,
    (value) => validateString(value, 100)
  );

  const dateDiscovered = validateLocalDate(discovery.dateDiscovered);

  const url = validateNullable(discovery.url, validateUrl);

  if (
    !id ||
    !title ||
    description === null ||
    !dateDiscovered ||
    (discovery.categoryId !== null && categoryId === null) ||
    (discovery.url !== null && url === null)
  ) {
    return null;
  }

  if (typeof discovery.isFavourite !== "boolean") {
    return null;
  }

  const createdAt = validateTimestamp(discovery.createdAt);
  const updatedAt = validateTimestamp(discovery.updatedAt);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    title,
    description,
    categoryId,
    dateDiscovered,
    url,
    isFavourite: discovery.isFavourite,
    createdAt,
    updatedAt
  };
}
// Validate a roulette history record.
export function validateRouletteHistory(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  const id = validateString(record.id, 100);

  const activityId = validateNullable(
    record.activityId,
    (value) => validateString(value, 100)
  );

  const activityName = validateString(record.activityName, 80);
  const categoryId = validateString(record.categoryId, 100);

  const result = validateEnum(record.result, [
    "revealed",
    "started",
    "saved",
    "skipped"
  ]);

  const reason = validateNullable(
    record.reason,
    (value) => validateString(value, 300)
  );

  if (
    !id ||
    !activityName ||
    !categoryId ||
    !result ||
    (record.activityId !== null && activityId === null) ||
    (record.reason !== null && reason === null)
  ) {
    return null;
  }

  // A reason is only allowed when the result was skipped.
  if (result !== "skipped" && reason !== null) {
    return null;
  }

  const createdAt = validateTimestamp(record.createdAt);
  const updatedAt = validateTimestamp(record.updatedAt);

  if (!createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    activityId,
    activityName,
    categoryId,
    result,
    reason,
    createdAt,
    updatedAt
  };
}
// Validate the settings object.
export function validateSettings(settings) {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return null;
  }

  const seededAt = validateNullable(
    settings.seededAt,
    validateTimestamp
  );

  const lastExportedAt = validateNullable(
    settings.lastExportedAt,
    validateTimestamp
  );

  if (
    (settings.seededAt !== null && seededAt === null) ||
    (settings.lastExportedAt !== null && lastExportedAt === null) ||
    typeof settings.dismissedWelcome !== "boolean"
  ) {
    return null;
  }

  return {
    seededAt,
    lastExportedAt,
    dismissedWelcome: settings.dismissedWelcome
  };
}

// Validate an array of records and check for duplicate IDs.
function validateRecordArray(records, validator) {
  if (!Array.isArray(records)) {
    return null;
  }

  const validatedRecords = records.map(validator);

  // Reject the entire array if any record is invalid.
  if (validatedRecords.some((record) => record === null)) {
    return null;
  }

  // Check for duplicate IDs.
  const ids = validatedRecords.map((record) => record.id);

  if (new Set(ids).size !== ids.length) {
    return null;
  }

  return validatedRecords;
}

// Validate the complete application document.
export function validateDocument(document) {
  if (
    !document ||
    typeof document !== "object" ||
    Array.isArray(document)
  ) {
    return null;
  }

  if (
    document.app !== "tinkering-dashboard" ||
    document.schemaVersion !== 1
  ) {
    return null;
  }

  const categories = validateRecordArray(
    document.categories,
    validateCategory
  );
  // At least one category must remain active.
if (
  !categories ||
  categories.length === 0 ||
  !categories.some((category) => !category.isArchived)
) {
  return null;
}

  const activities = validateRecordArray(
    document.activities,
    validateActivity
  );

  const attempts = validateRecordArray(
    document.attempts,
    validateAttempt
  );

  const journalEntries = validateRecordArray(
    document.journalEntries,
    validateJournalEntry
  );

  const discoveries = validateRecordArray(
    document.discoveries,
    validateDiscovery
  );

  const rouletteHistory = validateRecordArray(
    document.rouletteHistory,
    validateRouletteHistory
  );

  const settings = validateSettings(document.settings);

  if (
    !categories ||
    !activities ||
    !attempts ||
    !journalEntries ||
    !discoveries ||
    !rouletteHistory ||
    !settings
  ) {
    return null;
  }
  // Check that all category references exist.
  const categoryIds = new Set(
    categories.map((category) => category.id)
  );

  const allRecords = [
    ...activities,
    ...attempts,
    ...journalEntries,
    ...discoveries,
    ...rouletteHistory
  ];

  for (const record of allRecords) {
    if (
      record.categoryId !== null &&
      !categoryIds.has(record.categoryId)
    ) {
      return null;
    }
  }

  // Check for duplicate IDs across all collections.
  const allIds = [
    ...categories.map((record) => record.id),
    ...allRecords.map((record) => record.id)
  ];

  if (new Set(allIds).size !== allIds.length) {
    return null;
  }
    // Check whether linked activities still exist.
  const activityIds = new Set(
    activities.map((activity) => activity.id)
  );
// Check that live attempt references match their immutable identity.
for (const attempt of attempts) {
 if (
  attempt.activityId !== null &&
  activityIds.has(attempt.activityId) &&
  attempt.activityKey !== attempt.activityId
) {
    return null;
  }
}
  // Preserve historical records when their activity was deleted.
  const normalizedAttempts = attempts.map((attempt) => ({
    ...attempt,
    activityId: activityIds.has(attempt.activityId)
      ? attempt.activityId
      : null
  }));

  const normalizedJournalEntries = journalEntries.map((entry) => ({
    ...entry,
    activityId: activityIds.has(entry.activityId)
      ? entry.activityId
      : null
  }));

  const normalizedRouletteHistory = rouletteHistory.map((record) => ({
    ...record,
    activityId: activityIds.has(record.activityId)
      ? record.activityId
      : null
  }));
    return {
     
    app: "tinkering-dashboard",
    schemaVersion: 1,
    categories,
    activities,
    attempts: normalizedAttempts,
    journalEntries: normalizedJournalEntries,
    discoveries,
    rouletteHistory: normalizedRouletteHistory,
    settings
  };
}
