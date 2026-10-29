import type { Metadata } from "next";

import { ChatShell } from "@/components/chat/chat-shell";

export const metadata: Metadata = {
  title: "Chat · Sydney",
  description:
    "Talk with Sydney, a thoughtful AI companion for learning, planning, and working through ideas.",
};

export default function ChatPage() {
  return <ChatShell />;
}
