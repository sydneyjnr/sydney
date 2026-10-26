const MAX_MESSAGE_LENGTH = 4_000;

const TEMPORARY_REPLY =
  "The chat API route is working. Real AI responses will be connected in Step 4.3.";

function errorResponse(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse(
      'The request body must be a JSON object with a "message" field.',
    );
  }

  const message = (body as Record<string, unknown>).message;

  if (typeof message !== "string") {
    return errorResponse(
      'The "message" field is required and must be a string.',
    );
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return errorResponse("Message cannot be empty.");
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return errorResponse("Message must be 4,000 characters or fewer.");
  }

  return Response.json({ reply: TEMPORARY_REPLY });
}
