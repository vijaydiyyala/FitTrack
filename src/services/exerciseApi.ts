import { EXERCISEDB } from "@/constants";
import type { Exercise } from "@/types";

export const exerciseDbHeaders: Record<string, string> = {
  "X-RapidAPI-Key": EXERCISEDB.apiKey,
  "X-RapidAPI-Host": EXERCISEDB.apiHost,
};

function authHeaders(): HeadersInit {
  return exerciseDbHeaders;
}

export function exerciseGifUrl(id: string, resolution = 360): string {
  return `${EXERCISEDB.baseUrl}/image?resolution=${resolution}&exerciseId=${encodeURIComponent(id)}`;
}

export function exerciseGifSource(uri: string) {
  return { uri, headers: exerciseDbHeaders };
}

type RawExercise = Omit<Exercise, "gifUrl">;

function toExercise(raw: RawExercise): Exercise {
  return { ...raw, gifUrl: exerciseGifUrl(raw.id) };
}

async function request<T>(path: string, params?: Record<string, string>): Promise<T> {
  if (!EXERCISEDB.apiKey) {
    throw new Error(
      "ExerciseDB API key missing. Set EXPO_PUBLIC_EXERCISEDB_API_KEY in your .env.",
    );
  }
  const url = new URL(`${EXERCISEDB.baseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`ExerciseDB request failed (${res.status}): ${path}`);
  }
  return (await res.json()) as T;
}

export async function searchExercisesByName(
  name: string,
  limit = 25,
): Promise<Exercise[]> {
  const query = name.trim().toLowerCase();
  if (!query) return [];
  const results = await request<RawExercise[]>(
    `/exercises/name/${encodeURIComponent(query)}`,
  );
  return results.slice(0, limit).map(toExercise);
}

export async function getExercisesByBodyPart(
  bodyPart: string,
  limit = 25,
): Promise<Exercise[]> {
  const results = await request<RawExercise[]>(
    `/exercises/bodyPart/${encodeURIComponent(bodyPart)}`,
    { limit: String(limit) },
  );
  return results.map(toExercise);
}

export async function getExerciseById(id: string): Promise<Exercise> {
  const raw = await request<RawExercise>(
    `/exercises/exercise/${encodeURIComponent(id)}`,
  );
  return toExercise(raw);
}
