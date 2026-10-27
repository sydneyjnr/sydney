# Sydney

Sydney is a thoughtful AI assistant for thinking, planning, and working through everyday questions. It is built with Next.js, TypeScript, Tailwind CSS, and the Groq API.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add a Groq API key.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The default model is `qwen/qwen3.8-27b`. Override it with `GROQ_MODEL`.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Session behavior

Conversations and token budgets live in the current session. Each conversation has a 10,000-token budget. The server tracks usage in memory, so usage resets when the server restarts, and refreshing the page starts a new client session.
