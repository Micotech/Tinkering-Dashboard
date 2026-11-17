
export function createDefaultCategories() {
  const timestamp = new Date().toISOString();

  return [
    {
      id: "creative",
      name: "Creative",
      icon: "🎨",
      colorToken: "pink",
      isDefault: true,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "technical",
      name: "Technical",
      icon: "💻",
      colorToken: "blue",
      isDefault: true,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "intellectual",
      name: "Intellectual",
      icon: "🧠",
      colorToken: "purple",
      isDefault: true,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "life",
      name: "Life",
      icon: "🌍",
      colorToken: "mint",
      isDefault: true,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "wildcard",
      name: "Wildcard",
      icon: "🎲",
      colorToken: "yellow",
      isDefault: true,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

export function createDefaultActivities() {
  const timestamp = new Date().toISOString();

  const starterActivities = [
    // Creative
    { id: "starter-creative-1", name: "Make a cinematic edit", categoryId: "creative", suggestedDuration: 45 },
    { id: "starter-creative-2", name: "Design a poster", categoryId: "creative", suggestedDuration: 45 },
    { id: "starter-creative-3", name: "Draw something from memory", categoryId: "creative", suggestedDuration: 15 },
    { id: "starter-creative-4", name: "Write a six-word story", categoryId: "creative", suggestedDuration: 10 },
    { id: "starter-creative-5", name: "Photograph one object five different ways", categoryId: "creative", suggestedDuration: 30 },

    // Technical
    { id: "starter-technical-1", name: "Build something in Python", categoryId: "technical", suggestedDuration: 60 },
    { id: "starter-technical-2", name: "Automate a boring task with a script", categoryId: "technical", suggestedDuration: 45 },
    { id: "starter-technical-3", name: "Take apart a broken, unplugged gadget", categoryId: "technical", suggestedDuration: 30 },
    { id: "starter-technical-4", name: "Learn a new command-line tool", categoryId: "technical", suggestedDuration: 30 },
    { id: "starter-technical-5", name: "Build a tiny web page from scratch", categoryId: "technical", suggestedDuration: 60 },

    // Intellectual
    { id: "starter-intellectual-1", name: "Learn one concept from psychology", categoryId: "intellectual", suggestedDuration: 20 },
    { id: "starter-intellectual-2", name: "Work through a philosophy thought experiment", categoryId: "intellectual", suggestedDuration: 20 },
    { id: "starter-intellectual-3", name: "Watch a documentary on something unfamiliar", categoryId: "intellectual", suggestedDuration: 60 },
    { id: "starter-intellectual-4", name: "Trace the history of an everyday object", categoryId: "intellectual", suggestedDuration: 30 },
    { id: "starter-intellectual-5", name: "Solve a logic puzzle", categoryId: "intellectual", suggestedDuration: 20 },

    // Life
    { id: "starter-life-1", name: "Learn chess", categoryId: "life", suggestedDuration: 30 },
    { id: "starter-life-2", name: "Cook a dish you have never made", categoryId: "life", suggestedDuration: 60 },
    { id: "starter-life-3", name: "Take a walk somewhere new", categoryId: "life", suggestedDuration: 30 },
    { id: "starter-life-4", name: "Ask someone about their work", categoryId: "life", suggestedDuration: 30 },
    { id: "starter-life-5", name: "Learn five phrases in a new language", categoryId: "life", suggestedDuration: 20 },

    // Wildcard
    { id: "starter-wildcard-1", name: "Do a daily task with your other hand", categoryId: "wildcard", suggestedDuration: 15 },
    { id: "starter-wildcard-2", name: "Follow links from a random Wikipedia article", categoryId: "wildcard", suggestedDuration: 30 },
    { id: "starter-wildcard-3", name: "Teach someone something you just learned", categoryId: "wildcard", suggestedDuration: 20 },
    { id: "starter-wildcard-4", name: "Invent a small new tradition", categoryId: "wildcard", suggestedDuration: 15 },
    { id: "starter-wildcard-5", name: "Try a hobby picked at random", categoryId: "wildcard", suggestedDuration: 60 }
  ];

  return starterActivities.map((activity) => ({
    ...activity,
    description: "",
    difficulty: null,
    isFavourite: false,
    savedForLaterAt: null,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}
export function createDefaultDocument() {
  const timestamp = new Date().toISOString();

  return {
    app: "tinkering-dashboard",
    schemaVersion: 1,

    categories: createDefaultCategories(),
    activities: createDefaultActivities(),

    attempts: [],
    journalEntries: [],
    discoveries: [],
    rouletteHistory: [],

    settings: {
      seededAt: timestamp,
      lastExportedAt: null,
      dismissedWelcome: false
    }
  };
}