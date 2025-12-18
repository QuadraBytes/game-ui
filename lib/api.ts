const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const BASE_URL = "https://games-fp-game-engine.nqmggx.easypanel.host";

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
