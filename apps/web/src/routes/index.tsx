import { createFileRoute } from "@tanstack/react-router";
import { WordClock } from "@/components/WordClock";

export const Route = createFileRoute("/")({
  component: WordClock,
});
