// Barrel entry @tourism/api-client.
// Satu-satunya lapisan pemanggilan API dari sisi client (apps/web TIDAK BOLEH fetch
// langsung ke services/api — lihat agents.md §2).
// Fase 0.10 — wiring test: klien pertama, membuktikan web → api-client → api tersambung.

export interface PingResponse {
  message: string;
}

/**
 * Panggil endpoint GET /ping di services/api.
 * @param baseUrl Alamat dasar API, mis. http://localhost:3001
 */
export async function pingApi(baseUrl: string): Promise<PingResponse> {
  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/ping`);
  if (!res.ok) {
    throw new Error(`pingApi gagal: HTTP ${res.status} dari ${baseUrl}/ping`);
  }
  return (await res.json()) as PingResponse;
}
