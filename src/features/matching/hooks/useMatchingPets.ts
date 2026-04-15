import { useEffect, useState } from 'react';
import { getMatchingPets } from '../services/matchingService';
import type { MatchingPet } from '../types';

export function useMatchingPets(userId: string | null) {
  const [pets, setPets] = useState<MatchingPet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!userId) return;
        const data = await getMatchingPets(userId!);
        setPets(data as MatchingPet[]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  return { pets, loading, error };
}