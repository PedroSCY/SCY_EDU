import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Link Redirect
        </h1>
        <p className="mt-4 text-lg text-zinc-500">
          Hub centralizado de links para apoio docente. Acesse formulários,
          materiais e recursos com um clique.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/links"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Ver links disponíveis
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Área do professor
          </Link>
        </div>
      </div>
    </div>
  );
}
