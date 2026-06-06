import {
  getExercisesByBodyPart,
  searchExercisesByName,
} from "@/services/exerciseApi";
import type { Exercise } from "@/types";
import { useEffect, useState } from "react";

interface UseExerciseSearchResult {
  results: Exercise[];
  loading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 400;

export function useExerciseSearch(
  term: string,
  bodyPart?: string,
): UseExerciseSearchResult {
  const [results, setResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = term.trim();
    if (!query && !bodyPart) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const handle = setTimeout(async () => {
      try {
        const data = query
          ? await searchExercisesByName(query)
          : await getExercisesByBodyPart(bodyPart!);
        if (cancelled) return;
        setResults(data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Search failed.");
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [term, bodyPart]);

  return { results, loading, error };
}
