export interface AacPictureCard {
  id: string;
  label: string;
  emoji: string;
  imageSrc?: string;
}

export interface Checkpoint {
  id: string;
  mascotPrompt: string;
  hintPrompt: string;
  keywords: string[];
  aacPictureCards: AacPictureCard[];
  validAacCombinations?: string[][];
  successResponse: string;
  extractField?: string;
}

const customCards = {
  park: { id: "park", label: "park", emoji: "\ud83c\udf33", imageSrc: "/aac-custom/park.png" },
  yes: { id: "yes", label: "yes", emoji: "\u2705", imageSrc: "/aac-custom/yes.png" },
  somethingWrong: {
    id: "something-wrong",
    label: "something's wrong",
    emoji: "\u26a0\ufe0f",
    imageSrc: "/aac-custom/something-wrong.png",
  },
  needHelp: {
    id: "need-help",
    label: "I need help",
    emoji: "\ud83e\udd1d",
    imageSrc: "/aac-custom/i-need-help.png",
  },
  n1: { id: "n1", label: "1", emoji: "1\ufe0f\u20e3", imageSrc: "/aac-custom/1.png" },
  n2: { id: "n2", label: "2", emoji: "2\ufe0f\u20e3", imageSrc: "/aac-custom/2.png" },
  n3: { id: "n3", label: "3", emoji: "3\ufe0f\u20e3", imageSrc: "/aac-custom/3.png" },
  n4: { id: "n4", label: "4", emoji: "4\ufe0f\u20e3", imageSrc: "/aac-custom/4.png" },
  n5: { id: "n5", label: "5", emoji: "5\ufe0f\u20e3", imageSrc: "/aac-custom/5.png" },
  think: { id: "think", label: "think", emoji: "\ud83e\udd14", imageSrc: "/aac-custom/think.png" },
  where: { id: "where", label: "where", emoji: "\u2753", imageSrc: "/aac-custom/where.png" },
  with: { id: "with", label: "with", emoji: "\ud83e\udde9", imageSrc: "/aac-custom/with.png" },
  to: { id: "to", label: "to", emoji: "\u27a1\ufe0f", imageSrc: "/aac-custom/to.png" },
  go: { id: "go", label: "go", emoji: "🏃", imageSrc: "/aac-custom/go.png" },
  i: { id: "i", label: "I", emoji: "\ud83d\udc64", imageSrc: "/aac-custom/i.png" },
};

const supplementalCards: Record<string, AacPictureCard> = {
  london: { id: "london", label: "London", emoji: "\ud83c\uddec\ud83c\udde7", imageSrc: "/aac-supplement/london.svg" },
  tokyo: { id: "tokyo", label: "Tokyo", emoji: "\ud83c\uddef\ud83c\uddf5", imageSrc: "/aac-supplement/tokyo.svg" },
  paris: { id: "paris", label: "Paris", emoji: "\ud83c\uddeb\ud83c\uddf7", imageSrc: "/aac-supplement/paris.svg" },
  newYork: { id: "new-york", label: "New York", emoji: "\ud83d\uddfd\ufe0f", imageSrc: "/aac-supplement/new-york.svg" },
  singapore: { id: "singapore", label: "Singapore", emoji: "\ud83c\uddf8\ud83c\uddec", imageSrc: "/aac-supplement/singapore.svg" },
  sydney: { id: "sydney", label: "Sydney", emoji: "\ud83c\udde6\ud83c\uddfa", imageSrc: "/aac-supplement/sydney.svg" },
  airport: { id: "airport", label: "Airport", emoji: "\ud83d\udeeb\ufe0f", imageSrc: "/aac-supplement/airport.svg" },
  home: { id: "home", label: "Home", emoji: "\ud83c\udfe0", imageSrc: "/aac-supplement/home.svg" },
  hotel: { id: "hotel", label: "Hotel", emoji: "\ud83c\udfe8", imageSrc: "/aac-supplement/hotel.svg" },
  people: { id: "people", label: "Passengers", emoji: "\ud83d\udc65", imageSrc: "/aac-supplement/passengers.svg" },
  family: { id: "family", label: "Family", emoji: "\ud83d\udc6a", imageSrc: "/aac-supplement/family.svg" },
  bag: { id: "bag", label: "Bag", emoji: "\ud83e\uddf3", imageSrc: "/aac-supplement/bag.svg" },
  suitcase: { id: "suitcase", label: "Suitcase", emoji: "\ud83e\uddf3", imageSrc: "/aac-supplement/suitcase.svg" },
  carryOn: { id: "carry-on", label: "Carry-on", emoji: "\ud83d\udcbc", imageSrc: "/aac-supplement/carry-on.svg" },
  no: { id: "no", label: "No", emoji: "\u274c", imageSrc: "/aac-supplement/no.svg" },
  passport: { id: "passport", label: "Passport", emoji: "\ud83d\udcd8", imageSrc: "/aac-supplement/passport.svg" },
  idCard: { id: "id-card", label: "ID card", emoji: "\ud83e\udeaa", imageSrc: "/aac-supplement/id-card.svg" },
  here: { id: "here-you-go", label: "Here you go", emoji: "\ud83e\udd32", imageSrc: "/aac-supplement/here-you-go.svg" },
  please: { id: "please", label: "Please", emoji: "🙏" },
  thankYou: { id: "thank-you", label: "Thank you", emoji: "🙏" },
};

