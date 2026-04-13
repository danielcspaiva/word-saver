import { createFileRoute, Link } from "@tanstack/react-router";
import { GRID, WORDS } from "@/core/layout/portugueseBrazilian";
import { resolveActiveCells } from "@/core/layout/resolveActiveCells";
import { useCurrentTimePtBr } from "@/hooks/useCurrentTimePtBr";
import { ClockBoard } from "@/components/ClockBoard";

export const Route = createFileRoute("/pt-br/download")({
  component: DownloadPagePtBr,
  head: () => ({
    meta: [
      { title: "Baixar WordSaver — Um relógio de palavras para macOS" },
      {
        name: "description",
        content:
          "Baixe e instale o WordSaver, um protetor de tela open-source com relógio de palavras para macOS.",
      },
      {
        property: "og:title",
        content: "Baixar WordSaver — Um relógio de palavras para macOS",
      },
      {
        property: "og:description",
        content:
          "Baixe e instale o WordSaver, um protetor de tela open-source com relógio de palavras para macOS.",
      },
      {
        property: "og:image",
        content: "https://wordsaver.vercel.app/og.png",
      },
      {
        property: "og:url",
        content: "https://wordsaver.vercel.app/pt-br/download",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Baixar WordSaver — Um relógio de palavras para macOS",
      },
      {
        name: "twitter:description",
        content:
          "Baixe e instale o WordSaver, um protetor de tela open-source com relógio de palavras para macOS.",
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
    title: "Baixar",
    description: "Obtenha a última versão no GitHub.",
  },
  {
    number: "2",
    title: "Descompactar",
    description: "Extraia o WordSaver.saver do arquivo zip.",
  },
  {
    number: "3",
    title: "Instalar",
    description: "Dê um duplo clique no arquivo .saver para adicioná-lo às Ajustes do Sistema.",
  },
];

function DownloadPagePtBr() {
  const words = useCurrentTimePtBr();
  const activeCells = resolveActiveCells(words, WORDS);

  return (
    <div
      className="relative min-h-svh bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: "3rem 1.5rem", fontFamily: "'Geist Mono', monospace" }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <div className="w-full max-w-2xl px-8">
          <ClockBoard grid={GRID} activeCells={activeCells} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-12">
        <Link
          to="/pt-br"
          className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors duration-500"
        >
          WordSaver
        </Link>

        <h1 className="text-zinc-400 text-[10px] tracking-[0.4em] uppercase">Instalar</h1>

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
          Requer macOS 14 Sonoma ou posterior
        </p>

        <a
          href="https://github.com/danielcspaiva/word-saver/releases/latest"
          className="text-zinc-300 text-[10px] tracking-[0.25em] uppercase border border-zinc-800 px-6 py-3 hover:border-zinc-600 hover:text-white transition-all duration-500"
        >
          Baixar do GitHub <span className="text-zinc-700">↓</span>
        </a>

        <Link
          to="/download"
          className="text-zinc-700 text-[10px] tracking-[0.4em] uppercase hover:text-zinc-500 transition-colors duration-500"
        >
          EN
        </Link>
      </div>
    </div>
  );
}
