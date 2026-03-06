export interface CommunicationOption {
  id: string;
  label: string;
  icon: string;
  isCorrect?: boolean;
  feedback: string;
}

export interface ScenarioStep {
  id: string;
  prompt: string;
  context: string;
  speakerName?: string;
  speakerRole?: string;
  options: CommunicationOption[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: "food" | "help" | "shopping" | "social";
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: ScenarioStep[];
}

export const scenarios: Scenario[] = [
  {
    id: "order-donut",
    title: "Order a Donut",
    description: "Practice ordering your favourite donut at a bakery",
    category: "food",
    icon: "🍩",
    difficulty: "beginner",
    steps: [
      {
        id: "step-1",
        prompt: "Welcome to the bakery! What can I get for you today?",
        context: "You are at the counter of a friendly bakery. The worker is smiling at you.",
        speakerName: "Baker",
        speakerRole: "Shop Worker",
        options: [
          { id: "a", label: "I would like a donut please", icon: "🍩", isCorrect: true, feedback: "Great job! You made a clear request. The baker knows exactly what you want." },
          { id: "b", label: "Hello", icon: "👋", feedback: "Good greeting! But the baker is waiting for your order. Try telling them what you'd like." },
          { id: "c", label: "Donut", icon: "🍩", isCorrect: true, feedback: "Nice! You communicated what you want. Next time, try adding 'please' for politeness." },
          { id: "d", label: "I don't know", icon: "🤔", feedback: "That's okay! Take your time. You can point at the donut or say 'donut please'." },
        ],
      },
      {
        id: "step-2",
        prompt: "Sure! What flavour would you like? We have chocolate, blueberry, and strawberry.",
        context: "The baker shows you three donuts behind the glass.",
        speakerName: "Baker",
        speakerRole: "Shop Worker",
        options: [
          { id: "a", label: "Blueberry please", icon: "🫐", isCorrect: true, feedback: "Excellent choice! You clearly said what flavour you want." },
          { id: "b", label: "Chocolate please", icon: "🍫", isCorrect: true, feedback: "Yum! Chocolate is a great pick. You communicated your choice clearly." },
          { id: "c", label: "That one", icon: "👆", feedback: "Pointing works! But try also saying the name so the baker is sure which one you mean." },
          { id: "d", label: "All of them", icon: "😄", feedback: "Ha! That would be fun. Try picking just one for now." },
        ],
      },
      {
        id: "step-3",
        prompt: "That will be $3. Here's your donut! Is there anything else?",
        context: "The baker hands you a bag with your donut.",
        speakerName: "Baker",
        speakerRole: "Shop Worker",
        options: [
          { id: "a", label: "No thank you", icon: "😊", isCorrect: true, feedback: "Perfect! You answered the question politely. Well done!" },
          { id: "b", label: "Thank you, goodbye!", icon: "👋", isCorrect: true, feedback: "Wonderful! You thanked the baker and said goodbye. Great communication!" },
          { id: "c", label: "Yes, a drink please", icon: "🥤", isCorrect: true, feedback: "Great! You made another request. That shows confidence!" },
          { id: "d", label: "...", icon: "😶", feedback: "It's okay to feel shy. Try saying 'thank you' — the baker will appreciate it!" },
        ],
      },
    ],
  },
  {
    id: "ask-directions",
    title: "Ask for Directions",
    description: "Practice asking someone for help finding a place",
    category: "help",
    icon: "🗺️",
    difficulty: "beginner",
    steps: [
      {
        id: "step-1",
        prompt: "You look a bit lost. Can I help you?",
        context: "You're at a shopping centre and need to find the bathroom. A friendly staff member approaches you.",
        speakerName: "Staff",
        speakerRole: "Helper",
        options: [
          { id: "a", label: "Where is the bathroom?", icon: "🚻", isCorrect: true, feedback: "Great question! You asked clearly for what you need." },
          { id: "b", label: "Yes please, I need help", icon: "🙋", isCorrect: true, feedback: "Good! You let them know you need assistance." },
          { id: "c", label: "No", icon: "❌", feedback: "It's okay to say no, but if you need help, it's good to ask!" },
          { id: "d", label: "Bathroom", icon: "🚻", isCorrect: true, feedback: "You communicated your need! Try adding 'where is' next time for a full question." },
        ],
      },
      {
        id: "step-2",
        prompt: "The bathroom is down the hall, turn left. Do you understand?",
        context: "The staff member points down the hallway.",
        speakerName: "Staff",
        speakerRole: "Helper",
        options: [
          { id: "a", label: "Yes, thank you!", icon: "👍", isCorrect: true, feedback: "Wonderful! You confirmed you understood and thanked them." },
          { id: "b", label: "Can you show me?", icon: "🚶", isCorrect: true, feedback: "Great idea! Asking for more help is perfectly fine." },
          { id: "c", label: "I don't understand", icon: "😕", isCorrect: true, feedback: "It's very good to say when you don't understand. That helps people help you better!" },
          { id: "d", label: "Left?", icon: "⬅️", feedback: "You're checking the direction — that's smart! Try saying 'Turn left?' to make it a clear question." },
        ],
      },
    ],
  },
  {
    id: "grocery-shop",
    title: "Grocery Shopping",
    description: "Practice buying items at the grocery store",
    category: "shopping",
    icon: "🛒",
    difficulty: "intermediate",
    steps: [
      {
        id: "step-1",
        prompt: "Hello! Are you finding everything okay?",
        context: "You're in the fruit section looking for apples. A store worker notices you looking around.",
        speakerName: "Worker",
        speakerRole: "Store Staff",
        options: [
          { id: "a", label: "Where are the apples?", icon: "🍎", isCorrect: true, feedback: "Perfect! You asked a clear question about what you're looking for." },
          { id: "b", label: "I need help finding apples", icon: "🙋", isCorrect: true, feedback: "Great! You explained what you need. The worker can help you now." },
          { id: "c", label: "Yes", icon: "👍", feedback: "Hmm, but you still need to find the apples! Try asking where they are." },
          { id: "d", label: "Apples", icon: "🍎", isCorrect: true, feedback: "Good communication! You made your need known." },
        ],
      },
      {
        id: "step-2",
        prompt: "The apples are right over here! Do you want the red or green ones?",
        context: "The worker leads you to a display of different coloured apples.",
        speakerName: "Worker",
        speakerRole: "Store Staff",
        options: [
          { id: "a", label: "Red ones please", icon: "🍎", isCorrect: true, feedback: "You made a choice and said please! Brilliant." },
          { id: "b", label: "Green please", icon: "🍏", isCorrect: true, feedback: "Good choice! You communicated your preference clearly." },
          { id: "c", label: "Both!", icon: "😊", isCorrect: true, feedback: "Why not? You made a confident decision!" },
          { id: "d", label: "I'm not sure", icon: "🤔", feedback: "Take your time! Try picking whichever colour you like best." },
        ],
      },
      {
        id: "step-3",
        prompt: "Would you like a bag for those?",
        context: "You've picked your apples and the worker is being helpful.",
        speakerName: "Worker",
        speakerRole: "Store Staff",
        options: [
          { id: "a", label: "Yes please", icon: "🛍️", isCorrect: true, feedback: "Polite and clear! Well done." },
          { id: "b", label: "No thanks, I have one", icon: "👜", isCorrect: true, feedback: "Great! You explained why you don't need one." },
          { id: "c", label: "Thank you for your help!", icon: "😊", isCorrect: true, feedback: "So polite! Thanking people makes them feel good." },
          { id: "d", label: "How much are they?", icon: "💰", isCorrect: true, feedback: "Smart question! It's good to check the price." },
        ],
      },
    ],
  },
  {
    id: "meet-friend",
    title: "Meet a Friend",
    description: "Practice greeting and chatting with a friend",
    category: "social",
    icon: "👋",
    difficulty: "beginner",
    steps: [
      {
        id: "step-1",
        prompt: "Hey! It's so good to see you! How are you?",
        context: "Your friend waves at you from across the park and comes over.",
        speakerName: "Alex",
        speakerRole: "Friend",
        options: [
          { id: "a", label: "Hi! I'm good, how are you?", icon: "😊", isCorrect: true, feedback: "Wonderful! You greeted them back and asked how they're doing." },
          { id: "b", label: "Hello!", icon: "👋", isCorrect: true, feedback: "Nice greeting! You could also ask how they are." },
          { id: "c", label: "I'm happy to see you!", icon: "🤗", isCorrect: true, feedback: "That's so sweet! Your friend will love hearing that." },
          { id: "d", label: "Good", icon: "👍", isCorrect: true, feedback: "Short and clear! Try adding 'and you?' to keep the conversation going." },
        ],
      },
      {
        id: "step-2",
        prompt: "I'm great! Do you want to go get some ice cream?",
        context: "Your friend suggests an activity.",
        speakerName: "Alex",
        speakerRole: "Friend",
        options: [
          { id: "a", label: "Yes! I love ice cream!", icon: "🍦", isCorrect: true, feedback: "Fantastic! You showed enthusiasm and agreed to the plan." },
          { id: "b", label: "Sure, let's go!", icon: "🚶", isCorrect: true, feedback: "Great energy! You agreed and are ready to go." },
          { id: "c", label: "Maybe later, I'm not hungry", icon: "🤔", isCorrect: true, feedback: "It's totally fine to say no politely. You suggested an alternative time!" },
          { id: "d", label: "What flavours do they have?", icon: "❓", isCorrect: true, feedback: "Good question! You're showing interest and gathering information." },
        ],
      },
    ],
  },
];

export const categoryInfo = {
  food: { label: "Ordering Food", color: "scenario-food", bgClass: "bg-scenario-food/10", borderClass: "border-scenario-food/30" },
  help: { label: "Asking for Help", color: "scenario-help", bgClass: "bg-scenario-help/10", borderClass: "border-scenario-help/30" },
  shopping: { label: "Shopping", color: "scenario-shopping", bgClass: "bg-scenario-shopping/10", borderClass: "border-scenario-shopping/30" },
  social: { label: "Social & Friends", color: "scenario-social", bgClass: "bg-scenario-social/10", borderClass: "border-scenario-social/30" },
};

export const difficultyInfo = {
  beginner: { label: "Beginner", color: "text-success" },
  intermediate: { label: "Intermediate", color: "text-accent" },
  advanced: { label: "Advanced", color: "text-destructive" },
};
