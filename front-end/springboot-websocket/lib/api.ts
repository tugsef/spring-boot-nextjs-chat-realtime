export async function getJson<T>(url: string, opts?: { signal?: AbortSignal }): Promise<T> {
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}