export const airportCheckInScenario: Checkpoint[] = [
  {
    id: "greeting",
    mascotPrompt: "Hello! Welcome to the airport check-in counter. Where is your destination today?",
    hintPrompt: "In AAC mode, try a full phrase like: I + go + to + London.",
    keywords: ["london", "tokyo", "new york", "paris", "singapore", "sydney"],
    aacPictureCards: [
      customCards.i,
      customCards.go,
      customCards.to,
      customCards.where,
      customCards.think,
      customCards.park,
      supplementalCards.london,
      supplementalCards.tokyo,
      supplementalCards.paris,
      supplementalCards.newYork,
      supplementalCards.singapore,
      supplementalCards.sydney,
      supplementalCards.airport,
      supplementalCards.home,
      supplementalCards.hotel,
    ],
    validAacCombinations: [
      ["i", "go", "to", "london"],
      ["i", "go", "to", "tokyo"],
      ["i", "go", "to", "paris"],
      ["i", "go", "to", "new-york"],
      ["i", "go", "to", "singapore"],
      ["i", "go", "to", "sydney"],
    ],
    successResponse: "Great choice! Let me look that up for you.",
    extractField: "destination",
  },
  {
    id: "passengers",
    mascotPrompt: "How many passengers are travelling today?",
    hintPrompt: "In AAC mode, build one of these: I + 1, I + with + 2, I + with + 3, I + with + 4.",
    keywords: ["one", "1", "two", "2", "three", "3", "four", "4", "just me", "myself"],
    aacPictureCards: [
      customCards.i,
      customCards.with,
      customCards.n1,
      customCards.n2,
      customCards.n3,
      customCards.n4,
      customCards.n5,
      customCards.yes,
      customCards.think,
      supplementalCards.people,
      supplementalCards.family,
      supplementalCards.airport,
      supplementalCards.home,
      customCards.park,
      supplementalCards.bag,
    ],
    validAacCombinations: [
      ["i", "n1"],
      ["i", "with", "n2"],
      ["i", "with", "n3"],
      ["i", "with", "n4"],
    ],
    successResponse: "Got it, I've noted that down.",
    extractField: "passengers",
  },
  {
    id: "luggage",
    mascotPrompt: "Do you have any luggage to check in today?",
    hintPrompt: "Try one of these in AAC mode: yes + with + 1 + bag, yes + with + 2 + bag, no + bag, or carry-on.",
    keywords: ["yes", "no", "bag", "suitcase", "luggage", "carry", "none"],
    aacPictureCards: [
      customCards.yes,
      customCards.with,
      customCards.n1,
      customCards.n2,
      customCards.n3,
      customCards.n4,
      customCards.i,
      supplementalCards.no,
      supplementalCards.bag,
      supplementalCards.suitcase,
      supplementalCards.carryOn,
      supplementalCards.airport,
      supplementalCards.people,
      customCards.needHelp,
      customCards.somethingWrong,
    ],
    validAacCombinations: [
      ["yes", "with", "n1", "bag"],
      ["yes", "with", "n2", "bag"],
      ["no", "bag"],
      ["carry-on"],
    ],
    successResponse: "Alright, I've recorded your luggage information.",
    extractField: "luggage",
  },
  {
    id: "passport",
    mascotPrompt: "May I see your passport or ID please?",
    hintPrompt: "AAC options that work: yes + passport, yes + ID card, here you go + passport, or I need help.",
    keywords: ["here", "passport", "id", "sure", "yes", "okay", "help"],
    aacPictureCards: [
      customCards.yes,
      customCards.i,
      customCards.where,
      customCards.think,
      customCards.needHelp,
      customCards.somethingWrong,
      supplementalCards.passport,
      supplementalCards.idCard,
      supplementalCards.here,
      supplementalCards.please,
      supplementalCards.thankYou,
      supplementalCards.no,
      supplementalCards.airport,
      supplementalCards.hotel,
      supplementalCards.home,
    ],
    validAacCombinations: [
      ["yes", "passport"],
      ["yes", "id-card"],
      ["here-you-go", "passport"],
      ["need-help"],
      ["something-wrong", "need-help"],
    ],
    successResponse: "Thank you! Everything looks good.",
  },
  {
    id: "complete",
    mascotPrompt: "You're all checked in! Here's your boarding pass. Have a wonderful flight!",
    hintPrompt: "",
    keywords: [],
    aacPictureCards: [],
    successResponse: "",
  },
];
