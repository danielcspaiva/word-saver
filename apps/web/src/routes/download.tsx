import { createFileRoute, Link } from "@tanstack/react-router";
import { GRID, WORDS } from "@/core/layout/englishClassic";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { ClockBoard } from "@/components/ClockBoard";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
  head: () => ({
    meta: [
      { title: "Download WordSaver — A Word Clock Screensaver for macOS" },
      {
        name: "description",
        content:
          "Download and install WordSaver, a free open-source word clock screensaver for macOS.",
      },
      {
        property: "og:title",
        content: "Download WordSaver — A Word Clock Screensaver for macOS",
      },
      {
        property: "og:description",
        content:
          "Download and install WordSaver, a free open-source word clock screensaver for macOS.",
      },
      {
        property: "og:image",
        content: "https://wordsaver.vercel.app/og.png",
      },
      {
        property: "og:url",
        content: "https://wordsaver.vercel.app/download",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Download WordSaver — A Word Clock Screensaver for macOS",
      },
      {
        name: "twitter:description",
        content:
          "Download and install WordSaver, a free open-source word clock screensaver for macOS.",
      },
      {
        name: "twitter:image",
        content: "https://wordsaver.vercel.app/og.png",
      },
    ],
  }),
});

const STEPS = [
  {
    number: "1",
    title: "Download",
    description: "Get the latest release from GitHub.",
  },
  {
    number: "2",
    title: "Unzip",
    description: "Extract WordSaver.saver from the zip file.",
  },
  {
    number: "3",
    title: "Install",
    description: "Double-click the .saver file to add it to System Settings.",
  },
];

function DownloadPage() {
  const words = useCurrentTime();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div
      className="relative min-h-svh bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: "3rem 1.5rem", fontFamily: "'Geist Mono', monospace" }}
    >
      {/* Background clock */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <div className="w-full max-w-2xl px-8">
          <ClockBoard grid={GRID} activeCells={activeCells} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-12">
        <Link
          to="/"
          className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors duration-500"
        >
          WordSaver
        </Link>

        <h1 className="text-zinc-400 text-[10px] tracking-[0.4em] uppercase">Install</h1>

        <ol className="w-full flex flex-col gap-8">
          {STEPS.map((step) => (
            <li key={step.number} className="flex gap-4">
              <span className="text-zinc-700 text-sm">{step.number}.</span>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-300 text-xs tracking-[0.2em] uppercase">
                  {step.title}
                </span>
                <span className="text-zinc-600 text-xs leading-relaxed">{step.description}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-zinc-800 text-[10px] tracking-[0.2em] uppercase">
          Requires macOS 14 Sonoma or later
        </p>

        <a
          href="https://github.com/danielcspaiva/word-saver/releases/latest"
          className="text-zinc-300 text-[10px] tracking-[0.25em] uppercase border border-zinc-800 px-6 py-3 hover:border-zinc-600 hover:text-white transition-all duration-500"
        >
          Download from GitHub <span className="text-zinc-700">↓</span>
        </a>
      </div>
    </div>
  );
}
