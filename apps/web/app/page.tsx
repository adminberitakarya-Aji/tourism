import { pingApi } from "@tourism/api-client";

// Fase 0.10 - End-to-end wiring test (bukan halaman produk).
// Membuktikan alur: apps/web (SSR) → packages/api-client → services/api → packages/core.
// TIDAK ada business logic di sini - web hanya konsumen api-client (agents.md section 2).

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export default async function Home() {
  let message: string;
  let error: string | null = null;
  try {
    const res = await pingApi(API_URL);
    message = res.message;
  } catch (err) {
    // Ditangani eksplisit: wiring test harus menampilkan status koneksi, bukan halaman 500.
    // Bukan silent catch - statusnya dirender ke UI.
    message = "-";
    error = err instanceof Error ? err.message : "Gagal menghubungi API";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Wiring Test - Fase 0.10
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          apps/web → packages/api-client → services/api → packages/core
        </p>
        <div className="mt-6 rounded-lg bg-zinc-100 px-4 py-3 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
          core.ping() = <strong>{message}</strong>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">Error: {error}</p>
        ) : (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            OK - Alur end-to-end tersambung (API: {API_URL})
          </p>
        )}
      </main>
    </div>
  );
}

