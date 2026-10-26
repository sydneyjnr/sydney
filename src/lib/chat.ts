export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
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

export function getDemoReply(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (/(calm|evening|morning|routine|sleep|wind down|unwind|switch off)/.test(normalized)) {
    return "Here is a gentle shape for the evening:\n\n1. Dim the lights and put your phone out of reach for twenty minutes.\n2. Pick one small reset: a shower, a tidy surface, or a short walk.\n3. Write down anything still circling in your head so tomorrow has a place to start.\n4. End with something low-effort: a few pages, quiet music, or a gentle stretch.\n\nIf you tell me what your evenings usually look like, we can make this more realistic.";
  }

  if (/(idea|brainstorm|creative|project|weekend|fun)/.test(normalized)) {
    return "A few directions worth exploring:\n\n- Make the smallest useful version and see what it teaches you.\n- Combine two things you already like instead of starting from a blank page.\n- Give yourself a deliberately odd constraint. It often makes the next idea easier to find.\n- Set a ten-minute timer and stop when it rings, even if you are on a roll.\n\nTell me a little more about what you are making, and I can help you turn one of these into a concrete next step.";
  }

  if (/(explain|understand|how does|what is|why does|learn)/.test(normalized)) {
    return "A simple way to make almost any big idea easier to understand:\n\n1. Say it in one sentence without jargon.\n2. Compare it to something ordinary.\n3. Walk through one concrete example.\n4. Name the one limitation worth remembering.\n\nIf you tell me the idea, I can walk through that structure with you.";
  }

  if (/(decision|choose|choice|work|stuck|problem|perspective)/.test(normalized)) {
    return "Try looking at it in three voices:\n\n- The friend: what would you tell someone else in this position?\n- The future self: what will matter in six months?\n- The outsider: what would someone with no history here notice first?\n\nThe gap between those answers is usually where the useful perspective is hiding. If you share the situation, I can help you try each voice.";
  }

  return "I am here with you. Let us make this easier to hold.\n\nStart with the honest version rather than the polished one: what feels most important about it right now? I can help you untangle the next step, turn it into a plan, or simply think out loud.\n\nThis is a simulated reply, but the conversation flow is fully interactive.";
}
