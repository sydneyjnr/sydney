export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  isError?: boolean;
  retryPrompt?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
};

export const starterPrompts = [
  {
    id: "clarity",
    title: "Make sense of a thought",
    description: "Untangle what is on your mind, one piece at a time.",
    prompt: "Help me untangle what is on my mind right now.",
  },
  {
    id: "routine",
    title: "Plan a calm evening",
    description: "Create a gentle wind-down routine that actually fits.",
    prompt: "Help me plan a calm evening routine that helps me switch off.",
  },
  {
    id: "explain",
    title: "Explain something simply",
    description: "Make a big idea feel approachable and clear.",
    prompt: "Explain a big idea to me like I am curious but completely new to it.",
  },
  {
    id: "perspective",
    title: "See a fresh perspective",
    description: "Look at a situation from a different angle.",
    prompt: "Help me see a problem from a fresh perspective.",
  },
] as const;

export const demoConversations: Conversation[] = [
  {
    id: "demo-morning",
    title: "A calmer start to the day",
    updatedAt: "12m",
    messages: [
      {
        id: "demo-morning-1",
        role: "user",
        content: "I want my mornings to feel less rushed. Where should I start?",
      },
      {
        id: "demo-morning-2",
        role: "assistant",
        content:
          "Start smaller than feels impressive.\n\nTry protecting the first ten minutes: no phone, one glass of water, and a single decision about what matters most today. Lay out anything you need the night before so the morning does not begin with a scavenger hunt.\n\nIf you tell me what usually makes mornings feel rushed, we can shape that into a routine that fits your real life.",
      },
    ],
  },
  {
    id: "demo-decision",
    title: "Untangling a work decision",
    updatedAt: "1h",
    messages: [
      {
        id: "demo-decision-1",
        role: "user",
        content:
          "I keep going back and forth on a decision at work. How do I get unstuck?",
      },
      {
        id: "demo-decision-2",
        role: "assistant",
        content:
          "First, separate the decision from the anxiety around it.\n\nWrite down the choice in one sentence, then list what you know, what you are assuming, and what you would need to learn to feel more certain. A useful next step is usually a small experiment rather than a permanent commitment.\n\nWhat is the decision, and what are the two options you are weighing?",
      },
    ],
  },
  {
    id: "demo-weekend",
    title: "Ideas for a rainy weekend",
    updatedAt: "Yesterday",
    messages: [
      {
        id: "demo-weekend-1",
        role: "user",
        content: "The forecast is all rain this weekend. Any ideas that are not just watching TV?",
      },
      {
        id: "demo-weekend-2",
        role: "assistant",
        content:
          "A few low-pressure options:\n\n- Make something slowly: soup, bread, or a playlist.\n- Pick one small corner to reset and make it feel intentional.\n- Try a long-form puzzle, a used book, or a documentary you would never normally choose.\n- Invite someone over for a quiet two-hour visit.\n\nThe goal is not to optimize the weekend. It is to give it a little texture.",
      },
    ],
  },
  {
    id: "demo-letter",
    title: "A note I have been meaning to write",
    updatedAt: "2d",
    messages: [
      {
        id: "demo-letter-1",
        role: "user",
        content: "I owe a friend a thoughtful message, but I keep putting it off.",
      },
      {
        id: "demo-letter-2",
        role: "assistant",
        content:
          "Putting it off often means the message has become too big in your head.\n\nTry a three-part version: what made you think of them, one honest thing you appreciate, and an open door to talk. It does not need to resolve everything. It only needs to sound like you.\n\nIf you share the rough version, I can help you make it warmer without making it longer.",
      },
    ],
  },
];

export function getConversationTitle(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "New conversation";
  }

  if (normalized.length <= 42) {
    return normalized;
  }

  return `${normalized.slice(0, 41).trimEnd()}…`;
}

export function createChatId(prefix: "conversation" | "message") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
