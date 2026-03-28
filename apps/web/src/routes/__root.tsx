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
      {
        name: "theme-color",
        content: "#000000",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "WordSaver",
      },
      {
        property: "og:description",
        content: "A word clock screensaver for macOS",
      },
      {
        property: "og:image",
        content: "/og.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "WordSaver",
      },
      {
        name: "twitter:description",
        content: "A word clock screensaver for macOS",
      },
      {
        name: "twitter:image",
        content: "/og.png",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
    ],
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
