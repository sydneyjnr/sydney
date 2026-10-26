export const CONVERSATION_TOKEN_LIMIT = 10_000;
export const MAX_COMPLETION_TOKENS = 800;
export const MAX_HISTORY_MESSAGES = 100;

const MESSAGE_TOKEN_OVERHEAD = 4;
const REQUEST_TOKEN_OVERHEAD = 8;
const tokenNumberFormatter = new Intl.NumberFormat("en-US");

export type TokenUsage = {
  usedTokens: number;
  inputTokens: number;
  outputTokens: number;
  limitTokens: number;
  remainingTokens: number;
  canSend: boolean;
};

type TokenEstimateMessage = {
  content: string;
};

export function createEmptyTokenUsage(): TokenUsage {
  return {
    usedTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    limitTokens: CONVERSATION_TOKEN_LIMIT,
    remainingTokens: CONVERSATION_TOKEN_LIMIT,
    canSend: true,
  };
}

export function estimateTextTokens(text: string) {
  const byteLength = new TextEncoder().encode(text).byteLength;
  return Math.ceil(byteLength / 2) + MESSAGE_TOKEN_OVERHEAD;
}

export function estimateMessagesTokens(
  messages: ReadonlyArray<TokenEstimateMessage>,
) {
  return messages.reduce(
    (total, message) => total + estimateTextTokens(message.content),
    REQUEST_TOKEN_OVERHEAD,
  );
}

export function estimateRequestTokens(
  systemInstruction: string,
  messages: ReadonlyArray<TokenEstimateMessage>,
) {
  return (
    estimateTextTokens(systemInstruction) +
    estimateMessagesTokens(messages) +
    MAX_COMPLETION_TOKENS
  );
}

export function getMinimumRequestTokens(systemInstruction: string) {
  return estimateRequestTokens(systemInstruction, [
    { content: "x" },
  ]);
}

export function getRemainingTokens(usedTokens: number) {
  return Math.max(0, CONVERSATION_TOKEN_LIMIT - usedTokens);
}

export function canAffordRequest(
  usedTokens: number,
  minimumRequestTokens: number,
) {
  return usedTokens + minimumRequestTokens <= CONVERSATION_TOKEN_LIMIT;
}

export function formatTokenCount(value: number) {
  return tokenNumberFormatter.format(Math.max(0, Math.round(value)));
}
