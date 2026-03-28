import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { WordClock } from "@/components/WordClock";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: WordClock,
  head: () => ({
    meta: [
      {
        title: "WordSaver",
      },
      {
        name: "description",
        content: "A word clock screensaver for macOS",
      },
    ],
    links: [],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
